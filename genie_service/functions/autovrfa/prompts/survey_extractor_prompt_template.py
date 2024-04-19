from autovrfa.survey_state import Question, AnswerType
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser, OutputFixingParser
from langchain.schema import BaseMessage
from langchain.base_language import BaseLanguageModel
from typing import List

SURVEY_TEMPLATE = """ 
For the following conversation:
 (1) extract the following answers the Patient has given

Important: Only extract the information if the patient has already answered the question. Do not try to guess or infer if it is at all unclear how they answered:

    {schema_to_extract}

conversation: 
    {conversation}

Do not send back invalid JSON markdown. Even if there is no answer yet, just record it as null. 

{format_instructions} """

NULL_IF_UNKNOWN = 'null by default'


class SurveyExtractorPromptTemplate:
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_template(
            template=SURVEY_TEMPLATE)

    @staticmethod
    def get_answer_type(question: Question):
        if question.answer_type == AnswerType.ENUM:
            return 'enum'
        elif question.answer_type == AnswerType.LIST:
            return 'list of enums'
        elif question.answer_type == AnswerType.PERCENTAGE or question.answer_type == AnswerType.NUMBER:
            return 'number'
        else:
            return 'string'

    @staticmethod
    def get_description(question: Question):
        if question.answer_type == AnswerType.ENUM or question.answer_type == AnswerType.LIST:
            return f"Enum values: {', '.join([choice for choice in question.answer_choices])}. {NULL_IF_UNKNOWN}."
        elif question.answer_type == AnswerType.PERCENTAGE:
            return f'Float from 0 to 1. ${NULL_IF_UNKNOWN}.'
        else:
            return f'{NULL_IF_UNKNOWN}.'

    @staticmethod
    def create_output_parser(questions: List[Question]) -> StructuredOutputParser:
        response_schemas = [ResponseSchema(name=question.name,
                                           description=f'{question.display_question} (question_id: {question.id})', type=SurveyExtractorPromptTemplate.get_answer_type(question)) for question in questions
                            ]
        return StructuredOutputParser.from_response_schemas(
            response_schemas)

    @staticmethod
    def create_retry_parser(parser: StructuredOutputParser, llm: BaseLanguageModel) -> OutputFixingParser:
        return OutputFixingParser.from_llm(parser=parser, llm=llm)

    @staticmethod
    def format_conversation(conversation: List[BaseMessage], input: str) -> str:
        """
        Converts BaseMessages to str
        """
        formatted_conversation = ''

        for idx, line in enumerate(conversation):
            line = line.content.strip()
            if idx % 2 == 1:  # Patient
                formatted_conversation += f'AI Nurse: {line} \n'
            else:  # Nurse
                formatted_conversation += f'Patient: {line} \n'

        formatted_conversation += f'Patient: {input} \n'
        return formatted_conversation

    def format(self, conversation: List[BaseMessage], questions: List[Question], input: str) -> str:
        '''
        The output parser produces the following format_instructions:

        The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "```json" and "```":

        ```json
        {
            "bathing": enum  // How much has your bathing been limited by your health condition? (question_id: 1)
            "dressing": enum  // How much has your dressing been limited by your health condition? (question_id: 2)
            "laundry": enum  // How independently can you do your laundry? (question_id: 3)
            "shopping": enum  // How independently can you go shopping? (question_id: 4)
        }
        ```

        schema_to_extract:
            bathing: Enum values: ['NOT_LIMITED', 'LIMITED_A_LITTLE', 'LIMITED_A_LOT']. null if not known. 
            dressing: Enum values: ['NOT_LIMITED', 'LIMITED_A_LITTLE', 'LIMITED_A_LOT']. null if not known.  
            laundry: Enum values: ['WITHOUT_HELP', 'WITH_SOME_HELP', 'UNABLE_TO_DO_SO']. null if not known. 
            shopping: Enum values: ['WITHOUT_HELP', 'WITH_SOME_HELP', 'UNABLE_TO_DO_SO']. null if not known. 

        returns {
                    'bathing': 'NOT_LIMITED', 
                    'dressing': 'LIMITED_A_LITTLE', 
                    'laundry': 'WITHOUT_HELP', 
                    'shopping': null, 
                }
        '''

        schema_items = [
            f"{question.name}: {self.get_description(question)}" for question in questions]

        schema_to_extract = '\n'.join(schema_items)

        output_parser = self.create_output_parser(questions)

        messages = self.prompt.format_messages(conversation=SurveyExtractorPromptTemplate.format_conversation(conversation, input),
                                               format_instructions=output_parser.get_format_instructions(),
                                               schema_to_extract=schema_to_extract)
        return messages

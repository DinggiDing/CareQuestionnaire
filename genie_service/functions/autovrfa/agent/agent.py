from autovrfa.database.client import DatabaseClient
from autovrfa.autovrfa_utils import process_dialogue
from autovrfa.survey_state import SurveyState, Question, Section, Survey, AnswerType
from autovrfa.prompts.question_prompt_template import QuestionPromptTemplate
from autovrfa.prompts.survey_extractor_prompt_template import SurveyExtractorPromptTemplate
from autovrfa.autovrfa_utils import agent_needs_more_questions
from autovrfa.prompts.chat_prompt_template import CustomChatPromptTemplate
from langchain.cache import InMemoryCache
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import BaseMessage
from typing import Callable, Coroutine, Dict, List
import csv
import asyncio

STOP_TOKENS = ["Patient:", "AI Nurse:", "\n"]
SECTION_NAME_COLUMN = 0
ANSWER_TYPE_COLUMN = 1
QUESTION_NAME_COLUMN = 2
ANSWER_CHOICES_COLUMN = 3
SCORE_COLUMN = 4
THRESHOLD_COLUMN = 5
DISPLAY_QUESTION_COLUMN = 6

MAX_QUESTIONS = 5


class SurveyAgent():
    def __init__(self, db_client: DatabaseClient = None):
        self.db_client = db_client
        self.llm = ChatGoogleGenerativeAI(
            temperature=0.0,
            google_api_key="<API_KEY>",
            model="gemini-pro"
        )
        self.memory = ConversationBufferWindowMemory(k=3,  # Refers to size of conversation history that gets passed in.
                                                     ai_prefix="AI Nurse",
                                                     human_prefix="Patient",
                                                     input_key="input",
                                                     memory_key="history",
                                                     return_messages=True)

        self.survey_extractor_template = SurveyExtractorPromptTemplate()

    @property
    def chat_chain(self):
        """
        Do not change these from properties. They need to be re-rendered everytime they are 
        requested or you will not have the latest conversation history.
        """
        chat_history_size = len(self.memory.buffer)
        return LLMChain(
            prompt=CustomChatPromptTemplate.template(conversation=self.memory.buffer[-min(chat_history_size, 5):]), llm=self.llm, verbose=True, memory=self.memory)

    @staticmethod
    def _get_section_to_questions(survey_state: SurveyState) -> Dict[str, List[Question]]:
        """
        Returns section name to list of questions. 
        For example:
        {
            "adl": [
                Question(id='1', name='bathing', spoken_question='How much has your bathing been limited by your health condition?', display_question=How much has your bathing been limited by your health condition?, answer_type=AnswerType.ENUM, current_value=None, answer_choices=['Not limited', 'Limited a little', 'Limited a lot']), 
                Question(id='2', name='dressing', spoken_question='How much has your dressing been limited by your health condition?', display_question=How much has your dressing been limited by your health condition?, answer_type=AnswerType.ENUM, current_value=None, answer_choices=['Not limited', 'Limited a little', 'Limited a lot'])
            ]
        }
        """
        questions_for_section = {}
        for section in survey_state.survey.sections:
            questions_for_section[section.id] = section.questions
        return questions_for_section

    @staticmethod
    def _get_next_unanswered_questions(survey_state: SurveyState, results_start_index: int = 0, max_questions: int = 3) -> List[Question]:
        """
        Returns k next unanswered questions to complete. 
        For example:

        [
         Question(id='1', name='bathing', spoken_question='How much has your bathing been limited by your health condition?', display_question=How much has your bathing been limited by your health condition?, answer_type=AnswerType.ENUM, current_value=None, answer_choices=['Not limited', 'Limited a little', 'Limited a lot']), 
         Question(id='2', name='dressing', spoken_question='How much has your dressing been limited by your health condition?', display_question=How much has your dressing been limited by your health condition?, answer_type=AnswerType.ENUM, current_value=None, answer_choices=['Not limited', 'Limited a little', 'Limited a lot'])
        ]
        """
        all_questions = [
            question for section in survey_state.survey.sections for question in section.questions]
        current_question_id = survey_state.current_question.id if survey_state.current_question is not None else 1
        unanswered_questions = list(
            filter(lambda question: question.id >= current_question_id, all_questions))
        return unanswered_questions[results_start_index:min(results_start_index+max_questions, len(unanswered_questions))]

    @staticmethod
    def _get_or_create_eventloop() -> asyncio.AbstractEventLoop:
        """
            Create an async event loop if there is none
        """
        try:
            return asyncio.get_event_loop()
        except RuntimeError as ex:
            if "There is no current event loop in thread" in str(ex):
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return asyncio.get_event_loop()

    @staticmethod
    def _save_survey_state(survey_state: SurveyState, save_fn: Callable[..., Coroutine]):
        """
            Save survey state to database.
        """
        loop = SurveyAgent._get_or_create_eventloop()
        loop.run_until_complete(save_fn(survey_state))
        print('INFO: Saved survey state to database.')

    def _run_unanswered_questions(self, survey_state: SurveyState, next_unanswered_questions: List[Question], input: str) -> bool:
        """
        Returns False it is the end of the survey.
        """
        if len(next_unanswered_questions) <= 1 and next_unanswered_questions[-1].current_value is not None:
            return False

        question_template = QuestionPromptTemplate(
            input_variables=["questions"]
        )

        questions_formatted = question_template.format(
            questions=next_unanswered_questions)

        last_question_id = f'question (id: {survey_state.current_question.id if survey_state.current_question is not None else 1})'
        last_question_answer = f'has been successfully recorded as: "{survey_state.current_question_value}"' if survey_state.current_question_value is not None else 'has not gotten a sufficient answer from the patient'

        self.chat_chain.run(
            input=input,
            questions=questions_formatted,
            last_question_id=last_question_id,
            last_question_answer=last_question_answer,
            stop=STOP_TOKENS)
        return True

    def _generate_response_from_agent(self, survey_state: SurveyState, input: str) -> bool:
        """
        Returns False it is the end of the survey.
        """
        next_unanswered_questions = SurveyAgent._get_next_unanswered_questions(
            survey_state, max_questions=MAX_QUESTIONS)

        success = self._run_unanswered_questions(
            survey_state, next_unanswered_questions, input)
        print(
            f'Agent wants to respond: {self.memory.buffer[-1].content.strip()}')

        # Check if the next few unanswered questions are no longer relevant, if so, fetch more questions.
        if agent_needs_more_questions(self.memory.buffer):
            print('INFO: Agent needs more questions.')

            next_unanswered_questions = SurveyAgent._get_next_unanswered_questions(
                survey_state, results_start_index=MAX_QUESTIONS-1, max_questions=MAX_QUESTIONS*2)
            success = self._run_unanswered_questions(survey_state,
                                                     next_unanswered_questions, input)
        return success

    def _extract_survey(self, survey_state: SurveyState, input: str) -> Dict[str, any]:
        """
        Returns a map of the survey questions and the current values for a window of unanswered 
        questions.
        For example: {
                    'bathing': 'NOT_LIMITED', 
                    'dressing': 'LIMITED_A_LITTLE', 
                    'laundry': 'WITHOUT_HELP', 
                    'shopping': null
                    }
        """
        next_unanswered_questions = SurveyAgent._get_next_unanswered_questions(
            survey_state, max_questions=MAX_QUESTIONS)

        messages = self.survey_extractor_template.format(conversation=self.memory.buffer,
                                                         questions=next_unanswered_questions, input=input)

        parsed_conversation = self.llm(messages)
        print(f'INFO: parsed_conversation: {parsed_conversation.content}')

        output_parser = SurveyExtractorPromptTemplate.create_output_parser(
            next_unanswered_questions)

        questions_to_current_values = {}

        try:
            questions_to_current_values = output_parser.parse(
                parsed_conversation.content)

        except Exception as e:
            print('ERROR: Error parsing survey. Retrying with better JSON')

        return questions_to_current_values

    def _update_questions_with_extracted_answers(self, survey_state: SurveyState, survey_parsed: Dict[str, any]) -> SurveyState:
        """
        Update survey_state based on what the LLM has extracted from the conversation.
        """
        print(f'INFO: survey parsed: {survey_parsed}')

        for parsed_question, parsed_current_value in survey_parsed.items():
            # If there is a value for any question, save it as current_value.
            if parsed_current_value is not None and parsed_current_value != '' and parsed_current_value != 'UNKNOWN':
                # Update the current value in the survey.
                for section in survey_state.survey.sections:
                    for question in section.questions:
                        if question.name == parsed_question:
                            question.current_value = parsed_current_value
        return survey_state

    def _update_current_question(self, survey_state: SurveyState, last_question_asked: int) -> SurveyState:
        """
        Update the survey based on the extractions made from the conversation.
        """

        if last_question_asked is not None:
            survey_state.move_to_question(last_question_asked)

        return survey_state

    def load_memory(self, memory: List[List[str]]) -> None:
        """
        Input, output pairs to enter into memory. Each entry in memory should be a list of size 2: 
        input and output string, where input is the user and output is the agent. 
        For example:
                    [["Hello", 
                    "Welcome to your health care questionnaire. Your answers will help your 
                    medical team provide more comprehensive care for you, which may improve your outcomes.
                    Are you ready?]]
        """
        for single_entry in memory:
            if len(single_entry) != 2:
                raise ValueError(
                    "Every entry in memory must be a list of input and output")
            self.memory.save_context({'input': single_entry[0]},
                                     {'output': single_entry[-1]})

    def load_fake_memory(self) -> None:
        """
        Testing method to load fake memory.
        """
        # Mirrors home page.
        self.memory.save_context({"input": "Hello"},
                                 {"output": "Welcome to your health care questionnaire. Are you ready to start with the first question?"})

    def preprocess_user_response(self, survey_state: SurveyState, input: str) -> Dict[str, any]:
        """
        If the user is giving one of the answer choices, do not send to the LLM, instead
        provide a parsed survey, similar to the output of the LLM.

        Returns a map of the survey questions and the current values
        For example: {
            'bathing': 'NOT_LIMITED'
        }
        """
        if survey_state.current_question is not None and survey_state.current_question_value is None:
            for answer_choice in survey_state.current_question.answer_choices:
                if input.strip().lower() in answer_choice.lower():
                    print(f'Exact match found - no need to generate response')
                    return {survey_state.current_question.name: answer_choice}
        return {}

    def generate(self, survey_state: SurveyState, input: str) -> SurveyState:
        """
        Returns memory buffer for the conversation. 
        """

        # If there wasn't an exact match for an answer choice, have the LLM classify the reply.
        # Otherwise, save the answer choice and continue.
        survey_parsed = self.preprocess_user_response(survey_state, input)
        if not survey_parsed:
            survey_parsed = self._extract_survey(survey_state, input)

        self._update_questions_with_extracted_answers(
            survey_state, survey_parsed)

        # Generate response for next unanswered questions.
        end_of_survey = not self._generate_response_from_agent(
            survey_state, input)

        survey_state.conversation, current_question_id = process_dialogue(
            conversation=self.memory.buffer, end_of_survey=end_of_survey)

        survey_state = self._update_current_question(
            survey_state, current_question_id)
        print(f'INFO: survey state post-update: {survey_state}')

        if self.db_client is not None:
            SurveyAgent._save_survey_state(
                survey_state, self.db_client.update_survey_state)

        return survey_state

    def create_survey(self, tsv_filename: str, survey_state: SurveyState = None) -> SurveyState:
        """
        Reads the .tsv file to build a SurveyState of the entire survey.
        """
        survey = Survey()
        section_id = 1
        question_id = 1

        print(f'Opening {tsv_filename}...')

        with open(tsv_filename) as fd:
            reader = csv.reader(fd, delimiter="\t")
            for id, row in enumerate(reader):

                # Skip column header.
                if id > 0:
                    # If there is a section name, this is a new section.
                    if row[SECTION_NAME_COLUMN] != '':
                        new_section = Section(
                            section_id, row[SECTION_NAME_COLUMN])
                        survey.sections.append(new_section)
                        section_id += 1
                        # Capture the impairement threshold for the section.
                        survey.sections[-1].threshold = row[THRESHOLD_COLUMN] if row[THRESHOLD_COLUMN] != '' else 'N/A'

                    # If there is a question name, this is a new question.
                    if row[QUESTION_NAME_COLUMN] != '':
                        new_question = Question(
                            id=question_id,
                            name=row[QUESTION_NAME_COLUMN],
                            display_question=row[DISPLAY_QUESTION_COLUMN],
                            answer_type=AnswerType.from_string(
                                row[ANSWER_TYPE_COLUMN].upper()))
                        survey.sections[-1].questions.append(new_question)
                        question_id += 1

                    elif row[ANSWER_CHOICES_COLUMN] != '':
                        survey.sections[-1].questions[-1].answer_choices.append(
                            row[ANSWER_CHOICES_COLUMN])
                        if row[SCORE_COLUMN] != '':
                            survey.sections[-1].questions[-1].scores.append(
                                int(row[SCORE_COLUMN]))
        if survey_state is None:
            survey_state = SurveyState(survey=survey)
        else:
            survey_state.survey = survey
        return survey_state

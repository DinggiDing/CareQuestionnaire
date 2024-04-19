from re import I
from typing_extensions import override
from autovrfa.survey_state import Question, AnswerType
from langchain.prompts import StringPromptTemplate


class QuestionPromptTemplate(StringPromptTemplate):
    """ A custom prompt template that takes in the questions to ask and simply enumerates them. """

    @staticmethod
    def get_answer_description(question: Question):
        if question.answer_type == AnswerType.ENUM or question.answer_type == AnswerType.LIST:
            return f"Answer choices: {', '.join([f'{answer.lower()}' for answer in question.answer_choices])} "
        elif question.answer_type == AnswerType.PERCENTAGE:
            return f'Answer choice: a number between 30 and 100'
        else:
            return ''

    @override
    def format(self, **kwargs) -> str:
        questions = kwargs["questions"]

        return ''.join([f"(id: {question.id}) {question.display_question} \n  {QuestionPromptTemplate.get_answer_description(question)} \n" for question in questions])

    def _prompt_type(self):
        return "question-expander"

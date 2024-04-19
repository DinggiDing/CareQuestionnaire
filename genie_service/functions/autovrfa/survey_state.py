from json import JSONEncoder
from typing import Dict, List
from enum import Enum
from functools import reduce


class AnswerType(Enum):
    ENUM = 1
    STRING = 2
    PERCENTAGE = 3
    NUMBER = 4,
    LIST = 5,

    @staticmethod
    def from_string(string_value: str):
        for member in AnswerType.__members__.values():
            if member.name == string_value:
                return member
        raise ValueError(f"Invalid AnswerType: {string_value}")


class Question:
    def __init__(self, id: int = None,
                 name: str = "",
                 display_question: str = "",
                 answer_type: AnswerType = None,
                 current_value: str = None,
                 answer_choices: List[str] = None,
                 scores: List[int] = None):
        self.id = id
        self.name = name
        self.display_question = display_question
        self.answer_type = answer_type
        self.current_value = current_value
        self.answer_choices = answer_choices or []
        self.scores = scores or []

    @staticmethod
    def from_dict(source):
        return Question(source['id'],
                        source['name'],
                        source['display_question'],
                        source['answer_type'],
                        source['current_value'],
                        source['answer_choices'],
                        source['scores']),

    def to_dict(self):
        return self.__dict__()

    def __dict__(self) -> Dict[str, any]:
        return {
            "id": self.id,
            "name": self.name,
            "display_question": self.display_question,
            "answer_type": self.answer_type.name if self.answer_type is not None else None,
            "current_value": self.current_value,
            "answer_choices": self.answer_choices,
            "scores": self.scores
        }

    def __repr__(self):
        return f"Question(id={self.id}, " \
            f"name={self.name}, " \
            f"display_question={self.display_question}, " \
            f"answer_type={self.answer_type}, " \
            f"current_value={self.current_value}, " \
            f"answer_choices={self.answer_choices}, " \
            f"scores={self.scores})"


class Section:
    def __init__(self, id: int = None, name: str = "", questions: List[Question] = None, threshold: str = None):
        self.id = id
        self.name = name
        self.questions = questions or []
        self.threshold = threshold or 'N/A'

    @staticmethod
    def from_dict(source):
        questions = [Question.from_dict(question)
                     for question in source['questions']]
        return Section(source['id'], source['name'], questions, source['threshold'])

    def to_dict(self):
        return self.__dict__()

    def __dict__(self) -> Dict[str, any]:
        return {
            "id": self.id,
            "name": self.name,
            "questions": [question.__dict__() for question in self.questions],
            "threshold": self.threshold
        }

    def __repr__(self):
        return f"Section(id={self.id}, " \
            f"name={self.name}, " \
            f"questions={self.questions}, " \
            f"threshold={self.threshold})"


class Survey:
    def __init__(self, sections: List[Section] = None):
        self.sections = sections or []

    @staticmethod
    def from_dict(source):
        return Survey([Section.from_dict(section)
                       for section in source['sections']])

    def to_dict(self):
        return self.__dict__()

    def __dict__(self) -> Dict[str, any]:
        return {
            "sections": [section.__dict__() for section in self.sections]
        }

    def __repr__(self):
        return f"Survey(sections={self.sections})"


class SurveyState:
    def __init__(self, survey: Survey = None,
                 conversation: List[List[str]] = None,
                 current_user_id: str = None):
        self._current_question_id = None
        self.current_user_id = current_user_id
        self.survey = survey if survey is not None else Survey()
        self.conversation = conversation or []

    @property
    def total_number_questions(self):
        return self.survey.sections[-1].questions[-1].id

    @property
    def current_question(self):
        current_question = None
        for section in self.survey.sections:
            for question in section.questions:
                if question.id == self._current_question_id:
                    current_question = question
                # Check if the question can be advanced forward.
                if current_question is not None and current_question.current_value is not None and question.current_value is not None and question.id > self._current_question_id:
                    current_question = question
        return current_question

    @property
    def current_section(self):
        if self.current_question is None:
            return None

        for section in self.survey.sections:
            for question in section.questions:
                if question.id == self._current_question_id:
                    return section

    @current_question.setter
    def current_question(self, question: Question):
        self._current_question_id = question.id

    @property
    def current_question_value(self):
        """
        Returns the current question's current_value
        """
        if self.current_question is None:
            return None
        return self.current_question.current_value

    def get_current_value_for_question(self, question_id: int):
        """
        Returns the current question's current_value
        """
        for section in self.survey.sections:
            for question in section.questions:
                if question.id == question_id:
                    return question.current_value
        return None

    def move_to_question(self, new_question_id: int):
        """
        Sets current_question based on new_question_id.
        """
        for section in self.survey.sections:
            for question in section.questions:
                if question.id == new_question_id:
                    self.current_question = question
        print(f'INFO: Moving onto next question (id: {new_question_id})')

    @staticmethod
    def undo_conversation_flattening(conversation: List[str]):
        if len(conversation) % 2 != 0:
            raise ValueError(
                "Flattened list must contain an even number of elements.")

        return [[conversation[i], conversation[i + 1]] for i in range(0, len(conversation), 2)]

    @staticmethod
    def from_dict(source):
        conversation = SurveyState.undo_conversation_flattening(
            source['conversation'])
        survey_state = SurveyState(Survey.from_dict(
            source['survey']), conversation)
        survey_state.current_question = Question.from_dict(
            source['current_question']) if source['current_question'] is not None else None
        survey_state.current_user_id = source['current_user_id'] if source['current_user_id'] is not None else None
        return survey_state

    def to_dict(self):
        return self.__dict__()

    def __dict__(self) -> Dict[str, any]:
        return {
            "survey": self.survey.__dict__(),
            "current_user_id": self.current_user_id,
            "current_section_id": self.current_section.id if self.current_section is not None else 1,
            "current_section_id": self.current_section.id if self.current_section is not None else 1,
            "current_question": self.current_question.__dict__() if self.current_question is not None else None,
            # Firebase db doesn't allow nested arrays
            "conversation": reduce(lambda a, b: a+b, self.conversation, [])
        }

    def __repr__(self):
        return f"SurveyState(" \
            f"survey={self.survey}, " \
            f"current_user_id={self.current_user_id}, " \
            f"current_section_id={self.current_section.id if self.current_section is not None else 1}, " \
            f"current_section_id={self.current_section.id if self.current_section is not None else 1}, " \
            f"current_question={self.current_question}, " \
            f"conversation={self.conversation})"


class SurveyStateEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, SurveyState) or isinstance(o, Survey) or isinstance(o, Section) or isinstance(o, Question):
            return o.__dict__()

        # For other types, use the default serialization
        return super().default(o)

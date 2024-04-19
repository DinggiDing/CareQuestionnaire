import re
from langchain.schema import BaseMessage
from typing import Dict, List, Tuple

from autovrfa.survey_state import Question
from autovrfa.survey_state import AnswerType


def parse_question(question: Dict[str, str]) -> Question:
    """
    Convert dict to a Question object.
    """
    return Question(id=int(question['id']),
                    name=question['name'],
                    display_question=question['displayQuestion'],
                    current_value=question['currentValue'] if 'currentValue' in question else None,
                    answer_type=AnswerType.from_string(question['answerType']),
                    answer_choices=question['answerChoices'],
                    scores=question['scores'])


def agent_needs_more_questions(conversation: List[BaseMessage]) -> bool:
    needs_more_questions = "need more questions" in conversation[-1].content.strip(
    ).lower()
    # Remove the call for more questions from conversation history!
    if len(conversation) > 0 and needs_more_questions:
        # Pop Agent and Nurse out of the queue.
        conversation.pop()
        conversation.pop()
        return True
    return False


def _remove_id_from_statement(input_string) -> Tuple[str, int]:
    """
    Removes (id: X) from response by nurse and returns the current question id if there is 
    one, otherwise None. 
    Example: `AI Nurse: (id: 2) How much has your dressing been limited?`
            returns  `AI Nurse: How much has your dressing been limited?`, 2 .
    """
    # Define a regular expression pattern to match "(id: X)" and capture the number X
    pattern = r'\(id:\s(\d+)\)'

    # Use re.sub to replace the pattern with an empty string and capture the number
    result = re.sub(pattern, '', input_string).strip()

    # Use a conditional expression to set current_question_id to the captured number or None
    current_question_id = int(re.search(pattern, input_string).group(
        1)) if re.search(pattern, input_string) else None

    # Return modified string and the captured number or None
    return input_string, current_question_id


def process_dialogue(conversation: List[BaseMessage], end_of_survey: bool) -> Tuple[List[List[str]], int]:
    """
    Converts a string of dialog between AI Nuse and Patient to build 
    chat history that can be loaded into memory.
    Returns current question id
    """
    pairs = []
    current_pair = ['', '']  # Initial empty pair
    current_question_id = None

    for idx, line in enumerate(conversation):
        line = line.content.strip()
        if idx % 2 == 0:  # Patient line
            current_pair[0] = line
        else:  # Nurse line
            current_pair[1], current_question_id = _remove_id_from_statement(
                line)
            pairs.append(current_pair)
            current_pair = ['', '']  # Reset current pair

    # This is the end because the agent could not respond.
    if end_of_survey:
        current_pair[1] = 'Thanks so much for taking this survey. Please continue onto your recovery plan.'
        pairs.append(current_pair)
        current_question_id = None

    return pairs, current_question_id

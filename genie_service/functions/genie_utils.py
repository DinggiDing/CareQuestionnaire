
import json
import pprint
import re
from genie4forms.form_processor import FormState, SurveyState, SurveyState  # noqa
from genie4forms.form_state import FormStateEncoder  # noqa


STARTING_SURVEY_CURRENT_QUESTION = {
    'form': 'intro',
            'name': 'intro',
            'question': {}
}

""" 
This format: 

{'answerChoices': [True, False],
 'currentValue': None,
 'displayQuestion': 'Ready to answer a few questions from your care team?',
 'id': 0,
 'name': 'intro',
 'spokenQuestion': 'Answering these qustions will help the medical team provide more comprehensive '
                    'care for you which may improve youroutcomes? Are you ready?'}

Turns into:

{'answer_choices': [True, False],
 'current_value': None,
 'custom_fields': 'display_question:"Ready to answer a few questions from your care team?"',
 'spoken_question': 'Answering these qustions will help the medical team provide more comprehensive care for '
                    'you which may improve your outcomes? Are you ready?'
"""


def parse_survey_question(question: dict) -> dict:
    return {'current_value':  question['currentValue'] if 'currentValue' in question else None,
            'spoken_question': question['spokenQuestion'],
            'custom_fields': f"display_question:\"{question['displayQuestion']}\"",
            'answer_choices': question['answerChoices']}


"""
This format:

{'answerChoices': [True, False],
 'currentValue': 'true',
 'displayQuestion': 'Ready to answer a few questions from your care team?',
 'id': 0,
 'name': 'intro',
 'spokenQuestion': 'Answering these qustions will help the medical team provide more comprehensive care for '
                    'you which may improve your outcomes? Are you ready?'
Turns into:
  {'answer_choices': [True, False],
    'user_classified_answer': None
    'display_question': '"Ready to answer a few questions from your care team?"',
    'id': 0,
    'name': 'intro',
    'spoken_question': ['Answering these qustions will help the medical team provide more comprehensive '
                        'care for you which may improve your outcomes? Are you ready?']
"""


def parse_current_question(question) -> dict:
    return {'id':  question['id'],
            'name': question['name'],
            'user_classified_answer': question['currentValue'] if 'currentValue' in question and question['currentValue'] != '' else None,
            'spoken_question': [question['spokenQuestion']],
            'display_question': question['displayQuestion'],
            'answer_choices': question['answerChoices']}


def init_survey_state() -> SurveyState:
    try:
        survey_state = SurveyState()
        survey_state.form_state = FormState(
            'genie4forms/vrfa.tsv', 'text-davinci-003')
        return survey_state
    except Exception as e:
        print('ERROR: opening survey file: %s' % e)


def extract_display_question(input_string):
    pattern = r"display_question:\"([^\"']*)\""
    match = re.search(pattern, input_string)
    return match.group(1) if match else None


def jsonify_response(survey_state: SurveyState) -> str:
    try:
        return json.dumps(survey_state, cls=FormStateEncoder)
    except Exception as e:
        print('ERROR: parsing response: %s' % e)


def print_request(req_json):
    print('')
    print(' ~~~~~~~~~~~~~~~~~~~~~~~~~~REQUEST FROM FE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ')
    print('User response %s' % pprint.pformat(
        req_json['user_response'] if 'user_response' in req_json else 'None'))
    print('Form state %s' % pprint.pformat(
        req_json['survey_state']['formState']))
    print('Current question: %s' %
          pprint.pformat(req_json['survey_state']['currentQuestion']))
    print(' ~~~~~~~~~~~~~~~~~~~~~~~~~~REQUEST FROM FE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ')
    print('')


def print_current_survey(survey_state: SurveyState):
    print('current_question: %s' %
          pprint.pformat(survey_state.current_question))
    # if survey_state.survey:
    #     print('survey: %s' % pprint.pformat(survey_state.survey))
    if survey_state.form_state:
        print('form_state: %s' % pprint.pformat(survey_state.form_state))


def print_response(survey_state):
    print('')
    print(' ___________________________RESPONSE FROM GENIE4FORMS _____________________ ')
    print('')
    print('Form state %s' % pprint.pformat(survey_state.form_state))
    print('')
    print('Survey: %s' % pprint.pformat(survey_state.survey))
    print('')
    print('Current question: %s' %
          pprint.pformat(survey_state.current_question))
    print('')
    print(' ___________________________RESPONSE FROM GENIE4FORMS _____________________ ')
    print('')

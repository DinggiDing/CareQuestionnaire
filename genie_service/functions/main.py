from typing import Dict
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
import json
import sys
import os
import traceback


# TODO(justine): Figure out how to get rid of this.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from autovrfa.database.client import DatabaseClient  # noqa
from autovrfa.survey_state import SurveyState, Section, SurveyStateEncoder  # noqa
from autovrfa.agent.agent import SurveyAgent  # noqa
from autovrfa.autovrfa_utils import parse_question  # noqa
from autovrfa.report.client import ReportClient  # noqa


initialize_app()


def create_error(message: str, e: Exception) -> https_fn.Response:
    print(f"ERROR: {message}. \n {traceback.format_exc()}")
    return https_fn.Response(f"Error: internal error {e}", status=500)


def update_survey_state_from_response(survey_state: SurveyState, req_json: Dict[str, any]) -> SurveyState:
    updated_survey = req_json['survey']

    # Could be in the beginning stages where there is just casual conversation where there is not yet
    # a question.
    updated_current_question = req_json[
        'currentQuestion'] if 'currentQuestion' in req_json else None

    survey_state.survey.sections = []
    for section in updated_survey['sections']:
        parsed_section = Section(
            id=section['id'], name=section['name'], threshold=section['threshold'])
        parsed_section.questions = [parse_question(
            question) for question in section['questions']]
        survey_state.survey.sections.append(parsed_section)

    if updated_current_question is not None:
        survey_state.current_question = parse_question(
            updated_current_question)

    return survey_state


@https_fn.on_request(
    cors=options.CorsOptions(
        # This allows local servers to access the service.
        # TODO: Add VRFA domain.
        cors_origins=[r'http://localhost:3000', '*'],
        cors_methods=['get', 'post'])
)
def health_survey(req: https_fn.Request) -> https_fn.Response:
    req_json = req.get_json()

    if req_json is None:
        return https_fn.Response('Error: Form state required', status=400)

    response = {}
    user_id = req_json['user_id']
    db_client = DatabaseClient(user_id=user_id)
    agent = SurveyAgent(db_client=db_client)
    survey_state = SurveyState(current_user_id=user_id)

    if 'survey_state' in req_json:
        print(f'INFO: Survey state provided : {req_json["survey_state"]}')
        try:
            survey_state = update_survey_state_from_response(
                survey_state, req_json['survey_state']['formState'])
            conversation = req_json['survey_state']['formState']['conversation']
            agent.load_memory(
                SurveyState.undo_conversation_flattening(conversation))

        except Exception as e:
            return create_error("generate failed", e)
    else:
        survey_state = agent.create_survey(
            'autovrfa/new_vrfa.tsv', survey_state)
        agent.load_fake_memory()

    try:
        survey_state = agent.generate(
            survey_state, input=req_json['user_response'] if 'user_response' in req_json else 'I am ready')
        response = json.dumps(survey_state, cls=SurveyStateEncoder)

    except Exception as e:
        return create_error('parsing survey state failed', e)

    return https_fn.Response(response)


@https_fn.on_request(
    cors=options.CorsOptions(
        # This allows local servers to access the service.
        # TODO: Add VRFA domain.
        cors_origins=[r'http://localhost:3000', '*'],
        cors_methods=['get', 'post'])
)
def generate_report(req: https_fn.Request) -> https_fn.Response:
    req_json = req.get_json()

    if req_json is None or 'form_state' not in req_json:
        return https_fn.Response('Error: Form state required', status=400)

    response = {}
    survey_state = SurveyState()
    report_client = ReportClient(user_id=req_json['user_id'])

    try:
        survey_state = update_survey_state_from_response(
            survey_state, req_json['form_state'])
        scores = report_client.score_survey(survey_state)
        response = json.dumps(scores)

    except Exception as e:
        return create_error("generate report failed", e)

    return https_fn.Response(response)

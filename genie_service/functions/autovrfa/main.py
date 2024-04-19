from autovrfa.agent.agent import SurveyAgent
from autovrfa.report.client import ReportClient


def main():
    agent = SurveyAgent()
    survey_state = agent.create_survey('autovrfa/new_vrfa.tsv')
    user_input = "Hello there"
    while (True):
        survey_state = agent.generate(
            survey_state, input=user_input)
        user_input = input(f'Agent: {survey_state.conversation[-1][-1]} \n')

        # Meta prompts
        if user_input.strip().lower() == 'report':
            report_client = ReportClient(user_id='test_user')
            report = report_client.generate_report(survey_state)
            print(f'INFO: Report generated: \n {report}')
            return


if __name__ == '__main__':
    main()

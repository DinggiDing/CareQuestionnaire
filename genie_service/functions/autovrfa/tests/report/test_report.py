import unittest

from autovrfa.survey_state import SurveyState
from autovrfa.report.client import ReportClient
from autovrfa.agent.agent import SurveyAgent

report_client = ReportClient(user_id='test_user')


class TestReportClient(unittest.TestCase):
    def _setup(self):
        agent = SurveyAgent()
        return agent.create_survey('autovrfa/new_vrfa.tsv')

    @staticmethod
    def count_points(survey_state: SurveyState, section_id: int) -> int:
        total_points = 0
        for question in survey_state.survey.sections[section_id].questions:
            if len(question.answer_choices) > 0 and len(question.scores) > 0:
                question.current_value = question.answer_choices[1]
                total_points += question.scores[1]
        return total_points

    def test_empty_survey(self):
        empty_report = {'conversation': [],
                        'current_question': None,
                        'current_section_id': 1,
                        'survey': {'sections': []}}

        self.assertEqual(report_client.generate_report(
            SurveyState()), empty_report, "Should be empty")

    def test_new_survey_state(self):
        survey_state = self._setup()
        report = report_client.generate_report(survey_state)
        self.assertEqual(report['current_section_id'], 1)
        self.assertIsNone(report['current_question'])
        self.assertEqual(report['conversation'], [])
        self.assertIsNotNone(report['survey'], "should be set")

    def test_new_survey_state_scores(self):
        survey_state = self._setup()
        scores = report_client.score_survey(survey_state)
        self.assertDictEqual(
            scores, {'adl': 0, 'kps': 0, 'iadls': 0, 'social': 0, 'lifestyle': 0})

    def test_new_survey_state_scores_adl(self):
        survey_state = self._setup()
        total_points = self.count_points(survey_state, section_id=0)

        scores = report_client.score_survey(survey_state)
        self.assertDictEqual(
            scores, {'adl': total_points, 'kps': 0, 'iadls': 0, 'social': 0, 'lifestyle': 0})

    def test_new_survey_state_scores_iadl(self):
        survey_state = self._setup()
        total_points = self.count_points(survey_state, section_id=2)
        scores = report_client.score_survey(survey_state)
        self.assertDictEqual(
            scores, {'adl': 0, 'kps': 0, 'iadls': total_points, 'social': 0, 'lifestyle': 0})

    def test_new_survey_state_scores_social(self):
        survey_state = self._setup()
        total_points = self.count_points(survey_state, section_id=3)
        scores = report_client.score_survey(survey_state)
        self.assertDictEqual(
            scores, {'adl': 0, 'kps': 0, 'iadls': 0, 'social': total_points, 'lifestyle': 0})


if __name__ == '__main__':
    unittest.main()

from autovrfa.survey_state import SurveyState


class ReportClient():
    def __init__(self, user_id: str = None):
        self.user_id = user_id

    def generate_report(self, survey_state: SurveyState):
        print(f'INFO: Generating report for user {self.user_id}')
        return survey_state.to_dict()

    def score_survey(self, survey_state: SurveyState):
        scores = {}
        for section in survey_state.survey.sections:
            scores[section.name] = 0
            for question in section.questions:
                if question.current_value in question.answer_choices and len(question.scores) > 0:
                    index_of_score = question.answer_choices.index(
                        question.current_value)
                    # Get score for answer choice
                    scores[section.name] += question.scores[index_of_score]
        return scores

from firebase_admin import credentials
from google.cloud import firestore

from autovrfa.survey_state import SurveyState


class DatabaseClient():
    def __init__(self, user_id: str = None):
        creds = credentials.Certificate('autovrfa/database/credentials.json')
        self.db = firestore.AsyncClient(
            project='<project_id>', credentials=creds)
        self.user_id = user_id

    @property
    def survey_collection(self):
        return self.db.collection("survey")

    @property
    def survey_for_user(self):
        return self.survey_collection.document(self.user_id)

    def update_survey_state(self, survey_state: SurveyState):
        print(f'INFO: Updating survey state in DB')
        return self.survey_for_user.set(survey_state.to_dict(), merge=True)

    async def get_survey_states(self):
        docs = self.survey_collection.stream()
        async for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")

        return docs

# Supplementary Material: Digital Forms for All: A Holistic Multimodal Large Language Model Agent for Health Data Entry

## Backend
The python backend server is in `genie_service/`
* Prompts are in `/genie_service/functions/autovrfa/prompts`
* Survey questions in CSV form in `genie_service/functions/autovrfa/new_vrfa.tsv`
* API definitions for cloud functions in `genie_service/functions/main.py`
* LLM agent in `genie_service/functions/autovrfa/agent/agent.py`

## Frontend
The frontend Typescript server is in `vrfa_service/`

* Entry points in `vrfa_service/src/App.tsx`
* Main components in `vrfa_service/src/pages`

# Developer Setup

1. First, clone repository to computer use command: git clone https://github.com/dihim/homehealth_IVA_web.git

2. cd into repo: cd homehealth_IVA_web/vrfa_service and Run: npm install
   
4. cd into homehealth_IVA_web: cd ..

5. Create a developer branch for your github command: git checkout -b dev_{githubusername}

6. Run `cd vrfa_service` and `npm install` and `npm run start`.

7. In a separate terminal tab, change directories into `genie_service/functions` 

8. Create a python 3.10 venv by running the follow. If you don't have venv yet, run `pip install virtualenv` first.

    - `virtualenv --python=/usr/bin/python3.10 {your environment name - can be anything}`
    - `python3.10 -m venv {your environment name}`
    - `source {VENV-NAME}/bin/activate`
    - `pip3 install -r requirements.txt`

9. Run `firebase use --add`

10. Run `firebase emulators:start`

11. Replace the API key in agent.py with your API key! It has to be a string not an env variable. Trying to debug this.

12. Add a .env file under the autovrfa directory and add this to the file: 

`OBJC_DISABLE_INITIALIZE_FORK_SAFETY='YES'`

13. Server should be running at http://localhost:3000/start

14. You can use the db by running `export GOOGLE_APPLICATION_CREDENTIALS="<your_local_path>/homehealth_IVA_web/genie_service/functions/autovrfa/database/credentials.json"`. Note if you are outside the organization, you'll need to set up your own Firebase db. 

Note: if you just want to run autovrfa (the backend), you can interact with it via the terminal by running `python -m autovrfa.main` from inside genie_service/functions

# Running tests
1. Go into functions directory `cd genie_service/functions`
2. Run `python -m unittest autovrfa.tests.report.test_report.TestReportClient`

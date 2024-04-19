const LOCAL_EMULATOR = `http://127.0.0.1:5001/homehealth-iva/us-central1`;

class ApiRoute {
    static UPDATE_SURVEY_AUTO_ENDPOINT = 'https://health-survey-vh4vqsmdhq-uc.a.run.app';
    // Uncomment to use local emulator.
    //static UPDATE_SURVEY_AUTO_ENDPOINT = `${LOCAL_EMULATOR}/health_survey`;
    static GENERATE_REPORT_ENDPOINT = `${LOCAL_EMULATOR}/generate_report`;
}

export {
    ApiRoute
};

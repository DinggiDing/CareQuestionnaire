export interface FormSettings {
  intro: IntroSettings,
  sections: SectionSettings[],
  end: EndSettings
}

export interface IntroSettings {
  displayQuestion: string,
  spokenQuestion: string,
}

export interface SectionSettings {
  sectionId: string,
  firstStatements?: string,
  answerChoices?: string[],
  answerType: string,
  questions: QuestionSettings[]
}

export interface QuestionSettings {
  displayQuestion: string,
  spokenQuestion: string,
  promptQuestion: string,
  answerType?: string,
  node: string,
  answerChoices?: string[],
  promptConstraints?: string[],
  requiredAnswers?: string,
}

export interface EndSettings {
  displayQuestion: string,
  spokenQuestion: string,
}

export interface FormQuestions {
  adlsQuestions: AdlQuestion[]
}

export interface FormQuestionsJson {
  sections: VrfaSection[],
  adlsQuestions: VrfaQuestion[]
}

export class AdlQuestion {
  question: string;
  answerChoices: AdlAnswerChoiceEnum[];
  node: AdlNodesEnum;

  constructor(question: string, answerChoices: AdlAnswerChoiceEnum[], node: AdlNodesEnum) {
    this.question = question;
    this.answerChoices = answerChoices;
    this.node = node;
  }
}

export interface VrfaSection {
  sectionId: string;
  questions: VrfaQuestion[];
  firstStatements: string[];
}

export interface VrfaQuestion {
  displayQuestion: string,
  promptQuestion: string,
  answerChoices: string[],
  node: string,
  firstStatements: [],
  answerType: string,
  requiredAnswers: [],
  constraints: []
}

export interface FormResponse {
  date: string,
  adls: AdlAnswers
}

export interface AdlAnswers {
  bathing: AdlResponse,
  dressing: AdlResponse,
  grooming: AdlResponse,
  feeding: AdlResponse,
  walkingInsideHome: AdlResponse,
  walkingOutsideHome: AdlResponse,
  bladderBowlControl: AdlResponse
}

export interface AdlResponse {
  response: AdlAnswerChoiceEnum
}

export type AdlAnswerChoiceEnum = "not limited" | "limited a little" | "limited a lot"

export type AdlNodesEnum = "bathing" | "dressing" | "grooming" | "feeding" | "walkingInsideHome" | "walkingOutsideHome" | "bladderBowlControl";

export const formResponseState: FormResponse = {
  date: "",
  adls: {
    bathing: {
      response: "not limited"
    },
    grooming: {
      response: "not limited"
    },
    feeding: {
      response: "not limited"
    },
    walkingInsideHome: {
      response: "not limited"
    },
    walkingOutsideHome: {
      response: "not limited"
    },
    bladderBowlControl: {
      response: "not limited"
    },
    dressing: {
      response: "not limited"
    },
  }
}
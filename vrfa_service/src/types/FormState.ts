// Responses from genie API. 

interface FormState {
    survey?: Survey,
    currentSection?: Section,
    currentQuestion?: Question,
    conversation?: string[],
    error?: string
}

interface Survey {
    sections: Section[]
}

interface Section {
    id: number,
    name: string,
    threshold: string,
    questions: Question[],
}

interface Question {
    id: number,
    name: string,
    currentValue: string,
    spokenQuestion: string,
    displayQuestion: string,
    answerType: string,
    answerChoices?: any[],
    scores?: any[]
}

export type { FormState, Survey, Section, Question }
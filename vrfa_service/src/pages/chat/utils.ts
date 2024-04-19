/// Require does not accept dynamic URLs, therefore every question requires a mapping.
const QUESTION_TO_ICON: Map<String, any> =
  new Map<string, string>([
    ['bathing', require('../../icons/bathing.png'),],
    ['dressing', require('../../icons/dressing.png')],
    ['grooming', require('../../icons/grooming.png')],
    ['feeding', require('../../icons/feeding.png')],
    ['walking_inside_home', require('../../icons/walkingInsideHome.png')],
    ['walking_outside_home', require('../../icons/walkingOutsideHome.png')],
    ['bladder_bowel_control', require('../../icons/bladderBowelControl.png')],
    ['functional', require('../../icons/kps.png')],
    ['telephone', require('../../icons/telephone.png')],
    ['laundry', require('../../icons/shopping.png')],
    ['meals', require('../../icons/meals.png')],
    ['housework', require('../../icons/housework.png')],
    ['medication', require('../../icons/medication.png')],
    ['meals', require('../../icons/meals.png')],
    ['shopping', require('../../icons/shopping.png')],
    ['fallen', require('../../icons/everFall.png')],
    ['when_fall', require('../../icons/everFall.png')],
    ['where_fall', require('../../icons/everFall.png')],
    ['vision', require('../../icons/Vision.png')],
    ['hearing', require('../../icons/Hearing.png')],
    ['cane', require('../../icons/cane.png')],
    ['walker', require('../../icons/walker.png')],
    ['crutches', require('../../icons/crutches.png')],
    ['wheelchair', require('../../icons/wheelchair.png')],
    ['brace', require('../../icons/brace.png')],
    ['prosthesis', require('../../icons/prosthesis.png')],
    ['hearing_aid', require('../../icons/hearingAid.png')],
    ['glasses', require('../../icons/glasses.png')],
    ['help', require('../../icons/chores.png')],
    ['emotional_support', require('../../icons/personalProblems.png')],
    ['enjoyable', require('../../icons/enjoyable.png')],
    ['loved', require('../../icons/wanted.png')],
    ['interfere', require('../../icons/interfearSocial.png')],
    ['social_activity', require('../../icons/interfearSocial.png')],
    ['social_comparison', require('../../icons/interfearSocial.png')],
    ['weight_yes_no', require('../../icons/weight.png')],
    ['weight_loss', require('../../icons/weight.png')],
    ['weight_gain', require('../../icons/weight.png')],
    ['weight_no', require('../../icons/weight.png')],
    ['satisfication', require('../../icons/happyGeneral.png')],
    ['dropped_activities', require('../../icons/droppedInterests.png')],
    ['happy', require('../../icons/happyMostTime.png')],
    ['prefer_staying_home', require('../../icons/stayHome.png')],
    ['has_medications', require('../../icons/medication.png')],
    ['num_medications', require('../../icons/medication.png')],
    ['supplements', require('../../icons/supplements.png')],
    ['num_supplements', require('../../icons/supplements.png')],
    ['martial_status', require('../../icons/MARITAL_STATUS.png')],
    ['living_situation', require('../../icons/MARITAL_STATUS.png')],
    ['education', require('../../icons/education.png')],
    ['smoked_30', require('../../icons/smoking.png')],
    ['smoke_consider_quitting', require('../../icons/smoking.png')],
    ['smoke_100', require('../../icons/smoking.png')],
    ['smoke_age_start', require('../../icons/smoking.png')],
    ['smoke_age_quit', require('../../icons/smoking.png')],
    ['smoke_frequency', require('../../icons/smoking.png')],
    ['alcohol', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['alcohol_cut_down', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['alcohol_annoyed', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['alcohol_guilty', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['alcohol_morning', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['alcohol_per_day', require('../../icons/ALCOHOL_AND_DRUGS.png')],
    ['home_health', require('../../icons/HOME_CARE_SERVICE.png')],
    ['assessment_taker', require('../../icons/assessment.png')],
  ]);

const normalizeChoices = (choices: string[]) => choices.map(v => v.toLowerCase());
/**
  * Strips user answer of percent sign, lowercases and trims. 
  * @param answer 
  * @returns formatted answer
  */
const normalizeAnswer = (answer: string): string => answer.toString().toLowerCase().trim().replace(/%/g, '');


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function wait(length: number) { return sleep(length) };

export { QUESTION_TO_ICON, sleep, wait, normalizeAnswer, normalizeChoices };
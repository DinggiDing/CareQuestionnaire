/* eslint-disable */
import React from 'react'
import {
  Box,
  TextField,
  ButtonGroup,
  Button,
  Grid,
  Typography
} from '@mui/material'

import { useLocation } from 'react-router-dom';


import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, getAllUserCurriculum} from '../../slices/curriculum';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';

const styles = {
  page: {
    backgroundColor: "white",
    display: "flex",
    width: "100%",
    paddingBottom: "50px"

  },
  fieldRow: {
    display: "flex", 
    flexDirection: "row",
    height: "40px",
    marginTop: "81px",
    alignItems: "center",
    marginRight: "40px",
    marginLeft: "40px",
  },
  participantField: {
    width: "360px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
    marginLeft: "auto"


  },
  selectedButtonA: {
    backgroundColor: "#6FCF97",
    color: "white",
    boxShadow: 'none',
    width: "260px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  selectedButtonB: {
    backgroundColor: "#F2C94C",
    color: "white",
    boxShadow: 'none',
    width: "160px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  selectedButtonC: {
    backgroundColor: "#F2994A",
    color: "white",
    boxShadow: 'none',
    width: "140px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  curriculumButtonA: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "white",
    boxShadow: 'none',
    width: "260px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  curriculumButtonB: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "white",
    boxShadow: 'none',
    width: "160px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  curriculumButtonC: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "white",
    boxShadow: 'none',
    width: "140px",
    fontSize: "24px",
    borderRadius: "10px"
  },
  bodyPage: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  },
  addParticipantButton: {
    textTransform: "none",
    fontSize: "16px",
    width: '160px',
    height: '30px',
    padding: '10.29px',
    borderRadius: '10px',
    gap: '10.29px',
    backgroundColor: "#13386B",
    color: "white"
  },
  dateRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "25px"
  }, 
  gridContainer: {
    alignItems: "center",
    justifyContents: "center",
    textAlign: "center",
    margin: "25px",
    marginRight: "50px"
  },
  gridContainerBody: {
    alignItems: "center",
    justifyContents: "center",
    textAlign: "center",
    borderLeft: '2px solid #BDBDBD',
    borderRight: '2px solid #BDBDBD'  
  },
  gridBody: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderBottom: '2px solid #BDBDBD',
    borderLeft: '2px solid #BDBDBD',
    borderRight: '2px solid #BDBDBD'   
  },
  gridBodyRight: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "120px",
    borderRight: '2px solid #BDBDBD',
    borderLeft: '2px solid #BDBDBD',
  },
  gridBodyProgress: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px"
  },
  gridTitleTextParticipant: {
    color: "white",
    fontSize: "20px",
    height: "40px",
    lineHeight: "40px",
    backgroundColor: "#365681",
    borderTopLeftRadius: '10px',   // Rounds the top-left corner
    borderBottom: '2px solid #BDBDBD'  
  },
  gridTitleTextWeek: {
    color: "white",
    fontSize: "20px",
    height: "40px",
    lineHeight: "40px",
    backgroundColor: "#365681",
    borderBottom: '2px solid #BDBDBD',
    borderLeft: '2px solid #BDBDBD'
  },
  gridTitleTextProgress: {
    color: "white",
    fontSize: "20px",
    height: "40px",
    lineHeight: "40px",
    backgroundColor: "#365681",
    borderTopRightRadius: '10px',   // Rounds the top-left corner
    borderBottom: '2px solid #BDBDBD' ,
    borderLeft: '2px solid #BDBDBD'
  },
  allMarker: {
    backgroundColor: "#62A1F4",
    borderRadius: "10px",
    width: "5px",
    height: "100%"
  },
  ambMarker: {
    backgroundColor: "#6FCF97",
    borderRadius: "10px",
    width: "5px",
    height: "100%"
  }
  ,bedMarker: {
    backgroundColor: "#F2994A",
    borderRadius: "10px",
    width: "5px",
    height: "100%"
  },
  chairMarker: {
    backgroundColor: "#F2C94C",
    borderRadius: "10px",
    width: "5px",
    height: "100%"
  },
  allMarkerBox: {
    backgroundColor: "#62A1F4",
    borderRadius: "3px",
    width: "20px",
    height: "100%"
  },
  ambMarkerBox: {
    backgroundColor: "#6FCF97",
    width: "20px",
    borderRadius: "3px",
    height: "100%"
  }
  ,bedMarkerBox: {
    backgroundColor: "#F2994A",
    width: "20px",
    borderRadius: "3px",
    height: "100%"
  },
  chairMarkerBox: {
    backgroundColor: "#F2C94C",
    width: "20px",
    borderRadius: "3px",
    height: "100%"
  },
  specificMarker: {
    backgroundColor: "#9B51E0",
    borderRadius: "3px",
    width: "20px",
    height: "100%"
  },
  specificMarkerBox: {
    backgroundColor: "#9B51E0",
    width: "20px",
    borderRadius: "3px",
    height: "100%"
  },
  editRow: {
    display: "flex",
    flexDirection: "row",
    alignItems:"center",
    marginLeft: "50px",
    marginRight: "50px",
  },
  editButton: {
    display: "flex",
    backgroundColor: "#365681",
    textTransform: 'none',
    marginLeft: "auto",
    borderRadius: "10px",
    width: "120px"
  },
  legendBox: {
    display: "flex",
    marginLeft: "30px",
    flexDirection: "row",
    alignItems: "center"
  },
} as const;



function getNextMomentDate(): moment.Moment {
  const today = moment();
  const nextMonday = today.clone().day(8); // Setting 'day' to 8 calculates the next Monday

  return nextMonday;
}

type Activity = {
  activityTitle: string;
  week: number;
  activityType: string;
}

// const activities: Activity[] = [
//   { activityTitle: "Overview of program", week: 1, activityType: "wide" },
//   { activityTitle: "Benefits of Exercise for Cancer Survivors", week: 2, activityType: "wide" },
//   { activityTitle: "Exercise Safety Issues for Cancer Survivors", week: 2, activityType: "wide" },
//   { activityTitle: "Tips to Avoid Falls at Your MSK Appointment", week: 4, activityType: "wide" },
//   { activityTitle: "Balancing Healthy Eating, Dietary Needs and Cultural Practices", week: 5, activityType: "wide" },
//   { activityTitle: "Weight Management After Cancer", week: 5, activityType: "wide" },
//   { activityTitle: "Mindful Breathing Meditation", week: 6, activityType: "wide" },
//   { activityTitle: "Mindful Movement Meditation", week: 6, activityType: "wide" },
//   { activityTitle: "Yoga Nidra", week: 6, activityType: "wide" },
//   { activityTitle: "NIH Forgetfulness: Normal or Not?", week: 7, activityType: "wide" },
//   { activityTitle: "Common Cognitive Problems After Cancer Treatment", week: 7, activityType: "wide" },
//   { activityTitle: "Strategies to Improve Cognitive Function", week: 7, activityType: "wide" },
//   { activityTitle: "Video - Making it Stick", week: 8, activityType: "wide" },
//   { activityTitle: "Bed - Beginner Bed Exercises", week: 2, activityType: "bed" },
//   { activityTitle: "Bed - Intermediate Bed Exercises", week: 3, activityType: "bed" },
//   { activityTitle: "Bed - Advanced Bed Exercises", week: 4, activityType: "bed" },
//   { activityTitle: "Chair - Beginner Chair Exercises", week: 2, activityType: "chair" },
//   { activityTitle: "Chair - Intermediate Chair Exercises", week: 3, activityType: "chair" },
//   { activityTitle: "Chair - Advanced Chair Exercises", week: 4, activityType: "chair" },
//   { activityTitle: "Ambulatory - Beginner Ambulatory Exercises", week: 2, activityType: "amb" },
//   { activityTitle: "Ambulatory - Intermediate Ambulatory Exercises", week: 3, activityType: "amb" },
//   { activityTitle: "Ambulatory - Advanced Ambulatory Exercises", week: 4, activityType: "amb" }
// ];

const CurriculumParticipantOverview = () => {
  const [selectedCurr, setSelectedCurr] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [date, setDate] = React.useState<moment.Moment|null>(getNextMomentDate());
  const [loading, setLoading] = React.useState(true)
  const dispatch = useDispatch();
  const { id } = useParams();
  const userCurriculums = useSelector((state: RootState) => state.curriculum.userCurriculums) as any;
  const buttonTypes = [
    <Button style={(true ? styles.selectedButtonA : styles.curriculumButtonA)} onClick={() => setSelectedCurr("amb")} variant="contained" key="amb">AMBULATORY</Button>,
    <Button style={(true ? styles.selectedButtonB : styles.curriculumButtonB)} onClick={() => setSelectedCurr("chair")} key="chair">CHAIR</Button>,
    <Button style={(true? styles.selectedButtonC : styles.curriculumButtonC)} onClick={() => setSelectedCurr("bed")} key="bed">BED</Button>,
  ]
  const [buttons, setButtonsGroup] = React.useState([
    <Button style={(true ? styles.selectedButtonA : styles.curriculumButtonA)} onClick={() => setSelectedCurr("amb")} variant="contained" key="amb">AMBULATORY</Button>,
    <Button style={(true ? styles.selectedButtonB : styles.curriculumButtonB)} onClick={() => setSelectedCurr("chair")} key="chair">CHAIR</Button>,
    <Button style={(true? styles.selectedButtonC : styles.curriculumButtonC)} onClick={() => setSelectedCurr("bed")} key="bed">BED</Button>,
  ])

  React.useEffect(() => {
    console.log("dispatch")
    setLoading(true)
    dispatch(getAllUserCurriculum() as any)
  }, [location.pathname])

  React.useEffect(() => {
    if (userCurriculums) {
      console.log("filter")
      setLoading(false)
    }
  }, [userCurriculums])


  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSubmit = () => {
    if (!userName || !date || !selectedCurr) {
      console.log("Missing required information")
      return
    }
    dispatch(addNewUser(userName, date.toString(), selectedCurr) as any);
    setDate(getNextMomentDate());
    setSelectedCurr('');
    setUserName("");
  };

  function determinePercentageColor(type: string) {
    if (type == "wide") {
      return "#62A1F4"
    } else if (type == "amb") {
      return "#6FCF97"
    } else if (type == "bed") {
      return "#F2994A"
    } else if (type == "chair") {
      return "#F2C94C"
    } else if (type == "specific") {
      return "#9B51E0"
    }
     return "#62A1F4"
  }

  function userWeekPercentage(userData: any, currentWeek: any) {
    let num = 0;
    let deno = 0;
    userData.activities.forEach((activity: any) => {
      if (activity.assignedWeek == currentWeek) {
        num += activity.secondsWatch
        deno += parseInt(activity.duration)
      }
    })
    console.log(num, deno)
    console.log(naiveRound(num/deno, 2) * 100)
    return Math.min(Math.round(naiveRound(num/deno, 2) * 100), 100)
  }

  function renderWeekRows(){
    let renderResult = [];
    for(let i = 0; i < userCurriculums.length; i++) {
      let userData = userCurriculums[i][0] as any
      console.log(userData)
      if (!userData.role && userData.vrfaProgress != 0) {
      renderResult.push(<>
        <Grid style={styles.gridBody} container spacing={0}>
          <Grid item xs={3}>
            <Typography color="black" fontSize="20px" variant="h4">
              {userData.userName}
            </Typography>
            </Grid>
            <Grid item style={styles.gridBodyRight} xs={1}>
            <Typography variant="h4">
              {calculateWeeksSinceStartDate(userData.startDate, new Date())}
            </Typography>
            </Grid>
            <Grid item style={styles.gridBodyProgress} xs={8}>
            <Box
                sx={{
                  height: '20px',
                  width: '100%',
                  backgroundColor: '#eee', // Color of the background bar
                  borderRadius: '10px', // Rounded edges for the background bar
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${userWeekPercentage(userData, calculateWeeksSinceStartDate(userData.startDate, new Date()))}%`,
                    backgroundColor: '#13386B', // Color of the progress bar
                    borderRadius: 'inherit', // Rounded edges for the progress bar
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </Box>
              <Typography marginLeft="30px" fontSize="24px" color="#365681" marginRight="15px">
              {`${userWeekPercentage(userData, calculateWeeksSinceStartDate(userData.startDate, new Date()))}%`}
              </Typography>
            </Grid>
        </Grid>
      </>)
    }}

    return renderResult
  }

  function getCurrentFormattedDateWithWeekRange() {
    const currentDate = new Date();

    // Calculate the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = currentDate.getDay();
  
    // Calculate the difference in days to go back to the most recent Monday
    const daysToLastMonday = (currentDayOfWeek + 6) % 7;
  
    // Calculate the date of the last Monday
    const lastMonday = new Date(currentDate);
    lastMonday.setDate(currentDate.getDate() - daysToLastMonday);
  
    // Calculate the date of the following Sunday (end of the week)
    const endOfWeek = new Date(lastMonday);
    endOfWeek.setDate(lastMonday.getDate() + 6);
  
    const monthOptions = { month: 'long' };
    const dayOptions = { day: 'numeric' };
  
    const formattedStartMonth = new Intl.DateTimeFormat('en-US', monthOptions as any).format(lastMonday);
    const formattedStartDate = new Intl.DateTimeFormat('en-US', dayOptions as any).format(lastMonday);
  
    const formattedEndMonth = new Intl.DateTimeFormat('en-US', monthOptions as any).format(endOfWeek);
    const formattedEndDate = new Intl.DateTimeFormat('en-US', dayOptions as any).format(endOfWeek);
  
    return `${formattedStartMonth} ${formattedStartDate}-${formattedEndDate}, ${lastMonday.getFullYear()}`;
  }
  
  // Example usage:
  const formattedDateWithWeekRange = getCurrentFormattedDateWithWeekRange();



function determineMarker(type: string){
    if (type == "wide") return styles.allMarker
    if (type == "amb") return styles.ambMarker
    if (type == "chair") return styles.chairMarker
    if (type == "bed") return styles.bedMarker
}

function calculateWeeksSinceStartDate(startDateStr: string, currentDate: Date): number {
  // Parse the start date
  const startDate = new Date(startDateStr);

  // Normalize both dates to the start of the week (Monday)
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay() + (startDate.getDay() === 0 ? -6 : 1));

  const currentStartOfWeek = new Date(currentDate);
  currentStartOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));

  // Calculate weeks passed
  const weeksPassed = Math.floor((currentStartOfWeek.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));

  // If it's the same week as the start date, start counting from 1
  const weeksSinceStartDate = Math.max(weeksPassed + 1, 1);

  return weeksSinceStartDate;
}




function naiveRound(num: number, decimalPlaces = 0) {
  var p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
}

function convertSecondsToMinutes(seconds: number): [number, number] {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return [minutes, remainingSeconds];
}

// Example usage
console.log(convertSecondsToMinutes(500)); // 500 seconds as an example
``


function getNextEightWeeks(startDate: string): string[] {
    let startMoment = moment(startDate);
    let weeks: string[] = [];

    for (let i = 0; i < 8; i++) {
        let weekStart = startMoment.clone().add(i, 'weeks').startOf('isoWeek');
        let weekEnd = weekStart.clone().endOf('isoWeek');
        let formattedWeek = `${weekStart.format('MMMM D')} – ${weekEnd.format('D, YYYY')}`;
        weeks.push(formattedWeek);
    }

    return weeks;
}

  return (
   <>
   {(!loading) ?
    <Box  style={styles.page} display="flex" flexDirection="column">
      <Box style={styles.fieldRow}>
        <Typography fontSize="40px" variant="h2" >
          Overview
        </Typography>
        <Box style={styles.buttonGroup}>
          <Typography variant={"subtitle1"} fontSize={"24px"}>
              {getCurrentFormattedDateWithWeekRange()}
          </Typography>
        </Box>
      </Box>
      <Box style={styles.bodyPage}>
      <Grid style={styles.gridContainer} // Centers horizontally
      alignItems="center" container spacing={0}>
         <Grid alignItems="center" container spacing={0}>
         <Grid item xs={3}>
            <Typography style={styles.gridTitleTextParticipant} variant="h5">
              Participant
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={styles.gridTitleTextWeek} variant="h5">
              Week
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" style={styles.gridTitleTextProgress}>
            This Week’s Progress
            </Typography>
          </Grid>
          {renderWeekRows()}
        </Grid>
        
      </Grid>
      </Box>
    </Box>
    : 
      <></>
    }
   </>
  );
}

export default CurriculumParticipantOverview;
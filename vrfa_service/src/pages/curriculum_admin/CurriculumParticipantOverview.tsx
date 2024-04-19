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
import CircularProgress from '@mui/material/CircularProgress';

import { useLocation } from 'react-router-dom';


import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, retrieveUserCurriculum} from '../../slices/curriculum';
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
  usernameRow: {
    display: "flex", 
    flexDirection: "row",
    height: "40px",
    marginTop: "10px",
    alignItems: "center",
    marginRight: "40px",
    marginLeft: "40px",
    width: "100%"
  },
  participantField: {
    width: "360px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
    borderRadius: "6px",
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
    borderRight: '2px solid #BDBDBD',   
  },
  gridBodyRight: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "120px",
    borderLeft: '2px solid #BDBDBD',
  },
  gridBodyProgress: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
    minHeight: "120px",
    borderLeft: '2px solid #BDBDBD',
  },
  gridTitleTextWeek: {
    color: "white",
    fontSize: "20px",
    height: "40px",
    lineHeight: "40px",
    backgroundColor: "#365681",
    borderTopLeftRadius: '10px',   // Rounds the top-left corner
    borderBottom: '2px solid #BDBDBD'  
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
  resetPasswordBut: {
    backgroundColor: "#62A1F4",
    marginLeft: "30px",
    width: "180px",
    height: "41px",
    boxShadow: 'none'
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
  const [userData, setUserData] = React.useState<any>({});
  const [date, setDate] = React.useState<moment.Moment|null>(getNextMomentDate());
  const [loading, setLoading] = React.useState(true)
  const dispatch = useDispatch();
  const { id } = useParams();
  //const userData = useSelector((state: RootState) => state.curriculum.userData) as any;
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
    loadCurriculum()
  }, [location.pathname])

  async function loadCurriculum() {
    let curr = await dispatch(retrieveUserCurriculum(id) as any)
    setUserData(curr)
    console.log("filter")
    if (userData.curriculum) {
      let buttonsTemp = buttonTypes.filter((button) => button.key == userData.curriculum)
      setButtonsGroup(buttonsTemp)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

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

  function renderWeekRows(){
    let renderResult = [];
    let nextWeeks = getNextEightWeeks(userData.startDate)
    for(let i = 1; i < 9; i++) {
      renderResult.push(<>
        <Grid style={styles.gridBody} container spacing={0}>
          <Grid item xs={4}>
            <Typography variant="h4">
              {i}
            </Typography>
            <Typography>
              {nextWeeks[i - 1]}
            </Typography>
            </Grid>
            <Grid item style={styles.gridBodyRight} xs={8}>
              {renderActivity(i)}
            </Grid>
        </Grid>
      </>)
    }

    return renderResult
  }

function determineMarker(type: string){
    if (type == "wide") return styles.allMarker
    if (type == "amb") return styles.ambMarker
    if (type == "chair") return styles.chairMarker
    if (type == "bed") return styles.bedMarker
}
function naiveRound(num: number, decimalPlaces = 0) {
  var p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
}

function renderActivity(week: number) {
  let result = [] as any
  userData.activities.forEach((activity: any) => {
    if ((activity.assignedWeek == week && userData.curriculum == activity.type) || (activity.assignedWeek == week && "wide" == activity.type)) {
      let durationMin = convertSecondsToMinutes(activity.duration)
      result.push(<Box display="flex" alignItems="center" marginTop="10px" flexDirection={"row"}>
      {(activity.secondsWatch > 0) ? 
        <Typography style={{marginRight: "10px", color: determinePercentageColor(activity.type)}} fontSize="20px" variant='subtitle1'>
        {`${Math.min(Math.round(naiveRound(activity.secondsWatch/activity.duration, 2) * 100), 100)}%`}
        </Typography>
      : 
        <></>}
      <Box style={determineMarker(activity.type)}>&nbsp;</Box>
      <Typography style={{marginLeft: "10px"}} fontSize="16px" variant='subtitle1'>
        {`${activity.title} (${durationMin[0]}:${durationMin[1]} min.)`}
      </Typography>
      </Box>)
    }
  })

   return result
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
console.log(userData)

  return (
   <>
   {(!loading) ?
   <>
      {(userData.vrfaProgress! || userData.vrfaProgress == 0) ? <>
        <Box  style={styles.page} display="flex" flexDirection="column">
          <Box style={styles.fieldRow}>
            <Typography fontSize="40px" variant="h2" >
              {`${userData.participantName}`}
            </Typography>
          </Box>
          <Box style={styles.usernameRow}>
            <Typography  fontSize="24px" variant="caption" >
              {`Username: ${userData.userName}`}
            </Typography>
            <Button variant='contained'  style={styles.resetPasswordBut}>Reset Password</Button>
          </Box>
        <Box style={styles.bodyPage}>
          <Grid style={styles.gridContainer} // Centers horizontally
          alignItems="center" container spacing={0}>
            <Grid alignItems="center" container spacing={0}>
              <Grid item xs={4}>
                <Typography style={styles.gridTitleTextWeek} variant="h5">
                  Week
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" style={styles.gridTitleTextProgress}>
                  Progress
                </Typography>
              </Grid>
              <Grid style={styles.gridBody} container spacing={0}>
              <Grid item xs={4}>
                <Typography variant="h4">
                  vFRA
                </Typography>
                </Grid>
                <Grid item style={styles.gridBodyProgress} xs={8}>
                  <Typography marginLeft="30px" fontSize="36px" color="#62A1F4" >
                    {userData.vrfaProgress}%
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
           </Grid>
        </Box>
        </Box>
      </> : 
      <>
        <Box  style={styles.page} display="flex" flexDirection="column">
          <Box style={styles.fieldRow}>
            <Typography fontSize="40px" variant="h2" >
              {`${userData.userName}`}
            </Typography>
            <Box style={styles.buttonGroup}>
              {buttons}
            </Box>
          </Box>
          <Box style={styles.usernameRow}>
            <Typography  fontSize="24px" variant="caption" >
              {`Username: ${userData.userName}`}
            </Typography>
            <Button variant='contained'  style={styles.resetPasswordBut}>Reset Password</Button>
          </Box>
          <Box style={styles.bodyPage}>
          <Grid style={styles.gridContainer} // Centers horizontally
          alignItems="center" container spacing={0}>
            <Grid alignItems="center" container spacing={0}>
              <Grid item xs={4}>
                <Typography style={styles.gridTitleTextWeek} variant="h5">
                  Week
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" style={styles.gridTitleTextProgress}>
                  Progress
                </Typography>
              </Grid>
              {renderWeekRows()}
            </Grid>
            
          </Grid>
          </Box>
          <Box style={styles.editRow}>
            <Box style={styles.legendBox}>
              <Box style={styles.allMarkerBox}>&nbsp;</Box>
              <Typography marginLeft="10px" fontSize="16px" variant="subtitle1"> 
                Curriculum-wide 
              </Typography>
            </Box>
            <Box style={styles.legendBox}>
              <Box style={styles.ambMarkerBox}>&nbsp;</Box>
              <Typography marginLeft="10px" fontSize="16px" variant="subtitle1"> 
              Ambulatory
              </Typography>
            </Box>
            <Box style={styles.legendBox}>
              <Box style={styles.chairMarkerBox}>&nbsp;</Box>
              <Typography marginLeft="10px" fontSize="16px" variant="subtitle1"> 
              Chair
              </Typography>
            </Box>
            <Box style={styles.legendBox}>
              <Box style={styles.bedMarkerBox}>&nbsp;</Box>
              <Typography marginLeft="10px" fontSize="16px" variant="subtitle1"> 
              Bed
              </Typography>
            </Box>
            <Box style={styles.legendBox}>
              <Box style={styles.specificMarkerBox}>&nbsp;</Box>
              <Typography marginLeft="10px" fontSize="16px" variant="subtitle1"> 
              Symptom Specific
              </Typography>
            </Box>
            <Button style={styles.editButton} variant='contained'>Edit</Button>
          </Box>
        </Box>
    </>}
    </>
    : 
      <Box display="flex" alignItems="center" margin="30px">
      <CircularProgress />
      </Box>
    }
   </>
  );
}

export default CurriculumParticipantOverview;
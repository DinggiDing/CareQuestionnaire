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
import VideoPlayer from './components/VideoPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, retrieveUserCurriculum } from '../../slices/curriculum';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const styles = {
  page: {
    backgroundColor: "white",
    display: "flex",
    width: "100%",
    paddingBottom: "50px",
    height: "100%"
  },
  videoPage: {
    backgroundColor: "black",
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  videoPageHeader: {
    display: "flex",
    width: "100%",
    height: "125px",
    flexDirection: "row",
    alignItems: "center"
  },
  videoExitButton: {
    height: "60px",
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "35px",
    textTransform: "none",
    marginLeft: "25px",
    width: "180px"
  },
  fieldRow: {
    display: "flex",
    backgroundColor: "rgba(54, 86, 129, 0.15)",
    flexDirection: "row",
    height: "100px",
    alignItems: "center",

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
    marginTop: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "50px",
    marginRight: "50px",
    height: "100%",
    width: "100%"

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
    flexDirection: "column",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "15px",
    width: "100%"
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
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
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
    borderBottom: '2px solid #BDBDBD',
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
  , bedMarker: {
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
  , bedMarkerBox: {
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
    alignItems: "center",
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
  nextWeek: {
    marginLeft: "auto",
    height: "55px",
    color: "#365681",
    fontSize: "36px",
    textTransform: "none",
    marginRight: "15px",
  },
  prevWeek: {
    marginRight: "auto",
    height: "55px",
    color: "#365681",
    fontSize: "36px",
    textTransform: "none",
    marginLeft: "15px",
  },
  activityBox: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    marginRight: "auto"
  },
  activityRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
    alignItems: "center",
  },
  activityButton: {
    backgroundColor: "#13386B",
    fontSize: "36px",
    width: "240px",
    textTransform: "none",
    color: "white",
    borderRadius: "10px"
  },
  activityButtonFinished: {
    backgroundColor: "white",
    fontSize: "36px",
    width: "240px",
    textTransform: "none",
    color: "#13386B",
    borderRadius: "10px"
  }
  ,
  activityButtonUpNext: {
    backgroundColor: "rgba(19, 56, 107, 0.5)",
    fontSize: "36px",
    width: "240px",
    textTransform: "none",
    color: "white",
    borderRadius: "10px"
  }
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

const CurriculumParticipantOverview = () => {
  const [selectedCurr, setSelectedCurr] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [date, setDate] = React.useState<moment.Moment | null>(getNextMomentDate());
  const [loading, setLoading] = React.useState(true)
  const [weekStatus, setWeekStatus] = React.useState("next")
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentWeek, setCurrentWeek] = React.useState(1)
  const currentDate = new Date();
  const userData = useSelector((state: RootState) => state.curriculum.userData) as any;
  const currentWeekString = getNextEightWeeks(userData.startDate)[currentWeek - 1]
  const [playingActivity, setPlayingActivity] = React.useState(null) as any

  React.useEffect(() => {
    if (weekStatus == "next") {
      const weeksPassed = calculateWeeksSinceStartDate(userData.startDate, currentDate);
      setCurrentWeek(weeksPassed)
    } else {
      const weeksPassed = calculateWeeksSinceStartDate(userData.startDate, currentDate);
      setCurrentWeek(weeksPassed + 1)
    }

  }, [weekStatus])

  React.useEffect(() => {
    if (!playingActivity) {
      console.log("dispatch")
      dispatch(retrieveUserCurriculum(id) as any)
    }
  }, [playingActivity])

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


  React.useEffect(() => {
    console.log("dispatch")
    dispatch(retrieveUserCurriculum(id) as any)
  }, [location.pathname])

  React.useEffect(() => {
    if (userData) {
      console.log(userData.activities)
      setLoading(false)
    }
  }, [userData])


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

  function renderWeekRows() {
    let renderResult = [];
    let nextWeeks = getNextEightWeeks(userData.startDate)
    for (let i = 1; i < 9; i++) {
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

  function determineMarker(type: string) {
    if (type == "wide") return styles.allMarker
    if (type == "amb") return styles.allMarker
    if (type == "wide") return styles.allMarker
    if (type == "wide") return styles.allMarker
  }


  function renderActivity(week: number) {
    let result = [] as any
    userData.activities.forEach((activity: any) => {
      if ((activity.assignedWeek == week && userData.curriculum == activity.type) || (activity.assignedWeek == week && "wide" == activity.type)) {
        let durationMin = convertSecondsToMinutes(activity.duration)
        result.push(<>
          <Box style={styles.allMarker}>&nbsp;</Box>
          <Typography style={{ marginLeft: "10px" }} variant='subtitle1'>
            {`${activity.title} (${durationMin[0]}:${durationMin[1]} min.)`}
          </Typography>
        </>)
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

  function calculateWeeksPassedAndCurrentWeek(inputDateStr: string, currentDate: Date): [number, string] {
    // Parse the input date
    const inputDate = new Date(inputDateStr);

    // Check if input date is in the future
    if (inputDate > currentDate) {
      return [0, `${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6).toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`];
    }

    // Normalize both dates to the start of the week (Monday)
    const startOfInputWeek = new Date(inputDate);
    startOfInputWeek.setDate(inputDate.getDate() - inputDate.getDay() + (inputDate.getDay() === 0 ? -6 : 1));

    const startOfCurrentWeek = new Date(currentDate);
    startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));

    // Calculate weeks passed
    const weeksPassed = Math.floor((startOfCurrentWeek.getTime() - startOfInputWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Calculate the current week range
    const currentWeekEnd = new Date(startOfCurrentWeek);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    const currentWeekRange = `${startOfCurrentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${currentWeekEnd.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;

    return [weeksPassed, currentWeekRange];
  }

  function naiveRound(num: number, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
  }

  function activityButtonText(activity: any) {
    if (activity.secondsWatch == 0) {
      return "Start"
    } else if (activity.secondsWatch !== 0 && activity.secondsWatch !== activity.duration && activity.secondsWatch < activity.duration) {
      return `${Math.round(naiveRound(activity.secondsWatch / activity.duration, 2) * 100)}%`
    } else if (activity.secondsWatch >= activity.duration) {
      return "Finished"
    }
    return "Start"
  }

  function weekPercentage() {
    let num = 0;
    let deno = 0;
    userData.activities.forEach((activity: any) => {
      if (activity.assignedWeek == currentWeek) {
        num += activity.secondsWatch
        deno += parseInt(activity.duration)
      }
    })
    console.log(num, deno)
    console.log(naiveRound(num / deno, 2) * 100)
    return naiveRound(num / deno, 2) * 100
  }

  function determineActivityButtonStyle(activity: any) {
    if (weekStatus == "next") {
      if (activity.secondsWatch >= activity.duration) {
        return styles.activityButtonFinished
      }
      return styles.activityButton
    } else {
      return styles.activityButtonUpNext
    }
  }

  function displayActivities() {
    let result = [] as any
    userData.activities.forEach((activity: any) => {
      if (activity.assignedWeek == currentWeek) {
        let activityTime = convertSecondsToMinutes(activity.duration);
        result.push(
          <Box style={styles.activityRow}>
            <Button onClick={() => setPlayingActivity(activity)} disabled={weekStatus != "next"} style={determineActivityButtonStyle(activity)}>{(weekStatus == "next") ? activityButtonText(activity) : "Up next"}</Button>
            <Typography style={{ marginLeft: "40px" }} fontSize="35px" variant="subtitle1">{`${activity.title} (${activityTime[0]}:${activityTime[1]} min.)`}</Typography>
          </Box>
        )
      }
    })

    return result;
  }

  return (
    <>
      {(!loading) ?
        <>
          {(playingActivity) ? <>
            <Box style={styles.videoPage} >
              <Box style={styles.videoPageHeader}>
                <Button onClick={() => setPlayingActivity(null)} style={styles.videoExitButton} variant="contained">
                  Exit
                </Button>
              </Box>
              <VideoPlayer userActivityId={playingActivity.id} secondsIn={playingActivity.secondsWatch} videoUrl={playingActivity.url} />
            </Box>
          </> :
            <Box style={styles.page} display="flex" flexDirection="column">
              <Box style={styles.fieldRow}>
                {(weekStatus != "next") ? <Button onClick={() => setWeekStatus("next")} style={styles.prevWeek} startIcon={<PlayArrowIcon style={{ fontSize: "60px", transform: 'rotate(180deg)' }}></PlayArrowIcon>}>
                  This Week
                </Button> : <Button onClick={() => setWeekStatus("this")} style={styles.nextWeek} endIcon={<PlayArrowIcon style={{ fontSize: "60px" }}></PlayArrowIcon>}>
                  Next Week
                </Button>}
              </Box>
              <Box style={styles.bodyPage}>
                <Box marginRight="auto">
                  {(weekStatus != "next") ? <Typography fontWeight="bold" variant='h3'>Next week's activities</Typography> : <Typography fontWeight="bold" variant='h3'>This week's activities</Typography>}
                </Box>
                <Box style={styles.activityBox}>
                  {displayActivities()}
                </Box>
                <Box style={styles.dateRow}>
                  <Box style={{ marginRight: "auto" }}>
                    <Typography fontSize="36px" variant='subtitle1'>
                      Week {currentWeek}
                    </Typography>
                    <Typography fontSize="36px" variant='subtitle1'>
                      {currentWeekString}
                    </Typography>
                    <>
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
                            width: `${weekPercentage()}%`,
                            backgroundColor: '#13386B', // Color of the progress bar
                            borderRadius: 'inherit', // Rounded edges for the progress bar
                            transition: 'width 0.3s ease-in-out',
                          }}
                        />
                      </Box>
                    </>
                  </Box>
                </Box>
              </Box>
            </Box>
          }</>
        :
        <></>
      }
    </>
  );
}

export default CurriculumParticipantOverview;
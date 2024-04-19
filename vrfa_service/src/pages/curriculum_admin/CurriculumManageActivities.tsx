/* eslint-disable */
import React from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem, 
} from '@mui/material'
import { useDispatch } from 'react-redux';
import { addNewUser } from '../../slices/curriculum';
import moment from 'moment';
import {createNewActivity} from '../../slices/curriculum'
const styles = {
  page: {
    backgroundColor: "white",
    display: "flex",
    width: "100%",
    padding: "50px"
  },
  fieldRow: {
    display: "flex", 
    flexDirection: "row",
    height: "40px",
    width: "100%",
    marginTop: "81px",
    alignItems: "center",
  },
  participantField: {
    width: "360px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
    backgroundColor: "#BDBDBD",
    borderRadius: "6px",
    marginLeft: "10px"

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
    marginTop: "10px"
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
  newActivityBox: {
    display: "flex",
    flexDirection: "column"
  }
} as const;

function getNextMomentDate(): moment.Moment {
  const today = moment();
  const nextMonday = today.clone().day(8); // Setting 'day' to 8 calculates the next Monday

  return nextMonday;
}

const CurriculumManageActivities = () => {
  const [selectedCurr, setSelectedCurr] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [date, setDate] = React.useState<moment.Moment|null>(getNextMomentDate());
  const [newActivity, setNewActivity] = React.useState(false);
  const [formActivityType, setFormActivityType] = React.useState("");
  const [activityTitle, setActivityTitle] = React.  useState('');
  const [activityVideoURL, setActivityVideoURL] = React.  useState('');
  const [assignedWeek, setAssignedWeek] = React.  useState('');

  const dispatch = useDispatch();

  const buttons = [
    <Button style={(selectedCurr == "amb" ? styles.selectedButtonA : styles.curriculumButtonA)} onClick={() => setSelectedCurr("amb")} variant="contained" key="one">AMBULATORY</Button>,
    <Button style={(selectedCurr == "chair" ? styles.selectedButtonB : styles.curriculumButtonB)} onClick={() => setSelectedCurr("chair")} key="two">CHAIR</Button>,
    <Button style={(selectedCurr == "bed" ? styles.selectedButtonC : styles.curriculumButtonC)} onClick={() => setSelectedCurr("bed")} key="three">BED</Button>,
  ];

  const handleTextChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActivityTitle(event.target.value);
  };

  const handleTextChangeURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActivityVideoURL(event.target.value);
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

  async function handleCreateNewActivity(){
    if (!activityTitle || !activityVideoURL || !formActivityType) {
      console.error("Error: one of the variables is empty");
      return;
    }

    await dispatch(createNewActivity(activityTitle, activityVideoURL, formActivityType, assignedWeek) as any)
    console.log("Executing abstract code...");
    setNewActivity(false)
  }
  
  // Handler function for Select onChange event
  const handleSelectChange = (event: any) => {
    setFormActivityType(event.target.value);
  };

  // Handler function for Select onChange event
  const handleWeekChange = (event: any) => {
    setAssignedWeek(event.target.value);
  };

  return (
   <>
    <Box  style={styles.page} display="flex" flexDirection="column">
      <Box style={styles.fieldRow}>
      {(newActivity) ? 
        <></>
        : <Button onClick={() => setNewActivity(true)} variant="contained">
        Create New Activity
      </Button>}
      </Box>
      <Box style={styles.bodyPage}>
        {(newActivity) ? 
        <Box style={styles.newActivityBox}>
        <Typography variant='h3'>
        Create New Activity
      </Typography>
      <TextField onChange={handleTextChangeTitle} style={{marginTop: "10px"}} label="Title" />
      <TextField onChange={handleTextChangeURL} style={{marginTop: "10px"}}  label="Video URL" />
      <FormControl style={{marginTop: "10px"}}  fullWidth>
      <InputLabel >Type</InputLabel>
      <Select
        label="Type"
        value={formActivityType}
        onChange={handleSelectChange}
      >
        <MenuItem value={"wide"}>All</MenuItem>
        <MenuItem value={"amb"}>Ambulatory</MenuItem>
        <MenuItem value={"chair"}>Chair</MenuItem>\
        <MenuItem value={"bed"}>Bed</MenuItem>
      </Select>
      <FormControl  style={{marginTop: "10px"}}  fullWidth>
      <InputLabel id="number-select-label">Assigned Week</InputLabel>
      <Select
        labelId="number-select-label"
        id="number-select"
        value={assignedWeek !== null ? assignedWeek : ''}
        label="Assigned Week"
        onChange={handleWeekChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
          <MenuItem key={number} value={number}>
            {number}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
</FormControl>
        <Button style={{marginTop: "10px"}}  onClick={handleCreateNewActivity} variant="contained">
        Submit
      </Button>
      <Button style={{marginTop: "10px"}}  onClick={() => setNewActivity(false)} variant="contained">
        Cancel
      </Button>
      </Box>
        :  <Typography variant='h3'>
        Activities
      </Typography>}
      </Box>
    </Box>
   </>
  );
}

export default CurriculumManageActivities;
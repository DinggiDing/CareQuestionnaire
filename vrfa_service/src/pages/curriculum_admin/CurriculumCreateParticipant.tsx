/* eslint-disable */
import React from 'react'
import {
  Box,
  TextField,
  ButtonGroup,
  Button,
  Typography
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from 'react-redux';
import { addNewUser, createNewUser } from '../../slices/curriculum';
import moment from 'moment';

const styles = {
  page: {
    backgroundColor: "white",
    display: "flex",
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
    height: '40px',
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
  }
} as const;

function getNextMomentDate(): moment.Moment {
  const today = moment();
  const nextMonday = today.clone().day(8); // Setting 'day' to 8 calculates the next Monday

  return nextMonday;
}

const CurriculumSidePanel = () => {
  const [selectedCurr, setSelectedCurr] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false)
  const [date, setDate] = React.useState<moment.Moment|null>(getNextMomentDate());
  const dispatch = useDispatch();

  const buttons = [
    <Button style={(selectedCurr == "amb" ? styles.selectedButtonA : styles.curriculumButtonA)} onClick={() => setSelectedCurr("amb")} variant="contained" key="one">AMBULATORY</Button>,
    <Button style={(selectedCurr == "chair" ? styles.selectedButtonB : styles.curriculumButtonB)} onClick={() => setSelectedCurr("chair")} key="two">CHAIR</Button>,
    <Button style={(selectedCurr == "bed" ? styles.selectedButtonC : styles.curriculumButtonC)} onClick={() => setSelectedCurr("bed")} key="three">BED</Button>,
  ];

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
    console.log(id)
    if (id == "name") {
      setName(event.target.value);
    } else if (id == "username") {
      setUserName(event.target.value);
    } else if (id == "password") {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!userName || !name || !password) {
        console.log("Missing required information")
        return
      }
      setSubmitting(true)
      await dispatch(createNewUser(name, userName, password) as any);
      setName("");
      setUserName("")
      setPassword("")
      setSubmitting(false)
    } catch (e) {
      console.log(`Error creating user : ${e}`)
      setSubmitting(false)
    }
   
  };

  

  return (
   <>
    <Box  style={styles.page} display="flex" flexDirection="column">
      <Box style={styles.fieldRow}>
        
      </Box>
      <Box style={styles.bodyPage}>
      <Typography fontSize={"24px"}>
          Participant's Name
        </Typography>
        <TextField 
          value={name}
          onChange={(e) => handleTextChange(e, "name")}
          style={styles.participantField} 
        />
        <Typography marginTop={"20px"} fontSize={"24px"}>
          Username
        </Typography>
        <TextField 
          value={userName}
          onChange={(e) => handleTextChange(e, "username")}
          style={styles.participantField} 
        />
        <Typography marginTop={"20px"} fontSize={"24px"}>
          Password
        </Typography>
        <TextField 
          value={password}
          onChange={(e) => handleTextChange(e, "password")}
          style={styles.participantField} 
        />
        <Box marginTop={"20px"} width={"100%"}>
          {(submitting) ? <CircularProgress/> :
          <Button fullWidth={true} onClick={handleSubmit} style={styles.addParticipantButton} variant="contained"> Add participant</Button>
        }
        </Box>
      </Box>
    </Box>
   </>
  );
}

export default CurriculumSidePanel;
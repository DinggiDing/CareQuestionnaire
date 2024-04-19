/* eslint-disable */
import React from 'react'
import {
  Box, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails
} from '@mui/material'
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { getAllUsers } from '../../slices/curriculum';
import { useLocation } from 'react-router-dom';

const styles = {
  sidebar: {
    backgroundColor: "#13386B",
    display: "flex", 
    flexDirection: "column",
    height: "100%",
    width: "21%",
    alignItems: "center"
  },
  healthTrackerTitle: {
    color: "white",
    marginTop: "40px",
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "24px"
  },
  sidebarOptions: {
    backgroundColor: "#365681",
    display: "flex", 
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  OverviewButton: {
    color: "white",
    width: "fit-content",
    textTransform: "none",
    fontSize: "24px",
    marginTop: "15px"
  },
  OverviewIcon: {
    fontSize: "24px",
    color: "white",
  },
  plusIcon: {
    fontSize: "24px",
    color: "black",
  },
  plusIconNoSelect: {
    fontSize: "24px",
    color: "white",
  },
  participantsAccord: {
    backgroundColor: "#365681",
    display: "flex", 
    flexDirection: "column",
    height: "100%",
    marginLeft: "-10px",
    boxShadow: "none"
  },
  partcipantsTitle: {
    color: "white"
  },
  expandIcon: {
    color: "white",
    marginRight: "7px"
  },
  expandIconRotated: {
    color: "white",
    marginRight: "7px",
    transform: "rotate(90deg)",
  },
  accordianSummary: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "0px",
    marginBottom: "-20px"
  },
  accord: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"  
  },
  participantButtonSelected: {
    color: "black",
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginLeft: "30px",
    textTransform: "none",
    fontSize: "16px",
    boxShadow: 'none',
    height: "24px",
    width: '202.46px',
    borderRadius: '6px',
  },
  participantButton: {
    color: "white",
    marginLeft: "5px",
    textTransform: "none",
    fontSize: "16px",
    boxShadow: 'none',
    height: "24px",
    width: '202.46px',
    borderRadius: '6px',
  },
  partcipantOption: {
    color: "white",
    marginLeft: "30px",
    textTransform: "none",
    fontSize: "16px",
    boxShadow: 'none',
    height: "24px",
    width: '202.46px',
    borderRadius: '6px',
    justifyContent: "flex-start",
    display: 'flex',
    marginBottom: "10px"
  }
} as const;



const CurriculumSidePanel = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const navigate = useNavigate();
  const handleChange =
  (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const dispatch = useDispatch();

  const userList = useSelector((state: RootState) => state.curriculum.userList);

  React.useEffect(() => {
    dispatch(getAllUsers() as any)
    console.log("getting list")
    console.log(userList)
  }, [])

  function loadParticipants() {
    let renderList = []
    userList.forEach((user: any, index) => {
      if (!user.role) {
        return renderList.push(<Button  key={index + 1} onClick={() => navigate(`participant/${user.userID}`)} style={styles.partcipantOption}> {`${index + 1}. ${(user.participantName) ? user.participantName : user.userName}`}</Button>)
      }
  })
    renderList.push(
      <Button key={0} onClick={() => navigate("add-participant")} style={styles.participantButton} startIcon={<AddIcon style={styles.plusIconNoSelect} />}> Add Participant</Button>
    )
    return renderList
  }
  (location.pathname.split("/")[2] == "add-participant") ? "text" : ""
  return (
   <>
    <Box style={styles.sidebar}>
      <Typography variant="h5" style={styles.healthTrackerTitle}>HEALTH TRACKER</Typography>
      <Box style={styles.sidebarOptions}>
        <Box marginLeft="10px">
          <Button style={styles.OverviewButton} onClick={() => navigate("/curriculum-admin/overview")} startIcon={<EqualizerIcon style={styles.OverviewIcon} />}>Overview</Button>
          <Accordion  style={styles.participantsAccord} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary style={styles.accordianSummary} aaria-controls="panel1a-content" id="panel1a-header">
              {expanded === 'panel1' ?  <ArrowForwardIosSharpIcon style={styles.expandIconRotated}/>: <ArrowForwardIosSharpIcon style={styles.expandIcon}/>}
              <Typography variant="h5" style={styles.partcipantsTitle}>Participant</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {loadParticipants()}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
   </>
  );
}

export default CurriculumSidePanel;
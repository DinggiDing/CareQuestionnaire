/* eslint-disable */
import React from 'react'
import {Box} from '@mui/material'
import CurriculumSidePanel from "./CurriculumSidePanel"
import {Outlet} from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';


const CurriculumAdminHome = () => {
  const { logout } : any = useAuth(); 
  
  

  return (
   <>
    <Box display="flex" flexDirection="row" height={"100%"} width={"100%"}>
      <CurriculumSidePanel/>
      <Box display="flex" alignItems="center" flexDirection="column" height={"100%"} width={"100%"}>
        <Box marginLeft={"auto"} marginTop={"20px"} marginRight={"20px"}>
          <Button onClick={logout} sx={{"color": "black", "borderColor": "black"}} variant="outlined">Logout</Button>
        </Box>
        <Outlet/>
      </Box>
    </Box>
   </>
  );
}

export default CurriculumAdminHome;
/* eslint-disable */
import React from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material'
import "firebase/compat/auth";
import firebase from '../../lib/firebase';

const styles = {
  root: {
    height: '100%',
    backgroundColor: "rgba(54, 86, 129, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirectionL: "column"
  },
  input: {
    width: "481px",
    height: "60px",
    marginTop: "20px",
  },
  bodyPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  submitButton: {
    backgroundColor: "#62A1F4",
    color: "white",
    marginTop: "20px",
  }
} as const;
import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // Firebase Login with email and password here
    try {
      let loginUsername = username;
      if (username != "admin") {
        loginUsername = `<USERNAME>`
      } else {
        loginUsername = '<USERNAME>'
      }
      const res = await firebase.auth().signInWithEmailAndPassword(loginUsername, password)
      if (!res.user) throw new Error("Invalid username or password");
      console.log("running login");
    } catch (error) {
      console.error(error);
      alert("Invalid username or password");
    }

  };


  return (
    <div style={styles.root}>
      <Box style={styles.bodyPage}>
        <Typography style={{ "color": 'black' }} variant="h4">Please enter username and password below</Typography>
        <Box>
          <TextField
            style={styles.input}
            inputProps={{ style: { backgroundColor: "white", opacity: ".7" } }}
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            style={styles.input}
            inputProps={{ style: { backgroundColor: "white", opacity: ".7" } }}
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box>

        </Box>
        <Button variant='contained' style={styles.submitButton} fullWidth onClick={handleLogin} type="submit">Login</Button>
      </Box>
    </div>
  );
};

export default Login;
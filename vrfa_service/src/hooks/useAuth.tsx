/* eslint-disable */
// src/hooks/useAuth.jsx

import { createContext, useContext, useMemo, ReactNode, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useDispatch } from "react-redux";
import { getUserData, setUserData } from "../slices/curriculum";
import firebase from '../lib/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
const AuthContext = createContext({});


interface Props {
    children?: ReactNode
    // any props that come into the component
}

export const AuthProvider = ({ children }:Props) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();


  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    console.log("im back")
    let userData = await dispatch(getUserData(data) as any)
    setUser({authData: userData, userData: userData});
    console.log("redirecting to home auth")
    if (userData.role === "admin" && window.location.pathname != "/curriculum-admin") {
      navigate("/curriculum-admin")
      return
    }
    if (window.location.pathname != "/") {
      navigate("/")
      return
    }
  };

  async function asyncStateChange() {
    console.log("Auth State Change")
    if (firebase.auth().currentUser && window.location.pathname == "/login" && !user) {
      login(firebase.auth().currentUser?.uid);
    }
  }
  
  onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
     asyncStateChange();
    }  
    if (!firebase.auth().currentUser && window.location.pathname != "/login") {
      console.log("redirecting to login")
      navigate("/login")
    }   
  });

  // call this function to sign out logged in user
  const logout = async () => {
    console.log("logging out");
    await localStorage.clear();
    await firebase.auth().signOut();
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

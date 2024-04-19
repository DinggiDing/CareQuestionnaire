/* eslint-disable */
import { useAuth } from "../hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// React router dom hook to change url
import { useNavigate } from "react-router-dom";


interface Props {
    children?: ReactNode
    // any props that come into the component
}
export const ProtectedRoute = ({ children }:Props) => {
  console.log("Going through protected route")
  return <>{children}</>;
};

export default ProtectedRoute;

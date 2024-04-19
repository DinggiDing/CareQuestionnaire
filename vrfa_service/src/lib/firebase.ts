import firebase from "firebase/compat/app";
import "firebase/functions";
import 'firebase/auth';
import 'firebase/firestore';


import { firebaseConfig } from '../config';
firebase.initializeApp(firebaseConfig);
export default firebase

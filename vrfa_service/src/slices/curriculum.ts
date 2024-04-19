/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from '../store';
import firebase from '../lib/firebase';
import { collection, addDoc, getDoc, doc,  getFirestore, getDocs, query, where, updateDoc } from "firebase/firestore"; 
import { getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";
import { getApp } from "firebase/app";
const db = getFirestore(firebase.app())
import "firebase/compat/auth";



const slice = createSlice({
  name: 'curriculum',
  initialState: {
    userList: [],
    userData: {},
    userCurriculums: []
  },
  reducers: {
      updateUserCurriculms: (state, action) => {
        state.userCurriculums = action.payload
      },
      updateUserList: (state, action) => {
        state.userList = action.payload
      },
      setUserData: (state, action) => {
        state.userData = action.payload
      },
    }
});

export const {
  updateUserList,
  setUserData,
  updateUserCurriculms
} = slice.actions;

export const { reducer } = slice;

export const addNewUser = (username: string, dateString: string | null, curriculum: string): AppThunk => async (dispatch) => {
  try {
    // Create a User object with the provided data
    const user = {
      userName: username,
      startDate: dateString,
      curriculum
    };

    const docRef = await addDoc(collection(db, "users"), user);
    let activities = await dispatch(getActivities()) as unknown as Array<any>
    for (let i = 0; i < activities.length; i++) {
      await dispatch(createNewUserActivity(docRef.id, activities[i].id, activities[i].title))
    }

    dispatch(getAllUsers());
    console.log(`User added to Firestore with userName: ${username}`);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

export const createNewUser = (participantName: string, username: string, password: string): AppThunk => async (dispatch) => {
  try {
    const auth = firebase.auth();
    let authUser = await auth.createUserWithEmailAndPassword(`${username}@vrfa.com`, password);

    // Create a User object with the provided data
    const user = {
      authId: await authUser.user?.uid,
      userName: username,
      participantName,
      vrfaProgress: 0,
    };
    const docRef = await addDoc(collection(db, "users"), user);
    dispatch(getAllUsers());
    console.log(`User added to Firestore with userName: ${username}`);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    throw error
  }
};


export const createNewUserActivity = (userId: string, activityId:string, title:string): AppThunk => async (dispatch) => {
  try {
    // Create a User object with the provided data
    const activity = {
      userId,
      activityId,
      secondsWatch: 0,
    };

    const docRef = await addDoc(collection(db, "user-activities"), activity);
    console.log(`User Activity added to Firestore for actvitity title: ${title}`);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

export const createNewActivity = (title: string, url: string, type: string, assignedWeek: string): AppThunk => async (dispatch) => {
  try {
    // Create a User object with the provided data
    const activity = {
      title,
      url,
      type,
      assignedWeek,
    };

    const docRef = await addDoc(collection(db, "activities"), activity);
    dispatch(getAllUsers());
    console.log(`Activity added to Firestore with title: ${title}`);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

export const getAllUsers = (): AppThunk => async (dispatch) => {
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);

    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ userID: doc.id, ...doc.data() });
    });

    dispatch(updateUserList(users));
    return users;
  } catch (error) {
    console.error('Error retrieving users from Firestore:', error);
    return [];
  }
};

export const getActivityInfo = (activityId: string): AppThunk => async (dispatch) => {
  try {
    if (!activityId) throw Error("Null Acitvity ID")

    const activityDocRef = doc(db, 'activities', activityId); // Replace 'USER_ID' with the user's document ID

    const activityDocSnapshot = await getDoc(activityDocRef);

    const activities: any[] = [];
    let activityData = null

    if (activityDocSnapshot.exists()) {
      activityData = activityDocSnapshot.data();
    } else {
      console.log("User not found")
    }
    if (!activityData) throw Error("User document null")
    return activityData;
  } catch (error) {
    console.error('Error retrieving activity info from Firestore:', error);
    return [];
  }
};

export const updateSecondsWatched = (activityId: string, secondsWatched: number): AppThunk => async (dispatch) => {
  try {
    const userActivityRef = doc(db, 'user-activities', activityId);

    const activityDocSnapshot = await getDoc(userActivityRef);

    if (!activityDocSnapshot.exists) {
      console.error('User-activities document not found');
      return;
    }

    const updatedSecondsWatch = secondsWatched

    await updateDoc(userActivityRef, { secondsWatch: updatedSecondsWatch })
    console.log('Seconds watched updated successfully');
  } catch (error) {
    console.error('Error updating seconds watched:', error);
  }
};

export const getAllUserCurriculum = (): AppThunk => async (dispatch) => {
  try {
    let result = [];
    let users = await dispatch(getAllUsers()) as unknown as any;
    for (let i = 0; i < users.length; i++) {
      try {
        let userData = await dispatch(retrieveUserCurriculum(users[i].userID)) as unknown as any
      result.push([{
        ...userData
      }])
      } catch {
        console.error('Error retrieving users info from Firestore:', users[i].userID);
      }
    }
    dispatch(updateUserCurriculms(result));
    return result
  } catch (error) {
    console.error('Error retrieving users from Firestore:', error);
    return [];
  }
};

export const retrieveUserCurriculum = (userID: string | undefined): AppThunk => async (dispatch) => {
  try {
    const functions = getFunctions(getApp());
    //connectFunctionsEmulator(functions, "localhost", 5001);
    const getUserCurriculumFunc = httpsCallable(functions, 'getUserCurriculumFunc');
    const getUserCurriculumFuncData = await getUserCurriculumFunc({userId: userID});
    const userCurriculums = getUserCurriculumFuncData.data as string
    console.log("slice", userCurriculums)
    updateUserCurriculms(userCurriculums)
    return userCurriculums
  } catch (error) {
    console.log("Curriculum Slice: Issue retrieving curriculum user", error);
    throw error;
  }
};

export const getUserActivities = (userId: string | undefined): AppThunk => async (dispatch) => {
  try {
    const userActivitiesRef = collection(db, "user-activities");
    const q = query(userActivitiesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return activities;
  } catch (error) {
    console.error("Error retrieving user's activity from Firestore:", error);
    return [];
  }
};


export const getActivities = (): AppThunk => async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "activities"));
    const documents = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return documents;
  } catch (error) {

    console.error('Error retrieving users from Firestore:', error);
    return [];  
  }
};


// Firebase function that retrieve user document from firestore given the authId element in the user document
export const getUserData = (authId: string | undefined): AppThunk => async (dispatch) => {
  try {
    if (!authId) throw Error("Null Auth ID")

    // authId is a field in the user document which needs a query to retrieve the user document
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("authId", "==", authId));
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    if (usersData.length > 0) {
     return usersData[0];
    } else {
      console.log("User not found")
    }
  } catch (error) {
    console.error('Error retrieving user from Firestore:', error);
  }
};

export default slice;

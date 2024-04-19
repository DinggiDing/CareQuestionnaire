import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

// Retrieve state from local storage on application load
const persistedState = localStorage.getItem('reduxState');
const preloadedState = persistedState ? JSON.parse(persistedState) : undefined;

const store = configureStore({
  reducer: rootReducer,
  preloadedState, // Add the preloaded state here
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true'
});

// Subscribe to store changes and update local storage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('reduxState', JSON.stringify(state));
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;

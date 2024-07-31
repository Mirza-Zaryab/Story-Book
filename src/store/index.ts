import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user';
import profileReducer from '../features/profileSlice';
import bookReducer from '../features/bookFeatures';
import chapterReducer from '../features/chaptersSlice';
import questionReducer from '../features/questionsSlice';
import userBookReducer from '../features/bookSlice';
import adminReducer from '../features/adminSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
    chapters: chapterReducer,
    questions: questionReducer,
    userBook: userBookReducer,
    profile: profileReducer,
    admin: adminReducer
  },
});

export default store;

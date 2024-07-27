import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createQuestion = createAsyncThunk(
    'questions/createQuestion',
    async (questionData) => {

        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-custom-question`, questionData);

        const data = await response.data;

        return data;
    }
);

const questionsSlice = createSlice({
    name: 'questions',
    initialState: { chapterQuestions: [] },
    reducers: {
        setQuestions: (state, action) => {
            state.chapterQuestions = action.payload;
        },
        updateCheckedQuestions: (state, action) => {
            const { id, checked } = action.payload;
            const index = state.chapterQuestions.findIndex((d) => d.questionId === id)
            state.chapterQuestions[index].checked = checked;
        },
        addQuestion: (state, action) => {
            state.chapterQuestions.push(action.payload)
        },
        removeQuestion: (state, action) => {
            const id = action.payload;
            state.chapterQuestions = state.chapterQuestions.filter((data) => data.questionId !== id);
        }
    }
});

export const { setQuestions, updateCheckedQuestions, addQuestion, removeQuestion } = questionsSlice.actions;

export default questionsSlice.reducer;

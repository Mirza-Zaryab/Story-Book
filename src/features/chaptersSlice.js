import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createChapter = createAsyncThunk(
    'chapters/createChapter',
    async (chapterData) => {

        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/addCustomChapter`, chapterData);

        const data = await response.data;

        return data;
    }
);

const chaptersSlice = createSlice({
    name: 'chapters',
    initialState: { bookChapters: [] },
    reducers: {
        setChapters: (state, action) => {
            state.bookChapters = action.payload;
        },
        updateChecked: (state, action) => {
            const { index, checked } = action.payload;
            state.bookChapters[index].checked = checked;
        },
        addChapter: (state, action) => {
            state.bookChapters.push(action.payload)
        },
        removeChapter: (state, action) => {
            const id = action.payload;
            state.bookChapters = state.bookChapters.filter((data) => data.chapterId !== id);
        }
    }
});

export const { setChapters, updateChecked, addChapter, removeChapter } = chaptersSlice.actions;

export default chaptersSlice.reducer;

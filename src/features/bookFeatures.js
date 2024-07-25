import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  author: '',
  bookType: '',
  title: '',
  image: '',
  status: '',
  numberOfPages: 0,
  numberOfChapters: 0,
  deadline: null,
  chapters: [],
  startDate: null,
  updateDate: null,
  pages: [],
  pageContent: [],
  status: 'pending',
  editStory: {
    show: false,
    id: '',
    page: -1,
  },
  addStory: {
    title: '',
    show: false,
    page: -1,
  },
  text: {
    title: '',
    display: false,
    content: '',
  },
};

export const bookSlice = createSlice({
  name: 'book',
  initialState: { value: initialState },
  reducers: {
    storeBook: (state, action) => {
      // state.value.status = 'pending';

      state.value = action.payload;
    },
    setPages: (state, action) => {
      state.value.pages = action.payload;
    },
    setPageContent: (state, action) => {
      state.value.status = 'pending';
      state.value.pageContent = action.payload;
    },
    updateChapters: (state, action) => {
      state.value.chapters = action.payload;
    },
    updateStatus: (state, action) => {
      state.value.status = action.payload;
    },
    setEditStory: (state, action) => {
      state.value.editStory = action.payload;
    },
    setAddStory: (state, action) => {
      state.value.addStory = action.payload;
    },
    setText: (state, action) => {
      state.value.text = action.payload;
    },
    setQuestion: (state, action) => {
      state.value.question = action.payload;
    },
  },
});
export const {
  storeBook,
  updateChapters,
  setPageContent,
  setPages,
  updateStatus,
  setEditStory,
  setAddStory,
  setText,
  setQuestion,
} = bookSlice.actions;
export default bookSlice.reducer;

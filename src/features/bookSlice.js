import { createSlice } from "@reduxjs/toolkit";

const userBookSlice = createSlice({
  name: "userBook",
  initialState: { bookData: [], image: {}, croppedImg: "" },
  reducers: {
    setBook: (state, action) => {
      state.bookData = action.payload;
      if (action.payload.length > 0)
        localStorage.setItem("userBook", JSON.stringify(action.payload));
    },
    updateAnswer: (state, action) => {
      const { chapterId, questionId, answer } = action.payload;
      const chapterIndex = state.bookData.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterIndex !== -1) {
        const questionIndex = state.bookData[chapterIndex].questions.findIndex(
          (question) => question.id === questionId
        );
        if (questionIndex !== -1) {
          state.bookData[chapterIndex].questions[questionIndex].answer = answer;
        }
      }
      localStorage.setItem("userBook", JSON.stringify(state.bookData));
    },
    openChapter: (state, action) => {
      const { id, open } = action.payload;

      for (let i = 0; i < state.bookData.length; i++) {
        if (state.bookData[i].id === id) {
          state.bookData[i].open = !open;
        } else {
          state.bookData[i].open = false;
        }
      }
    },
    createCustomChapter: (state, action) => {
      const newChapter = action.payload;

      state.bookData = [...state.bookData, newChapter];
    },
    removeCustomChapter: (state, action) => {
      const chapterIdToDelete = action.payload;

      // Filter out the chapter to delete
      let updated = state.bookData.filter(
        (chapter) => chapter.id !== chapterIdToDelete
      );
      state.bookData = updated;
    },
    createCustomQuestion: (state, action) => {
      const { chapterId, newQuestion } = action.payload;

      // Find the chapter by ID
      const updatedBookData = state.bookData.map((chapter) => {
        if (chapter.id === chapterId) {
          // Create a copy of the questions array and add the new question
          const updatedQuestions = [...chapter.questions, newQuestion];
          return { ...chapter, questions: updatedQuestions };
        }
        return chapter;
      });
      state.bookData = updatedBookData;
    },
    removeCustomQuestion: (state, action) => {
      const { chapterId, questionId } = action.payload;

      // Find the chapter by ID
      const chapterToUpdate = state.bookData.find(
        (chapter) => chapter.id === chapterId
      );

      if (chapterToUpdate) {
        // Filter out the question to remove
        chapterToUpdate.questions = chapterToUpdate.questions.filter(
          (question) => question.id !== questionId
        );
      }
    },
    uploadImage: (state, action) => {
      state.image = action.payload;
    },
    cropImg: (state, action) => {
      state.croppedImg = action.payload;
    },
  },
});

export const {
  setBook,
  updateAnswer,
  openChapter,
  createCustomChapter,
  removeCustomChapter,
  createCustomQuestion,
  removeCustomQuestion,
  uploadImage,
  cropImg,
} = userBookSlice.actions;

export default userBookSlice.reducer;

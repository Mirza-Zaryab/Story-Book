import axios from 'axios';
const baseURL = '';

export default {
  register: (name, email, password) => {
    return axios.post('/api/user/register', { name, email, password });
  },
  login: (data) => {
    return axios.post('/api/user/login', data);
  },
  logout: () => {
    return axios.post('/api/user/logout');
  },
  getUser: (email) => {
    return axios.post('/api/user/getUser', { email });
  },

  //contributor routes
  addContributor: (bookId, values) => {
    return axios.post('/api/user/addContributor', { bookId, values });
  },

  getContributor: (id) => {
    return axios.post('/api/user/getContributor', { id });
  },

  getAllContributions: () => {
    return axios.get('/api/user/getContributions');
  },
  // used for individual contributor
  addContribution: (id, bookId, text, title) => {
    return axios.post('/api/user/addContribution', { id, bookId, text, title });
  },

  // Used for mass contributions
  saveContribution: (id, bookId, content, username) => {
    return axios.post('/api/user/saveContribution', { id, bookId, content, username });
  },
  getAllContributors: () => {
    return axios.get('/api/user/getAllContributors');
  },

  saveDraft: (id, bookId, text, title) => {
    return axios.post('/api/user/saveDraft', { id, bookId, text, title });
  },

  updateDraft: (id, bookId, draftId, text) => {
    return axios.post('/api/user/updateDraft', { id, bookId, draftId, text });
  },

  // Book Routes
  addBook: (data) => {
    return axios.post('/api/book/createBook', { data });
  },
  getBooks: (data) => {
    return axios.get('/api/book/getBooks', data);
  },
  getBook: (data) => {
    return axios.post('/api/book/getBook', { data });
  },

  //Chapter Routes
  addChapter: (id) => {
    return axios.post('/api/chapter/addChapter', { id });
  },
  editChapterTitle: (id, chapterId, data) => {
    return axios.post('/api/chapter/editChapterTitle', { id, chapterId, data });
  },

  getPages: (id) => {
    return axios.post('/api/chapter/getPages', { id });
  },

  updateChapterOrder: (bookId, chapters) => {
    return axios.post('/api/chapter/updateChapterOrder', { bookId, chapters });
  },
  addPage: (chapterId) => {
    return axios.post('/api/chapter/addPage', { chapterId });
  },

  getQuestions: (data) => {
    return axios.post('/api/chapter/getQuestions', { data });
  },
  //Page Routes

  getPage: (pages) => {
    return axios.post('/api/page/getPage', { pages });
  },

  editPage: (pageId, pageContent) => {
    return axios.post('/api/page/editPage', { pageId, pageContent });
  },
  updatePage: (pageId, content) => {
    return axios.post('/api/page/updatePage', { pageId, content });
  },

  //Story Routes
  addStory: (bookId, pageId, text) => {
    return axios.post('/api/page/addStory', { bookId, pageId, text });
  },
  updateStory: (pageId, storyId, text) => {
    return axios.post('/api/page/updateStory', { pageId, storyId, text });
  },
  repositionStory: (pageId, stories) => {
    return axios.post('/api/page/repositionStory', { pageId, stories });
  },

  // print routes

  printPDF: (data) => {
    return axios.post('/api/pdf/printPDF', { data });
  },

  //dev
  seed: (data) => {
    return axios.post('/api/user/seed', data);
  },
};

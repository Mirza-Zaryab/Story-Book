import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AddContributor from '../../components/AddContributor';
import API from '../../utils/api';
import AppButton from '../../components/AppButton';
import BookContent from '../../components/BookContent';
import BookStats from '../../components/BookStats';
import ChapterLayout from '../../components/ChapterLayout.jsx';
import Dashboard from '../../components/Dashboard';

import { storeBook, setPages, setPageContent, updateStatus } from '../../features/bookFeatures';
import axios from 'axios';

export default function BookDashboard() {
  const [addContributorModal, showAddContributorModal] = useState(false);
  const [book, setBook] = useState({
    chapters: [{ number: 1 }],
    stories: [],
  });
  const [currentChapter, setCurrentChapter] = useState({ _id: '' });
  const [questions, setQuestions] = useState({
    chapter: '',
    content: [],
  });
  const [stories, setStories] = useState([])
  const [bookData, setBookData] = useState([])
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const bookState = useSelector((state: any) => state.book.value);

  let { bookId } = useParams();

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    setLoader(true)

    await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${bookId}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
        }
      })
      .then((res) => {
        setBookData(res?.data)

        const allAns: any = [];
        res?.data?.bookData?.map((d: any) => d.questions.map((q: any) => allAns.push({ answer: q.answer })))

        setStories(allAns)
        setLoader(false)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const storeInRedux = (book: any) => {
    const shuttle = {
      _id: book._id,
      author: book.authore,
      bookType: book.bookType,
      title: book.title,
      image: book.image,
      status: book.status,
      numberOfPages: book.numberOfPages,
      numberOfChapters: book.numberOfChapters,
      deadline: book.deadline,
      chapters: book.chapters,
      startDate: book.startDate,
      updateDate: book.updatedDate,
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
    dispatch(storeBook(shuttle));
  };

  const handleStories = (text: any) => {
    setBook({ ...book, stories: text });
  };

  const handleChapters = (chapters: any) => {
    setBook({ ...book, chapters: chapters });
  };

  const handleCurrentChapter = async (chapter: any) => {
    setCurrentChapter(chapter);
    getChapterPages(chapter.chapterId);

    await API.getQuestions(chapter.chapterId).then((res) => {
      setQuestions({ chapter: chapter.chapterId, content: res.data });
    });
  };

  //current page is set to the first page when the chapter is selected.
  const getChapterPages = async (id: any) => {
    await API.getPages(id).then(async (res) => {
      dispatch(setPages(res.data.pages));
      handleCurrentPage(res.data.pages);
    });
  };

  //Get the page from the Database
  const handleCurrentPage = async (pages: any) => {
    // get page should return two pages
    await API.getPage(pages).then((res) => {
      //set page content sets an array with two pages
      dispatch(setPageContent(res.data));
      dispatch(updateStatus('loaded'));
    });
  };

  return (
    <>
      <Dashboard>
        <AddContributor open={addContributorModal} setOpen={showAddContributorModal} />


        <div className="p-5 min-h-screen h-min ">
         
          <div className="flex">
            
            <div className="w-full h-96 flex justify-center">
              <BookContent
                currentChapter={currentChapter}
                bookID={bookId}
                content={bookState?.pageContent}
                setContent={handleStories}
                stories={stories}
                bookData={bookData}
              />
            </div>
          </div>
        </div>

      </Dashboard>
    </>
  );
}

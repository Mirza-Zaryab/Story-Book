import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import {
  CalendarIcon,
  CogIcon,
  HomeIcon,
  MapIcon,
  MenuIcon,
  SearchCircleIcon,
  SpeakerphoneIcon,
  UserGroupIcon,
  ViewGridAddIcon,
  XIcon,
  UploadIcon,
  SaveIcon,
} from '@heroicons/react/outline';
import {
  ChevronLeftIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  EmojiHappyIcon,
} from '@heroicons/react/solid';
import React from 'react';
import logo from '../../assets/MSV logo balck_teal-2.svg';
import api from '../../utils/api';

import { useSelector, useDispatch } from 'react-redux';
import { storeBook, setPages, setPageContent, updateStatus } from '../../features/bookFeatures';
import EditChapter from '../../components/EditChapter';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AiOutlineSend } from 'react-icons/ai';
import { createChapter } from '../../features/chaptersSlice';
import { createQuestion } from '../../features/questionsSlice';
import { AlertDialog } from '../../components/AlertDialog';
import { MdDeleteForever } from 'react-icons/md';
import '../../components/style.css'
import { openChapter, setBook, updateAnswer, createCustomChapter, removeCustomChapter, createCustomQuestion, removeCustomQuestion } from '../../features/bookSlice';
import '../../components/style.css'
import jwtDecode from 'jwt-decode';
import ImageCroper from '../../components/ImageCroper';
import Loader from '../../components/Loader';
import PopupAlert from '../../components/PopupAlert';
import ReminderPopup from '../../components/reminderPopup';
import DirectorySideNavbar from '../../components/directorySideNavbar';
import DirectoryMobileNavbar from '../../components/DirectoryMobileNavbar';
import { BsInfoCircle } from 'react-icons/bs';


const user = {
  name: 'Tom Cook',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Profile Dashboard', href: '/', icon: HomeIcon, current: false },
  { name: 'Reminders', href: '#', icon: CalendarIcon, current: false },
  // { name: 'Teams', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Directory', href: '#', icon: SearchCircleIcon, current: true },
  { name: 'Announcements', href: '#', icon: SpeakerphoneIcon, current: false },
  { name: 'Story Vault', href: '#', icon: SaveIcon, current: false },
  { name: 'Collaboration Vault', href: '#', icon: UploadIcon, current: false },
];
const secondaryNavigation = [
  // { name: 'Apps', href: '#', icon: ViewGridAddIcon },
  { name: 'Settings', href: '#', icon: CogIcon },
];
const tabs = [
  { name: 'Profile', href: '#', current: true },
  { name: 'Settings', href: '#', current: false },
  { name: 'Reminders', href: '#', current: false },
];
const profile = {
  name: 'Ricardo Cooper',
  imageUrl:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  coverImageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60',
  about: `
    <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,
  fields: {
    Phone: '(555) 555-5555',
    Email: 'test@test.com',
    Relation: 'Brother',
    // Team: 'Product Development',
    Location: 'San Francisco',
    // Sits: 'Oasis, 4th floor',
    // Salary: '$145,000',
    Birthday: 'June 8, 1990',
  },
};
const directoryOld = {
  A: [
    {
      id: 1,
      name: 'Leslie Abbott',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Hector Adams',
      role: 'VP, Marketing',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Blake Alexander',
      role: 'Account Coordinator',
      imageUrl:
        'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 4,
      name: 'Fabricio Andrews',
      role: 'Senior Art Director',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  B: [
    {
      id: 5,
      name: 'Angela Beaver',
      role: 'Chief Strategy Officer',
      imageUrl:
        'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 6,
      name: 'Yvette Blanchard',
      role: 'Studio Artist',
      imageUrl:
        'https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 7,
      name: 'Lawrence Brooks',
      role: 'Content Specialist',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  C: [
    {
      id: 8,
      name: 'Jeffrey Clark',
      role: 'Senior Art Director',
      imageUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 9,
      name: 'Kathryn Cooper',
      role: 'Associate Creative Director',
      imageUrl:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  E: [
    {
      id: 10,
      name: 'Alicia Edwards',
      role: 'Junior Copywriter',
      imageUrl:
        'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 11,
      name: 'Benjamin Emerson',
      role: 'Director, Print Operations',
      imageUrl:
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 12,
      name: 'Jillian Erics',
      role: 'Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1504703395950-b89145a5425b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 13,
      name: 'Chelsea Evans',
      role: 'Human Resources Manager',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  G: [
    {
      id: 14,
      name: 'Michael Gillard',
      role: 'Co-Founder / CTO',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 15,
      name: 'Dries Giuessepe',
      role: 'Manager, Business Relations',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  M: [
    {
      id: 16,
      name: 'Jenny Harrison',
      role: 'Studio Artist',
      imageUrl:
        'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 17,
      name: 'Lindsay Hatley',
      role: 'Front-end Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 18,
      name: 'Anna Hill',
      role: 'Partner, Creative',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  S: [
    {
      id: 19,
      name: 'Courtney Samuels',
      role: 'Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 20,
      name: 'Tom Simpson',
      role: 'Director, Product Development',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  T: [
    {
      id: 21,
      name: 'Floyd Thompson',
      role: 'Principal Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 22,
      name: 'Leonard Timmons',
      role: 'Senior Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 23,
      name: 'Whitney Trudeau',
      role: 'Copywriter',
      imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  W: [
    {
      id: 24,
      name: 'Kristin Watson',
      role: 'VP, Human Resources',
      imageUrl:
        'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 25,
      name: 'Emily Wilson',
      role: 'VP, User Experience',
      imageUrl:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  Y: [
    {
      id: 26,
      name: 'Emma Young',
      role: 'Senior Front-end Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
};
const team = [
  {
    name: 'Leslie Alexander',
    handle: 'lesliealexander',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Michael Foster',
    handle: 'michaelfoster',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Dries Vincent',
    handle: 'driesvincent',
    role: 'Manager, Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Lindsay Walton',
    handle: 'lindsaywalton',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Directory({ setLoading }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggleMSg, setToggleMsg] = useState("")
  const [dropdown, setDropdown] = useState(false);
  const [titleview, setTitleView] = useState(false);
  const [allchapters, setAllChapters] = useState(false);
  const dispatch = useDispatch();
  const bookState = useSelector((state) => state.book.value);
  const [directory, setDirectory] = useState([]);
  const { state, pathname } = useLocation();
  const [datas, setDatas] = useState({});
  const [chapterIndex, setChapterIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [newChapter, setNewChapter] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [fetch2, setFetch] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [bookData, setBookData] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location=useLocation()

  const [changeSeq, setChangeSeq] = useState(false);
  const [changeEditor, setChangeEditor] = useState(false);

  const [toggleQ, setToggleQ] = useState(false)
  const [toggle1, setToggle1] = useState(false)
  const [info, setInfo] = useState(false)
  const [isChange, setIsChange]=useState(false)
  const [show, setShow]=useState(false)
  const [type, setType]=useState(3)
  const [open, setOpen]=useState(false)
  const [isNavigate, setNavigate]=useState(true)
  const [reminderMsg, setReminderMsg]=useState("")

  const [deleteQPopup, setDeleteQPopup]= useState(false)
  const [deleteChPopup, setDeleteChPopup]= useState(false)

  const [propagation, setPopagation]=useState("")
  const [deleteQId, setDeleteQId]=useState("")
  const [deleteChId, setDeleteChId]=useState("")

  const { bookId } = useParams();

  const userBook = useSelector((state) => state.userBook.bookData)

  let dataString = '';

  useEffect(() => {
    // dispatch(updateStatus('loading'));
    getDirectory();
  }, [fetch2]);

  useEffect(() => {
    setTimeout(() => {
      setMsg('')
    }, 5000)
  }, [msg]);

  useEffect(()=>{
    isExist();

    return ()=>{
      dispatch(setBook([]))
    }
  },[])
  const getDirectory = async () => {
    setLoading(true)

    fetch(`${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${bookId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        setDirectory(data.bookData);
        setBookData({
          bookId: data.bookId,
          bookType: data.bookType,
          title: data.title
        });
        dispatch(setBook(data.bookData.map(data => ({ ...data, open: false }))))
        // if(data.bookType==1){
        setType(data.bookType)
        // }
        setTimeout(() => {
          setLoading(false)
          setShow(true)
          setReminderMsg("Remember to save the changes before exiting this page!")
          
        }, 1000);

        setTimeout(() => {
          setReminderMsg("")
        }, 6000);
      })
      .catch(error => {
        console.error(error);
        setShow(true)
        setLoading(false);
      });
    
  };

  const dropDownClick = (v) => {
    setToggle1(false)
    setDropdown(!dropdown)
    setChapterIndex(v.id)

    dispatch(openChapter(v))

    let newData = {
      chapterId: v.id,
      chapterName: v.name,
      IsCustom: v.IsCustom?.data[0]
    }

    setDatas(newData)
  }

  const handleQuestionData = (e, questionData, v) => {
    setToggleQ(false)
    e.stopPropagation();

    setQuestionIndex(questionData.id)

    let newData = {
      chapterId: v.id,
      chapterName: v.name,
      IsCustom: v.IsCustom?.data[0],
      id: questionData?.id,
      question: questionData?.question,
      answer: questionData?.answer,
      questionSequence: questionData?.questionSequence,
      email: questionData?.recieverEmail || "",
      isCustomQues: questionData?.IsCustom?.data[0]
    }

    setDatas(newData)
  }

  // chapter drag drop
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    setChangeSeq(true)
    
    const items = Array.from(userBook);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => {
      return {
        ...item,
        chapterSequence: index + 1
      };
    });

    dispatch(setBook(updatedItems))
    localStorage.setItem("changeSeq","true")
  };

  // que drag drop
  const handleOnDragEndQuestions = async (result, i) => {
    console.log(result);

    if (!result.destination) return;
    setChangeSeq(true)
    const updatedDirectory = [...userBook];
    const updatedQuestions = [...updatedDirectory[i].questions];
    const [reorderedItem] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, reorderedItem);

    // Update questionSequence property
    const updatedQuestionsWithSequence = updatedQuestions.map((question, index) => {
      return { ...question, questionSequence: index + 1 };
    });

    updatedDirectory[i] = { ...updatedDirectory[i], questions: updatedQuestionsWithSequence };

    dispatch(setBook(updatedDirectory));
    localStorage.setItem("changeSeq","true")
  };

  const addChapter = () => {
    dispatch(createChapter({ name: newChapter, bookId: bookId }))
      .then((res) => {
        const chapData = {
          id: res.payload.chapterId,
          name: res.payload.name,
          chapterSequence: res.payload.chapterSequence,
          IsCustom: { data: [1], type: "Buffer" },
          questions: [],
          open: false
        }
        dispatch(createCustomChapter(chapData))
        setNewChapter("")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addQuestion = (id) => {
    let quesObj = {
      questionDesc: newQuestion,
      chapterId: id,
      bookId: bookId
    }

    dispatch(createQuestion(quesObj))
      .then((res) => {
        const quesData = {
          chapterId: res.payload.data.chapterId,
          newQuestion: {
            id: res.payload.data.questionId,
            question: quesObj.questionDesc,
            questionSequence: res.payload.data.questionSequenceNumber,
            IsCustom: { data: [1], type: "Buffer" },
            answer: res.payload.data.answer
          }
        }
        dispatch(createCustomQuestion(quesData));
        setNewQuestion("")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const submitSequence = async () => {
    localStorage.setItem("submitClick","true")

    let redirect = false;
    let bookName = '';
    setToggleMsg("Saving")
    setToggle(true)
    const data = userBook.map((chap) => (
      {
        chapterId: chap.id,
        chapterSequenceNumber: chap.chapterSequence,
        questions: chap.questions.map((ques) => {
          return {
            questionId: ques.id,
            questionSequenceNumber: ques.questionSequence
          }
        })
      }
    ))

    const userBookData = userBook.map((chap) => (
      {
        chapterId: chap.id,
        questions: chap.questions.map((ques) => {
          if (ques.answer) {
            redirect = true;
          }
          return {
            questionId: ques.id,
            answer: ques.answer,
            questionSequenceNumber: ques.questionSequence
          }
        })
      }
    ))

    if (!redirect) {
      setToggle(false);
      setMsg("Book is Empty")
      setTimeout(() => {
        setMsg("")
      }, 2000);
      return;
    }

    if (changeEditor) {
      await axios({
        method: 'put',
        url: `${process.env.REACT_APP_API_BASE_URL}/create/answer`,
        data: {
          bookId: bookId,
          chapters: userBookData
        }
      }).then((res) => {

      }).catch((err) => {
        console.log(err)
      })
    }

    if (changeSeq) {
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_API_BASE_URL}/update/sequence`,
        data: {
          bookId: bookId,
          chapters: data
        }
      })
        .then((res) => {
          console.log(res);
          setFetch(!fetch2)
        })
        .catch((err) => {
          console.log(err);
        })
    }

    // await new Promise(resolve => setTimeout(resolve, 2000));
    let token=localStorage.getItem("jwtToken")
    let author;
    let subtitle;
    await axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${bookId}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("response for author----",response?.data)

        response?.data?.bookData?.map((chap, i) => {
          (chap?.questions.find((d) => d?.answer !== "") ?
            dataString += `<h3 style=\"page-break-before: always; text-align: center; margin-bottom: 10px\"><span style=\"font-size: 24px;\"><strong>${chap?.name}</strong></span></h3>\n`
            : null
          )

          chap?.questions.map((q) => {
            if (q?.answer !== "") {
              dataString += `<p style=\"margin-bottom: 5px;\"><span style=\"font-size: 22px;\"><strong>${q?.question}</strong></span></p>\n`
              dataString += `<p style=\"font-size: 19px !important;\">${q?.answer}</p>`;
            }
          })
        })

        bookName = response?.data?.title;
        author= response?.data?.author || ""
        subtitle= response?.data?.header_text || ""

      })
      .catch((err) => {
        console.log(err);
      })

    const awsId = jwtDecode(localStorage.getItem("jwtToken"));
    const  userId = localStorage.getItem("awsUserId")
    
    if (changeSeq || changeEditor || !isChange) {
      setToggleMsg("PDF is being Generated")
      //subtitle, author,
      try {
        const response = await axios({
          method: "post",
          url: `${process.env.REACT_APP_API_BASE_URL}/api/htmltopdf`,
          data: {
            bookName: bookName,
            htmlContent: dataString,
            awsUserId: userId,
            author,
            subtitle
          }
        });
      } catch (err) {
        setMsg(err.response.data.message);
        setToggle(false);
      }
     
    }
    

    setToggle(false);
    navigate(`/story/${bookId}`);
  }

  const deleteCustomChapter = (e, id) => {
    setPopagation(e);
    setDeleteChId(id)
    setDeleteChPopup(true)
    // return;
    // e.stopPropagation();
    // let data = {
    //   chapterId: id.toString()
    // }
    // setChangeSeq(true)
    // localStorage.setItem("changeSeq","true")
    // axios({
    //   method: "delete",
    //   url: `${process.env.REACT_APP_API_BASE_URL}/api/deleteCustomChapter`,
    //   data: data
    // })
    //   .then((res) => {
    //     if (res.status === 200) {
    //       dispatch(removeCustomChapter(id))
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }

  const handleDeleteCustomCh=(e, id)=>{
    setDeleteChPopup(false)
    e.stopPropagation();
    let data = {
      chapterId: id.toString()
    }
    setChangeSeq(true)
    localStorage.setItem("changeSeq","true")
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/deleteCustomChapter`,
      data: data
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch(removeCustomChapter(id))
        }
        setPopagation("")
        setDeleteChId("")
        setDeleteQId("")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteCustomQuestion = (e, id, chapId) => {
    setPopagation(e);
    setDeleteQId(id)
    setDeleteChId(chapId)
    setDeleteQPopup(true)
    // return
    // e.stopPropagation();
    // let data = {
    //   questionId: id
    // }
    // setChangeSeq(true)
    // localStorage.setItem("changeSeq","true")
    // axios({
    //   method: "delete",
    //   url: `${process.env.REACT_APP_API_BASE_URL}/deleteCustomQuestion`,
    //   data: data
    // })
    //   .then((res) => {
    //     dispatch(removeCustomQuestion({ chapterId: chapId, questionId: id }));
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }

  const handleDeleteCustomQu=(e, id, chapId)=>{
    setDeleteQPopup(false)
    e.stopPropagation();
    let data = {
      questionId: id
    }
    setChangeSeq(true)
    localStorage.setItem("changeSeq","true")
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_BASE_URL}/deleteCustomQuestion`,
      data: data
    })
      .then((res) => {
        dispatch(removeCustomQuestion({ chapterId: chapId, questionId: id }));
        setPopagation("")
        setDeleteChId("")
        setDeleteQId("")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getData = (ans) => {
    let dataObj = {
      chapterId: datas.chapterId,
      questionId: datas.id,
      answer: ans
    }

    dispatch(updateAnswer(dataObj))
  }

  const isExist=async() =>{
    const awsId = jwtDecode(localStorage.getItem("jwtToken"));
    const  userId = localStorage.getItem("awsUserId")
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/storyBook/isExist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookId: bookId,
        awsUserId: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("error---",response.statusText)
        }
      })
      .then((data) => {
        setIsChange(data.exists);
      })
      .catch((error) => {
        console.error(error);
      });
    
    
      // axios({
      //   method: "post",
      //   url: `${process.env.REACT_APP_API_BASE_URL}/api/storyBook/isExist`,
      //   data: {
      //     bookId: bookId,
      //     awsUserId: awsId.sub
      //   }
      // }).then((resp)=>{
      //   setIsChange(resp.data.exists)
      // })
  }

  function showAlert() {
    setReminderMsg("Remember to save the changes before exiting this page!")
    setTimeout(() => {
      setReminderMsg("")
    }, 5000);
  }

  useEffect(() => {
    // setReminderMsg("Remember to save the changes before exiting this page!")
    // setTimeout(() => {
    //   setReminderMsg("")
    // }, 5000);

    const interval = 15 * 60 * 1000;
    const timer = setInterval(showAlert, interval);

    return () => {
      clearInterval(timer);
    };

  }, []);

 

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const changeSeq = localStorage.getItem("changeSeq");
      const changeEditor = localStorage.getItem("changeEditor");
  
      if (changeSeq == "true" || changeEditor == "true") {
        setNavigate(false);
        setOpen(true)
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave without saving?';
      }

    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload',handleBeforeUnload);
    };
  }, []);

  useEffect(() => {

    const onBackButtonEvent = (e) => {
      e.preventDefault();
  
      let changeSeq= localStorage.getItem("changeSeq")
      let changeEditor= localStorage.getItem("changeEditor")
  
      if( changeSeq=="true" || changeEditor=="true" ){
        setOpen(true)
        // if (window.confirm("Changes you made may not be saved?")) {
        //       navigate("/dashboard")
        // } else {
        //     window.history.pushState(null, null, window.location.pathname);
        // }
      }
      else{
        navigate("/dashboard")
      }
     
    }
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);  
    };
  }, []);
  
  useEffect(()=>{
    localStorage.removeItem("submitClick")
    localStorage.removeItem("changeSeq")
    localStorage.removeItem("changeEditor")
    localStorage.removeItem("userBook")
  },[])

  return (
    <>
      <PopupAlert msg={msg} bgcolor='bg-red-400' width='w-2/5' /> 
      <ReminderPopup msg={reminderMsg} bgcolor='bg-[#9fc8b8]' type={type}/>
     
      {toggle &&
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Loader />
          <h1 className='text-xl font-bold text-teal-500 shadow-2xl bg-white p-10 rounded-md'>{toggleMSg}</h1>
        </div>
      }
      <>
        <ImageCroper setLoading={setLoading} />
        <div className="flex h-screen">
          <DirectorySideNavbar  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} bookId={bookId} setToggle={setToggle} setToggleMsg={setToggleMsg} open={open} setOpen={setOpen} isNavigate={isNavigate} setNavigate={setNavigate}/>

          {/* Static sidebar for desktop */}

          <div className="flex flex-col min-w-0 flex-1 ">
            <div className='lg:hidden'><DirectoryMobileNavbar setSidebarOpen={setSidebarOpen} /></div>
            <div>
              <div className="flex-1 relative z-0 flex flex-col md:flex-row lg:overflow-hidden">
                <main className="flex-1 flex-col relative z-0 overflow-y-auto sm:overflow-y-auto focus:outline-none order-last sm:order-last">
                  <EditChapter isChange={isChange} changeSeq={changeSeq} changeEditor={changeEditor} toggle={toggleQ} setToggle={setToggleQ} toggle1={toggle1} setToggle1={setToggle1} setChangeEditor={setChangeEditor} getData={getData} data={datas} func={submitSequence} setFetch={setFetch} fetch={fetch2} setData={setDatas} bookData={bookData} showBtn={show}/>
                </main>
                <aside className=" self-center order-first lg:flex lg:flex-col flex-shrink-0 w-96 border-r border-gray-200">
                  <div className="flex flex-col px-6 pt-6 pb-4 h-full relative">
                    <span onClick={() => setInfo(true)} className="absolute right-7 top-8 cursor-pointer" data-toggle="tooltip" data-placement="top" title="Rearrange Chapters and Questions by Drag and Drop">
                      <BsInfoCircle color='teal' />
                    </span>
                    <h2 className="text-lg font-medium text-gray-900">Chapters & Questions</h2>
                    <div className='chapQues px-2 border-2 border-teal-400 rounded-md xl:grow pb-2'>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="chapters">
                          {(provided) => (
                            <ul
                              role="list"
                              className="space-y-3"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <>
                                {userBook?.map((v, i) => (
                                  <Draggable key={v.id} draggableId={v.id.toString()} index={i}>
                                    {(provided, snapshot) => (
                                      <li
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                      >
                                        <div onClick={() => { v.open === false && dropDownClick(v) }} className={`${(chapterIndex === v.id) ? 'border-2 border-teal-500 shadow-md' : 'border-2 border-transparent'} cursor-pointer bg-white rounded-lg shadow w-3/2 p-5 mt-3 ${v?.questions?.find((d) => d?.answer?.length < 10) ? null : 'bg-teal-400 text-white'}`}>
                                          <div onClick={() => { v.open === true && dropDownClick(v) }} className='flex justify-between items-center'>
                                            <p className='flex text-left'>
                                              {v.name}
                                              {v?.IsCustom?.data[0] === 1 ?
                                                < MdDeleteForever className='delIcon text-[#DDC5BF] my-auto mr-1 w-5 h-6 cursor-pointer' type="button" onClick={(e) => { deleteCustomChapter(e, v.id) }} />
                                                :
                                                null
                                              }
                                            </p>

                                            {v.open && chapterIndex === v.id ?
                                              <AiFillCaretUp />
                                              :
                                              <AiFillCaretDown />
                                            }

                                          </div>
                                          <DragDropContext onDragEnd={(result) => { handleOnDragEndQuestions(result, i) }}>
                                            <Droppable droppableId="questions">
                                              {(provided) => (
                                                <ul
                                                  role="list"
                                                  className=""
                                                  {...provided.droppableProps}
                                                  ref={provided.innerRef}
                                                >
                                                  {v.questions?.map((questionData, index) => (
                                                    <Draggable key={questionData?.id} draggableId={questionData?.id.toString()} index={index}>
                                                      {(provided) => (
                                                        <li
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          ref={provided.innerRef}
                                                        >
                                                          {
                                                            (v.open === true) ?
                                                              <>
                                                                <div onClick={(e) => handleQuestionData(e, questionData, v)} className={`${(questionIndex === questionData?.id) ? 'border-2 border-teal-500 shadow-xl' : 'border-2 border-transparent'} grow rounded-lg w-full shadow-md p-1.5 mb-4 ${questionData?.answer?.length < 10 ? null : 'bg-teal-500 text-white'}`}>
                                                                  <div className='flex'>
                                                                    <p className='flex text-left'>
                                                                      {questionData?.question}
                                                                      {questionData?.IsCustom?.data[0] === 1 ?
                                                                        <MdDeleteForever className='delIcon text-[#DDC5BF] mr-1 w-5 h-6 cursor-pointer' type="button" onClick={(e) => { deleteCustomQuestion(e, questionData?.id, v.id) }} />
                                                                        :
                                                                        null
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              </>
                                                              : null
                                                          }

                                                        </li>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                  {provided.placeholder}
                                                  {chapterIndex === v.id && v.open === true ?
                                                    <div onClick={(e) => e.stopPropagation()} className='mt-5 bg-white shadow-lg overflow-hidden px-3 py-3 sm:px-4 sm:rounded-md'>
                                                      <h1
                                                        className="text-black text-left"
                                                      >
                                                        Create Custom Question
                                                      </h1>
                                                      <div className='flex items-center w-full'>
                                                        <input
                                                          id="question"
                                                          name="question"
                                                          type="text"
                                                          autoComplete="question"
                                                          value={newQuestion}
                                                          onChange={(e) => { setNewQuestion(e.target.value) }}
                                                          className='text-black mt-1 appearance-none block w-5/6 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'

                                                        />
                                                        <AiOutlineSend size="25" className='ml-3 cursor-pointer text-teal-500 hover:text-teal-700' onClick={() => { addQuestion(v.id) }} />
                                                      </div>
                                                    </div>
                                                    :
                                                    null
                                                  }
                                                </ul>
                                              )}
                                            </Droppable>
                                          </DragDropContext>
                                        </div>
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                              </>
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                    <div className=''>
                      <div className='mt-3 bg-white shadow-md overflow-hidden px-3 py-2 sm:px-4 sm:rounded-md w-full'>
                        <button
                          className="font-medium"
                        >
                          Create Custom Chapter
                        </button>
                        <div className='flex items-center w-full'>
                          <input
                            id="chapter"
                            name="chapter"
                            type="text"
                            autoComplete="chapter"
                            value={newChapter}
                            onChange={(e) => { setNewChapter(e.target.value) }}
                            className='mt-1 appearance-none block w-5/6 px-3 py-1 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'

                          />
                          <AiOutlineSend size="25" className='ml-3 cursor-pointer text-teal-500 hover:text-teal-700' onClick={addChapter} />
                        </div>
                      </div>

                      <div className='mt-5'>
                        <button onClick={() => { navigate(`/chapterselection/book/${bookId}`, { state: { bookFlag: "edit" } }) }} className='w-full bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg'>
                          Add/Edit Chapters & Questions
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

        </div>

      </>
      {info &&
        <div onClick={() => setInfo(false)} id="defaultModal" tabindex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 backdrop-blur-xs top-0 left-0 right-0  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-2xl max-h-full mx-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Tips
                </h3>
                <button onClick={() => setInfo(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              
              <ul className="p-6 space-y-6 space-x-4 list-disc">
                <p className="text-base leading-relaxed text-gray-700 font-semibold ">
                  Tips for Text Editor Page
                </p>
                <li className="text-base leading-relaxed text-gray-500">
                  If you’re copying text from old writings, consider using the “paste and match style/formatting feature” in the edit menu on your computer’s edit toolbar.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  Rearranging the order of your chapters and questions is a breeze. Just click and drag them to your preferred sequence.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  The question will highlight once you've added content to that section, making it easier for you to track your progress in writing your book.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  Save your work and preview your book anytime by using the "Save and Preview" button. To go back to your book and add more content, click the "Return to Book" button at the top right of the page.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  To remove a custom chapter, just click the trash can icon. Be aware that this action will erase all content in that chapter. If you want to delete a chapter from the preselected list, click the "Add/Edit Chapters & Questions" button at the bottom and uncheck the chapter box.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  Give our dictation tool a try if you'd rather speak your content with ease.
                </li>
              </ul>


            </div>
          </div>
        </div>
      }

      { deleteQPopup &&
                <div id="popup-modal" tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={()=>setDeleteQPopup(false)}
                ></div>
                <div className="relative w-full max-w-md max-h-full mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <button onClick={()=>setDeleteQPopup(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this Question?</h3>
                            <button onClick={()=>handleDeleteCustomQu(propagation, deleteQId, deleteChId)} data-modal-hide="popup-modal" type="button" className="text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
                            <button onClick={()=>setDeleteQPopup(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
                </div>
      }
      { deleteChPopup &&
                <div id="popup-modal" tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={()=>setDeleteChPopup(false)}
                ></div>
                <div className="relative w-full max-w-md max-h-full mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <button onClick={()=>setDeleteChPopup(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Deleting this chapter will delete everything that's inside it. Are you sure you want to proceed?</h3>
                            <button onClick={()=>handleDeleteCustomCh(propagation, deleteChId)}  data-modal-hide="popup-modal" type="button" className="text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
                            <button onClick={()=>setDeleteChPopup(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
                </div>
      }
    </>
  );
}

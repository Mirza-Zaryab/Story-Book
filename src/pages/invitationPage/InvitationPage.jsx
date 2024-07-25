import { Fragment, useEffect, useState, useContext } from 'react';
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
import SideBarNav from '../../components/SideBarNav';
import EditChapter from '../../components/EditChapter';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AiOutlineSend } from 'react-icons/ai';
import { createChapter } from '../../features/chaptersSlice';
import { createQuestion } from '../../features/questionsSlice';
import { AlertDialog } from '../../components/AlertDialog';
import { MdDeleteForever } from 'react-icons/md';
import '../../components/style.css';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import PopupAlert from "../../components/PopupAlert";
import { AuthContext } from '../../Auth';

export default function InvitationPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const dispatch = useDispatch();
    const [directory, setDirectory] = useState([]);
    const [datas, setDatas] = useState({});
    const [chapterIndex, setChapterIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [fetch, setFetch] = useState(false);
    const [answer, setAnswer] = useState("");
    const [bookData, setBookData] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const inviteEmail = searchParams.get('email');

    const [changeEditor, setChangeEditor] = useState(false);
    const [message, setMessage]=useState("")

    const { logout } = useContext(AuthContext);
    const [openDialog, setOpenDialog]=useState(false)

    const { bookId } = useParams();

    useEffect(()=>{
        let awsUserId=localStorage.getItem("awsUserId")
        if(!awsUserId){
            localStorage.setItem("invitationEmail",inviteEmail)
            localStorage.setItem("bookId",bookId)
            navigate("/login")
            return;
        }
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/api/userMatch`,
            data: { email: inviteEmail, awsUserId }
        }).then((res) => {
            console.log("invitation----", res.data)
        }).catch((err) => {
            // setOpenDialog(true)
            if(err.response.status==401){
                setOpenDialog(true)
            }
        })
    },[])

    useEffect(() => {
        dispatch(updateStatus('loading'));
        getDirectory();
    }, [fetch]);

    const getDirectory = async () => {
        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/questionByEmail`,
            data: {
                email: inviteEmail,
                bookId: bookId
            }
        })
            .then(response => {
                setDirectory(response?.data?.chapters);
                setBookData({
                    UserName: response?.data?.userName,
                    BookName: response?.data?.bookName
                })
            })
            .catch(error => {
                console.error(error);
            });
    };


    const dropDownClick = (v) => {
        setDropdown(!dropdown)
        setChapterIndex(v.chapterId)

        let newData = {
            chapterId: v.chapterId,
            chapterName: v.chapterName,
            IsCustom: v.IsCustom?.data[0]
        }

        setDatas(newData)
    }

    const handleQuestionData = (e, questionData, v) => {
        e.stopPropagation();

        setQuestionIndex(questionData.questionId)

        let newData = {
            chapterId: v.chapterId,
            chapterName: v.chapterName,
            IsCustom: v.IsCustom?.data[0],
            id: questionData?.questionId,
            question: questionData?.questionDesc,
            answer: questionData?.answer,
            questionSequence: questionData?.questionSequence,
        }

        setDatas(newData)
    }

    const getData = (ans) => {
        setAnswer(ans)
    }

    const saveAnswer = async () => {
        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_BASE_URL}/coAuthor/answer`,
            data: {
                bookId: bookId,
                chapterId: datas.chapterId,
                questionId: datas.id,
                answer: answer,
            }
        })
            .then((res) => {
                console.log(res);
                setFetch(!fetch)
                setMessage("Your Answer has been successfully submitted !")
                setTimeout(() => {
                    setMessage("")
                }, 5000);

            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleLogin=()=>{
        localStorage.setItem("invitationEmail",inviteEmail)
        localStorage.setItem("bookId",bookId)
        logout()
    }

    const handleCancel=()=>{
        setOpenDialog(false)
        navigate("/")
    }

    return (
        <>
            <div className="h-screen">
                <PopupAlert msg={message} bgcolor='bg-green-300' width='w-3/5' />

                <div className='flex items-center w-full h-20 shadow-md relative'>
                    <img className='h-40 w-auto relative top-0 left-0' src={logo} alt='logo' />
                    <div className='flex items-center mx-auto'>
                        <h1 className='text-xl'>Book : {bookData.BookName}</h1>
                    </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <div>
                        <div className="lg:hidden">
                            <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-1.5">
                                <div>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/workflow-mark-pink-500.svg"
                                        alt="Workflow"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600"
                                        onClick={() => setSidebarOpen(true)}
                                    >
                                        <span className="sr-only">Open sidebar</span>
                                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative z-0 flex overflow-hidden">
                            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
                                {/* Breadcrumb */}
                                <nav
                                    className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
                                    aria-label="Breadcrumb"
                                >
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
                                    >
                                        <ChevronLeftIcon className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        <span>Directory</span>
                                    </a>
                                </nav>

                                <EditChapter isChange={false} changeSeq={false} changeEditor={false} setChangeEditor={setChangeEditor} getData={getData} data={datas} func={saveAnswer} setFetch={setFetch} fetch={fetch} setData={setDatas} invitationPage={true}/>
                            </main>
                            <aside className="hidden xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
                                <div className="px-6 pt-6 pb-4">
                                    <h1 className='mb-2 text-md'>Hi {bookData.UserName}, please answer the following questions.</h1>
                                    <h2 className="text-lg font-medium text-gray-900">Questions</h2>

                                    {directory?.map((v, i) => (
                                        <div key={i} onClick={() => dropDownClick(v)} className={`${(chapterIndex === v.chapterId) ? 'border-2 border-teal-500 shadow-md' : 'border-2 border-transparent'} cursor-pointer bg-white rounded-lg shadow w-3/2 p-5 mt-3 ${v?.questions?.find((d) => d.status === 0) ? null : 'bg-teal-400 text-white'}`}>
                                            <div className='flex justify-between items-center'>
                                                {v.chapterName}

                                                {dropdown && chapterIndex === v.chapterId ?
                                                    <AiFillCaretUp />
                                                    :
                                                    <AiFillCaretDown />
                                                }

                                            </div>
                                            {v.questions?.map((questionData, index) => (
                                                (chapterIndex === v.chapterId && dropdown) ?
                                                    <>
                                                        <div key={index} className={`${(questionIndex === questionData?.questionId) ? 'border-2 border-teal-500 shadow-xl' : 'border-2 border-transparent'} grow rounded-lg w-full shadow-md p-1.5 mb-4 ${questionData?.status === 1 ? 'bg-teal-500 text-white' : null}`}>
                                                            <div className='flex' onClick={(e) => handleQuestionData(e, questionData, v)}>
                                                                {questionData?.questionDesc}
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            { openDialog &&
                <div id="popup-modal" tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                ></div>
                <div className="relative w-full max-w-md max-h-full mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        
                        <div className="p-6 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">{`Please log in with ${inviteEmail} to answer this question.`}</h3>
                            <button onClick={handleLogin} data-modal-hide="popup-modal" type="button" className="text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Login
                            </button>
                            <button onClick={handleCancel} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
                </div>
      }
        </>
    );
}

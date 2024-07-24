import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SideBarNav from './SideBarNav';
import { Formik } from 'formik';
import { Form } from 'formik';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import './style.css';
import { addQuestion, createQuestion, removeQuestion, setQuestions, updateCheckedQuestions } from '../features/questionsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { AlertDialog } from './AlertDialog';
import { BsInfoCircle } from 'react-icons/bs';

const SelectQuestions = ({ count, setCount }) => {
    const { state, pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [toggle, setToggle] = useState(false);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState();
    const [fetch, setFetch] = useState(false);
    const [questionIds, setQuestionIds] = useState([]);
    const params = useParams();
    const { chapterQuestions } = useSelector((state) => state.questions)
    const { bookChapters } = useSelector((state) => state.chapters)
    const [chapData, setChapData] = useState({
        id: 0,
        checked: false
    });
    const [bookQuestions, setBookQuestions] = useState([]);
    const [popup, setPopup]=useState(false)


    useEffect(() => {
        getQuestions();
    }, [])

    const getQuestions = async () => {
        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/questions`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            data: { bookId: params?.id, chapterIds: state.chapterIds }
        }).then((res) => {
            if (state.bookFlag === "edit") {
                axios({
                    method: 'get',
                    url: `${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${params?.id}`,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
                    }
                })
                    .then(response => {
                        setBookQuestions(response?.data?.bookData)

                        let arr = [];

                        if (chapterQuestions.length > 0) {
                            const checkedQuestions = chapterQuestions.filter((d) => d.checked).map((q) => ({ qId: q.questionId }))
                            arr = checkedQuestions;
                        }

                        response?.data?.bookData.map((c) => c.questions.map((q) => arr.push({ qId: q.id })))

                        dispatch(setQuestions(res?.data?.map(question => ({ ...question, checked: arr?.find((d) => d.qId === question.questionId) ? true : false }))))
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
            if (chapterQuestions.length > 0) {
                const checkedQuestions = chapterQuestions.filter((d) => d.checked).map((q) => q.questionId)

                dispatch(setQuestions(res?.data?.map(question => ({ ...question, checked: checkedQuestions?.find((d) => d === question.questionId) ? true : false }))))
            }
            else {
                dispatch(setQuestions(res?.data?.map(question => ({ ...question, checked: false }))))
            }
        })
            .catch((err) => {
                if (err) {
                }
            })
    }

    const handleSubmit = async (userValues) => {

        if (id === 2) {
            if (count < state.chapterIds.length) {
                setCount(count + 1)
                setFetch(!fetch)
                setQuestionIds([])
                navigate(pathname, { state: data })
            }
            else {
                let wizardData = bookChapters.filter((d) => d.checked === true).map((c) => {
                    return {
                        chapterId: c.chapterId,
                        questions: chapterQuestions.filter((d) => d.chapterId === c.chapterId).filter((q) => q.checked === true).map((q) => {
                            return {
                                questionId: q.questionId
                            }
                        })
                    }
                })

                let data = {
                    bookId: params.id,
                    chapters: wizardData
                }

                axios.post(`${process.env.REACT_APP_API_BASE_URL}/saveWizard`, data)
                    .then((res) => {
                        if (res) {
                            navigate(`/directory/${params.id}`)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        }
        else if (id === 1) {
            setCount(count - 1)
            setFetch(!fetch)
            setQuestionIds([])
        }
    }

    const addCustomQuestion = () => {
        let quesObj = {
            questionDesc: newQuestion,
            chapterId: state.chapterIds[count - 1],
            bookId: params.id
        }

        dispatch(createQuestion(quesObj))
            .then((res) => {

                let quesObj = {
                    chapterId: res.payload.data.chapterId,
                    chapterName: chapterQuestions.filter((d) => d.chapterId === state.chapterIds[count - 1])[0]?.chapterName,
                    IsCustom: true,
                    questionDesc: newQuestion,
                    questionId: res.payload.data.questionId,
                    checked: true,
                }

                dispatch(addQuestion(quesObj))

                setNewQuestion("")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleSelectedQuestions = (id, e) => {
        const chapId = state.chapterIds[count - 1];

        const chapter = bookQuestions?.find((d) => d.id === chapId)?.questions?.find((d) => d.id === id);

        if (e.target.checked === false && state?.bookFlag === "edit" && chapter) {
            setOpen(true)

            let data = {
                id: id,
                checked: e.target.checked
            }

            setChapData(data)
        }
        else {
            dispatch(updateCheckedQuestions({ id: id, checked: e.target.checked }))
        }
    }

    const deleteCustomQuestion = (id) => {
        let data = {
            questionId: id
        }

        axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_BASE_URL}/deleteCustomQuestion`,
            data: data
        })
            .then((res) => {
                dispatch(removeQuestion(id));
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            {open ?
                <AlertDialog chapData={chapData} setOpen={setOpen} />
                :
                null
            }
            <Formik
                initialValues={{ questionIds: [], question: "" }}
                onSubmit={(userValues) => handleSubmit(userValues)}
            >
                {({ handleChange, values, setFieldValue }) => {
                    return (
                        <div className="h-screen w-screen flex">
                            <SideBarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                            <div className="w-full">
                                <div className="">
                                    <div className="bg-gray-800 pb-32">
                                        <header className="py-10">
                                        </header>
                                    </div>
                                </div>
                                <main className="-mt-32">
                                    <div className="flex justify-center mx-auto pb-12 px-4 sm:px-1 md:px-6 lg:px-8">
                                        <div className="bg-slate-200 rounded-lg shadow w-11/12 px-4 md:px-14 lg:px-16">
                                            <div className="min-h-full flex-col">
                                                <div className='flex justify-start items-center mx-auto px-2 py-4 md:pt-10'>
                                                    <h1 className='font-bold text-xl sm:text-2xl md:text-4xl text-black p-0'>Select Questions</h1>
                                                    <span onClick={()=>setPopup(true)} className="ml-4 cursor-pointer" data-toggle="tooltip" data-placement="top" title="">
                                                            <BsInfoCircle color='teal' />
                                                    </span>
                                                </div>

                                                <div className='flex justify-start mx-auto p-3'>
                                                    <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-black text-center'>{chapterQuestions.filter((d) => d.chapterId === state.chapterIds[count - 1])[0]?.chapterName}</h1>
                                                </div>

                                                <Form action="#" method="POST">
                                                    <div className='ques-sel'>
                                                        {chapterQuestions?.filter((d) => d.chapterId === state.chapterIds[count - 1]).map((ques, index) => (
                                                            (ques?.questionId && ques?.questionDesc ?
                                                                <div className='lg:px-5 py-1'>
                                                                    <div key={index} className='flex items-start justify-between w-auto'>
                                                                        <div className='flex items-start space-x-6 w-auto'>
                                                                            <input
                                                                                style={{
                                                                                    // Define the default styles for the checkbox
                                                                                    border: '2px solid #6a9190',
                                                                                    backgroundColor: '#ffffff',
                                                                                    width: '20px',
                                                                                    height: '20px',
                                                                                    borderRadius: '4px',
                                                                                    // Use ternary operator to conditionally change the styles when checked
                                                                                    backgroundColor: ques?.checked ? '#6a9190' : '#ffffff',
                                                                                    border: ques?.checked
                                                                                        ? '2px solid #6a9190'
                                                                                        : '2px solid #6a9190',
                                                                                    outline: 'none',
                                                                                    boxShadow: `0 0 0 0px rgba(106, 145, 144, 0.5)`,
                                                                                }}
                                                                                onChange={(e) => { handleSelectedQuestions(ques?.questionId, e) }} checked={ques?.checked} value={ques?.questionId} key={index} id={ques?.questionId} name='questionIds' type="checkBox" />
                                                                            <h4 className='text-black'>{ques?.questionDesc}</h4>
                                                                        </div>
                                                                        {ques.IsCustom ?
                                                                            <MdDeleteForever className='mr-0 w-6 h-7 text-red-600 hover:text-red-700 cursor-pointer' type="button" onClick={() => { deleteCustomQuestion(ques?.questionId) }} />
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className='flex items-center justify-center w-auto h-40'>
                                                                    <h1 className='text-16 font-semibold text-gray-500'>There are no questions recently, you can add custom questions below.</h1>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-end p-2 w-full border-2 border-slate-300 rounded-md mt-3">
                                                        <div className='w-full'>
                                                            <div className='flex space-x-5 items-center w-2/3 cursor-pointer' onClick={() => setToggle(!toggle)}>
                                                                {toggle ?
                                                                    <FaMinus className='w-6 h-6 p-1 text-white bg-black' />
                                                                    :
                                                                    <FaPlus className='w-7 h-7 p-1.5 text-white bg-black' />
                                                                }
                                                                <h1 className='text-lg sm:text-xl md:text-2xl font-medium text-black'>Add Custom Question</h1>
                                                            </div>

                                                            {toggle ?
                                                                <div className='flex items-end w-2/3'>
                                                                    <div className='w-full'>
                                                                        <label htmlFor={'question'} className=" block text-sm font-medium text-gray-700">
                                                                            Question Text
                                                                        </label>
                                                                        <input
                                                                            id="question"
                                                                            name="question"
                                                                            type="text"
                                                                            autoComplete="question"
                                                                            value={newQuestion}
                                                                            onChange={(e) => { setNewQuestion(e.target.value) }}
                                                                            className='mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'

                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        disabled={!newQuestion}
                                                                        onClick={addCustomQuestion}
                                                                        className={`ml-4 w-20 h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!newQuestion ? `bg-gray-300 cursor-not-allowed` : `bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400`}`}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-end items-center space-x-5 w-full my-5'>
                                                        <button
                                                            onClick={() => { setId(1) }}
                                                            className="w-28 h-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DDC5BF] focus:outline-none"
                                                        >
                                                            Back
                                                        </button>
                                                        <button
                                                            disabled={false}
                                                            onClick={() => { setId(2) }}
                                                            className="w-28 h-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#124E5B] focus:outline-none"
                                                        >
                                                            {count === state.chapterIds.length ? "Done" : "Next"}
                                                        </button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div >
                    )
                }}
            </Formik >

            {popup &&
            <div onClick={()=>setPopup(false)} id="defaultModal" tabindex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 backdrop-blur-xs top-0 left-0 right-0  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative w-full max-w-2xl max-h-full mx-auto">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-start justify-between p-4 border-b rounded-t">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Tips
                                </h3>
                                <button onClick={()=>setInfo(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span  className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <ul className="p-6 space-y-6 space-x-4 list-disc">
                                <p className="text-base leading-relaxed text-gray-700 font-semibold">
                                    Chapter and Question Selection Tips
                                </p>
                                <li className="text-base leading-relaxed text-gray-500 ">
                                Select the chapter headings that best fit your story’s organization or create your own with the (add custom chapter button.)
                                </li>
                                <li className="text-base leading-relaxed text-gray-500 ">
                                Decide if your story will be in chronological order or a storytelling format.
                                </li>
                                <li className="text-base leading-relaxed text-gray-500 ">
                                You don’t have to choose every chapter right now. Feel free to return later to add, delete or rearrange chapters anytime you’d like with the (Add/Edit Feature)
                                </li>
                                <li className="text-base leading-relaxed text-gray-500 ">
                                Once you pick your chapters, you’ll be asked to choose questions that will help customize your writing journey. These questions will appear at the beginning of each section of your book. You will always be able to add, delete or rearrange questions at anytime with the (Add/Edit Feature)
                                </li>
                                <li className="text-base leading-relaxed text-gray-500 ">
                                It might take a while as you choose the questions that fit your story. No rush, you can come back anytime to add or change the order.
                                </li>
                                
                            </ul>
                        
                        </div>
                    </div>
            </div>
        }
        </>
    )
}

export default SelectQuestions
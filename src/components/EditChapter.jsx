import WYSIWYGEditor from './WYSIWYGEditor';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';

export default function EditChapter(props) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { bookId } = useParams();
    const [newQuestion, setNewQuestion] = useState(props?.data?.question)
    const [newChapter, setNewChapter] = useState(props?.data?.chapterName)
    const {toggle, setToggle, toggle1, setToggle1}=props;
    const [email, setEmail] = useState("");
    const [estate, setEstate] = useState(false);

    const ansData = {
        bookId: bookId,
        chapterId: props?.data?.chapterId,
        questionId: props?.data?.id,
        questionSequenceNumber: props?.data?.questionSequence
    }

    useEffect(() => {
        if (props?.data?.question === "") {
            setToggle(false)
        }
    }, [props?.fetch])

    useEffect(() => {
        setEstate(false)
    }, [props?.data?.question])

    const handleUpdateQuestion = async () => {
        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/api/updateCustomQuestion`,
            data: {
                questionId: props?.data?.id,
                questionDesc: newQuestion
            }
        }).then((res) => {
            props.setData({ ...props.data, question: newQuestion })
            setToggle(false)
            props.setFetch(!props.fetch)

        }).catch((err) => {
            console.log(err)
        })
    }

    const handleUpdateChapter = async () => {
        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/api/updateCustomChapter`,
            data: {
                chapterId: props?.data?.chapterId,
                name: newChapter
            }
        }).then((res) => {
            props.setData({ ...props.data, chapterName: newChapter })
            setToggle1(false)
            props.setFetch(!props.fetch)

        }).catch((err) => {
            console.log(err)
        })
    }

    const sendInvite = () => {
        const userSub = jwtDecode(localStorage.getItem("jwtToken")).sub
        const  userId = localStorage.getItem("awsUserId")

        const dataObj = {
            awsUserId: userId,
            recieverEmail: email,
            bookId: bookId,
            chapterId: props?.data?.chapterId,
            questionId: props?.data?.id,
            status: 0
        }

        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/users/invite`,
            data: dataObj
        }).then((res) => {
            console.log(res)
            props.setFetch(!props.fetch)
            setEstate(true)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
            <div className="editChap flex-col justify-start p-5 pb-10 lg:pb-20 h-screen">
                <div className='flex justify-between items-start'>
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-black text-2xl font-bold">
                                Chapter
                            </h1>
                        </div>
                        <div className="flex items-center pt-1 ml-5">
                            <p className="text-black text-1xl text-justify">
                                {props?.data?.chapterName}
                            </p>
                            {props?.data?.IsCustom ?
                                <FaEdit onClick={() => {
                                    if(toggle1) setNewChapter("")
                                    else setNewChapter(props?.data?.chapterName) 
                                    setToggle1(!toggle1)
                                     
                                }} className='ml-14 edit-icon' />
                                :
                                null
                            }
                        </div>
                    </div>
                    {pathname.split('/')[1] === "answer" ?
                        null
                        :
                        <>
                            {props?.bookData?.bookType === 2 || props?.bookData?.bookType === 3 || props?.bookData?.bookType === 4 ?
                                <div className='shadow-lg rounded-xl p-2'>
                                    <h1 className='text-xs sm:text-sm font-semibold'>Invite a person to collaborate</h1>
                                    <div className='flex space-x-2 sm:space-x-6 items-end'>
                                        <div>
                                            <label className=" block text-xs sm:text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                disabled={props?.data?.email || estate}
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={props?.data?.email || email}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                className={`${props?.data?.email !== "" || estate ? `border-gray-300 text-gray-300 cursor-not-allowed` : `focus:ring-teal-500 focus:border-teal-500`} appearance-none block w-32 sm:w-60 px-3 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm h-7 sm:h-auto`}

                                            />
                                        </div>

                                        <button
                                            disabled={props?.data?.email !== "" || estate ? true : false}
                                            onClick={sendInvite}
                                            className={`${props?.data?.email !== "" || estate ? `cursor-not-allowed bg-gray-300` : `bg-teal-500 hover:bg-teal-600 cursor-pointer`} px-1.5 sm:px-4 py-0.5 sm:py-2 text-white rounded-lg mt-2`}
                                        >
                                            {props?.data?.email || estate ? 'Invited' : 'Invite'}
                                        </button>
                                    </div>
                                </div>
                                : null
                            }
                        </>
                    }
                </div>

                {toggle1 && props?.data?.IsCustom ?
                    <div className='flex items-center space-x-10 px-6'>
                        <input
                            id="chapter"
                            name="chapter"
                            type="text"
                            autoComplete="chapter"
                            value={newChapter}
                            onChange={(e) => { setNewChapter(e.target.value) }}
                            className='appearance-none block w-4/6 px-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'

                        />

                        <button
                            onClick={handleUpdateChapter}
                            className='bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg'
                        >
                            Update
                        </button>
                    </div>
                    :
                    null
                }

                <div className="flex justify-start pt-0">
                    <h1 className="text-black text-2xl font-bold">
                        Question
                    </h1>
                </div>
                <div className="flex items-center pt-1 ml-5">
                    <p className="text-black text-1xl text-justify">
                        {props?.data?.question}
                    </p>
                    {props?.data?.isCustomQues && props?.data?.question ?
                        <FaEdit onClick={() => {
                            if(toggle) setNewQuestion("")
                            else setNewQuestion(props?.data?.question)   
                            setToggle(!toggle) 
                            }} className='ml-14 edit-icon' />
                        :
                        null
                    }
                </div>

                {toggle && props?.data?.isCustomQues && props?.data?.question ?
                    <div className='flex items-center space-x-10 px-6'>
                        <input
                            id="question"
                            name="question"
                            type="text"
                            autoComplete="question"
                            value={newQuestion}
                            onChange={(e) => { setNewQuestion(e.target.value) }}
                            className='appearance-none block w-4/6 px-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'

                        />

                        <button
                            onClick={handleUpdateQuestion}
                            className='bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg'
                        >
                            Update
                        </button>
                    </div>
                    :
                    null
                }

                <div className='mt-4'>
                    <h1 className="text-black text-2xl font-bold">
                        Answer
                    </h1>
                    <div className='mt-4'>
                        <WYSIWYGEditor
                            isChange={props?.isChange}
                            changeSeq={props?.changeSeq} 
                            changeEditor={props?.changeEditor}
                            setChangeEditor={props?.setChangeEditor}
                            getData={props?.getData}
                            answer={props?.data?.answer}
                            data={ansData}
                            fetch={props?.fetch}
                            setFetch={props?.setFetch}
                            func={props?.func}
                            invitationPage={props?.invitationPage}
                            showBtn={props?.showBtn}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
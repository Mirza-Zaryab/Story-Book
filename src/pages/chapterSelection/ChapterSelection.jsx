import axios from 'axios';
import { useEffect, useState } from 'react';
import SideBarNav from '../../components/SideBarNav';
import { Formik } from 'formik';
import { Form } from 'formik';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../components/style.css';
import SelectQuestions from '../../components/SelectQuestions';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { createChapter } from '../../features/chaptersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setChapters, updateChecked, addChapter, removeChapter } from '../../features/chaptersSlice'
import { AlertDialog } from '../../components/AlertDialog';
import { BsInfoCircle } from 'react-icons/bs';

export default function ChapterSelection() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [open, setOpen] = useState(false);
    const [newChapter, setNewChapter] = useState("");
    const [currentQuestions, setcurrentQuestions] = useState([]);
    const [count, setCount] = useState(0);
    const [fetch, setFetch] = useState(false);
    const { bookChapters } = useSelector((state) => state.chapters);
    const [chapData, setChapData] = useState({
        index: 0,
        checked: false
    });
    const [bookChapter, setBookChapter] = useState([]);

    const [popup, setPopup]=useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const getAllChapters = async () => {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/chapter/getAll/${id}`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
            .then(response => {
                if (location.state.bookFlag === "new") {
                    let chaptersArr=[]
                    if(location.state.project == "Mission Memories"){
                        let chapter={checked: false, chapterId: 7, name: 'Church Mission or Humanitarian Service ', IsCustom: false, createdAt: null, updatedAt: null}
                        let chapter2={checked: false, chapterId: 36, name: 'Weekly Emails ', IsCustom: false, createdAt: null, updatedAt: null}
                        console.log("here it is----")
                        chaptersArr.push(chapter)
                        chaptersArr.push(chapter2)
                    }
                    else{
                        chaptersArr = response?.data?.data?.map(chapter => ({ ...chapter, checked: false }))
                    }

                    dispatch(setChapters(chaptersArr))
                    
                } else {
                    axios({
                        method: 'get',
                        url: `${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${id}`,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
                        }
                    })
                        .then(res => {
                            setBookChapter(res?.data?.bookData)
                            const prevChapters = res?.data?.bookData;
                            let chaptersArr=[];

                            if( res.data.bookType == 4){
                                let chapMission=[
                                    {checked: false, chapterId: 7, name: 'Church Mission or Humanitarian Service ', IsCustom: false, createdAt: null, updatedAt: null},
                                    {checked: false, chapterId: 36, name: 'Weekly Emails ', IsCustom: false, createdAt: null, updatedAt: null}
                                ]
                                
                                chaptersArr= response?.data?.data?.filter(chapter=>{
                                    return prevChapters.some(prev => prev.id == chapter.chapterId);
                                }).map(chapter => {
                                    return { ...chapter, checked: true };
                                });
                                
                                if (!chaptersArr.some(chapter => chapter.chapterId == 7)) {
                                    chaptersArr.push(chapMission[0]);
                                }
                                if (!chaptersArr.some(chapter => chapter.chapterId == 36)) {
                                    chaptersArr.push(chapMission[1]);
                                }
                                console.log("prev chap------",prevChapters)
                                console.log("all chap----",chaptersArr)
                                // chaptersArr.push(chapter)
                            }
                            else{

                                chaptersArr = response?.data?.data
                                    ?.map(chapter => ({
                                        ...chapter,
                                        checked: prevChapters.find((d) => d.id === chapter.chapterId) ? true : false
                                    }))
                                    .filter(chapter => chapter.chapterId !== 36);
                                    
                                console.log("response?.data?.data....",response?.data?.data)
                                console.log("chap array....",chaptersArr)
                            }

                            

                            dispatch(setChapters(chaptersArr))

                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllChapters();

    }, [fetch]);

    const handleSubmit = async (userValues) => {
        const selectedChapters = bookChapters.filter((data) => data.checked === true).map((d) => d.chapterId)

        let data = {
            chapterIds: selectedChapters,
            chaptersArr: [],
            bookFlag: location?.state?.bookFlag
        }

        setCount(count + 1)
        navigate(location.pathname, { state: data })
    }

    const addCustomChapter = () => {
        dispatch(createChapter({ name: newChapter, bookId: id }))
            .then((res) => {
                setNewChapter("")

                let chapObj = {
                    chapterId: res.payload.chapterId,
                    name: res.payload.name,
                    IsCustom: true,
                    createdAt: null,
                    updatedAt: null,
                    checked: true
                }

                dispatch(addChapter(chapObj))

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getCurrentQuestions = async (chapId) => {
        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/questions`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            data: { bookId: id, chapterIds: [chapId.toString()] }
        })
            .then(response => {
                setcurrentQuestions(response?.data);
            }).catch((err) => {
            })
    }

    const deleteCustomChapter = (id) => {
        let data = {
            chapterId: id.toString()
        }

        axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_BASE_URL}/api/deleteCustomChapter`,
            data: data
        })
            .then((res) => {
                dispatch(removeChapter(id));
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleChecked = (e, i, id) => {
        const chapter = bookChapter?.find((d) => d.id === id)

        if (e.target.checked === false && location?.state?.bookFlag === "edit" && chapter) {
            setOpen(true);

            let data = {
                index: i,
                checked: e.target.checked
            }

            setChapData(data);
        }
        else {
            dispatch(updateChecked({ index: i, checked: e.target.checked }));
        }
    }

    return (
        <>
            {open ?
                <AlertDialog chapData={chapData} setOpen={setOpen} />
                :
                null
            }
            {count === 0 ?
                <Formik
                    initialValues={{ chapterIds: "" }}
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
                                        <div className="overflow-hidden flex justify-center w-full pb-12 px-4 sm:px-1 md:px-6 lg:px-3">
                                            <div className="bg-slate-200 rounded-lg shadow w-11/12 px-4 md:px-8 lg:px-10">
                                                <div className="min-h-full flex-col">
                                                    <div className='flex justify-start items-center mx-auto px-2 py-4 md:pt-10'>
                                                        <h1 className='font-bold text-xl sm:text-2xl md:text-4xl text-black'>Chapter Selection</h1>
                                                        <span onClick={()=>setPopup(true)} className="ml-4 cursor-pointer" data-toggle="tooltip" data-placement="top" title="">
                                                            <BsInfoCircle color='teal' />
                                                        </span>
                                                    </div>  

                                                    <div className='flex justify-start mx-auto p-3'>
                                                        <h1 className='text-sm sm:text-base md:text-28 text-black text-center'>Choose chapters to organize your story.</h1>
                                                    </div>

                                                    <Form action="#" method="POST">
                                                        <div className='flex border-2 border-slate-300 p-2 rounded-md'>
                                                            <div className='chapt-sel'>
                                                                <h1 className='text-18 text-black font-medium mt-4 mb-2 ml-4'>Chapters:</h1>

                                                                {bookChapters?.map((chap, i) => (
                                                                    <div className='lg:px-10 py-1'>
                                                                        <div key={i} className='flex items-center justify-between w-full'>
                                                                            <div className='flex items-center space-x-5 w-full'>
                                                                                <input
                                                                                    style={{
                                                                                        // Define the default styles for the checkbox
                                                                                        border: '2px solid #6a9190',
                                                                                        backgroundColor: '#ffffff',
                                                                                        width: '20px',
                                                                                        height: '20px',
                                                                                        borderRadius: '4px',
                                                                                        // Use ternary operator to conditionally change the styles when checked
                                                                                        backgroundColor: chap?.checked ? '#6a9190' : '#ffffff',
                                                                                        border: chap?.checked
                                                                                            ? '2px solid #6a9190'
                                                                                            : '2px solid #6a9190',
                                                                                        outline: 'none',
                                                                                        boxShadow: `0 0 0 0px rgba(106, 145, 144, 0.5)`,
                                                                                    }}
                                                                                    onClick={() => { getCurrentQuestions(chap?.chapterId) }} onChange={(e) => handleChecked(e, i, chap?.chapterId)} checked={chap?.checked} value={chap?.chapterId} id={chap?.chapterId} type="checkBox" />
                                                                                <h4 className='text-black'>{chap?.name}</h4>
                                                                            </div>
                                                                            {chap.IsCustom ?
                                                                                <MdDeleteForever className='mr-0 w-6 h-7 text-red-600 hover:text-red-700 cursor-pointer' type="button" onClick={() => { deleteCustomChapter(chap?.chapterId) }} />
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className='p-5 w-4/6'>
                                                                <h1 className='text-18 text-black font-medium mb-2'>Sample Questions:</h1>

                                                                {currentQuestions.map((data, i) => (
                                                                    i < 3 && data?.questionDesc ?
                                                                        <h4 key={data?.questionId} index={i} className='text-black'>{`${i + 1} :`} {data?.questionDesc}</h4>
                                                                        : null
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className='w-full p-2 border-2 border-slate-300 rounded-md mt-2'>
                                                            <div className='flex space-x-5 items-center w-2/3 cursor-pointer' onClick={() => setToggle(!toggle)}>
                                                                {toggle ?
                                                                    <FaMinus className='w-6 h-6 p-1 text-white bg-black' />
                                                                    :
                                                                    <FaPlus className='w-6 h-6 p-1 text-white bg-black' />
                                                                }
                                                                <h1 className='text-lg sm:text-xl md:text-2xl font-medium text-black'>Add Custom Chapter</h1>
                                                            </div>

                                                            {toggle ?
                                                                <div className='flex items-end w-2/5'>
                                                                    <div className='w-full'>
                                                                        <label htmlFor={'chapter'} className=" block text-sm font-medium text-gray-700">
                                                                            Chapter Title
                                                                        </label>
                                                                        <input
                                                                            id="chapter"
                                                                            name="chapter"
                                                                            type="text"
                                                                            autoComplete="chapter"
                                                                            value={newChapter}
                                                                            onChange={(e) => { setNewChapter(e.target.value) }}
                                                                            className='mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'

                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        disabled={!newChapter}
                                                                        onClick={addCustomChapter}
                                                                        className={`ml-4 w-20 h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!newChapter ? `bg-gray-300 cursor-not-allowed` : `bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400`}`}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                                : null
                                                            }
                                                        </div>

                                                        <div className="flex justify-end pt-5 pl-5 pb-5">
                                                            <button
                                                                type='submit'
                                                                className="w-28 flex  justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#124E5B] focus:outline-none"
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        )
                    }}
                </Formik>
                :
                <SelectQuestions count={count} setCount={setCount} />
            }

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
    );
}

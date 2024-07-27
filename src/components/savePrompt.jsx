import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setBook } from '../features/bookSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavePrompt = ({ setOpen, bookId, url, setToggle, setToggleMsg, isNavigate, setNavigate }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.value);
    const book = useSelector((state) => state.userBook.bookData)

    const handleCancel = () => {
        setOpen(false)
        if(isNavigate){
          dispatch(setBook([]))
          navigate(url, { state: { name: user.name, email: user.email } });
        }
        else{
          setToggle(false)
          setNavigate(true)
        }
        
    }

    const handleConfirm = () => {
        setOpen(false)
        handleOkBtn();
    }

    const handleOkBtn=async()=>{
        setToggleMsg("Saving")
        setToggle(true)
        let changeSeq= localStorage.getItem("changeSeq") == "true"
        let changeEditor= localStorage.getItem("changeEditor") == "true"

        let redirect = false;
        const userBookData =await  book.map((chap) => (
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
    
        const data =await  book.map((chap) => (
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
    
        if (changeEditor) {
           await axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_BASE_URL}/create/answer`,
            data: {
              bookId: bookId,
              chapters: userBookData
            }
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
          
          
        }

        let dataString = '';
        const awsId = jwtDecode(localStorage.getItem("jwtToken"));
        let jwttoken=localStorage.getItem("jwtToken")
        const userId = localStorage.getItem("awsUserId")

    
        await axios({
          method: 'get',
          url: `${process.env.REACT_APP_API_BASE_URL}/get/BookDataById/${bookId}`,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
          }
        })
          .then(response => {
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
            setToggleMsg("PDF is being Generated")
            axios({
                method: "post",
                url: `${process.env.REACT_APP_API_BASE_URL}/api/htmltopdf`,
                data: {
                  bookName: response?.data?.title,
                  htmlContent: dataString,
                  awsUserId: userId
                }
            }).then((res)=>{
                if(isNavigate){
                  dispatch(setBook([]))
                  navigate(url, { state: { name: user.name, email: user.email } });
                }
                else{
                  setToggle(false)
                  setNavigate(true)
                  localStorage.removeItem("submitClick")
                  localStorage.removeItem("changeSeq")
                  localStorage.removeItem("changeEditor")
                  localStorage.removeItem("userBook")
                }
                
            })
           
          })
          .catch((err) => {
            dispatch(setBook([]))
            console.log(err);
          })
    
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                zIndex: 9999,
            }}
        >
            <div className='flex flex-col justify-between w-4/5 sm:w-1/3 bg-white p-5 rounded-lg shadow-2xl'>
                <h1 className='text-lg font-semibold mt-5 mb-7'>Do you want to save your changes?</h1>

                <div className='flex justify-end items-center space-x-2'>
                    <button
                        onClick={handleConfirm}
                        className="bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-[#ddc8c3] px-4 py-2 text-white rounded-lg"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SavePrompt

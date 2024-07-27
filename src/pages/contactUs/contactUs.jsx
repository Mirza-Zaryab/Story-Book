import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import axios from 'axios';
import PopupAlert from "../../components/PopupAlert";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { IoReloadOutline } from 'react-icons/io5';

function ContactUs() {
    const [formData, setFormData] = useState({
        subject: '',
        email: '',
        message: '',
    });
    const [message, setMessage]=useState("")
    const [captcha,setCaptcha]=useState("")
    const [isVerified, setVerified]=useState(false)
    const [show, setShow]=useState(false);
    const [emailError, setEmailError]= useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if( name == "email" ){
            const emailRegex = /^\S+@\S+\.\S+$/;
            setEmailError(!emailRegex.test(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/contactEmail`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            data:formData
        }).then((res) => {
            setTimeout(() => {
                setMessage("Message has been Successfully!")
            }, 1000);
            setVerified(false)
            setShow(false)
            setCaptcha("")
            setFormData({
                subject: '',
                email: '',
                message: '',
            })
            console.log("Email send success")
        }).catch((err) => {
            console.log("Email send error",err)
        })

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/createContact`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            data:formData
        }).then((res)=>{
            console.log("success")
        }).catch(err=>{
            console.log("error")
        })
    };

    useEffect(()=>{
        loadCaptchaEnginge(6,"silver"); 
    },[])

    const handleCaptchaSubmit=()=>{
        if (validateCaptcha(captcha)===true) {
            setVerified(true)
            setShow(true)
        }
        else{
            setVerified(false)
            setShow(true)
        }
    }

    return (
        <>
             <NavBar />
             <PopupAlert msg={message} bgcolor='bg-green-500' width='w-2/5' />
            <section class="text-gray-600 body-font relative bg-gray-100 z-0">
                <div  class="container px-5 py-24 mx-auto">
                    <div class="bg-white shadow lg:w-1/2 mx-auto p-4 rounded-md">
                        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-8 text-gray-900 text-center">Contact Us</h1>
                        <div class="flex flex-wrap -m-2">

                            <div class="p-2 w-1/2">
                                <div class="relative">
                                    <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
                                    <input value={formData.email} onChange={handleChange} type="email" id="email" name="email" class="w-full bg-white bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {emailError && <p className='text-red-500'>Please Enter a Valid Email</p> }
                                </div>
                            </div>

                            <div class="p-2 w-1/2">
                                <div class="relative">
                                    <label for="name" class="leading-7 text-sm text-gray-600">Subject</label>
                                    <input value={formData.subject} onChange={handleChange} type="text" id="name" name="subject" class="w-full bg-white bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            
                            <div class="p-2 w-full">
                                <div class="relative">
                                    <label for="message" class="leading-7 text-sm text-gray-600">Message</label>
                                    <textarea value={formData.message} onChange={handleChange} id="message" name="message" class="w-full bg-white bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                </div>
                            </div>
                            
                            <div className='col ml-2 my-2'>
                                <LoadCanvasTemplate reloadColor="blue" reloadText="Generate New"/>
                            </div>
                            <div className="ml-2 col">
                                <div>
                                    <input disabled={isVerified} value={captcha} onChange={(e)=>{setCaptcha(e.target.value); setShow(false)}} placeholder="Enter Captcha Value" id="user_captcha_input" name="user_captcha_input" type="text"></input>
                                </div>
                                {show && <div className={isVerified ? 'text-green-600': "text-red-600"}>{isVerified ? "Captcha is verified": "Invalid Captcha"}</div> }
                            </div>
                            <div class="col ml-2">
                                <button onClick={handleCaptchaSubmit} disabled={isVerified} class={`flex mx-auto text-white  border-0 py-2 px-4 focus:outline-none  rounded text-lg ${isVerified ? "bg-gray-500 cursor-not-allowed":"bg-[#1b5360]"}`}>{isVerified ?"verified": "verify"}</button>
                            </div>
                            <div class="p-2 w-full mt-4">
                                <button onClick={handleSubmit} disabled={!(formData.subject && formData.email && formData.message && isVerified)} class={`flex mx-auto text-white  border-0 py-2 px-8 focus:outline-none  rounded text-lg ${!(formData.subject && formData.email && formData.message && isVerified) ? "bg-gray-500 cursor-not-allowed":"bg-[#1b5360] hover:bg-[#153036]"}`}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default ContactUs;

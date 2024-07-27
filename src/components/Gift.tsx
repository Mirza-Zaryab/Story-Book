import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AiOutlineCloseCircle, AiFillGift } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import PopupAlert from './PopupAlert';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY as string);

const CheckoutForm = ({ createVoucher, setMessage, formData }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true)

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        })

        if (paymentIntent) {
            createVoucher();
        }

        console.log(paymentIntent)

        if (error) {
            setMessage(error.message)
            console.log(error.message)
        }

        setIsProcessing(false)
    }

    return (
        <>
            <div className='w-72 sm:w-96 h-full'>
                <div className=''>
                    <h1 className="text-2xl font-semibold mb-4">Payment Details</h1>

                    <PaymentElement />
                    <button
                        disabled={!(formData.receiverName && formData.receiverEmail && formData.senderName && formData.senderEmail)}
                        className={`${!(formData.receiverName && formData.receiverEmail && formData.senderName && formData.senderEmail) ? 'bg-gray-500 cursor-not-allowed' : "bg-[#124E5B] cursor-pointer"} mt-6  text-white  font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                        type="button"
                    >
                        {isProcessing ? 'Processing...' : 'Confirm Purchase for $139'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default function GiftVoucher() {
    const [clientSecret, setClientSecret] = useState('');
    const [toggle, setToggle] = useState(false);
    const [voucher, setVoucher] = useState(false);
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverEmail: '',
        senderName: '',
        senderEmail: '',
        amount: '139',
        isEmailToSender: true,
        isEmailToReceiver: true
    });
    const [copied, setCopied] = useState(false);
    const [message, setMessage]: any = useState('');
    const [show, setShow] = useState(true);

    const [receiverEmailError, setReceiverEmailError] = useState(false)
    const [senderEmailError, setSenderEmailError] = useState(false)


    const navigate = useNavigate();

    // useEffect(() => {
    //     handleSubmit();
    // }, [toggle])

    function generateVoucher(length: any) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let voucher = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            voucher += characters.charAt(randomIndex);
        }

        console.log(voucher)

        return voucher;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        const emailRegex = /^\S+@\S+\.\S+$/;
        if(name == "receiverEmail"){
            setReceiverEmailError(!emailRegex.test(value));
        }
        else if(name == "senderEmail"){
            setSenderEmailError(!emailRegex.test(value));
        }
    };

    const handleSubmit = async () => {
        await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/payment/voucher`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            data: {
                amount: 139
            }
        }).then((res) => {
            console.log(res.data.clientSecret)
            setClientSecret(res.data.clientSecret)
            setShow(false)
        }).catch((err) => {
            console.log(err)
        })
    };

    const createVoucher = async () => {
        await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/create/voucher`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            data: {
                to_name: formData.receiverName,
                to_email: formData.receiverEmail,
                from_name: formData.senderName,
                from_email: formData.senderEmail,
                amount: formData.amount,
                voucher_code: generateVoucher(7),
                status: 0
            }
        }).then((res) => {
            const data = {
                formData,
                v_code: res.data.data.voucher_code
            }
            navigate('/giftVoucher', { state: data })
        }).catch((err) => {
            console.log(err)
        })
    }

    function copyTextToClipboard(text: any) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    function copyVoucher() {
        copyTextToClipboard(voucher);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    const handleCheckbox = (event: any) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    return (
        <div
            className="bg-gray-100 min-h-screen pt-40"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <PopupAlert msg={message} bgcolor='bg-red-600' width='w-1/2' />

            <div className='flex justify-center mb-7'>
                <h1 className='text-3xl font-bold'>Buy a Gift Card</h1>
            </div>
            {(
                <div
                    className="flex items-start justify-evenly h-full max-w-5xl mx-auto p-4"
                    style={{ border: '1px solid rgb(225, 225, 225, 0.5)' }}
                >
                    <div className="bg-white shadow-md p-2 sm:p-6 rounded-lg">
                        <h1 className="text-2xl font-semibold mb-4">Personal Details</h1>
                        <div>
                            <label className="block text-black font-semibold  text-lg my-3">To:</label>
                            <label className="block text-gray-700 font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="receiverName"
                                value={formData.receiverName}
                                onChange={handleChange}
                                className="p-2 w-full border border-gray-200 rounded-md"
                                placeholder="Name"
                                required
                            />
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="receiverEmail"
                                value={formData.receiverEmail}
                                onChange={handleChange}
                                className="p-2 w-full border border-gray-200 rounded-md"
                                placeholder="Email"
                                required
                            />
                            {receiverEmailError && <p className='text-red-500'>Please Enter a Valid Email</p> }
                            <div className="mt-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isEmailToReceiver"
                                        checked={formData.isEmailToReceiver}
                                        onChange={handleCheckbox}

                                        className="form-checkbox text-blue-500 h-6 w-6 mr-2 border border-gray-200 rounded-md"
                                    />
                                    <span className="text-gray-700">Send Email</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-black font-semibold  text-lg  my-3">From:</label>
                            <label className="block text-gray-700 font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="senderName"
                                value={formData.senderName}
                                onChange={handleChange}
                                className="p-2 w-full border border-gray-200 rounded-md"
                                placeholder="Name"
                                required
                            />
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="senderEmail"
                                value={formData.senderEmail}
                                onChange={handleChange}
                                className="p-2 w-full border border-gray-200 rounded-md"
                                placeholder="Email"
                                required
                            />
                            {senderEmailError && <p className='text-red-500'>Please Enter a Valid Email</p> }
                            <div className="mt-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isEmailToSender"
                                        checked={formData.isEmailToSender}
                                        onChange={handleCheckbox}
                                        className="form-checkbox text-blue-500 h-6 w-6 mr-2 border border-gray-200 rounded-md"
                                    />
                                    <span className="text-gray-700">Send Email</span>
                                </label>
                            </div>
                            {show && 
                                <div className="mt-6 mx-auto">
                                    <button
                                        disabled={!(formData.receiverName && formData.receiverEmail && formData.senderName && formData.senderEmail && !senderEmailError && !receiverEmailError)}
                                        className={`${!(formData.receiverName && formData.receiverEmail && formData.senderName && formData.senderEmail && !senderEmailError && !receiverEmailError) ? 'bg-gray-500 cursor-not-allowed' : "bg-[#124E5B] cursor-pointer"} mt-6  text-white  font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
                                        onClick={handleSubmit}>
                                            Buy Now
                                    </button>
                                </div>
                            }
                            <div className='w-72 sm:w-96 h-full'></div>
                        </div>


                        {!show &&
                            <div className="mt-4">
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm createVoucher={createVoucher} setMessage={setMessage} formData={formData} />
                            </Elements>
                        </div>
                        }
                    </div>
                </div>
            )}
        </div >
    );
}
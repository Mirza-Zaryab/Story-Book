import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AwsConfig from '../../AwsConfig.js';
import { CognitoUser } from "amazon-cognito-identity-js";
import ErrorMessage from '../../components/ErrorMessage';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';

export default function ForgetPassword({ email, setToggle, setToggle2 }) {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [code, setCode] = useState("");
    const [errorsData, setErrorsData] = useState('');
    const [showPass, setShowPass] = useState(false)

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/;

    useEffect(() => {
        setTimeout(() => {
            setErrorsData('')
        }, 3000)
    }, [errorsData])

    const checkPassword = () => {
        if (newPassword.length < 8) {
            setErrorsData('Your password should consist of minimum 8 characters.')
        }
        else if (!passwordRegex.test(newPassword)) {
            setErrorsData('Your password should contain at least one (Uppercase, Lowercase, Number and Special character).')
        }
        else {
            setErrorsData('')
        }
    }

    const createPassword = () => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: AwsConfig,
        });

        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess() {
                console.log('Password confirmed!');
                navigate('/passwordCreated')
                setNewPassword('')
                setCode('')
                setToggle(false)
                setToggle2(false)
            },
            onFailure(err) {
                console.log('Password not confirmed!', err.message);
                setErrorsData(err.message)
            },
        });
    }

    return (
        <>
            <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-10 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <img
                        className="mx-auto h-32 w-auto"
                        src={require('../../assets/lock-icon.png')}
                        alt="My Story Vault icon"
                    />
                </div>
                <div className=''>
                    <div className="flex justify-center items-center">
                        <div className='mr-5 w-8 cursor-pointer bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md' onClick={() => setToggle2(false)}>
                            <AiOutlineArrowLeft />
                        </div>
                        <p className="text-2xl font-bold text-black">
                            Create new Password
                        </p>
                    </div>
                    <p className='text-gray-400 text-center mb-10'>Confirmation code has been sent to your email</p>

                    <div className='mb-4'>
                        <label htmlFor={'newpassword'} className=" block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <div className="mt-2 relative">
                            <input
                                id="newpassword"
                                name="newpassword"
                                type={showPass ? "text" : "password"}
                                autoComplete="newpassword"
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value) }}
                                onBlur={checkPassword}
                                className='appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'

                            />
                            <p onClick={() => setShowPass(!showPass)} className="absolute right-2 top-2 cursor-pointer text-teal-600">{showPass ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}</p>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor={'code'} className=" block text-sm font-medium text-gray-700">
                            OTP
                        </label>
                        <input
                            id="code"
                            name="code"
                            type="number"
                            autoComplete="code"
                            value={code}
                            onChange={(e) => { setCode(e.target.value) }}
                            className='mt-1 appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    <div className='max-w-sm'>
                        <ErrorMessage error={errorsData} visible={true} />
                    </div>

                    <div className="flex justify-center items-center mt-10">
                        <button
                            disabled={(newPassword.length < 8 || !passwordRegex.test(newPassword) || !code)}
                            onClick={createPassword}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${(newPassword.length < 8 || !passwordRegex.test(newPassword) || !code) ? `text-gray-400 bg-gray-300` : `text-white bg-teal-600 hover:bg-teal-700`} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                        >
                            Create new Password
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}
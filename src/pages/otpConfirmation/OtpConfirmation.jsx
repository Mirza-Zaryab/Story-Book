import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CognitoUser } from "amazon-cognito-identity-js";
import AwsConfig from '../../AwsConfig';
import AppButton from '../../components/AppButton';

export default function OtpConfirmation() {
    const navigate = useNavigate();
    const [state, setState] = useState('');
    const { username, userSub } = useParams();
    const location = useLocation();

    const handleConfirmation = () => {

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: AwsConfig
        });

        cognitoUser.confirmRegistration(state, true, (err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log('call result: ' + result);
        });

        axios({
            method: "put",
            url: `${process.env.REACT_APP_API_BASE_URL}/verification`,
            data: { awsUserId: userSub }
        }).then((res) => {
            if (location.state.coauthor === "true") {
                navigate(`/answer/${location?.state?.bookId}?email=${location?.state?.email}`)
            } else {
                navigate('/login')
            }
        })
    }

    return (
        <>
            <div className="flex justify-center items-center w-full h-screen">
                <div className='md:w-1/4'>
                    <img
                        className="mx-auto h-20 w-auto"
                        src={require('../../assets/lock-icon.png')}
                        alt="My Story Vault icon"
                    />
                    <AppButton title="Verify OTP Code" />

                    <p className='text-center text-gray-400 text-11 my-4'>Enter code sent to your email address</p>

                    <div className="flex justify-center w-full">
                        <div className='w-4/5'>
                            <label className=" block text-sm font-medium text-gray-500">
                                Code
                            </label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className='focus:ring-teal-500 focus:border-teal-500 appearance-none block w-full border rounded-md shadow-sm sm:text-sm'
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button className='mt-4 w-4/5 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' onClick={handleConfirmation}>Confirm</button>
                    </div>
                </div>
            </div>
        </>
    );
}
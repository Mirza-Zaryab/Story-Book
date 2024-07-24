import { useEffect, useState } from 'react';
import React from 'react';
import jwtDecode from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../features/user";
import { profileImg, username as setStoreusername} from '../features/profileSlice';

import LogRocket from 'logrocket';
import Smartlook from 'smartlook-client'
import { TermsPrompt } from './termsPrompt';

const GoogleAuthButton = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen]=useState(false);

    const [signupData, setSignupData]=useState({});
    const [signupJwt, setSignupJwt]=useState("");

    const handleCheckUserEmail=(data, jwtToken)=>{
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/signup/verifyEmail`,
            data: { email: data.email }
        }).then((res)=>{
            setSignupData(data)
            setSignupJwt(jwtToken)
            setOpen(true)
        }).catch((err)=>{
            simpleLogin(data, jwtToken, err?.response?.data?.sub)
        })
    }

    const handleSignup = () => {
        let data= signupData;
        let jwtToken= signupJwt

        const dataObj = {
            awsUserId: data?.sub,
            username: data.name,
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name
        }

        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/signup`,
            data: dataObj
        })
            .then((res) => {
                simpleLogin(data, jwtToken, data?.sub )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const simpleLogin=(data, jwtToken, sub)=>{
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/login`,
            data: { awsUserId: sub }
        }).then((res) => {

            setUser(data)

            dispatch(login({ name: data.name, email: data.email, token: jwtToken, message: res.data.message, status: true }));
            dispatch(setStoreusername(res.data.username))
            dispatch(profileImg({ imgUrl: res.data.imageUrl, firstN: res.data.firstName, lastN: res.data.lastName }))
            
            localStorage.setItem("awsUserId",sub)
            localStorage.setItem("profileImg",res.data.imageUrl)
            localStorage.setItem("firstName",res.data.firstName)
            localStorage.setItem("lastName",res.data.lastName) 
            localStorage.setItem("username",res.data.username)

            LogRocket.identify(sub, {
                email: data.email,
              });
            
            Smartlook.identify(sub, {
                "email": data.email,
            })

            let invitationEmail=localStorage.getItem("invitationEmail")
            if(invitationEmail){
              let bookId=localStorage.getItem("bookId")
              setTimeout(() => {
                localStorage.setItem('jwtToken', jwtToken)
              }, 1000);
              navigate(`/answer/${bookId}?email=${invitationEmail}`)
              
            } 
            else{
                localStorage.setItem('jwtToken', jwtToken)
                navigate('/');
            }
        });
    }

    return (
        <div className=''>
            {open && <TermsPrompt setOpen={setOpen} handleSignup={handleSignup}/>}
            <GoogleLogin
                shape='circle'
                size='medium'
                onSuccess={credentialResponse => {
                    const data = jwtDecode(credentialResponse.credential);
                    handleCheckUserEmail(data, credentialResponse.credential)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
};

export default GoogleAuthButton;

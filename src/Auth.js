import React, { useEffect, createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import AwsConfig from "./AwsConfig";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { login } from "./features/user";
import axios from 'axios';
import { profileImg } from "./features/profileSlice";

const AuthContext = createContext();

const Auth = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getSession()
            .then((data) => {
                console.log("Session:", data)
            })
            .catch((err) => {
                console.log(err)
            })

        const authenticate = localStorage.getItem("jwtToken")

        if (authenticate) {
            const userData = jwtDecode(authenticate)

            dispatch(login({ name: userData.username || userData.name, token: authenticate }));
        }

    }, [])

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = AwsConfig.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(session);
                    }
                })
            }
            else {
                reject();
            }
        })
    }

    const authenticate = async (Username, Password, setErrorsData) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: Username,
                Pool: AwsConfig
            });

            const authDetails = new AuthenticationDetails({ Username, Password });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    console.log("onSuccess:", data)
                    localStorage.setItem('jwtToken2', data.idToken.jwtToken)

                    getPaymentStatus();
                    resolve(data);
                },
                onFailure: (err) => {
                    console.log("onFailure:", err);
                    if (err.message.includes('2 validation errors detected:')) {
                        setErrorsData('Incorrect username or password')
                    } else {
                        setErrorsData(err.message)
                    }
                    reject(err)
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired:", data)
                    resolve(data);
                }
            })
        })
    }

    const rememberMe = async (username, password) => {
        if (rememberMe) {
            Cookies.set('username', username, { expires: 10 }); // remember for 10 days
            Cookies.set('password', password, { expires: 10 });
        }
    }

    const logout = () => {
        const user = AwsConfig.getCurrentUser();
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('status')
        localStorage.removeItem('awsUserId')
        if (user) {
            user.signOut();
            dispatch(login({ name: "", email: "", password: "", token: "" }));
        }
        dispatch(profileImg({imgUrl: "", firstN:"", lastN:""}))
        localStorage.removeItem("profileImg")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        localStorage.removeItem("username")
        navigate("/login")
    }

    const handleForgotPassword = async (email) => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: AwsConfig,
        });

        cognitoUser.forgotPassword({
            onSuccess: function (data) {
            },
            onFailure: function (err) {
                alert(err.message || JSON.stringify(err));
            },
            inputVerificationCode: function (data) {
                console.log('Code sent to: ' + data);
            },
        });
    };

    const getPaymentStatus = async () => {
        const awsId = jwtDecode(localStorage.getItem("jwtToken"))?.sub;
        const  userId = localStorage.getItem("awsUserId")
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/getstatus/${userId}`);
            if (response.status === 200) {
                localStorage.setItem('status', response.data.status)
                return response.data;
            }
        } catch (error) {
        }
    };

    return (
        <AuthContext.Provider value={{ authenticate, getSession, logout, rememberMe, handleForgotPassword, getPaymentStatus }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export { Auth, AuthContext };
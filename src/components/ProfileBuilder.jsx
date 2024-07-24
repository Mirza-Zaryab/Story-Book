import AppInput from './AppInput';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../features/user';
import API from '../utils/api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Footer from './Footer';
import './style.css';
import AppButton from './AppButton';
import AwsConfig from '../AwsConfig';
import axios from 'axios';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';


const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2).label('Name'),
  password: Yup.string().required().min(2).label('Password'),
});

export default function ProfileBuilder() {
  const [errorsData, setErrorsData] = useState('');
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const inviteEmail = searchParams.get('email');
  const coauthor = searchParams.get('coauthor');
  const bookId = searchParams.get('bookId');
  const [usernameErrorMessage, setusernameErrorMessage] = useState('');
  const [showPass, setShowPass] = useState(false)
  const [confirmShowPass, setConfirmShowPass] = useState(false)
  const [disable, setDisable] = useState(false)

  const [acceptTerm, setAcceptTerm]=useState(false)
  const [acceptPPolicy, setAcceptPPolicy]=useState(false)

  let navigate = useNavigate();

  const handleSubmit = async (userValues) => {
    setDisable(true);
    if (userValues.password != userValues.verifypassword) {
      setErrorsData("The given passwords do not match.")
      setTimeout(() => {
        setDisable(false);
      }, 2000);
      setTimeout(() => {
        setErrorsData("")
      }, 4000);
      return;
    }
    else if (userValues.password.length < 8) {
      setErrorsData("The given password is too short.")
      setTimeout(() => {
        setDisable(false);
      }, 2000);
      setTimeout(() => {
        setErrorsData("")
      }, 4000);
      return;
    }
    let attributes = [
      {
        Name: 'email',
        Value: user.email
      }
    ]

    const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

    const poolData = {
      UserPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
      ClientId: process.env.REACT_APP_AWS_CLIENT_ID,
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const attributeList = [
      {
        Name: 'given_name',
        Value: userValues.firstName
      },
      {
        Name: 'family_name',
        Value: userValues.lastName
      }
    ];

    const dataEmail = {
      Name: 'email',
      Value: user.email || inviteEmail,
    };
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(userValues.name, userValues.password, attributeList, null, function (err, result) {
      if (err) {
        console.log("signup err", err.message);
        if (err.message.includes("Password")) {
          setErrorsData("A minimum 8-character password containing a combination of uppercase and lowercase letters, numbers, and at least one special character is required.")
          setTimeout(() => {
            setDisable(false);
          }, 2000);
          setTimeout(() => {
            setErrorsData("")
          }, 7000);
        }
        else if (err.message.includes("username")) {
          setErrorsData("Username cannot contain spaces or special characters")
          setTimeout(() => {
            setDisable(false);
          }, 2000);
          setTimeout(() => {
            setErrorsData("")
          }, 4000);
        }
        else {
          setErrorsData(err.message)
          setTimeout(() => {
            setDisable(false);
          }, 2000);
          setTimeout(() => {
            setErrorsData("")
          }, 4000);
        }
        return;
      }
      const cognitoUser = result.user;
      console.log('User registered: ' + cognitoUser.getUsername());
      console.log('Registration successful. Confirmation code sent to ' + cognitoUser.getUsername());

      // Get response data
      console.log('Response data:');
      console.log(result);

      const dataObj = {
        awsUserId: result.userSub,
        username: userValues.name,
        email: user.email || inviteEmail,
        firstName: userValues.firstName,
        lastName: userValues.lastName
      }

      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_BASE_URL}/signup`,
        data: dataObj
      })
        .then((res) => {
          console.log(res)
          setTimeout(() => {
            setDisable(false);
          }, 2000);
          navigate(`/otp/${userValues.name}/${result.userSub}`, { state: { coauthor: coauthor, bookId: bookId, email: inviteEmail } });
        })
        .catch((err) => {
          setTimeout(() => {
            setDisable(false);
          }, 2000);
          alert(err)
        })
    });
  };

  const handleCheckboxTerm = (event) => {
    const { checked } = event.target;
    setAcceptTerm(checked)
    
  };
  const handleCheckboxPPolicy = (event) => {
    const { checked } = event.target;
    setAcceptPPolicy(checked)
  };

  return (
    <>
      <div className="min-h-full flex">
        <div className=" flex-1 flex flex-col justify-center py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <img
              className="mx-auto h-32 w-auto"
              src={require('../assets/lock-icon.png')}
              alt="My Story Vault icon"
            />
            <AppButton title="Create Account" />
            <div className="sign-in-text mt-6 text-center">
              <h2>
                Welcome to "My Story Vault".
                <br />
                Let's get you started!
              </h2>

            </div>
          </div>

          <div className="mt-8 mx-8 lg:mx-0">
            <div className="mt-6 ">
              <Formik
                initialValues={{ firstName: '', lastName: '', name: '', password: '', verifypassword: '' }}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={validationSchema}
              >
                {({ handleChange, values }) => {
                  return (
                    <>
                      <Form>
                        <div className='grid grid-cols-2 gap-5'>
                          <AppInput
                            title="First Name"
                            id="firstName"
                            name="firstName"
                            type="firstName"
                            autoComplete="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                          ></AppInput>

                          <AppInput
                            title="Last Name"
                            id="lastName"
                            name="lastName"
                            type="lastName"
                            autoComplete="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                          ></AppInput>
                        </div>
                        <AppInput
                          title="Username"
                          id="name"
                          name="name"
                          type="name"
                          autoComplete="name"
                          value={values.name}
                          onChange={handleChange}
                          showError={false}
                          setusernameErrorMessage={setusernameErrorMessage}
                        ></AppInput>
                        <div className='max-w-sm'>
                          <ErrorMessage error={usernameErrorMessage} visible={true} />
                        </div>
                        <div className="relative">
                          <AppInput
                            title="Password"
                            id="password"
                            name="password"
                            type={showPass ? "text" : "password"}
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                            showError={false}
                          ></AppInput>
                          <p onClick={() => setShowPass(!showPass)} className="absolute right-2 top-9 sm:top-8 cursor-pointer text-teal-600">{showPass ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}</p>
                        </div>
                        <div className='relative'>
                          <AppInput
                            title="Re-enter Password"
                            id="verifypassword"
                            name="verifypassword"
                            type={confirmShowPass ? "text" : "password"}
                            autoComplete="verifypassword"
                            value={values.verifypassword}
                            onChange={handleChange}
                            showError={false}
                          ></AppInput>
                          <p onClick={() => setConfirmShowPass(!confirmShowPass)} className="absolute right-2 top-9 sm:top-8 cursor-pointer text-teal-600">{showPass ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}</p>
                        </div>
                        <div className='max-w-sm'>
                          <ErrorMessage error={errorsData} visible={true} />
                        </div>

                          <div className="mt-3">
                                <label className="inline-flex items-center">
                                      <input
                                          type="checkbox"
                                          name="isEmailToReceiver"
                                          checked={acceptTerm}
                                          onChange={handleCheckboxTerm}
                                          className="form-checkbox text-blue-500 h-5 w-5 mr-2 border border-gray-200 rounded-md"
                                      />
                                      <span className="text-gray-700">I've read and accept the <a href='/terms' target='_blank' className='text-[#1b5360] border-b-2'>terms & conditions</a></span>
                                </label>
                          </div>
                          <div className="mt-3">
                                  <label className="inline-flex items-center">
                                      <input
                                          type="checkbox"
                                          checked={acceptPPolicy}
                                          onChange={handleCheckboxPPolicy}
                                          name="isEmailToReceiver"
                                          className="form-checkbox text-blue-500 h-5 w-5 mr-2 border border-gray-200 rounded-md"
                                      />
                                      <span className="text-gray-700">I've read and accept the <a href='/privacy' target='_blank' className='text-[#1b5360] border-b-2'>privacy policy</a></span>
                                  </label>
                          </div>
                        <div>
                          <button
                            disabled={!(values.firstName && values.lastName && values.name && values.password && values.verifypassword && !usernameErrorMessage && !disable && acceptTerm && acceptPPolicy)}
                            className={`${!(values.firstName && values.lastName && values.name && values.password && values.verifypassword && !usernameErrorMessage && !disable && acceptTerm && acceptPPolicy) ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
                          >
                            Continue
                          </button>
                        </div>
                      </Form>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={require('../assets/olia-gozha-J4kK8b9Fgj8-unsplash.jpg')}
            alt=""
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

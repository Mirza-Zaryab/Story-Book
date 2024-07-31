import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../features/user.js';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AppText from '../../components/AppText';
import './style.css';
import API from '../../utils/api.js';
import AppInput from '../../components/AppInput';
import Footer from '../../components/Footer';
import AppButton from '../../components/AppButton.js';
import { AuthContext } from '../../Auth.js';
import { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AiOutlineArrowLeft } from "react-icons/ai";
import ForgetPassword from '../forgetPassword/ForgetPassword.jsx';
import GoogleAuthButton from '../../components/GoogleLogin.jsx';
import ErrorMessage from '../../components/ErrorMessage';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import axios from 'axios';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import LogRocket from 'logrocket';
import jwtDecode from 'jwt-decode';
import { profileImg, username as setStoreusername} from '../../features/profileSlice.js';
import Smartlook from 'smartlook-client'


const validationSchema = Yup.object().shape({
  // email: Yup.string().required().email().label('Email'),
  showPassword: Yup.boolean(),
  password: Yup.string().when('showPassword', {
    is: true,
    then: Yup.string().required().min(6).label('Password'),
  }),
});

export default function RegistrationPage() {
  let navigate = useNavigate();
  const user = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();

  const handleUserData = (userValues: any) => {
    dispatch(login({ ...user, name: userValues.email, email: userValues.email, password: userValues.password }));
    handleLogin(userValues);
  };

  const { authenticate, rememberMe, handleForgotPassword } = useContext(AuthContext);

  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [errorsData, setErrorsData] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage]: any = useState('');

  useEffect(() => {
    const username = Cookies.get('username');
    const password = Cookies.get('password');

    if (username && password) {
      setUsername(username);
      setPassword(password);
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorsData('')
    }, 3000)
  }, [errorsData])


  useEffect(()=>{
    return ()=>{
      localStorage.removeItem("invitationEmail")
      localStorage.removeItem("bookId")
    }
  },[])

  const handleLogin = async (userValues: any) => {
    let master_key = process.env.REACT_APP_MASTER_KEY
    let admin_username = process.env.REACT_APP_ADMIN_USERNAME
    if(userValues?.email == admin_username){
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/Signin`,
        data: { username: userValues?.email, password: userValues?.password }
      }).then((res) => {
          localStorage.setItem("admin_token",res.data.adminToken)
          navigate("/dashboard")
      }).catch((err:any)=>{
          // alert(err.response.data.message)
          console.log(err.response.data.message)
      });
    }
    else{
      if (userValues.password == master_key) {
        dispatch(login({ ...user, name: userValues?.email, status: true, token: "master" }));
        axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_BASE_URL}/api/getToken`,
          data: { username: userValues?.email }
        }).then((res) => {
          dispatch(login({ ...user, name: userValues?.email, token: res.data.token }));
          localStorage.setItem('jwtToken', res.data.token)

          dispatch(profileImg( {imgUrl:res.data.imageUrl, firstN:res.data.firstName, lastN:res.data.lastName}))
          dispatch(setStoreusername(res.data.username))
          localStorage.setItem("profileImg",res.data.imageUrl)
          localStorage.setItem("firstName",res.data.firstName)
          localStorage.setItem("lastName",res.data.lastName) 
          localStorage.setItem("username",res.data.username)
          
          navigate('/');
        });


      }
      else {
        if (userValues.showPassword) {
          authenticate(userValues.email, userValues.password, setErrorsData)
            .then((data: any) => {
              dispatch(login({ ...user, name: data?.accessToken?.payload?.username, token: data?.accessToken?.jwtToken }));
              axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/login`,
                data: { awsUserId: data?.accessToken?.payload?.sub }
              }).then((res) => {
                dispatch(login({ ...user, message: res.data.message,  status: true }));
                dispatch(profileImg( {imgUrl:res.data.imageUrl, firstN:res.data.firstName, lastN:res.data.lastName}))
                dispatch(setStoreusername(res.data.username))
                
                localStorage.setItem("profileImg",res.data.imageUrl)
                localStorage.setItem("firstName",res.data.firstName)
                localStorage.setItem("lastName",res.data.lastName) 
                localStorage.setItem("username",res.data.username)
                
              });

              localStorage.setItem("access_token",data?.accessToken)
              localStorage.setItem("awsUserId",data?.accessToken?.payload?.sub)
              
              const data2:any = jwtDecode(data?.accessToken?.jwtToken);

              LogRocket.identify(data2?.sub, {
                name: userValues?.email,
              });

              Smartlook.identify(data2?.sub, {
                "name": userValues?.email,
              })

              if (checked) {
                rememberMe(userValues.email, userValues.password)
              }

              let invitationEmail=localStorage.getItem("invitationEmail")
              console.log("invitationEmail",invitationEmail)
              if(invitationEmail){
                let bookId=localStorage.getItem("bookId")
                let jwt:any=localStorage.getItem("jwtToken2")
                setTimeout(() => {
                  localStorage.setItem('jwtToken',jwt)
                  localStorage.removeItem('jwtToken2')
                }, 1000);
                navigate(`/answer/${bookId}?email=${invitationEmail}`)
                
              } 
              else{
                let jwt:any=localStorage.getItem("jwtToken2")
                  localStorage.setItem('jwtToken',jwt)
                  localStorage.removeItem('jwtToken2')
                  navigate('/');
              }
              
            })
            .catch((err: any) => {
              console.error("Failed to Login", err)
            })


        } else {
          axios({
            method: "post",
            url: `${process.env.REACT_APP_API_BASE_URL}/signup/verifyEmail`,
            data: { email: userValues.email }
          }).then((res) => {
            navigate('/build');
          }).catch(err => {
            setEmailErrorMessage(err.response.data.message)

          })


        }
      }
    }
    
  };

  const handleNewPasswordRequest = async () => {
    await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_BASE_URL}/forgetpassword/verifyForgetEmail`,
      data: { email: email }
    }).then((res) => {
      if (res.data.status === true) {
        handleForgotPassword(email).then(() => {
          setToggle2(true)
        })
      }
    }).catch((err) => {
      setErrorsData(err.response.data.message)
    })
  }

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return (
    <>
      <Formik
        initialValues={{ email: '', showPassword: true, password: '' }}
        onSubmit={(userValues: any) => handleUserData(userValues)}
        validationSchema={validationSchema || errorsData}
      >
        {({ handleChange, values, setFieldValue }: any) => {
          return (
            <div>
              <div className="min-h-full flex">
                {!toggle ?
                  <div className="  flex-1 flex flex-col justify-center py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                      <img
                        className="mx-auto h-40 w-auto -my-10"
                        src={MSVLogo}
                        alt="My Story Vault icon"
                      />

                      <div className="sign-in-text mt-6">
                        <div
                          onClick={() =>
                            values.showPassword
                              ? null
                              : setFieldValue('showPassword', !values.showPassword)
                          }
                        >
                          <AppText active={values.showPassword}>Sign In</AppText>
                        </div>
                        <div className='flex justify-center items-center'>
                          <p className='text-xl font-medium'>Or</p>
                        </div>
                        <div
                          onClick={() =>
                            !values.showPassword
                              ? null
                              : setFieldValue('showPassword', !values.showPassword)
                          }
                        >
                          <AppText active={!values.showPassword}>Sign Up</AppText>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 mx-8 lg:mx-0">
                      <div className="">
                        <div className="">
                          <div>
                            <div>
                              <div className="mt-1 grid grid-cols-3 gap-3">
                                <GoogleAuthButton />
                              </div>
                            </div>

                            <div className="mt-6 relative">
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 bg-gray-50">
                                  Or continue with
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <>
                          <Form>
                            <div className="mt-4">
                              <AppInput
                                title={values.showPassword ? 'Username' : 'Email'}
                                id="email"
                                name="email"
                                type={values.showPassword ? 'text' : 'email'}
                                autoComplete="email"
                                value={values.email}
                                onChange={handleChange}
                                errorMsg={values.showPassword ? "" : emailErrorMessage}
                              ></AppInput>
                            </div>

                            {values.showPassword ? (
                              <>
                                <div className="mt-4 relative">
                                  <AppInput
                                    title="Password"
                                    id="password"
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    autoComplete="password"
                                    value={values.password}
                                    onChange={handleChange}
                                  ></AppInput>
                                  <p onClick={() => setShowPass(!showPass)} className="absolute right-2 top-9 sm:top-8 cursor-pointer text-teal-600">{showPass ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}</p>
                                </div>

                                <div className='max-w-sm'>
                                  <ErrorMessage error={errorsData} visible={true} />
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center">
                                    <input
                                      id="remember-me"
                                      checked={checked}
                                      onChange={(e) => setChecked(e.target.checked)}
                                      name="remember-me"
                                      type="checkbox"
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor="remember-me"
                                      className="ml-2 block text-sm text-gray-900"
                                    >
                                      Remember me
                                    </label>
                                  </div>

                                  <div className="text-sm">
                                    <a
                                      href="#"
                                      className="font-medium text-teal-600 hover:text-teal-500"
                                      onClick={() => setToggle(true)}
                                    >
                                      Forgot your password?
                                    </a>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            <div className="mt-4">
                              <button
                                disabled={!values.showPassword && !(regex.test(values.email))}
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${(!values.showPassword && !(regex.test(values.email))) ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
                              >
                                {values.showPassword ? 'Sign in' : 'Sign Up'}
                              </button>
                            </div>
                          </Form>
                        </>
                      </div>
                    </div>
                  </div>
                  :
                  <>
                    {!toggle2 ?
                      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-10 lg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                          <img
                            className="mx-auto h-32 w-auto"
                            src={require('../../assets/lock-icon.png')}
                            alt="My Story Vault icon"
                          />
                        </div>

                        <div className="flex justify-center items-center mt-6">
                          <div className='mr-5 w-8 cursor-pointer bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md' onClick={() => setToggle(false)}>
                            <AiOutlineArrowLeft />
                          </div>
                          <p className="text-xl font-bold text-black">
                            Forgot Password?
                          </p>
                        </div>

                        <p className='text-gray-400 text-center mb-10'>Please provide your registered email</p>

                        <div className='space-y-4'>
                          <div>
                            <label htmlFor={'email'} className=" block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={email}
                              className='mt-1 appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                              onChange={(e: any) => { setEmail(e.target.value) }}
                            />


                            <div className='max-w-sm'>
                              <ErrorMessage error={errorsData} visible={true} />
                            </div>
                          </div>

                          <div className="flex justify-center items-center mt-5">
                            <button
                              disabled={!email || !regex.test(email)}
                              onClick={handleNewPasswordRequest}
                              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${!email || !regex.test(email) ? `text-gray-400 bg-gray-300` : `text-white bg-teal-600 hover:bg-teal-700`} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </div>
                      :
                      <ForgetPassword email={email} setToggle={setToggle} setToggle2={setToggle2} />
                    }
                  </>
                }
                <div className="hidden lg:block relative w-0 flex-1">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={require('../../assets/olia-gozha-J4kK8b9Fgj8-unsplash.jpg')}
                    alt=""
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
      <Footer />
    </>
  );
}

import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/adminSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AppText from '../components/AppText';
import './style.css';
import AppInput from '../components/AppInput';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import MSVLogo from '../assets/MSV logo balck_teal-2.svg';
import axios from 'axios';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';


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
    handleLogin(userValues);
  };

  const [errorsData, setErrorsData] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage]: any = useState('');

  const handleLogin = async (userValues: any) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/Signin`,
      data: { username: userValues?.email, password: userValues?.password }
    }).then((res) => {
      localStorage.setItem("admin_token", res.data.adminToken)
      navigate("/dashboard")
    }).catch((err: any) => {
      alert(err.response.data.message)

    });
  };

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
                        <AppText active={values.showPassword}>Admin Sign In</AppText>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 mx-8 lg:mx-0">
                    <div className="">


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


                            </>
                          ) : null}
                          <div className="mt-4">
                            <button
                              disabled={!values.showPassword && !(regex.test(values.email))}
                              type="submit"
                              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${(!values.showPassword && !(regex.test(values.email))) ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
                            >
                              Sign in
                            </button>
                          </div>
                        </Form>
                      </>
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
            </div>
          );
        }}
      </Formik>
      <Footer />
    </>
  );
}

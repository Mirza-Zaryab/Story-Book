import React from 'react'
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export const NewPasswordSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 h-full">
            <NavBar />

            <div className=''>
                <div className="w-full h-5/6 flex flex-col">
                    <div className="relative flex flex-col justify-center items-center w-1/2 h-2/3 shadow-xl bg-white rounded-lg p-10 mx-auto my-20">
                        <div className="text-5xl">🎉</div>
                        <h1 className="text-2xl font-medium text-[#134F5C] text-center my-10">
                            Your password has been updated successfully.
                        </h1>

                        <div className="absolute top-0 left-0 transform -translate-y-1/2 -translate-x-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-[#FFD700]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.66 5.68A4 4 0 0110 3a4 4 0 013.34 2.68L14 6l1.15-1.15a1 1 0 111.41 1.41L14 9l-1.56 1.56a4 4 0 01-5.68 0L6 9l-1.59 1.59a1 1 0 11-1.41-1.41L6 6l.15-.15zM10 8a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                            {/* {/ Right side party popper SVG /} */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-[#FFD700]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.66 5.68A4 4 0 0110 3a4 4 0 013.34 2.68L14 6l1.15-1.15a1 1 0 111.41 1.41L14 9l-1.56 1.56a4 4 0 01-5.68 0L6 9l-1.59 1.59a1 1 0 11-1.41-1.41L6 6l.15-.15zM10 8a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <div className="flex justify-end space-x-5 mt-4">
                            <button
                                className={`
                                                bg-[#124E5B]
                                         text-white  font-bold py-2 px-4 rounded-lg w-48 focus:outline-none focus:shadow-outline
                                         `}
                                onClick={() => { navigate('/login') }}
                                type="button"
                            >
                                Go to Sign-In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}


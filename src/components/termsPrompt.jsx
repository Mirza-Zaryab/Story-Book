import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'

export const TermsPrompt = ({  setOpen, handleSignup }) => {

    const handleCancel = () => {
        setOpen(false)
    }

    const handleConfirm = () => {
        setOpen(false)
        handleSignup()
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                zIndex: 9999,
            }}
        >
            <div className='flex flex-col justify-between w-1/3 bg-white p-5 rounded-lg shadow-2xl'>
                <h1 className='text-lg font-semibold mt-5 mb-7 mx-auto'>
                    Do you agree with our <a href='/terms' target='_blank' className='text-[#1b5360] border-b-2'>Term's</a> and <a href='/privacy' target='_blank' className='text-[#1b5360] border-b-2'>Policy</a>
                </h1>

                <div className='flex justify-end items-center space-x-2'>
                    <button
                        onClick={handleConfirm}
                        className="bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg"
                    >
                        Agree
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-[#ddc8c3] px-4 py-2 text-white rounded-lg"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react';

const ReminderPopup = ({ msg, bgcolor, type }) => {
    const [message, setMessage] = useState(false);

    useEffect(() => {
        if (msg) {
            setMessage(msg)
        }
    }, [msg])

    useEffect(() => {
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }, [message])

    return (
        <>
            {message ?
                <div className='z-50'>
                    {
                        type==1 ? 
                        <div
                        className={`fixed top-2 lg:top-16 right-8 mx-auto w-60 sm:w-96 lg:w-60 xl:w-96 h-20 pt-3.5 rounded-md shadow-2xl text-white ${bgcolor} justify-center items-center text-center`}
                        >
                            {message}
                        </div>:
                        <div
                            className={`fixed top-2 lg:top-32 right-8 mx-auto w-60 sm:w-96 lg:w-60 xl:w-96 h-20 pt-3.5  rounded-md shadow-2xl text-white ${bgcolor} justify-center items-center text-center`}
                        >
                            {message}
                        </div>
                    }
                    
                </div>
                :
                null
            }
        </>
    )
}
// 32
export default ReminderPopup
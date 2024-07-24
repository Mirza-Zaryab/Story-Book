import React, { useEffect, useState } from 'react';

const PopupAlert = ({ msg, bgcolor, width }) => {
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
                <div className='relative z-50'>
                    <div
                        className={`fixed top-5 left-0 right-0 mx-auto ${width} h-24 md:h-12 pt-3.5 rounded-md shadow-2xl text-white ${bgcolor} justify-center items-center text-center`}
                     >
                        {message}
                    </div>
                </div>
                :
                null
            }
        </>
    )
}

export default PopupAlert
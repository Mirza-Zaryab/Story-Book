import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../features/user';

const LoginPrompt = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)

    useEffect(() => {
        setTimeout(() => {
            dispatch(login({ ...user, status: false }))
        }, 5000)
    }, [user?.status])

    return (
        <>
            {user.status && user.message ?
                <div className='relative z-50'>
                    <div className='flex justify-center items-center absolute top-5 left-0 right-0 mx-auto w-80 h-12 rounded-md shadow-2xl text-slate-800 bg-[#fef4e5] opacity-80'>
                        {user.message}
                    </div>
                </div>
                :
                null
            }
        </>
    )
}

export default LoginPrompt
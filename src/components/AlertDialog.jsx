import React from 'react';
import { useDispatch } from 'react-redux';
import { updateChecked } from '../features/chaptersSlice';
import { updateCheckedQuestions } from '../features/questionsSlice';
import { FaExclamationTriangle } from 'react-icons/fa'

export const AlertDialog = ({ chapData, setOpen }) => {
    const dispatch = useDispatch();

    const handleCancel = () => {
        setOpen(false)
    }

    const handleConfirm = () => {
        if (chapData.index) {
            dispatch(updateChecked({ index: chapData.index, checked: chapData.checked }))
        }
        else if (chapData.id) {
            dispatch(updateCheckedQuestions({ id: chapData.id, checked: chapData.checked }))
        }
        setOpen(false)
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
                <h1 className='text-lg font-semibold mt-5 mb-7'>You have already answered the questions in this chapter. If you remove this chapter you will lose those answers. Do you want to continue?</h1>

                <div className='flex justify-end items-center space-x-2'>

                    <button
                        onClick={handleConfirm}
                        className="bg-teal-500 hover:bg-teal-700 px-4 py-2 text-white rounded-lg"
                    >
                        Yes
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

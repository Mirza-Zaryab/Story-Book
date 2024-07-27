import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/4.png';
import { useNavigate } from 'react-router-dom';

export const OurBooks = (props:any) => {
    const navigate = useNavigate();
    const { getPaymentStatus } = useContext(AuthContext);

    const books = [
        { id: 1, image: image1 },
        { id: 2, image: image2 },
        { id: 3, image: image3 },
        { id: 4, image: image4 }
    ]

    let url = "/checkout";

    const redirectPage = async () => {
        const token = localStorage.getItem('jwtToken');

        if (token) {
            const paymentStatus = await getPaymentStatus();
            console.log(paymentStatus);
            if (paymentStatus.status === true) {
                navigate('/dashboard');
            } else {
                navigate(url);
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='bg-teal-800 text-white p-14'>
            <div className='grid grid-cols-1 sm:grid-cols-2 mb-10'>
                <div>
                    <h1 className='text-4xl font-serif'>Our Books</h1>
                </div>
                <div>
                    <p className='text-xl font-serif w-full sm:w-4/6 mb-4'>
                        Everyone’s story is unique and there is no right or wrong way to answer customized life story questions.  Be true to yourself, and share your experiences authentically.
                    </p>

                    {props.show &&
                        <button onClick={redirectPage} className='px-5 py-3 font-semibold rounded-full bg-teal-500 hover:bg-teal-600'>
                            {props.books >0 ? "Return to book": "Get Started"}
                        </button>
                    }
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8'>
                {books.map((data: any) => (
                    <div key={data.id} className=''>
                        <img className='w-72 h-96 rounded-lg mx-auto' src={data.image} />
                    </div>
                ))}
            </div>
        </div>
    )
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import '../components/style.css';
import './stylebook.css';
import { FaEdit } from "react-icons/fa";

export default function BookList({ books, show, setBook, setView, tokenData }: any) {
  let navigate = useNavigate();
  const userId = localStorage.getItem("awsUserId")
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Current Books</h2>
        </div>

        {books?.length !== 0 ?
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 bookBorder">
            {books?.map((book: any) => (
              <div key={book?.bookId} className="group relative pb-4 px-2 pt-2 bookBorder">
                <div className='absolute top-2 right-2 z-50'>
                  <div onClick={() => { navigate('/book', { state: { bookId: book.bookId } }) }} data-toggle="tooltip" data-placement="top" title="Edit Book Cover" className='flex justify-center items-center w-8 h-8 cursor-pointer '>
                    <FaEdit size={24} className='edit-icon' />
                  </div>
                </div>
                <div onClick={() => { navigate(`/directory/${book.bookId}`) }} className="w-full h-96 rounded-lg overflow-hidden cursor-pointer">
                  <div className="containersm -mt-4">
                    <div className="booksm">
                      <div className="frontsm">
                        <div className="coversm" style={{ backgroundColor: book.book_color }}>
                          {
                            book?.frontCover ?
                              <img
                              style={{ width: '255px', height: '370px' }}
                              src={book?.frontCover}
                              alt={book.title}
                              className=""
                              /> :
                              <img
                                style={{ width: '255px', height: '370px' }}
                                src={`https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/bookcovers/${book.title}front${userId}.png`}
                                alt={book.title}
                                className=""
                              />

                          }
                          
                          
                        </div>
                      </div>
                      <div className="left-sidesm" style={{ backgroundColor: book.cover_template_id === 0 ? '#fff' : book.book_color }}>
                        <h2 style={{alignItems:"center"}}>
                          <span style={{fontSize:"12px", color:book.spine_color?book.spine_color:"black"}} className="font-semibold">{""/*book.title*/}</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='sm:w-72 px-16 pb-2'>
                  <div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      <a>
                        {book.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Author: {book.author}</p>
                  </div>
                </div>

                {book.bookType === 2 ?
                  <>
                    {book.coAuthors ?
                      <div className='flex justify-center'>
                        <a
                          data-tooltip-id="book-tooltip"
                          data-tooltip-html={`<div><ul>${book.coAuthors ? Array.from(new Set(book.coAuthors)).map((d: any) => `<li>&#8226; ${d}</li>`).join('') : "No Co-Author"}</ul></div>`}
                          data-tooltip-offset={0}
                          data-tooltip-float={true}
                          data-tooltip-delay-show={300}
                          data-tooltip-variant='warning'
                        >
                          <div className='flex items-center border border-teal-600 bg-teal-500 rounded-md h-10 w-72'>
                            <p className='px-1.5 text-xs text-white truncate w-72'>Co-Author: {book.coAuthors ? book.coAuthors.map((d: any, i: any) => `${d}${i < book.coAuthors.length - 1 ? ', ' : ""}`) : ""}</p>
                          </div>
                        </a>
                        <Tooltip
                          id="book-tooltip"
                        />
                      </div>
                      :
                      null
                    }
                  </>
                  :
                  null
                }
              </div>
            )).reverse()}
          </div>
          :
          show &&
          <div className='flex justify-center items-center h-96 w-full'>
            <h1 className='text-xl font-semibold text-[#779B9A]'>You do not have any books. Click on "New Project" to get started now.</h1>
          </div>
        }
      </div>
    </div>
  );
}

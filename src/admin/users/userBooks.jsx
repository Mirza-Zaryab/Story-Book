import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import "react-tooltip/dist/react-tooltip.css";
import Navbar from "../navbar";
import { IoBookSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import PopupAlert from "../../components/PopupAlert";
import { FaBookOpen } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Popup from "../popup";

const UserBooks = () => {
  const { state } = useLocation();
  const [books, setBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [showPopUp, setPopup] = useState(false);
  const [bookId, setBookId] = useState();

  const [bookExistancePopup, setBookExistancePopup] = useState(false);

  useEffect(() => {
    const  userId = localStorage.getItem("awsUserId")
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/book/getBookByUserId/${state.awsUserId}`,
    })
      .then((res) => {
        console.log("res.data.data.data----", res.data.data.data);
        setBooks(res.data.data.data);
        setShow(true);
      })
      .catch((err) => {
        setShow(true);
        console.log(err);
      });
  }, []);

  const deleteBook = (value, id) => {
    console.log(id);
    setPopup(value);
    setBookId(id);
  };

  const confirmDeleteBook = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/deleteBook`,
      data: { bookId },
    })
      .then((res) => {
        setBooks((prev) => prev.filter((user) => user.bookId != bookId));
        console.log("delete sucess----");
        setPopup(false);
      })
      .catch((err) => {
        console.log("err while delete user---", err);
      });
  };

  const previewBook = (bookId) => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/previewBook`,
      data: { bookId },
    })
      .then((res) => {
        console.log(res);

        const s3Link = res?.data?.pdfStoryUrl;

        fetch(s3Link, {
          method: "HEAD",
        })
          .then((response) => {
            if (response.ok) {
              window.open(res?.data?.pdfStoryUrl, res?.data?.pdfStoryUrl);
            } else {
              console.log("PDF file does not exist at the given S3 link.");
              setBookExistancePopup(true);
              setTimeout(() => {
                setBookExistancePopup(false);
              }, 2000);
            }
          })
          .catch((error) => {});
      })
      .catch((err) => {
        console.log("err while delete user---", err);
      });
  };

  return (
    <>
      <div className="ml-64 ">
        <Navbar name={"Users Books"} url={"/users"} />
      </div>
      <Tooltip id="my-tooltip" />
      <>
        {books.length > 0 ? (
          <div className="ml-64  mt-6 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 bookBorder">
            {books
              ?.map((book) => (
                <div
                  key={book?.bookId}
                  className="group pb-4 px-2 pt-2 bookBorder relative"
                >
                  <div className="w-full  h-96 rounded-lg overflow-hidden">
                    <div className="containersm -mt-4">
                      <div className="booksm">
                        <div className="frontsm">
                          <div
                            className="coversm "
                            style={{ backgroundColor: book.book_color }}
                          >
                            {book?.frontCover ? (
                              <img
                                style={{ width: "255px", height: "370px" }}
                                src={book?.frontCover}
                                alt={book.title}
                                className=""
                              />
                            ) : (
                              <img
                                style={{ width: "255px", height: "370px" }}
                                src={`https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/bookcovers/${book.title}front${state.awsUserId}.png`}
                                alt={book.title}
                                className=""
                              />
                            )}
                          </div>
                        </div>
                        <div
                          className="left-sidesm"
                          style={{
                            backgroundColor:
                              book.cover_template_id === 0
                                ? "#fff"
                                : book.book_color,
                          }}
                        >
                          <h2 style={{ alignItems: "center" }}>
                            <span
                              style={{
                                fontSize: "12px",
                                color: book.spine_color
                                  ? book.spine_color
                                  : "black",
                              }}
                              className="font-semibold"
                            >
                              {"" /*book.title*/}
                            </span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-16 pb-2"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <div className="top-2 right-2 z-50">
                        <button
                          style={{
                            marginLeft: "10px",
                          }}
                          onClick={() => previewBook(book?.bookId)}
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Preview Book"
                          data-tooltip-place="left"
                        >
                          <FaBookOpen fill={"#689290"} size={25} />
                        </button>
                        <button
                          className=" top-0 right-0 m-2 bg-transparent"
                          onClick={() => deleteBook(true, book?.bookId)}
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Delete Book"
                          data-tooltip-place="right"
                        >
                          <MdDeleteForever fill={"#689290"} size={25} />
                        </button>
                      </div>
                      <h3 className=" text-base font-semibold text-gray-900">
                        <a>{book.title}</a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Author: {book.author}
                      </p>
                    </div>
                  </div>

                  {book.bookType === 2 ? (
                    <>
                      {book.coAuthors ? (
                        <div className="flex justify-center">
                          <a
                            data-tooltip-id="book-tooltip"
                            data-tooltip-html={`<div><ul>${
                              book.coAuthors
                                ? Array.from(new Set(book.coAuthors))
                                    .map((d) => `<li>&#8226; ${d}</li>`)
                                    .join("")
                                : "No Co-Author"
                            }</ul></div>`}
                            data-tooltip-offset={0}
                            data-tooltip-float={true}
                            data-tooltip-delay-show={300}
                            data-tooltip-variant="warning"
                          >
                            <div className="flex items-center border border-teal-600 bg-teal-500 rounded-md h-10 w-72">
                              <p className="px-1.5 text-xs text-white truncate w-72">
                                Co-Author:{" "}
                                {book.coAuthors
                                  ? book.coAuthors.map(
                                      (d, i) =>
                                        `${d}${
                                          i < book.coAuthors.length - 1
                                            ? ", "
                                            : ""
                                        }`
                                    )
                                  : ""}
                              </p>
                            </div>
                          </a>
                          <Tooltip id="book-tooltip" />
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ))
              .reverse()}
          </div>
        ) : (
          show && (
            <div
              className="text-xl font-semibold flex justify-center items-center mt-20 ml-64"
              style={{
                fontSize: "30px",
                opacity: "0.5",
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <IoBookSharp size={32} fill="#33606a" /> <span>No Books</span>
            </div>
          )
        )}
      </>

      {showPopUp ? (
        <Popup
          closeIcon={() => deleteBook(false)}
          text={"Are you sure you want to delete this Book?"}
          confirmAction={() => confirmDeleteBook()}
          closeModal={() => deleteBook(false)}
        />
      ) : null}
      {bookExistancePopup ? <Popup text={"Book does not Exist."} /> : null}
    </>
  );
};

export default UserBooks;

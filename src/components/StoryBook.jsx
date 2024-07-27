import React, { useState, useEffect, useRef, useCallback } from "react";
import PageFlip from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import axios from "axios";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import "react-pdf/dist/esm/Page/TextLayer.css";
import JsFileDownloader from "js-file-downloader";
import "./style.css";
import jwtDecode from "jwt-decode";
import html2canvas from "html2canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const height = 870;

const Page = React.forwardRef(({ pageNumber, width }, ref) => {
  return (
    <div ref={ref}>
      <ReactPdfPage pageNumber={pageNumber} width={width} />
    </div>
  );
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StoryBook({ bookData, parentClick, onChangee }) {
  const bookCoverRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [bookurl, setBookUrl] = useState("");
  const [coverurl, setCoverUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [spineWidthInches, setSpineWidthInches] = useState("");
  const [showDownloadCoverPage, setShowDownloadCoverPage] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [response, setResponse] = useState();
  const [frontCover, setFrontCover] = useState("");
  const [backCover, setBackCover] = useState("");

  const pageFlipRef = useRef(null);
  const [customSpine, setCustomSpine] = useState(false);
  const [isOpne, setOpen] = useState(false);

  const [width, setWidth] = useState(580);
  useEffect(() => {
    const updateWidth = () => {
      const newWidth = window.innerWidth;
      if (newWidth >= 648) {
        setWidth(580);
      } else if (newWidth >= 560) {
        setWidth(500);
      } else if (newWidth >= 500) {
        setWidth(440);
      } else if (newWidth >= 460) {
        setWidth(400);
      } else if (newWidth >= 400) {
        setWidth(350);
      } else {
        setWidth(300);
      }
      console.log("current width--------", newWidth);
      // setWidth(newWidth);
    };

    window.addEventListener("resize", updateWidth);

    updateWidth();

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const toggleDownloadCoverPage = () => {
    setShowDownloadCoverPage((prevShow) => !prevShow);
  };

  const awsId = jwtDecode(localStorage.getItem("jwtToken"));
  const userId = localStorage.getItem("awsUserId");

  useEffect(() => {
    if (bookData?.title) {
      getBook();

      const frontImageUrl = `https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/bookcovers/${bookData?.title}front${userId}.png`;
      const backImageUrl = `https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/bookcovers/${bookData?.title}back${userId}.png`;

      async function fetchFrontImageAndConvert(frontImageUrl) {
        try {
          const response = await fetch(frontImageUrl, {
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          const blob = await response.blob();

          const reader = new FileReader();
          reader.onload = () => {
            const dataURL = reader.result;
            setFrontCover(dataURL);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Error fetching or converting image:", error);
        }
      }

      async function fetchBackImageAndConvert() {
        try {
          const response = await fetch(backImageUrl, {
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          const blob = await response.blob();

          const reader = new FileReader();
          reader.onload = () => {
            const dataURL = reader.result;
            setBackCover(dataURL);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Error fetching or converting image:", error);
        }
      }

      if (bookData.frontCover) {
        fetchFrontImageAndConvert(bookData.frontCover);
      } else {
        fetchFrontImageAndConvert(frontImageUrl);
      }
      fetchBackImageAndConvert();
    }
  }, [bookData?.title]);

  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const handleNext = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.pageFlip().turnToNextPage();
    }
  };

  const handlePrevious = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.pageFlip().turnToPrevPage();
    }
  };

  const getBook = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/file/url/${bookData?.title}${userId}.pdf`
      )
      .then((res) => {
        const timestamp = new Date().getTime();
        const url = `${res.data.fileUrl}?v=${timestamp}`;
        setBookUrl(url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCoverPdf = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/get/page_count/${bookData.bookId}`,
    })
      .then((res) => {
        console.log(res.data.page_count);
        axios({
          method: "post",
          url: `${process.env.REACT_APP_API_BASE_URL}/api/coverImage`,
          data: {
            page_count: res.data.page_count,
            bookName: bookData?.title,
            awsUserId: userId,
            spineWidth: spineWidthInches,
          },
        })
          .then((response) => {
            console.log("aksnkcsdacs", response);
            setResponse(response?.status);
            if (parentClick) {
              onChangee(response?.status);
            }

            setToggle(false);
          })
          .catch((error) => {
            setToggle(false);
          });
      })
      .catch((err) => {});
  };

  function onDocumentLoadSuccess({ numPages }) {
    setCustomSpine(numPages >= 100);
    setNumPages(numPages);
    const spineWidthInInches = calculateSpineWidthInInches(numPages);
    setSpineWidthInches(spineWidthInInches);
  }

  const calculateSpineWidthInInches = (numInteriorPages) => {
    if (numInteriorPages < 23) {
      return ".20";
    } else {
      const spineWidth = numInteriorPages / 444 + 0.06;

      return spineWidth.toFixed(3);
    }
  };

  const [img, setImg] = useState("");

  const mergeCoverPages = async () => {
    setToggle(true);
    const awsId = jwtDecode(localStorage.getItem("jwtToken"));
    setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById("cover-pages-container");

    html2canvas(
      element,
      { useCORS: true, allowTaint: true },
      { scale: 5 }
    ).then((canvas) => {
      canvas.toBlob(async (blob) => {
        setOpen(false);
        // Create FormData and append the Blob
        const formData = new FormData();
        formData.append("awsUserId", `final${userId}`);
        formData.append("bookName", bookData?.title);
        formData.append("image", blob, "image.png");

        // const url = URL.createObjectURL(blob);
        // setImg(url)
        // console.log("bolb------",blob)
        // setToggle(false);
        // return;

        try {
          await axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/upload/image`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              }
            )
            .then((res) => {
              getCoverPdf();
            })
            .catch((err) => {});
        } catch (error) {}
      });
    });
  };

  const generateBookCover = () => {
    toggleDownloadCoverPage();
    setToggle(true);

    setTimeout(() => {
      mergeCoverPages();
    }, 5000);
  };

  const generateBookCover1 = () => {
    toggleDownloadCoverPage();
    setToggle(true);

    setTimeout(() => {
      mergeCoverPages();
    }, 5000);
  };

  console.log("fkjvndfvnd", parentClick);

  useEffect(() => {
    if (parentClick) {
      generateBookCover();
    }
  }, [parentClick]);

  return (
    <div>
      {/* <button onClick={generateBookCover}>generateBookCover</button>
            <img src={img}/> */}
      {toggle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 8888,
          }}
        >
          <h1 className="text-xl font-bold text-teal-500 shadow-2xl bg-white p-10 rounded-md">
            Creating Book Cover...
          </h1>
        </div>
      )}
      <div>
        {showDownloadCoverPage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 7777,
            }}
            className="flex justify-center items-center h-full"
          >
            <div className=" bg-white shadow-2xl h-5/6 overflow-scroll w-auto px-5">
              <div className="relative">
                <button
                  onClick={toggleDownloadCoverPage}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  ref={bookCoverRef}
                  id="cover-pages-container"
                  className=" flex flex-row justify-center mt-5 mb-5"
                  style={
                    isOpne
                      ? {
                          transform: `scale(${3})`,
                          transformOrigin: "top left",
                        }
                      : {}
                  }
                >
                  <div id="back-page" style={{ width: 576, height: 864 }}>
                    <img style={{ height: 864 }} src={backCover} alt="" />
                  </div>
                  {/* bookData.template_id!=0 and  bookData.cover_template_id==3*/}
                  {/* 2nd for custom */}
                  {!(
                    bookData.template_id != 0 && bookData.cover_template_id == 3
                  ) ? (
                    <div
                      className={`flex flex-col justify-center ${
                        bookData.cover_template_id == 0 ? "ml-2" : "-ml-2"
                      }`}
                      style={{
                        width: `${spineWidthInches}in`,
                        backgroundColor:
                          bookData?.cover_template_id === 0
                            ? "white"
                            : bookData?.book_color,
                        height: 864,
                      }}
                    >
                      {!(
                        bookData.template_id != 0 &&
                        bookData.cover_template_id == 3
                      ) &&
                        bookData.title?.split("")?.map((d, index) => (
                          <span
                            key={index}
                            style={{ color: bookData?.spine_color }}
                            className="text-center font-semibold pl-3.5 mt-1 p-0 h-2 transform rotate-90 origin-right"
                          >
                            {"" /*d*/}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col justify-center`}
                      style={{
                        width: `${spineWidthInches}in`,
                        backgroundColor:
                          bookData?.cover_template_id === 0
                            ? "white"
                            : bookData?.book_color,
                        height: 864,
                      }}
                    >
                      {customSpine &&
                        bookData.title.split("").map((d, index) => (
                          <span
                            key={index}
                            style={{ color: bookData?.spine_color }}
                            className="text-center font-semibold p-0 mt-1 h-2 transform rotate-90 origin-right"
                          >
                            {"" /*d*/}
                          </span>
                        ))}
                    </div>
                  )}

                  <div id="front-page" style={{ width: 576, height: 864 }}>
                    <img style={{ height: 864 }} src={frontCover} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Document
        file={bookurl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="docPage"
      >
        <PageFlip
          ref={pageFlipRef}
          onFlip={onFlip}
          width={width}
          height={height}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              width={width}
              className=""
              pageNumber={index + 1}
            />
          ))}
        </PageFlip>
      </Document>

      <div className="mt-6">
        <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
          <div className="-mt-px w-0 flex-1 flex">
            <button
              disabled={currentPage === 0}
              onClick={handlePrevious}
              className={classNames(
                currentPage === 0
                  ? "text-gray-200 hover:cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700  hover:border-gray-300  hover:cursor-pointer",
                "border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium "
              )}
            >
              <ArrowNarrowLeftIcon
                className="mr-3 h-5 w-5 "
                aria-hidden="true"
              />
              Previous
            </button>
          </div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <button
              disabled={
                currentPage ===
                (numPages % 2 === 0 ? numPages - 2 : numPages - 1)
              }
              onClick={handleNext}
              className={classNames(
                currentPage ===
                  (numPages % 2 === 0 ? numPages - 2 : numPages - 1)
                  ? "text-gray-200 hover:cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700  hover:border-gray-300  hover:cursor-pointer",
                "border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium "
              )}
            >
              Next
              <ArrowNarrowRightIcon
                className="ml-3 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </div>

      {bookurl !== "" ? (
        <div className="flex justify-center items-center mt-10">
          <button
            onClick={generateBookCover}
            className={`bg-teal-600 text-white rounded-md px-3 py-2 w-48`}
          >
            Preview Book Cover
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default StoryBook;

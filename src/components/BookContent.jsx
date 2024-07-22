import { Fragment, useEffect, useCallback, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Quill from "quill";

import { Dialog, Transition } from "@headlessui/react";
import parse from "html-react-parser";

import AddButton from "./AddButton";
import AddPage from "./AddPage";
import API from "../utils/api";
import AppAlert from "./AppAlert";
import AppTextArea from "./AppTextArea";
import PageNumbers from "./PageNumbers";
import {
  setPageContent,
  updateStatus,
  setPages,
  setEditStory,
  setAddStory,
  setText,
} from "../features/bookFeatures";

import "./style.css";
import EditorModal from "./EditorModal";
import AppButton from "./AppButton";

import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import api from "../utils/api";
import { current } from "@reduxjs/toolkit";
import { useNavigate, useParams } from "react-router-dom";
import StoryBook from "./StoryBook";
import PopupAlert from "./PopupAlert";
import axios from "axios";
import { BsInfoCircle } from "react-icons/bs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BookContent({
  bookID,
  content,
  setContent,
  currentChapter,
  stories,
  bookData,
}) {
  const dispatch = useDispatch();
  const bookState = useSelector((state) => state.book.value);

  const navigate = useNavigate();
  const { bookId } = useParams();

  const [story1, setStory1] = useState("");
  const [story2, setStory2] = useState("");
  const [popup, setPopup] = useState(false);
  const [parentClick, setParentClick] = useState(false);

  const ref = useRef(null);

  const [title, setTitle] = useState({
    content: "",
    display: false,
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setStory1(stories[0]?.answer);
    setStory2(stories[1]?.answer);
  }, [stories[0]?.answer]);

  //current page is set to the first page when the chapter is selected.
  const getChapterPages = async (id) => {
    await API.getPages(id).then(async (res) => {
      dispatch(setPages(res.data.pages));
      handleCurrentPage(res.data.pages);
    });
  };
  //Get the page from the Database
  const handleCurrentPage = async (pages) => {
    // get page should return two pages
    await API.getPage(pages).then((res) => {
      //set page content sets an array with two pages
      dispatch(setPageContent(res.data));
      dispatch(updateStatus("loaded"));
    });
  };
  // used to hold the instance of quill
  const [quill, setQuill] = useState();
  const [open, setOpen] = useState(true);

  // this is used to update the rich editor wrapper
  const [updated, setUpdated] = useState(false);
  const cancelButtonRef = useRef(null);

  // Visibility is for the the alert modal when cancelling story input with text in the text box.
  const [visibility, setVisibility] = useState(false);

  // Tracks which pages the user has open. incremented by 1 to get second page.
  const [pageIndex, setPageIndex] = useState(0);

  // This will handle which page is clicked
  const [pageClicked, setPageClicked] = useState();

  // Content holds all pages for the chapter

  let pageA = content[pageIndex];
  let pageB = content[pageIndex + 1];

  const [pageAContent, setPageAContent] = useState(
    pageA ? pageA.stories.ops[0].insert : undefined
  );
  const [pageBContent, setPageBContent] = useState(
    pageB ? pageB.stories.ops[0].insert : undefined
  );

  // TODO: Need to look into doing this with a callback instead of a useEffect.
  useEffect(() => {
    if (pageA !== undefined) {
      setPageAContent(pageA.stories.ops[0].insert);
      document.getElementById("pageA").innerText = pageA.stories.ops[0].insert;
    }

    if (pageB !== undefined) {
      document.getElementById("pageB").innerText = pageB.stories.ops[0].insert;
      setPageBContent(pageB.stories.ops[0].insert);
    }
  }, [
    content,
    pageA,
    pageB,
    currentChapter,
    pageAContent,
    pageBContent,
    pageIndex,
  ]);

  useEffect(() => {
    setPageIndex(0);
  }, [currentChapter]);

  const showTextArea = (page) => {
    let token;

    if (bookState.editStory.show) {
      token = false;
    } else {
      token = !bookState.addStory.show;
    }
    dispatch(setAddStory({ title: title.content, show: token, page: page }));
    setUpdated(!updated);
  };

  const addNewStory = async () => {
    //content._id is the page ID
    await API.addStory(
      bookID,
      content[bookState.addStory.page]._id,
      bookState.text
    ).then((res) => {
      var token = [...bookState.pageContent[bookState.addStory.page].stories];
      var shuttle;
      token.splice(1, 0, res.data);

      if (bookState.addStory.page === 0) {
        if (pageB === undefined) {
          shuttle = { ...content[0], stories: token };
        } else {
          shuttle = [{ ...content[0], stories: token }, content[1]];
        }
      } else if (bookState.addStory.page === 1) {
        shuttle = [content[0], { ...content[1], stories: token }];
      }

      dispatch(setPageContent(shuttle));
      dispatch(updateStatus("loaded"));

      dispatch(setAddStory({ title: "", show: false, page: -1 }));
      dispatch(setText({ title: "", content: "" }));
    });
  };

  const handleStoryEdit = (story, page) => {
    dispatch(
      setEditStory({
        show: !bookState.editStory.show,
        id: story._id,
        page: page,
      })
    );
    dispatch(setText({ title: "", content: story.content }));
  };

  const editPageStory = async () => {
    await API.updateStory(
      content[bookState.editStory.page]._id,
      bookState.editStory.id,
      bookState.text.content
    ).then((res) => {
      var shuttle;

      if (bookState.editStory.page === 0) {
        if (pageB === undefined) {
          shuttle = { ...content[0], stories: res.data };
        } else {
          shuttle = [{ ...content[0], stories: res.data }, content[1]];
        }
      } else if (bookState.editStory.page === 1) {
        shuttle = [content[0], { ...content[1], stories: res.data }];
      }

      dispatch(setPageContent(shuttle));
      dispatch(updateStatus("loaded"));
      dispatch(setEditStory({ show: false, id: "", page: -1 }));
    });
  };

  const cancelAlert = () => {
    setVisibility(false);
  };

  const confirmAlert = () => {
    setVisibility(false);
    dispatch(setAddStory({ title: "", show: false, page: -1 }));
    dispatch(setText({ title: "", content: "" }));
    dispatch(setEditStory({ show: false, id: "", page: -1 }));
  };

  const alert = () => {
    if (bookState.text.content === "" || bookState.text.content === undefined) {
      setVisibility(true);
    }
  };

  const handleNewPage = async () => {
    let pages = [{ pageId: undefined }];
    await API.addPage(currentChapter.chapterId).then((res) => {
      dispatch(setPages(res.data.pages));
      pages = res.data.pages;
    });
    await API.getPage(pages).then((res) => {
      //set page content sets an array iwth two pages
      dispatch(setPageContent(res.data));
      dispatch(updateStatus("loaded"));
    });
  };

  const handlepageClick = async () => {
    navigate(`/directory/${bookId}`);
  };

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ];

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      //send-changes
      console.log("index => ", pageClicked + pageIndex);
      API.editPage(
        content[pageClicked + pageIndex]._id,
        quill.getContents()
      ).then((res) => {
        if (pageClicked === 0) {
          document.getElementById("pageA").innerText =
            res.data.stories.ops[0].insert;
          //setPageAContent(res.data.stories.ops[0].insert);
        } else {
          document.getElementById("pageB").innerText =
            res.data.stories.ops[0].insert;
          //setPageBContent(res.data.stories.ops[0].insert);
        }
      });

      // dispatch(setPageContent(quill.getContents().ops));
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  // populates the editor with content when page is clicked
  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;

      wrapper.innerText = "";

      const editor = document.createElement("div");
      // Add the current page stories to the page editor

      // if (pageClicked === 0) {
      //   editor.innerText = pageAContent;
      // } else {
      //   editor.innerText = pageBContent;
      // }
      if (pageClicked === 0) {
        editor.innerText = document.getElementById("pageA").innerText;
      } else {
        editor.innerText = document.getElementById("pageB").innerText;
      }

      wrapper.append(editor);

      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(q);
    },
    [pageClicked]
  );

  // updates the quill object when question is selected
  useEffect(() => {
    //api to update pagecontent
    // API.updatePage(content[0]._id, bookState.question).then((res) => {
    //   setPageAContent(res.data.stories.ops[0].insert);
    //   // showTextArea(0);
    // });
  }, [bookState.question]);

  // when save button is pressed save the current contents of the text editor
  const saveEditor = async () => {
    console.log(
      "content[pageClicked + pageIndex]._id => ",
      content[pageClicked + pageIndex]._id
    );
    await API.editPage(
      content[pageClicked + pageIndex]._id,
      quill.getContents()
    ).then((res) => {
      console.log("res", res.data);
      setContent(res.data);
      if (pageClicked === 0) {
        document.getElementById("pageA").innerText =
          res.data.stories.ops[0].insert;
        //setPageAContent(res.data.stories.ops[0].insert);
      } else {
        document.getElementById("pageB").innerText =
          res.data.stories.ops[0].insert;
        //setPageBContent(res.data.stories.ops[0].insert);
      }
    });
    showTextArea(bookState.addStory.page);
  };

  const printPDF = async () => {
    await API.printPDF(bookID).then(async (res) => {
      const pdfBlob = await pdfExporter.generatePdf(res.data);
      saveAs(pdfBlob, "quill-pdf.pdf");
    });
  };

  const getPageCount = async () => {
    setParentClick(true);
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/get/page_count/${bookId}`,
    })
      .then((res) => {
        if (res.data.page_count >= 32) {
          localStorage.setItem("pageCount", res.data.page_count);
        } else {
          setMsg("Your book should have minimum 32 pages for printing.");
          setTimeout(() => {
            setMsg("");
          }, 15000);
        }
      })
      .catch((err) => {
        setMsg(err);
      });
  };

  const handeUpdate = (status) => {
    let pageCountt = localStorage.getItem("pageCount");
    if (status === 200 && pageCountt >= 32) {
      navigate("/print", { state: bookData });
    }
  };

  return (
    <>
      {visibility ? (
        <AppAlert onCancel={confirmAlert} onConfirm={cancelAlert} />
      ) : null}
      {bookState.addStory.show ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={saveEditor}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg">
                    <div className="flex justify-end">
                      <div className="w-1/4 mt-10  mb-4 mr-16 border border-white rounded-md">
                        <AppButton
                          title="Questions"
                          onClick={() => console.log("View Questions")}
                        />
                      </div>
                      <div className="w-1/4 mt-10  mb-4 border border-white rounded-md">
                        <AppButton title="Save" onClick={saveEditor} />
                      </div>
                    </div>
                    <div className="editor-container" ref={wrapperRef}></div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
      <div className="bg-white page-container  shadow sm:rounded-lg ">
        <PopupAlert msg={msg} bgcolor="bg-[#ddc8c3]" width="w-1/2" />
        <div className="px-4 py-5 sm:px-2">
          <div className="flex justify-between -mb-1 ">
            <div
              className={classNames(
                bookState.addStory.page === 1 && bookState.addStory.show
                  ? "invisible"
                  : "visible",
                "add-Story-page-1 flex justify-center items-center mb-2"
              )}
            >
              <button
                onClick={getPageCount}
                className="text-white bg-teal-600 h-8 rounded-md px-3 py-1.5 text-xs sm:text-base w-28 sm:w-40"
              >
                Send to print
              </button>
              <span
                onClick={() => setPopup(true)}
                className="ml-4 cursor-pointer"
                data-toggle="tooltip"
                data-placement="top"
                title=""
              >
                <BsInfoCircle color="teal" />
              </span>
            </div>
            <div
              className={classNames(
                bookState.addStory.page === 0 && bookState.addStory.show
                  ? "invisible"
                  : "visible",
                "add-Story-page-2"
              )}
            >
              <AddButton onClick={() => handlepageClick(1)} />
            </div>
          </div>
          {/* Content goes here */}
          <div className="h-96">
            <StoryBook
              stories={stories}
              bookData={bookData}
              parentClick={parentClick}
              onChangee={(e) => {
                handeUpdate(e);
              }}
            />
          </div>
        </div>
      </div>

      {popup && (
        <div
          onClick={() => setPopup(false)}
          id="defaultModal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed bg-black bg-opacity-50 backdrop-blur-xs top-0 left-0 right-0  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-2xl max-h-full mx-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">Tips</h3>
                <button
                  onClick={() => setInfo(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                  data-modal-hide="defaultModal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <ul className="p-6 space-y-6 space-x-4 list-disc">
                <p className="text-base leading-relaxed text-gray-600 font-semibold ">
                  Tips for Send to Print Page
                </p>
                <li className="text-base leading-relaxed text-gray-500 ">
                  Hooray! You've completed your book! Before sending it for
                  printing or creating a PDF copy, be sure to utilize the
                  Grammarly feature embedded in the text editor. Suggested
                  changes will be highlighted in red. This will help you polish
                  up your content.
                </li>
                <li className="text-base leading-relaxed text-gray-500 ">
                  Take a good look at your book cover to catch any last-minute
                  changes.
                </li>
                <li className="text-base leading-relaxed text-gray-500 ">
                  Carefully review every page to ensure proper formatting and
                  photo placement.
                </li>
                <li className="text-base leading-relaxed text-gray-500 ">
                  Give yourself a big pat on the back for a job well done!
                  You've written a one-of-a-kind keepsake that will be cherished
                  for generations to come.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

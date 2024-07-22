import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import PopupAlert from "../../components/PopupAlert";
import Popup from "../popup";
const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQues, setNewQues] = useState("");
  const [popup, setPopup] = useState(false);
  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [msg, setMsg] = useState("");
  const { state } = useLocation();

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/getAllQuestions/${state.chapId}`,
    })
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [update]);

  const handleShowPop = () => {
    setPopup(!popup);
  };

  const handleAdd = () => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/createQuestion`,
      data: { name: newQues, chapterId: state.chapId },
    })
      .then((res) => {
        setNewQues("");
        setQuestions((prev) => [...prev, res.data.createQuestion]);
        setPopup(false);
        setMsg("Question Added Successfully!");
        setTimeout(() => {
          setMsg("");
        }, 600);
      })
      .catch((err) => {
        setMsg("Please Try Again question not added!");
        setTimeout(() => {
          setMsg("");
        }, 600);
      });
  };

  const Question = ({ question, i }) => {
    const [name, setName] = useState(question?.questionDesc); //questionId
    const [showPopUp, setPopupVisibility] = useState(false);
    const [questionId, setQuestionId] = useState("");

    const popUpAppearance = (value) => {
      setPopupVisibility(value);
      setQuestionId(question.questionId);
    };

    const handleDelete = () => {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/deleteQuestion/${questionId}`,
      })
        .then((res) => {
          setQuestions((prev) =>
            prev.filter((prevQue) => prevQue.questionId != questionId)
          );
          setPopupVisibility(false);
          setMsg("Question Deleted Successfully!");
          setTimeout(() => {
            setMsg("");
          }, 600);
        })
        .catch((err) => {
          setMsg("Please try again question not deleted!");
          setTimeout(() => {
            setMsg("");
          }, 600);
        });
    };

    const handleUpdate = () => {
      setQuestions((prevQues) =>
        prevQues.map((que) =>
          que.questionId == question.questionId
            ? { ...que, questionDesc: name }
            : que
        )
      );
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/updateQuestion`,
        data: {
          chapterId: state.chapId,
          questionId: question.questionId,
          name,
        },
      })
        .then((res) => {
          setMsg("Question Updated Successfully!");
          setTimeout(() => {
            setMsg("");
          }, 600);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return (
      <div style={styles.todoItem}>
        <span className="mx-1">{i}</span>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          className="bg-teal-600"
          style={styles.saveButton}
        >
          Save
        </button>
        <button
          onClick={() => popUpAppearance(true)}
          className="bg-teal-600"
          style={styles.deleteButton}
        >
          Delete
        </button>
        {showPopUp ? (
          <Popup
            closeIcon={() => popUpAppearance(false)}
            text={"Are you sure you want to delete this Question?"}
            confirmAction={() => handleDelete()}
            closeModal={() => popUpAppearance(false)}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="ml-64 h-screen">
      <Navbar
        name={state.chapName}
        show={"Question"}
        onClick={handleShowPop}
        url={"/chapques"}
      />
      <PopupAlert msg={msg} bgcolor={"bg-[#6bbe9e]"} width="w-1/3" />
      {questions?.map((question, i) => (
        <Question question={question} key={i} i={i + 1} />
      ))}

      {popup && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            //onClick={() => setPopup(false)}
          ></div>
          <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="items-center px-4 py-8 "
          >
            <div className="rz-80 relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
              <div className="relative bg-white">
                <button
                  onClick={() => setPopup(false)}
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="py-6 px-6 lg:px-8">
                  <h3 className="mb-4 text-xl flex items-center justify-center font-medium text-gray-900 ">
                    <span>Add New Question</span>
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        New Question<span className="text-red-400"></span>
                      </label>
                      <textarea
                        value={newQues}
                        onChange={(e) => setNewQues(e.target.value)}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="New Question"
                        rows={5}
                      />
                    </div>

                    <button
                      disabled={!newQues}
                      onClick={handleAdd}
                      style={{ marginTop: "20px" }}
                      className={`w-full text-white ${
                        !newQues ? "bg-gray-500" : "bg-[#53a787]"
                      }  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  todoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginRight: "10px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "3px",
  },
  saveButton: {
    //backgroundColor: 'bg-teal-600',
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "3px",
    cursor: "pointer",
    marginRight: "2px",
  },
  deleteButton: {
    // backgroundColor: '#f44336',
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "3px",
    cursor: "pointer",
  },
};
export default Questions;

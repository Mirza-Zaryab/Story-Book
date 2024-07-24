import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import axios from "axios";
import PopupAlert from "../../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import Popup from "../popup";

const Gifts = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [showPopUp, setPopupVisibility] = useState(false);
  const [userId, setUserId] = useState("");

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverEmail: "",
    senderName: "MSV",
    senderEmail: "admin@mystoryvault.co",
    amount: "139",
    isEmailToSender: false,
    isEmailToReceiver: true,
  });
  const [popup, setPopup] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/getGifts`,
    })
      .then((res) => {
        setVouchers(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }, []);

  const popUpAppearance = (value, id) => {
    setPopupVisibility(value);
    setUserId(id);
  };

  const handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/deleteGift/${userId}`,
    })
      .then((res) => {
        setVouchers((prev) =>
          prev.filter((voucher) => voucher.voucher_id != userId)
        );
        setPopupVisibility(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function generateVoucher(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let voucher = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucher += characters.charAt(randomIndex);
    }
    return voucher;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setPopup(false);

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/create/voucher`,
      data: {
        to_name: formData.receiverName,
        to_email: formData.receiverEmail,
        from_name: formData.senderName,
        from_email: formData.senderEmail,
        amount: formData.amount,
        voucher_code: generateVoucher(7),
        status: 0,
      },
    })
      .then(async (res) => {
        let obj = {
          voucher_id: res.data.data.voucher_id,
          voucher_code: res.data.data.voucher_code,
          amount: res.data.data.amount,
          from_email: res.data.data.from_email,
          to_email: res.data.data.to_email,
          status: res.data.data.status,
        };
        setVouchers((prev) => [...prev, obj]);
        // setFormData((prevData) => ({
        //     ...prevData,
        //     receiverName: "",receiverEmail: "",
        // }));
        setMsg("Gift Card Sent");
        setTimeout(() => {
          setMsg("");
        }, 600);
        const stateData = {
          formData,
          v_code: res.data.data.voucher_code,
        };
        navigate("/giftVoucher", { state: stateData });
      })
      .catch((err) => {
        setMsg("Error Gift Card not created");
        setTimeout(() => {
          setMsg("");
        }, 600);
      });
  };

  return (
    <div className="p-4 ml-64 h-screen">
      <Navbar name={"Gift Cards"} />
      <PopupAlert msg={msg} bgcolor={"bg-[#6bbe9e]"} width="w-1/2" />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-start my-2">
          <p
            onClick={() => setPopup(true)}
            className=" cursor-pointer mr-10 px-10 py-2 rounded-md text-white bg-[#6bbe9e]"
          >
            New
          </p>
        </div> 
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              
              <th scope="col" className="px-6 py-3">
                Voucher Id
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>

              <th scope="col" className="px-6 py-3">
                From
              </th>
              <th scope="col" className="px-6 py-3">
                To
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {vouchers
              .map((voucher, i) => (
                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                  {/* <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        Apple 
                                    </th> */}
                  <td className="px-6 py-4">{voucher?.voucher_code}</td>
                  <td className="px-6 py-4">{voucher?.amount}</td>

                  <td className="px-6 py-4">{voucher?.from_email}</td>
                  <td className="px-6 py-4">{voucher?.to_email}</td>
                  <td className="px-6 py-4">
                    {voucher?.status ? "Redeemed" : "Not Redeemed"}
                  </td>
                  <td className="px-6 py-4 ">
                    <a
                      onClick={() => popUpAppearance(true, voucher.voucher_id)}
                      className="cursor-pointer font-medium text-[#6bbe9e] hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </table>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => setPopup(false)}
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
                    <span className="font-serif">Create Gift Card</span>
                  </h3>
                  <form className="space-y-2">
                    <p className="font-semibold text-lg">To:</p>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Name<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.receiverName}
                        onChange={handleChange}
                        type="text"
                        name="receiverName"
                        id="receiverName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Email<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.receiverEmail}
                        onChange={handleChange}
                        type="email"
                        name="receiverEmail"
                        id="receiverEmail"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name@gmail.com"
                        required
                      />
                    </div>
                    <button
                      onClick={handleCreate}
                      type="submit"
                      style={{ marginTop: "20px" }}
                      className={`w-full text-white ${
                        false ? "bg-gray-500" : "bg-[#53a787]"
                      }  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopUp ? (
        <Popup
          closeIcon={() => popUpAppearance(false)}
          text={"Are you sure you want to delete this Voucher?"}
          confirmAction={() => handleDelete()}
          closeModal={() => popUpAppearance(false)}
        />
      ) : null}
    </div>
  );
};

export default Gifts;

import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import axios from "axios";
import PopupAlert from "../../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import Popup from "../popup";

const PromoCode = () => {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [showPopUp, setPopupVisibility] = useState(false);
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    promo_code: "",
    promo_value: "",
    valid_from: "",
    valid_till: "",
  });
  const [popup, setPopup] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/getPromo`,
    })
      .then((res) => {
        setPromos(res.data);
        console.log(res.data);
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
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/deletePromo/${userId}`,
    })
      .then((res) => {
        setPromos((prev) => prev.filter((promo) => promo.promo_id != userId));
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setPopup(false);

    console.log("formData------", formData);

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/createPromo`,
      data: formData,
    })
      .then(async (res) => {
        let obj = { ...formData };
        obj.promo_id = res.data.promo_id;
        setPromos((prev) => [...prev, obj]);
        setMsg("Promo created successfully!");
        setTimeout(() => {
          setMsg("");
        }, 600);
        setFormData((prevData) => ({
          ...prevData,
          promo_code: "",
          promo_value: "",
          valid_from: "",
          valid_till: "",
        }));
      })
      .catch((err) => {
        setMsg("Error promo code not created");
        setTimeout(() => {
          setMsg("");
        }, 600);
      });
  };

  return (
    <div className="p-4 ml-64 h-screen">
      <Navbar name={"Promotion Voucher"} />
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
        {/* <div className="pb-4 bg-white ">
                    <label for="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="table-search" className="block pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search for items" />
                    </div>
                </div> */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Promo Code
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>

              <th scope="col" className="px-6 py-3">
                Valid From
              </th>
              <th scope="col" className="px-6 py-3">
                Valid Till
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {promos
              ?.map((promo, i) => (
                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{promo?.promo_code}</td>
                  <td className="px-6 py-4">{promo?.promo_value}</td>

                  <td className="px-6 py-4">{promo?.valid_from}</td>
                  <td className="px-6 py-4">{promo?.valid_till}</td>
                  <td className="px-6 py-4 ">
                    <a
                      onClick={() => popUpAppearance(true, promo.promo_id)}
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
                    <span className="font-serif">Create Promo</span>
                  </h3>
                  <form className="space-y-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Promo Code<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.promo_code}
                        onChange={handleChange}
                        type="text"
                        name="promo_code"
                        id="promo_code"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Promo Code"
                        required
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Value<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.promo_value}
                        onChange={handleChange}
                        type="text"
                        name="promo_value"
                        id="promo_value"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Value"
                        required
                      />
                    </div>

                    <div className="">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Value From<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.valid_from}
                        onChange={handleChange}
                        type="date"
                        name="valid_from"
                        id="valid_from"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Value"
                        required
                      />
                    </div>

                    <div className="">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Value Till<span className="text-red-400"></span>
                      </label>
                      <input
                        value={formData.valid_till}
                        onChange={handleChange}
                        type="date"
                        name="valid_till"
                        id="valid_till"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Value"
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
          text={"Are you sure you want to delete this Promo Code?"}
          confirmAction={() => handleDelete()}
          closeModal={() => popUpAppearance(false)}
        />
      ) : null}
    </div>
  );
};

export default PromoCode;

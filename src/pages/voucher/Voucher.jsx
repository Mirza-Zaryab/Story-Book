import NavBar from "../../components/NavBar";
import MSVLogo from "../../assets/MSV logo balck_teal-2.svg";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";

import html2canvas from "html2canvas";
import axios from "axios";
import AdminNavbar from "../../admin/navbar";

export default function Voucher({ admin }) {
  const { state } = useLocation();
  const voucherRef = useRef();

  useEffect(() => {
    html2canvas(voucherRef.current, { backgroundColor: "#dad9d5" }).then(
      (canvas) => {
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("voucher_code", state.v_code);
          formData.append("image", blob, "image.png");

          await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/upload/voucher`,
            {
              method: "POST",
              body: formData,
            }
          ).then(() => {
            fetch(
              `${process.env.REACT_APP_API_BASE_URL}/api/upload/pdfVoucher`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ voucher_code: state.v_code }),
              }
            ).then(() => {
              sendEmail();
            });
          });
        });
      }
    );
  }, []);

  const sendEmail = async () => {
    let data = {
      to_email: state?.formData.receiverEmail,
      from_email: state?.formData.senderEmail,
      to_check: state?.formData.isEmailToReceiver,
      from_check: state?.formData.isEmailToSender,
      amount: parseInt(state?.formData.amount),
      voucher_code: state?.v_code,
    };
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/email/voucher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <div className="bg-gray-100 h-full">
        <div className="ml-64 h-screen">
          <div>
            {admin ? (
              <AdminNavbar name="Gift Card" url={"/giftcards"} />
            ) : (
              <NavBar />
            )}
          </div>

          <div className={`flex-1 p-8 ${admin ? "pt-8" : "pt-48"}`}>
            <div>
              <div>
                <div className="pt-12 mt-12">
                  <form
                    className="p-8 shadow-md mx-auto max-w-3xl"
                    style={{
                      backgroundColor: "#dad9d5",
                      boxShadow: "unset",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                    ref={voucherRef}
                  >
                    <div className="flex items-center justify-between h-44">
                      <div className="w-1/2 -mt-24 -ml-6">
                        <img
                          src={MSVLogo}
                          alt="Gift Image"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="mb-auto">
                        <div className="text-center">
                          <h2 className="text-2xl font-sans  text-end tracking-widest font-semibold">
                            GIFT
                          </h2>
                        </div>
                        <div className="text-center">
                          <h2 className="text-2xl font-sans text-end tracking-widest font-semibold">
                            VOUCHER
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-4 -mt-10">
                      <div className="w-full md:w-1/2 px-4 mb-4 flex items-center ">
                        <label
                          htmlFor="field1"
                          className="block text-sm tracking-widest   font-bold text-black mr-3"
                        >
                          TO:
                        </label>
                        <div className="w-full px-3 py-2 border-none bg-white">
                          {state.formData.receiverName}
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 px-4 mb-4 flex items-center ">
                        <label
                          htmlFor="field2"
                          className="block text-sm tracking-widest   font-bold text-black mr-3"
                        >
                          FROM:
                        </label>
                        <div className="w-full px-3 py-2 border-none bg-white">
                          {state.formData.senderName}
                        </div>
                      </div>

                      <div className="w-full md:w-full px-4 mb-4 flex items-center mt-2">
                        <label
                          htmlFor="field3"
                          className="block text-sm tracking-widest   font-bold text-black "
                        >
                          FOR:
                        </label>
                        <div className="w-full px-3 tracking-widest text-lg text-center py-2 border-none bg-white">
                          ONE MY STORY VAULT CUSTOM PRINTED BOOK AND PDF
                        </div>
                      </div>
                      <div></div>
                      <div className="w-full md:w-1/2 px-4 mb-4 flex items-center mt-2">
                        <label
                          htmlFor="field4"
                          className=" text-sm tracking-widest w-44    font-bold text-black "
                        >
                          VALID UNTIL:
                        </label>
                        <div className="w-full px-3 py-2 border-none bg-white">
                          NO EXPIRATION
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 px-4 mb-4 flex items-center mt-2">
                        <div className="flex w-full">
                          <label
                            htmlFor="field5"
                            className=" text-sm tracking-widest  w-48 mt-2     font-bold text-black   "
                          >
                            VOUCHER NO:
                          </label>
                          <div className="w-full px-3 py-2 border-none bg-white">
                            {state.v_code}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex text-center justify-center">
                      <p
                        className=" font-bold text-4xl mt-3 tracking-widest uppercase"
                        style={{ color: "#1b5360" }}
                      >
                        www.mystoryvault.co
                      </p>
                    </div>
                  </form>
                </div>

                <div className="flex justify-center items-center mt-10">
                  <ReactToPrint
                    trigger={() => (
                      <button className="bg-[#9fc8b8] text-white font-bold py-2 px-4 rounded">
                        Print
                      </button>
                    )}
                    content={() => voucherRef.current}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {admin ? (
          <div className="ml-64">
            <Footer />
          </div>
        ) : (
          <Footer />
        )}
      </div>
    </>
  );
}

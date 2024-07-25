import React, { useState, useEffect } from "react";
import SideBarNav from "../../components/SideBarNav";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import jwtDecode from "jwt-decode";
import PopupAlert from "../../components/PopupAlert";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { FaCopy, FaCloudDownloadAlt } from "react-icons/fa";
import JsFileDownloader from "js-file-downloader";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

export default function PrintBook() {
  const userDetails = jwtDecode(localStorage.getItem("jwtToken"));
  const userId = localStorage.getItem("awsUserId");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [service, setService] = useState(null);
  const [shippingServices, setShippingServices] = useState([]);
  const [country, setCountry] = useState("US");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: userDetails[`cognito:username`] || userDetails.name,
    street: "",
    city: "",
    phone_number: "",
    quantity: "1",
    email: userDetails.email,
    state_code: "",
    country_code: "US",
    postcode: "",
    shipping_options: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [freeBookStatus, setFreeBookStatus] = useState(null);
  const [cost, setCost] = useState();
  const [clientSecret, setClientSecret] = React.useState("");
  const [bookPages, setBookPages] = React.useState(0);
  const [selectedShipping, setSelectedShipping] = React.useState({});
  const [coverUrl, setCoverUrl] = React.useState("");
  const [bookUrl, setBookUrl] = React.useState("");
  const [voucherCode, setVoucherCode] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [discountPrice, setDiscountPrice] = React.useState(0);
  const [discount, setDiscount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState("");
  const [clickedIcons, setClickedIcons] = useState({
    copyCover: false,
    copyInterior: false,
    downloadCover: false,
    downloadInterior: false,
  });
  const [isApplied, setIsApplied] = React.useState(false);
  const [actualCharges, setActualCharges] = React.useState(0);
  const [giftBtnDisable, setGiftBtnDisable] = useState(false);

  const { state } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    getPageCount();
    getAuthToken();
    getUserStatus();

    setStates(State.getStatesOfCountry("US"));
    // setCoverUrl(`https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/lulu/${state.title}${userDetails.sub}luluBookCover.pdf`);
    // setBookUrl(`https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/${process.env.REACT_APP_S3_BUCKET}/lulu/${state.title}${userDetails.sub}luluStoryBook.pdf`);
  }, [step]);

  useEffect(() => {
    if (shippingServices) {
      setSelectedShipping(
        shippingServices.find(
          (data) => data.level === formData.shipping_options
        )
      );
    }
  }, [formData.shipping_options]);

  useEffect(() => {
    setTimeout(() => {
      setError("");
      setMsg("");
      setMessage("");
      setPromoApplied("");
    }, 5000);
  }, [error, msg, message, promoApplied]);

  useEffect(() => {
    const shippingOptionsDisable =
      formData.city &&
      formData.country_code &&
      formData.postcode.length >= 5 &&
      formData.state_code &&
      formData.street &&
      formData.quantity;
    if (shippingOptionsDisable) {
      getShippingOptions();
    }
  }, [
    formData.city,
    formData.country_code,
    formData.postcode,
    formData.state_code,
    formData.street,
    formData.quantity,
  ]);

  // const countryCode = Country.getAllCountries();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStates = (e) => {
    const stateCode = e.target.value.split("-")[0];
    setFormData((prevState) => ({ ...prevState, [e.target.name]: stateCode }));
    if ([e.target.name] == "state_code") {
      setCities(City.getCitiesOfState(country, stateCode));
    }
  };

  const getAuthToken = async () => {
    const url = `${process.env.REACT_APP_LULU_API_BASE_URL}/auth/realms/glasstree/protocol/openid-connect/token`;
    const clientId = process.env.REACT_APP_LULU_CLIENT_KEY;
    const clientSecret = process.env.REACT_APP_LULU_CLIENT_SECRET;

    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    };

    const body = "grant_type=client_credentials";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data = await response.json();
      localStorage.setItem("print_token", data.access_token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getPageCount = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/get/page_count/${state.bookId}`,
    })
      .then((res) => {
        console.log(res);
        setBookPages(res.data.page_count);
      })
      .catch((err) => {});
  };

  const getShippingOptions = async () => {
    const data = {
      currency: "USD",
      line_items: [
        {
          page_count: bookPages,
          pod_package_id: "0600X0900FCPRECW080CW444GXX",
          quantity: formData.quantity,
        },
      ],
      shipping_address: {
        city: formData.city,
        country: formData.country_code,
        postcode: formData.postcode,
        state_code: formData.state_code,
        street1: formData.street,
      },
    };

    await axios({
      method: "POST",
      url: "https://api.lulu.com/shipping-options/",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("print_token"),
      },
      data: data,
    })
      .then((res) => {
        console.log("shipping services---", res);
        const freeService = res.data.find(
          (d) => d.carrier_service_name == "UPS Mail Innovation"
        );
        setShippingServices(res.data);
        if (freeService) {
          setFormData((prevState) => ({
            ...prevState,
            shipping_options: freeService.level,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserStatus = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/get/free_book/${userId}`,
    })
      .then((res) => {
        console.log(res);
        setFreeBookStatus(res.data.free_book);
      })
      .catch((err) => {});
  };

  const getCost = async () => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_BASE_URL}/print-charges-calculation`,
      data: {
        awsUserId: userId,
        bookId: state.bookId,
        quantity: formData.quantity,
        shipping_charges:
          formData.shipping_options === "MAIL"
            ? 0
            : selectedShipping?.cost_excl_tax,
      },
    })
      .then((res) => {
        console.log(res);
        setCost(res.data.total_amount);
        setDiscountPrice(res.data.discounted_amount);
        setActualCharges(res.data.user_charges);
        stepForward();
      })
      .catch((err) => {});
  };

  const getDiscount = async () => {
    if (discountPrice < 139) {
      setMessage("Gift Voucher can only apply on amount $139 or more");
    } else {
      try {
        await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_BASE_URL}/print-charges-calculation`,
          data: {
            awsUserId: userId,
            bookId: state.bookId,
            quantity: formData.quantity,
            shipping_charges:
              formData.shipping_options === "MAIL"
                ? 0
                : selectedShipping?.cost_excl_tax,
            voucher_code: voucherCode,
            amount: discountPrice,
          },
        }).then((res) => {
          setGiftBtnDisable(true);
          console.log(res);
          setDiscount(res.data.discount);
          setDiscountPrice(res.data.discounted_amount);
          setCost(res.data.total_amount);
          setMessage("Voucher code has been applied successfully.");
        });
      } catch (err) {
        setMessage(err.response.data.message);
      }
    }
  };

  const getPromoDiscount = async () => {
    try {
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_BASE_URL}/api/promocalculation`,
        data: {
          awsUserId: userId,
          promo_code: promoCode,
          total_price: discountPrice,
        },
      }).then((res) => {
        console.log(res);
        setDiscountPrice(res.data.total_cost);
        setCost(res.data.total_cost);
        setIsApplied(true);
        setPromoApplied("Promo code has been applied successfully.");
      });
    } catch (err) {
      setPromoApplied(err.response.data.message);
    }
  };

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/checkout/stripePayment`,
        { amount: discountPrice }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  };

  const stepForward = async () => {
    if (discountPrice === 0 && step === 2) {
      let awsUserId = localStorage.getItem("awsUserId");
      let bookName = state.title;
      let body = {
        awsUserId,
        bookName,
      };

      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/api/upload/luluCover`,
          body
        )
        .then((res) => {
          setCoverUrl(res?.data?.coverUrl);
          setBookUrl(res?.data?.storyUrl);
          createPrintJob(res?.data?.coverUrl, res?.data?.storyUrl);
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      setStep(step + 1);
    }
  };

  const stepBack = () => {
    if (step !== 1) {
      setStep(step - 1);
    }
  };

  const createPrintJob = async (cover, book) => {
    const requestBody = {
      contact_email: formData.email,
      line_items: [
        {
          external_id: "item-reference-1",
          printable_normalization: {
            cover: {
              source_url: cover,
            },
            interior: {
              source_url: book,
            },
            pod_package_id: "0600X0900FCPRECW080CW444GXX",
          },
          quantity: formData.quantity,
          title: state.title,
        },
      ],
      shipping_address: {
        city: formData.city,
        country_code: formData.country_code,
        name: formData.name,
        phone_number: formData.phone_number,
        postcode: formData.postcode,
        state_code: formData.state_code,
        street1: formData.street,
      },
      shipping_level: formData.shipping_options,
    };

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_LULU_API_BASE_URL}/print-jobs/`,
      headers: {
        // 'Cache-control': 'no-cache',
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("print_token")}`,
      },
      data: requestBody,
    })
      .then((response) => {
        console.log(response.data);
        setOrderDetails(response.data);

        const data = {
          line_items: [
            {
              page_count: bookPages,
              pod_package_id: "0600X0900FCPRECW080CW444GXX",
              quantity: formData.quantity,
            },
          ],
          shipping_address: {
            city: formData.city,
            country_code: formData.country_code,
            postcode: formData.postcode,
            state_code: formData.state_code,
            street1: formData.street,
            phone_number: formData.phone_number,
          },
          shipping_level: formData.shipping_options,
        };

        axios({
          method: "POST",
          url: `${process.env.REACT_APP_LULU_API_BASE_URL}/print-job-cost-calculations/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("print_token")}`,
          },
          data: data,
        })
          .then((res) => {
            console.log(res);
            setOrderId(response.data.id);
            const data = {
              bookId: state.bookId,
              phone: formData.phone_number,
              street: formData.street,
              city: formData.city,
              state_code: formData.state_code,
              country_code: formData.country_code,
              postcode: formData.postcode,
              quantity: formData.quantity,
              awsUserId: userId,
              orderId: response.data.id,
              lulu_printCharge: res.data.total_cost_incl_tax,
              user_printCharge: cost || 0,
              bookCoverUrl: cover,
              storyBookUrl: book,
            };

            axios({
              method: "post",
              url: `${process.env.REACT_APP_API_BASE_URL}/api/printBook`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
              data: data,
            })
              .then((res) => {
                console.log(res);
                if (discountPrice === 0 && step === 2) {
                  setStep(step + 2);
                } else {
                  setStep(step + 1);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {});
  };

  const downloadPdfUrl = async (url) => {
    new JsFileDownloader({
      url: url,
    })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  const copyBookCover = () => {
    copyTextToClipboard(coverUrl);
    setClickedIcons((prevState) => ({
      ...prevState,
      copyCover: true,
    }));

    setTimeout(() => {
      setClickedIcons((prevState) => ({
        ...prevState,
        copyCover: false,
      }));
    }, 3000);
  };

  // Function to handle copy for book interior
  const copyBookInterior = () => {
    copyTextToClipboard(bookUrl);
    setClickedIcons((prevState) => ({
      ...prevState,
      copyInterior: true,
    }));

    // Reset the clicked state after a certain time
    setTimeout(() => {
      setClickedIcons((prevState) => ({
        ...prevState,
        copyInterior: false,
      }));
    }, 3000);
  };

  const handleDownloadCover = () => {
    setClickedIcons((prevState) => ({
      ...prevState,
      downloadCover: true,
    }));
    downloadPdfUrl(coverUrl);
    setTimeout(() => {
      setClickedIcons((prevState) => ({
        ...prevState,
        downloadCover: false,
      }));
    }, 3000);
  };

  // Function to handle download for book interior
  const handleDownloadInterior = () => {
    setClickedIcons((prevState) => ({
      ...prevState,
      downloadInterior: true,
    }));
    downloadPdfUrl(bookUrl);
    setTimeout(() => {
      setClickedIcons((prevState) => ({
        ...prevState,
        downloadInterior: false,
      }));
    }, 3000);
  };

  const disabled = !(
    formData.city &&
    formData.country_code &&
    formData.phone_number?.length >= 10 &&
    formData.postcode.length >= 5 &&
    formData.state_code &&
    formData.street &&
    formData.quantity &&
    formData.shipping_options
  );
  const shippingOptionsDisable = !(
    formData.city &&
    formData.country_code &&
    formData.postcode.length >= 5 &&
    formData.state_code &&
    formData.street &&
    formData.quantity
  );
  const [phoneNumber, setPhoneNumber] = useState("+1");

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;
    const formattedPhoneNumber = inputValue.replace(/\D/g, "").slice(0, 11);
    setPhoneNumber(
      formattedPhoneNumber.replace(
        /^(\d{1})?(\d{3})?(\d{3})?(\d{4})?/,
        (_, country, area, first, second) => {
          let formattedNumber = "+";
          if (country) formattedNumber += country + " ";
          if (area) formattedNumber += area + "-";
          if (first) formattedNumber += first + "-";
          if (second) formattedNumber += second;
          return formattedNumber;
        }
      )
    );
    setFormData({
      ...formData,
      phone_number: formattedPhoneNumber,
    });
    console.log(formData.phone_number);
  };

  const CheckoutForm = ({ stepBack }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      setIsProcessing(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (paymentIntent) {
        let awsUserId = localStorage.getItem("awsUserId");
        let bookName = state.title;
        let body = {
          awsUserId,
          bookName,
        };

        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/api/upload/luluCover`,
            body
          )
          .then((res) => {
            setCoverUrl(res?.data?.coverUrl);
            setBookUrl(res?.data?.storyUrl);
            createPrintJob(res?.data?.coverUrl, res?.data?.storyUrl);
          })
          .catch((err) => {
            console.log("error", err);
          });
      }

      console.log(paymentIntent);

      if (error) {
        console.log(error.message);
        setMsg(error.message);
      }

      setIsProcessing(false);
    };

    return (
      <>
        <div className="w-full h-full">
          <div
            style={{ minHeight: "260px" }}
            className="w-1/2 bg-white p-4 rounded-lg mx-auto my-28"
          >
            <PaymentElement />
          </div>
          <div className="flex justify-end space-x-5 mt-10">
            <button
              onClick={stepBack}
              className="bg-[#DDC5BF] text-white font-bold py-2 px-4 rounded-lg"
            >
              Back
            </button>

            <button
              className={`bg-[#124E5B] cursor-pointer text-white  font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
              onClick={(e) => {
                handleSubmit(e);
              }}
              type="button"
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <PopupAlert msg={msg} bgcolor="bg-red-600" width="w-96" />
      <div className="h-full flex">
        <SideBarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="w-full min-h-screen bg-[#F3F4F6] p-6">
          <div className="flex justify-center mb-6">
            <h1 className="font-bold text-3xl font-sans">Print and Checkout</h1>
          </div>
          {step === 1 ? (
            <div className="w-full h-5/6">
              <h3 className="font-semibold text-2xl font-sans text-left mb-4">
                Shipping Details
              </h3>
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label
                      className="block text-gray-600 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      className="shadow bg-[#F0F2F6] appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      name="name"
                      disabled
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.name}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="country_code"
                    >
                      Country
                    </label>

                    <input
                      className="shadow bg-[#F0F2F6] appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                      id="country_code"
                      type="text"
                      name="country_code"
                      disabled
                      placeholder="US"
                      value={formData.country_code}
                    />

                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.country_code}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="city"
                    >
                      City
                    </label>
                    {cities.length != 0 ? (
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="city"
                        type="text"
                        name="city"
                        placeholder="Testtown"
                        value={formData.city}
                        onChange={handleChange}
                      >
                        <option>Select City</option>
                        {cities.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="city"
                        type="text"
                        name="city"
                        disabled
                        placeholder="Testtown"
                        value={formData.city}
                      ></select>
                    )}
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.city}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="phone_number"
                    >
                      Phone Number
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phone_number"
                      type="text"
                      name="phone_number"
                      placeholder="+1 123-456-7890"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />

                    {/* <input
                      type="text"
                      placeholder="+1 123-456-7890"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    /> */}
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.phone_number}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="street"
                    >
                      Books Quantity
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="quantity"
                      type="number"
                      name="quantity"
                      placeholder="For example 10"
                      value={formData.quantity}
                      onChange={handleChange}
                      min={1}
                    />
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.quantity}
                      </h1>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-600 text-sm font-bold  mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow bg-[#F0F2F6] appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      disabled
                      name="email"
                      placeholder="example@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.email}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5  mb-2"
                      htmlFor="state_code"
                    >
                      State
                    </label>

                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="state_code"
                      autoFocus
                      type="text"
                      name="state_code"
                      placeholder="NY"
                      value={formData.state_code}
                      onChange={handleStates}
                    >
                      <option>Select State</option>
                      {states.map((item, index) => (
                        <option key={index} value={item.isoCode}>
                          {item.name}-{item.isoCode}
                        </option>
                      ))}
                    </select>
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.state_code}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="street"
                    >
                      Street
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="street"
                      type="text"
                      name="street"
                      placeholder="123 Test Street"
                      value={formData.street}
                      onChange={handleChange}
                    />
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.street}
                      </h1>
                    )}
                    <label
                      className="block text-gray-600 text-sm font-bold mt-5 mb-2"
                      htmlFor="postcode"
                    >
                      Postcode
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="postcode"
                      type="number"
                      name="postcode"
                      placeholder="10001"
                      value={formData.postcode}
                      onChange={handleChange}
                      min={0}
                    />
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.postcode}
                      </h1>
                    )}

                    <label
                      className="block text-gray-600 text-sm font-bold mt-5  mb-2"
                      htmlFor="shipping_options"
                    >
                      Shipping Services
                    </label>

                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="shipping_options"
                      type="text"
                      name="shipping_options"
                      placeholder="Select Shipping option"
                      value={formData.shipping_options}
                      onChange={handleChange}
                      disabled={shippingOptionsDisable}
                    >
                      <option>Select Shipping</option>
                      {shippingServices?.map((item, index) => (
                        <option key={index} value={item.level}>
                          {item.carrier_service_name}-{item.level}
                        </option>
                      ))}
                    </select>
                    {formData.shipping_options && (
                      <h1 className="text-gray-500 text-sm font-medium">
                        {formData.shipping_options === "MAIL"
                          ? ""
                          : `Shipping cost will be $${
                              selectedShipping &&
                              Math.ceil(selectedShipping?.cost_excl_tax)
                            }`}
                      </h1>
                    )}
                    {formErrors.name && (
                      <h1 className="text-red-500 text-sm">
                        {formErrors.shipping_options}
                      </h1>
                    )}
                  </div>
                </div>
                {error && <h1 className="text-sm text-red-600">{error}</h1>}
              </div>

              <div className="flex justify-end space-x-5 mt-10">
                <button
                  className={`${
                    disabled
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#124E5B] cursor-pointer"
                  } text-white  font-bold py-2 px-4 rounded-lg w-48 focus:outline-none focus:shadow-outline`}
                  onClick={() => {
                    getCost();
                  }}
                  type="button"
                  disabled={disabled}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="w-full h-5/6 flex flex-col">
              <div className="flex flex-col justify-center items-center w-full sm:w-2/3 lg:w-2/5 h-4/5 shadow-xl bg-white rounded-lg p-10 mx-auto my-5">
                <div className=" flex items-center justify-center w-full">
                  <div className="w-full">
                    <h1 className="text-3xl text-center font-semibold text-teal-800 mb-4">
                      Invoice
                    </h1>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">
                          Book Name:
                        </p>
                        <p className="text-gray-800">{state.title}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">Quantity:</p>
                        <p className="text-gray-800">{formData.quantity}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">
                          Book Charges:
                        </p>
                        <p className="text-gray-800">
                          ${isNaN(actualCharges) ? 0 : actualCharges}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">
                          Shipping Charges:
                        </p>
                        <p className="text-gray-800">
                          $
                          {shippingServices &&
                            `${
                              selectedShipping.level === "MAIL"
                                ? 0
                                : Math.ceil(selectedShipping?.cost_excl_tax)
                            }`}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">Subtotal:</p>
                        <p className="text-gray-800">
                          $
                          {isNaN(
                            Math.ceil(selectedShipping?.cost_excl_tax) + cost
                          )
                            ? 0
                            : cost}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">
                          Apply Gift Voucher:
                        </p>

                        <div className="flex space-x-2">
                          <input
                            className={`shadow bg-[#F0F2F6] appearance-none border rounded w-28 py-1 px-2 leading-tight focus:outline-none focus:shadow-outline ${
                              giftBtnDisable
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-black cursor-pointer"
                            }`}
                            id="voucher"
                            type="text"
                            name="voucher"
                            minLength={7}
                            maxLength={7}
                            placeholder=""
                            onChange={(e) => {
                              setVoucherCode(e.target.value);
                            }}
                            value={voucherCode}
                            disabled={giftBtnDisable}
                          />
                          <button
                            onClick={getDiscount}
                            disabled={
                              voucherCode.length !== 7 || giftBtnDisable
                            }
                            className={`${
                              voucherCode?.length !== 7 || giftBtnDisable
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#134f5c] cursor-pointer"
                            } text-white text-sm font-medium py-1 px-2 rounded-md`}
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {
                        <p
                          className={`h-3 ${
                            message?.includes("Voucher code")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {message}
                        </p>
                      }
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-600">
                          Apply Promo Code:
                        </p>

                        <div className="flex space-x-2">
                          <input
                            className={`shadow bg-[#F0F2F6] appearance-none border rounded w-28 py-1 px-2 leading-tight focus:outline-none focus:shadow-outline ${
                              isApplied
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-black cursor-pointer"
                            }`}
                            id="voucher"
                            type="text"
                            name="voucher"
                            minLength={3}
                            placeholder=""
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                            }}
                            value={promoCode}
                            disabled={isApplied}
                          />
                          <button
                            onClick={getPromoDiscount}
                            disabled={promoCode.length < 3 || isApplied}
                            className={`${
                              promoCode?.length < 3 || isApplied
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#134f5c] cursor-pointer"
                            } text-white text-sm font-medium py-1 px-2 rounded-md`}
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {
                        <p
                          className={`h-3 ${
                            promoApplied?.includes("Promo code")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {promoApplied}
                        </p>
                      }
                    </div>
                    <hr className="border-t-2 border-gray-300 my-4" />

                    <div className="mb-2">
                      <p className="text-lg font-semibold text-right text-gray-800">
                        Total Charges:{" "}
                        <span className="text-teal-800">${discountPrice}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-5 mt-10">
                <button
                  onClick={stepBack}
                  className="bg-[#DDC5BF] text-white font-bold py-2 px-4 rounded-lg"
                >
                  Back
                </button>

                <button
                  className={`
                                                bg-[#124E5B]
                                         text-white  font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline
                                         `}
                  onClick={() => {
                    stepForward();
                    if (discountPrice !== 0) {
                      createPaymentIntent();
                    }
                  }}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            <div className="w-full h-5/6">
              <div className="flex h-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm stepBack={stepBack} />
                  </Elements>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-5/6 flex flex-col">
              <div className="relative flex flex-col justify-center items-center w-1/2 h-2/3 shadow-xl bg-white rounded-lg p-10 mx-auto my-20">
                <div className="text-5xl">🎉</div>
                <h1 className="text-2xl font-medium text-[#134F5C] text-center mb-10">
                  Your Order has been placed successfully.
                </h1>
                <div className="mb-4 ">
                  <div className="flex justify-between  items-center">
                    <p className="font-bold text-gray-600">Order Id:</p>
                    <p className=" font-semibold text-gray-800">
                      {orderDetails?.id}
                    </p>
                  </div>
                  <div className="flex justify-between  items-center">
                    <p className="font-bold text-gray-600">
                      Estimated Arrival Time:{" "}
                    </p>
                    <p className=" font-semibold text-gray-800 ml-8 ">
                      {`${selectedShipping?.total_days_min} - ${selectedShipping?.total_days_max}`}{" "}
                      days
                    </p>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="font-bold text-gray-600 block">
                    Book Cover:
                  </label>
                  <div className="flex justify-between w-full">
                    <div>
                      <input
                        disabled
                        value={coverUrl}
                        type="text"
                        className="bg-[#F0F2F6] appearance-none border rounded-md w-auto xl:w-80 py-1 px-2 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCopy
                        onClick={copyBookCover}
                        color={clickedIcons.copyCover ? "#0e4f5c" : "#9fc8b8"}
                        className="cursor-pointer w-7 h-6"
                      />
                      <FaCloudDownloadAlt
                        onClick={handleDownloadCover}
                        color={
                          clickedIcons.downloadCover ? "#0e4f5c" : "#6A9190"
                        }
                        className="cursor-pointer w-7 h-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <label className="font-bold text-gray-600 block">
                    Book Interior:
                  </label>
                  <div className="flex justify-between w-full">
                    <div>
                      <input
                        disabled
                        value={bookUrl}
                        type="text"
                        className="bg-[#F0F2F6] appearance-none border rounded-md w-auto xl:w-80 py-1 px-2 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCopy
                        onClick={copyBookInterior}
                        color={
                          clickedIcons.copyInterior ? "#0e4f5c" : "#9fc8b8"
                        }
                        className="cursor-pointer w-7 h-6"
                      />
                      <FaCloudDownloadAlt
                        onClick={handleDownloadInterior}
                        color={
                          clickedIcons.downloadInterior ? "#0e4f5c" : "#6A9190"
                        }
                        className="cursor-pointer w-7 h-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-[#FFD700]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.66 5.68A4 4 0 0110 3a4 4 0 013.34 2.68L14 6l1.15-1.15a1 1 0 111.41 1.41L14 9l-1.56 1.56a4 4 0 01-5.68 0L6 9l-1.59 1.59a1 1 0 11-1.41-1.41L6 6l.15-.15zM10 8a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                  {/* {/ Right side party popper SVG /} */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-[#FFD700]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.66 5.68A4 4 0 0110 3a4 4 0 013.34 2.68L14 6l1.15-1.15a1 1 0 111.41 1.41L14 9l-1.56 1.56a4 4 0 01-5.68 0L6 9l-1.59 1.59a1 1 0 11-1.41-1.41L6 6l.15-.15zM10 8a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-end space-x-5 mt-10">
                <button
                  className={`
                                                bg-[#124E5B]
                                         text-white  font-bold py-2 px-4 rounded-lg w-48 focus:outline-none focus:shadow-outline
                                         `}
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  type="button"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import ProfileDashboard from "./pages/profile/ProfileDashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import WhyPage from "./pages/why/WhyPage";
import BookDashboard from "./pages/bookDashboard/BookDashboard";
import ProfileBuilder from "./components/ProfileBuilder";
import BookSetupPage from "./pages/bookSetupPage/BookSetupPage";
import CollaborationVault from "./pages/vault/CollaborationVault";
import Directory from "./pages/directory/Directory";
import Portal from "./pages/contributorPortal/Portal";
import ContributionPortal from "./pages/contributionPortal/ContributionPortal";
import ChapterSelection from "./pages/chapterSelection/ChapterSelection";
import { Auth } from "./Auth";
import Storyvault from "./pages/storyvault/Storyvault";
import Announcements from "./pages/announcements/Announcements";
import Reminders from "./pages/reminders/Reminders";
import OtpConfirmation from "./pages/otpConfirmation/OtpConfirmation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import Loader from "./components/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import InvitationPage from "./pages/invitationPage/InvitationPage";
import PrintBook from "./pages/printBook/PrintBook";
import GiftCertificate from "./pages/gift/GiftCertificate";
import Checkout from "./pages/checkout/Checkout";
import FAQ from "./pages/FAQ/FAQ";
import Voucher from "./pages/voucher/Voucher";
import { PaymentSuccessPage } from "./pages/successPages/PaymentSuccessPage";
import { NewPasswordSuccess } from "./pages/successPages/NewPasswordSuccess";
import ContactUs from "./pages/contactUs/contactUs";
import LogRocket from "logrocket";
import Settings from "./pages/profileSetting/settings";
import {
  profileImg,
  username as setStoreusername,
} from "./features/profileSlice";
import Terms from "./pages/terms/terms";
import Privacy from "./pages/privacyPolicy/privacy";

import PrintJobs from "./pages/printJobs/printJobs";
import AdminDashboard from "./admin/dashboard";
import Sidebar from "./admin/sidebar";
import Books from "./admin/books/books";
import Users from "./admin/users/users";
import ChapterQues from "./admin/chatpterQues/chapterQues";
import Gifts from "./admin/giftcard/gifts";
import PromoCodes from "./admin/promocode/promos";
import AdminPrintJobs from "./admin/printBooks/books";
import UserBooks from "./admin/users/userBooks";
import Questions from "./admin/chatpterQues/questions";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("/dashboard");

  useEffect(() => {
    let imageurl = localStorage.getItem("profileImg");
    let firstName = localStorage.getItem("firstName");
    let lastName = localStorage.getItem("lastName");
    let username = localStorage.getItem("username");
    dispatch(setStoreusername(username));
    dispatch(
      profileImg({ imgUrl: imageurl, firstN: firstName, lastN: lastName })
    );
    LogRocket.init("rye6co/mystoryvault");
  }, []);
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setLoading(true);

        return config;
      },
      (error) => {
        setLoading(false);

        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);

        return response;
      },
      (error) => {
        setLoading(false);

        return Promise.reject(error);
      }
    );

    // Remove the interceptors when the component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="1006775000308-06t6qt89v91v4lht65tbg2i4sq8d919u.apps.googleusercontent.com">
      {localStorage.getItem("admin_token") && (
        <>
          <Sidebar />
        </>
      )}
      <Auth>
        {loading && <Loader />}
        {!localStorage.getItem("admin_token") ? (
          <Routes>
            {localStorage.getItem("jwtToken") ? (
              localStorage.getItem("status") == "false" ? (
                <Route path="*" element={<Navigate replace to="/" />} />
              ) : (
                <>
                  <Route
                    exact
                    path="/book"
                    element={<BookSetupPage setLoading={setLoading} />}
                  />
                  <Route
                    exact
                    path="/dashboard"
                    element={<ProfileDashboard setLoading={setLoading} />}
                  />
                  <Route
                    exact
                    path="/chapterselection/book/:id"
                    element={<ChapterSelection />}
                  />
                  <Route
                    exact
                    path="/contributor/:id/:bookId"
                    element={<Portal />}
                  />
                  <Route
                    exact
                    path="/contribution/:bookId"
                    element={<ContributionPortal />}
                  />
                  <Route
                    exact
                    path="/collaborationVault"
                    element={<CollaborationVault />}
                  />
                  <Route
                    exact
                    path="/directory/:bookId"
                    element={<Directory setLoading={setLoading} />}
                  />
                  <Route exact path="/reminders" element={<Reminders />} />
                  <Route
                    exact
                    path="/announcements"
                    element={<Announcements />}
                  />
                  <Route exact path="/storyvault" element={<Storyvault />} />
                  <Route
                    exact
                    path="/story/:bookId"
                    element={<BookDashboard />}
                  />
                  <Route exact path="/print" element={<PrintBook />} />
                  <Route exact path="/printjobs" element={<PrintJobs />} />
                </>
              )
            ) : (
              <>
                <Route exact path="/login" element={<RegistrationPage />} />
                <Route exact path="/build" element={<ProfileBuilder />} />
                <Route
                  exact
                  path="/otp/:username/:userSub"
                  element={<OtpConfirmation />}
                />
                <Route
                  exact
                  path="/passwordCreated"
                  element={<NewPasswordSuccess />}
                />
              </>
            )}
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route exact path="/why" element={<WhyPage />} />
            <Route
              exact
              path="/"
              element={<LandingPage setLoading={setLoading} />}
            />
            <Route exact path="/gift" element={<GiftCertificate />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route exact path="/FAQ" element={<FAQ />} />
            <Route exact path="/answer/:bookId" element={<InvitationPage />} />
            <Route exact path="/giftVoucher" element={<Voucher />} />
            <Route exact path="/success" element={<PaymentSuccessPage />} />
            <Route exact path="/contact" element={<ContactUs />} />
            <Route
              exact
              path="/settings"
              element={<Settings setLoading={setLoading} />}
            />
            <Route exact path="/terms" element={<Terms />} />
            <Route exact path="/privacy" element={<Privacy />} />

          </Routes>
        ) : (
          <Routes>
            <Route exact path="/dashboard" element={<AdminDashboard />} />
            <Route exact path="/books" element={<Books />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/chapques" element={<ChapterQues />} />
            <Route exact path="/questions" element={<Questions />} />
            <Route exact path="/giftcards" element={<Gifts />} />
            <Route exact path="/promocodes" element={<PromoCodes />} />
            <Route
              exact
              path="/giftVoucher"
              element={<Voucher admin={true} />}
            />
            <Route exact path="/printbooks" element={<AdminPrintJobs />} />
            <Route exact path="/userbooks" element={<UserBooks />} />
            <Route
              path="*"
              element={<Navigate replace to={path || "/dashboard"} />}
            />
          </Routes>
        )}
      </Auth>
    </GoogleOAuthProvider>
  );
}

export default App;

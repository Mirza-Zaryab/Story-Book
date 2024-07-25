import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/user.js';
import { useLocation } from 'react-router-dom';

import API from '../../utils/api';
import BookList from '../../components/BookList';
import Dashboard from '../../components/Dashboard';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import LoginPrompt from '../../components/LoginPrompt.jsx';

const initialValues = { title: '', author: '', image: '' };

export default function ProfileDashboard({ setLoading }) {
  const [viewBook, setViewBook] = useState(false);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState();
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const location = useLocation();
  const tokenData = jwtDecode(localStorage.getItem("jwtToken"));
  const [show, setShow]=useState(false)

  const getUser = async () => {
    const  userId = localStorage.getItem("awsUserId")

    setLoading(true)

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/book/getBookByUserId/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        console.log('f', data);
        setBooks(data?.data?.data);
        setShow(true);
        setTimeout(() => {
          setLoading(false)
        }, 1000);
      })
      .catch(error => {
        setShow(true);
        setTimeout(() => {
          setLoading(false)
        }, 1000);
        console.error(error);
      });
    
  };

  useEffect(() => {
    getUser();
  }, []);

  const aside = (
    <>
      {/* Secondary column (hidden on smaller screens) */}
      <aside className="hidden w-96 bg-white border-l border-gray-200 overflow-y-auto lg:block">
        {/* content */}
      </aside>
    </>
  );

  return (
    <>
      <LoginPrompt />
      <Dashboard>
        <BookList setBook={setBook} show={show} setView={setViewBook} books={books} tokenData={tokenData} />
      </Dashboard>
    </>
  );
}

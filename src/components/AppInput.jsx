import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { useFormikContext } from 'formik';
import axios from 'axios';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AppInput({ title = "", id, name, type, autoComplete, value, onChange, showError = true, errorMsg = "", setusernameErrorMessage = false }) {
  const { errors, touched, handleBlur } = useFormikContext();
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleonChangeUsername = (event) => {
    onChange(event)
    const { value } = event.target;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTypingTimeout = setTimeout(() => {
      if (value.trim() !== '') {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/signup/verifyUsername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: value }),
        }).then((res) => {
          console.log(res)
          if (res.status == 200) {
            setusernameErrorMessage("")
          }
          else if (res.status == 400) {
            setusernameErrorMessage("This username is already taken. Try another one.")
          }
          else {
            setusernameErrorMessage("Internal Server Error")
          }
        })
      }
    }, 500);

    setTypingTimeout(newTypingTimeout);
  };
  return (
    <div>
      <label htmlFor={name} className=" block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          onChange={setusernameErrorMessage ? handleonChangeUsername : onChange}
          value={value}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          className={classNames(
            touched[name] && errors[name] ? 'border-red-600' : 'border-gray-300',
            'mt-1 appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          )}
        />
      </div>
      {showError && <ErrorMessage error={errorMsg || errors[name]} visible={touched[name]} />}
    </div>
  );
}

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from './AppButton';
import './style.css';
import { useSelector } from "react-redux";
import { AuthContext } from '../Auth';

export default function RegisterPrompt(props:any) {
  let navigate = useNavigate();
  const user = useSelector((state: any) => state.user.value);
  const { getPaymentStatus } = useContext(AuthContext);

  let url = "/checkout";

  const redirectPage = async () => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const paymentStatus = await getPaymentStatus();
      console.log(paymentStatus);
      if (paymentStatus.status === true) {
        navigate('/dashboard');
      } else {
        navigate(url);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">The best way to begin.</span>
          <span className="-mb-1 pb-1 block bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
            Is simply to begin.
          </span>
        </h2>
        <div className="mt-6  space-y-4 sm:space-y-0 sm:flex sm:space-x-5">
         {props.show && <AppButton title={props.books >0 ? "Return to book": "Let's Get Started"} onClick={redirectPage} />}
        </div>
      </div>
    </div>
  );
}

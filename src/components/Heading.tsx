import { useNavigate } from "react-router-dom";
import personalImage from "../assets/myImage.jpeg";
import { useContext } from 'react';
import { AuthContext } from '../Auth';

const incentives = [
  {
    name: 'Customer Support',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-warranty-simple.svg',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    name: 'Exchanges',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-exchange-simple.svg',
    description:
      ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
];

export default function Heading() {
  const navigate = useNavigate();
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
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-24 sm:px-2 sm:py-32 lg:px-4">
        <div className="max-w-2xl mx-auto p-5 lg:max-w-none">
          <div className="grid grid-cols-1 items-center gap-y-10 gap-x-16 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                We specifically designed, My Story Vault, to help you and your family create a book of treasured memories that will last for generations.
              </h2>
              <p className="mt-4 text-gray-500">
                Following the loss of both our fathers, whose life stories were not documented, we felt compelled to simplify the process of preserving legacies by helping people write their own stories, create memory books, and invite collaborators to share in this process.
              </p>

              <p className="mt-4 text-gray-500">
                If you are looking for an investment in your family for generations to come, spend some time with My Story Vault, we are confident the dividends are great!
              </p>

              <p className="mt-4 text-gray-500 text-lg font-semibold">
                Get acquainted with our founders.
              </p>

              <p className="mt-4 text-gray-500">
                <span className="text-base font-bold">Stephanie Jacobson</span> –
                Stephanie is a true Arizona native and enjoys basking in the warmth of the sun. She earned her degree in Elementary Education from ASU and completed her Masters in Multicultural Education from NAU. Stephanie and her husband have four children, including twins, and they relish spending time outdoors and bonding as a family.
              </p>

              <p className="mt-4 text-gray-500">
                <span className="text-base font-bold">Chelsea Lamb</span> –
                Chelsea was born and brought up in Utah but settled with her own family in Arizona. She holds a degree in Marriage and Family Relations from BYU-I. Chelsea and her spouse are proud parents to five children, including twins, and seven grandchildren. They value their travel and camping experiences, which have become cherished family traditions.
              </p>

              <p className="mt-4 text-gray-500">
                Both Stephanie and Chelsea have experienced the significant benefit of generational relationships within their families and hope to strengthen all families because of this endeavor.
              </p>
            </div>
            <div className="aspect-w-3 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={personalImage}
                alt=""
                className="object-center object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-28 bg-[#96c9bf] flex justify-center items-center">
        <h1 className="cursor-pointer text-white font-medium text-4xl font-serif" onClick={redirectPage}>Let's Get Started</h1>
      </div>
    </div>
  );
}

import { FaPlus } from 'react-icons/fa';

export default function AddButton({ onClick }: any) {
  return (
    <button
      className=" h-8 w-32 sm:w-max text-xs sm:text-base justify-center flex items-center rounded sm:p-4 add-Story-button"
      onClick={onClick}
    >
      <FaPlus color="white" />
      <span className="ml-2 text-white">Return to book</span>
    </button>
  );
}


import { useSelector, useDispatch } from 'react-redux';

import { setQuestion } from '../features/bookFeatures';

export default function Question({ data }: any) {
  const bookState = useSelector((state: any) => state.book.value);
  const dispatch = useDispatch();
  const handleQuestionClick = () => {
    dispatch(setQuestion(data.question.content));
  };

  return (
    <li
      key={data._id}
      className="py-5 hover:cursor-pointer  hover:bg-slate-200 rounded"
      onClick={handleQuestionClick}
    >
      <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{data.question.content}</p>
      </div>
    </li>
  );
}

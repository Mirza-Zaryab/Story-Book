import { useState } from 'react';

const messages = [
  {
    id: 1,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Gloria Roberston',
    time: '1d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
  },
  {
    id: 2,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Gloria Roberston',
    time: '1d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
  },
];

export default function Drafts({ drafts, setText, setDraftId, setTitle }: any) {
  const handleClick = (content: any) => {
    setText({ title: '', content: content.content });
    setTitle({ content: content.title, display: content.displayTitle });
    setDraftId(content._id);
  };
  return (
    <ul role="list" className="divide-y divide-gray-200 border border-slate-200 ">
      {drafts.length < 1 ? (
        <h1>No Drafts</h1>
      ) : (
        drafts.map((content: any) => (
          <li
            onClick={() => handleClick(content)}
            key={content.id}
            className="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-100"
          >
            <div className="flex justify-between space-x-3">
              <div className="min-w-0 flex-1">
                <a href="#" className="block focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="truncate text-sm font-medium text-gray-900">{content.title}</p>
                </a>
              </div>
              <time
                dateTime={content.createdOn}
                className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
              >
                {content.createdOn}
              </time>
            </div>
            <div className="mt-1">
              <p
                className="text-sm text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: content['content'] }}
              ></p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './style.css';
import AppToggle from './AppToggle';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
function AppTextArea({
  text,
  title,
  setTitle,
  setText,
  onSubmit,
  onCancel,
  saveDraft = () => console.log('Saving'),
  contributor = false,
  confirmButtonText = 'Save',
}) {
  const dispatch = useDispatch();
  const bookState = useSelector((state) => state.book.value);
  const handleTitleStatus = (status) => {
    setTitle({ ...title, display: status });
  };

  const handleChange = (event) => {
    setTitle({ ...title, content: event.target.value });
  };

  return (
    <div className={classNames(contributor ? 'contributorTextArea' : 'textEditor', 'rounded ')}>
      <div className="flex">
        <div className="flex flex-col mb-4 w-8/12">
          <label for="title" className="text-white mt-2 ml-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="rounded"
            value={text.title}
            onChange={handleChange}
          />
        </div>
        <div className="flex item-content pt-4 ml-4">
          <AppToggle
            display={text.display}
            label="Display Title?"
            textColor="white"
            setStatus={(status) => handleTitleStatus(status)}
          />
        </div>
      </div>
      <div>
        <label for="content" className="text-white mb-2 ml-2">
          Content
        </label>
        <div />
        <CKEditor
          id="content"
          className="drop-shadow-lg"
          editor={ClassicEditor}
          data={text.data}
          onChange={(event, editor) => {
            const data = editor.getData();
            dispatch(setText({ ...bookState.text, content: data }));
          }}
        />
      </div>
      <div className="mt-4 flex justify-end mr-4 ">
        {contributor ? (
          <button
            className="bg-white w-24 py-2 rounded border border-slate-400 mr-auto ml-4"
            onClick={saveDraft}
          >
            Save Draft
          </button>
        ) : null}
        <button
          className="bg-white w-24 py-2 rounded border border-slate-400 mr-4
        "
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-white px-6 w-24 rounded border border-slate-400
        "
          onClick={onSubmit}
        >
          {confirmButtonText}
        </button>
      </div>
    </div>
  );
}

export default AppTextArea;

import React from 'react';

type ButtonProps = {
  title: string;
  onClick: (params: any) => any;
};

export default function AppButton({ title, onClick }: ButtonProps) {
  return (
    <a
      onClick={onClick}
      className="flex items-center justify-center button-gradient bg-origin-border px-4 py-3  text-base font-medium rounded-md shadow-sm text-white bg-white hover:bg-indigo-50 hover:cursor-pointer sm:px-8 tracking-widest"
    >
      {title}
    </a>
  );
}

import './style.css';
type TextProps = {
  active?: boolean;
  children: JSX.Element | JSX.Element[] | string | string[];
};

export default function AppText({ children, active = true }: TextProps) {
  return (
    <>
      {active ? (
        <p className=" text-center text-3xl font-extrabold text-gray-900 clickableText">
          {children}
        </p>
      ) : (
        <p className="text-center text-3xl   text-gray-300 clickableText">{children}</p>
      )}
    </>
  );
}

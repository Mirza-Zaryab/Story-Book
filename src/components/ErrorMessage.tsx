type ErrorMessageProps = {
  error: string | string[] | any;
  visible: boolean;
};

export default function ErrorMessage({ error, visible }: ErrorMessageProps) {
  if (!visible || !error) return null;

  return <p className=" text-red-600 ">{error}</p>;
}

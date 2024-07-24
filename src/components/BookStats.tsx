export default function BookStats({ book }: any) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        {/* Content goes here */}
        {book.title}
        {/* We use less vertical padding on card headers on desktop than on body sections */}
      </div>
      <div className="bg-gray-50 px-4 py-5 sm:p-6">{/* Content goes here */}Stats go here</div>
    </div>
  );
}

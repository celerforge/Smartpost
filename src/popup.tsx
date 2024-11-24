import "@/style.css";

function IndexPopup() {
  return (
    <div className="bg-white flex h-24 w-40 items-center justify-center rounded-lg p-4 shadow-md">
      <a
        href="/options.html"
        target="_blank"
        className="text-blue-600 hover:text-blue-800 text-sm underline transition-colors"
      >
        Settings
      </a>
    </div>
  );
}

export default IndexPopup;

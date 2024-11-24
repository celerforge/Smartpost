import "@/style.css";

function IndexPopup() {
  return (
    <div className="sp-bg-white sp-flex sp-h-24 sp-w-40 sp-items-center sp-justify-center sp-rounded-lg sp-p-4 sp-shadow-md">
      <a
        href="/options.html"
        target="_blank"
        className="sp-text-blue-600 hover:sp-text-blue-800 sp-text-sm sp-underline sp-transition-colors"
      >
        Settings
      </a>
    </div>
  );
}

export default IndexPopup;

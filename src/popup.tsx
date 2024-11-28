import { buttonVariants } from "@/components/ui/button";
import "@/style.css";
import { ExternalLink } from "lucide-react";

function IndexPopup() {
  return (
    <div className="sp-bg-white sp-flex sp-h-24 sp-w-40 sp-items-center sp-justify-center sp-rounded-lg sp-p-4 sp-shadow-md">
      <a href="/options.html" target="_blank" className={buttonVariants()}>
        Settings
        <ExternalLink />
      </a>
    </div>
  );
}

export default IndexPopup;

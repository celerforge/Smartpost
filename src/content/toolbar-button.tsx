import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  loading?: boolean;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon, loading, className = "", ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`sp-hover:bg-x-primary/10 sp-flex sp-h-9 sp-w-9 sp-items-center sp-justify-center sp-rounded-full ${
          loading ? "sp-cursor-not-allowed sp-opacity-50" : ""
        } ${className}`}
      >
        {icon}
      </button>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";

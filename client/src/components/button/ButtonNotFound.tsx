import React from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const ButtonNotFound: React.FC<ButtonProps> = ({ onClick, text, leftIcon, rightIcon, className = "", size = "w-full", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 ${size} whitespace-pre md:flex group relative justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2 ${className}`}
      {...props}
    >
      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
      <div className="flex items-center">
        {leftIcon && <span className="w-4 h-4">{leftIcon}</span>}
        <span className="ml-1 text-white">{text}</span>
      </div>
      {rightIcon && <div className="ml-2 flex items-center gap-1 text-sm md:flex">{rightIcon}</div>}
    </button>
  );
};

export default ButtonNotFound;

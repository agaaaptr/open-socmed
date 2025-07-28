
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-blue-500 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

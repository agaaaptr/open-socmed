
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-accent-main text-text-light hover:bg-accent-bold-hover ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({ error, className, children, ...props }) => {
    return (
            <select
                className={`w-full px-4 py-2 border-[1px] rounded-md transparent text-white bg-[#3C3C3C] border-solid border-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 ${error ? "border-red-500" : "border-gray-600"} ${className}`}
                {...props}
            >
                {children}
            </select>
    );
};

export default Select;

import {ReactNode} from "react";

export const Card = ({children, className}: {children?: ReactNode, className?: string}) => {
    return <div className={'w-full bg-[rgb(73 73 73)] shadow-md rounded-lg p-6 border border-gray-500 transition duration-200 hover:bg-white/5 ' + className}>{children}</div>;
}
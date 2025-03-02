import {ReactNode} from "react";

const Wrapper = ({children}: {children: ReactNode}) => {
    return <div className={"max-w-[1200px] pr-4 pl-4 w-full mr-auto ml-auto"}>{children}</div>
}

export default Wrapper;
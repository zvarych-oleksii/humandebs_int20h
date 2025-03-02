import styles from "./Button.module.css";
import clsx from "clsx";
import {FC, HTMLAttributes, ReactNode} from "react";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    disabled?: boolean;
    children?: ReactNode;
    type?: "button" | "submit";
}

const Button: FC<ButtonProps> = ({children, className, loading, disabled, type="button", ...props}) => {
    return <button className={clsx(styles.button, className, {[styles["button--loading"]]: loading, [styles["button--disabled"]]: disabled})} type={type} {...props}>{children}</button>
}

export default Button;
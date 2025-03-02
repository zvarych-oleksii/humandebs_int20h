import { forwardRef } from "react"
import { IMaskInput, IMaskInputProps } from "react-imask"
import style from "./Input.module.css"
import clsx from "clsx"

export interface InputProps
    extends Omit<IMaskInputProps<HTMLInputElement>, "inputRef"> {
    modify?: "default" | "new-york"
    placeholder?: string
    error?: string
    mask?: string
    className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            placeholder = "",
            error,
            mask,
            disabled,
            modify = "default",
            className = "",
            ...props
        },
        ref,
    ) => {
        const inputClass = clsx(
            style.input,
            {
                [style["input--error"]]: !!error,
                [style["input--disabled"]]: disabled,
            },
            style[`input__modify--${modify}`],
            className,
        )

        if (mask) {
            return (
                <IMaskInput
                    disabled={disabled}
                    mask={mask}
                    placeholder={placeholder}
                    className={inputClass}
                    inputRef={ref}
                />
            )
        }

        return (
            <input
                {...props}
                disabled={disabled}
                ref={ref}
                placeholder={placeholder}
                className={inputClass}
            />
        )
    },
)

Input.displayName = "Input"

export default Input

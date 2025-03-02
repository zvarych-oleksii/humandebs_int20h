import { forwardRef, HTMLAttributes } from "react"
import style from "./TextArea.module.css"
import clsx from "clsx"

interface TextAreaProps extends HTMLAttributes<HTMLTextAreaElement> {
    className?: string
    modify?: "default" | "new-york"
    disabled?: boolean
    error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            error,
            className = "",
            disabled = false,
            modify = "default",
            ...textareaProps
        },
        ref,
    ) => {
        return (
            <textarea
                {...textareaProps}
                ref={ref}
                className={clsx(
                    style.textArea,
                    {
                        [style["textArea--error"]]: !!error,
                        [style["textArea--disabled"]]: disabled,
                    },
                    style[`textArea__modify--${modify}`],
                    className,
                )}
                disabled={disabled}
            />
        )
    },
)

TextArea.displayName = "TextArea"

export default TextArea

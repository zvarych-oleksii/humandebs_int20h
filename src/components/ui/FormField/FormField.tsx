import { FC, HTMLAttributes, ReactNode } from "react"
import styles from "./FormField.module.css"
import clsx from "clsx"

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    error?: string
    modify?: "default" | "new-york"
    type?: "default" | "inline"
    label?: string
    desc?: string
    children?: ReactNode
    withoutError?: boolean
}

const FormField: FC<FormFieldProps> = ({
                                           modify = "default",
                                           type = "default",
                                           error,
                                           label = "",
                                           desc,
                                           className = "",
                                           children,
                                           withoutError,
                                           ...props
                                       }) => {
    return (
        <div
            className={clsx(
                styles.formField,
                styles[`formField__modify--${modify}`],
                styles[`formField__type--${type}`],
                { [styles[`formField--error`]]: !!error },
                className,
            )}
            {...props}
        >
            {label && <label className={styles.formField__label}>{label}</label>}
            {children}
            {desc && <span className={styles.formField__desc}>{desc}</span>}
            {!withoutError && (
                <span className={styles.formField__error}>{error}</span>
            )}
        </div>
    )
}

export default FormField

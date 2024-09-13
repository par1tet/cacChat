import { ReactNode } from "react"
import cl from './Button.module.css'

type ButtonProps = {
    children?: ReactNode,
    width?: number,
    height?: number,
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button = ({children, width, height, ...props}: ButtonProps) => {
    return (<button
        className={cl['button']}
        style={{
            width: width,
            height: height
        }}
        {...props}
    >
        {children}
    </button>)
}
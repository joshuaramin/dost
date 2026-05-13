import React, { ReactNode } from 'react'


interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
}

export default function Text({
    children,
    ...props
}: Props) {
    return (
        <span {...props}>{children}</span>
    )
}

import React from 'react'


interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode
}

export default function Paragraph({children}: Props) {
    return (
        <p>{children}</p>
    )
}

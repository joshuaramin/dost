"use client"

import React, { ReactNode } from 'react'


interface Props extends React.HTMLAttributes<HTMLDivElement>{
    children: ReactNode
}


export default function ModalForm({ children, ...props}: Props) {
  return (
    <div>
        {children}
    </div>
  )
}

import React, { ReactNode } from 'react'


//lub & hooks 
import Footer from '@/lib/ui/footer'
import Header from '@/lib/ui/header'


interface Props {
    children: ReactNode
}

export default function AuthLayout({ children }: Props) {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

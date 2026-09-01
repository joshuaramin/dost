import Footer from '@/lib/ui/footer';
import Header from '@/lib/ui/header';
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}


export default function Layout({ children }: Props) {
  return (
    <div>
      <Header /> 
          {children}
      <Footer/>  
    </div>
  )
}

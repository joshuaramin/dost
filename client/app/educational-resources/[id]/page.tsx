import EducationResourceId from '@/lib/ui/educational-resource/educational-resource-id';
import React from 'react'



export default async function Page({params}: { params: Promise<{id: string}>}) {


  const {  id } = await params
  return (
    <div>
      <EducationResourceId id={id}/>
    </div>
  )
}

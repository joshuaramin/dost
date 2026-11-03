import SurveyID from '@/lib/ui/dashboard/system-maintenance/survey-management/survey-id';
import React from 'react'



export default async function Page({params}: { params: Promise<{id: string}>}) {


  const { id } = await params

  return (
    <SurveyID  slug={id} />
  )
}

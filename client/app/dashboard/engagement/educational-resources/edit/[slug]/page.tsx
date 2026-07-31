import EducationalResourceEdit from '@/lib/ui/educational-resource/edit/educational-resource-edit';
import React from 'react'

export default  async function Page({ params }: {params: Promise<{slug: string}>}) {

      const { slug } = await params
  return (
    <EducationalResourceEdit id={slug} /> 
  )
}


import Template from '@/lib/ui/template';
import React from 'react'


export default async function Page({ params }: { params: Promise<{id: string }>}) {
  return (
    <Template title="Survey"> </Template>
  )
}

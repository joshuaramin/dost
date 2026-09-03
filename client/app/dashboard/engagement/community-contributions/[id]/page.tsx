
import ContributionID from '@/lib/ui/dashboard/engagement/community-contribution/contribution-id';
import React from 'react'

export default async function Page({ params }: { params: Promise<{id: string}>}) {

  const { id } = await params
  return (
    <ContributionID id={id} />
  )
}

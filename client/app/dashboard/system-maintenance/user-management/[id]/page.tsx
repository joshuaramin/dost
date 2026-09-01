import React from 'react'
import UserManagementID from '@/lib/ui/dashboard/system-maintenance/user-management/user-management-id';

export default async function Page({ params }: { params: Promise<{id: string}>}) {
    
    const { id } = await params
    
    return (
        <UserManagementID id={id} />
    )
}

import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action';
import React from 'react'
const page = async () => {
    const user = await getCurrentUser();

  return (
    <>
    <h3>Interview Page</h3>
    <Agent userName={user?.name} userId={user?.userid} type="generate"></Agent>
    </>
  )
}

export default page
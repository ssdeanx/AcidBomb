import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from './../utils/supabase/server'

export default async function PrivatePage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}

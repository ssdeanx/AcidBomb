'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from './../utils/supabase/server';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

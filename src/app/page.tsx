import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('TOKEN_AUTH')?.value;
  const role = cookieStore.get('USER_ROLE')?.value?.toLowerCase();

  if (token && role === 'admin') {
    redirect('/dashboard');
  }

  redirect('/login');
}

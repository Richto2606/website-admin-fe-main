export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import DynamicCard from '@components/particel/dynamic-card';

async function getPendaftaran() {
  const cookiesObj = await cookies();
  const token = cookiesObj.get('TOKEN_AUTH')?.value;

  try {
    const res = await fetch('https://asramaputrakukar.my.id/api/v1/pendaftaran', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': '881182541952993820593968'
      },
      cache: 'no-store'
    });
    const response = await res.json();
    if (res.ok && response.data) return response.data;
    return [];
  } catch (error) {
    return [];
  }
}

export default async function PendaftaranPage() {
  const data = await getPendaftaran();
  return (
    <div className='container max-w-screen-xl mx-auto px-4 pt-4'>
      <h1 className="text-xl font-semibold">Data Pendaftaran</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
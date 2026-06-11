import React from 'react';
import ValidasiTable from './table';
import { cookies } from 'next/headers';
import DynamicCard from '@components/particel/dynamic-card';

// Fungsi Fetch Server-Side
async function getPendaftar() {
  const cookiesObj = await cookies();
  const token = cookiesObj.get('TOKEN_AUTH')?.value;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/pendaftaran', {
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
    console.error('Error:', error);
    return [];
  }
}

export default async function ValidasiPendaftarPage() {
  const dataPendaftar = await getPendaftar();
  const cookiesObj = await cookies();
  const token = cookiesObj.get('TOKEN_AUTH')?.value || '';

  return (
    <div className='container max-w-screen-xl mx-auto px-4 pt-4'>
      <DynamicCard
        header={
          <div className='flex p-4 justify-between items-center'>
            <h1 className="text-xl font-semibold text-white">Validasi Pendaftar Baru</h1>
            <p className="text-sm text-gray-400">
              Menunggu Konfirmasi
            </p>
          </div>
        }
        body={
          <ValidasiTable data={dataPendaftar} token={token} />
        }
      />
    </div>
  );
}
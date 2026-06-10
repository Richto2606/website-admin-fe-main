import React from 'react';
import ValidasiTable from './table';
import { cookies } from 'next/headers';

// Fungsi Fetch Server-Side
async function getPendaftar() {
  const cookiesObj = await cookies();
  const token = cookiesObj.get('TOKEN_AUTH')?.value;

  // DEBUG: Cek apakah token benar-benar terbaca di Next.js
  console.log("Token yang dikirim:", token); 

  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/pendaftaran', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Pastikan formatnya 'Bearer ' + token
        'Authorization': `Bearer ${token}`, 
        'x-api-key': '881182541952993820593968'
      },
      cache: 'no-store'
    });

    const response = await res.json();
    console.log("Respon dari Laravel:", response);

    if (res.ok && response.data) {
      return response.data; 
    }
    return [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export default async function ValidasiPendaftarPage() {
  // Eksekusi fungsi fetch sebelum halaman dirender
  const dataPendaftar = await getPendaftar();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Validasi Pendaftar Baru</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Daftar calon penghuni Asrama Kutai Kartanegara yang menunggu konfirmasi.
        </p>
        
        {/* Lempar data yang didapat ke komponen tabel */}
        <ValidasiTable data={dataPendaftar} />
      </div>
    </div>
  );
}
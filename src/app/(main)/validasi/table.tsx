'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ValidasiTableProps {
  data: any[];
  token: string; 
}

export default function ValidasiTable({ data, token }: ValidasiTableProps) {
  const router = useRouter();
  
  // Mengambil baseURL dari environment variable
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.asramaputrakukar.my.id/api/v1';

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      // 💡 Perhatikan URL sekarang menggunakan BASE_URL dinamis
      const res = await fetch(`${BASE_URL}/pendaftaran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, 
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968'
        },
        body: JSON.stringify({ status_pendaftaran: status }),
      });

      if (res.ok) {
        alert(`Status berhasil diubah menjadi ${status}`);
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Unauthorized'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  // ... (Sisa kode tabel Anda tetap sama)
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-transparent">
        Belum ada data pendaftar baru.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-transparent">
      <table className="w-full text-sm text-left text-white">
        <thead className="border-b border-white/10 text-sm font-medium text-gray-300">
          <tr>
            <th className="h-12 px-4 text-left align-middle font-medium">Nama Lengkap</th>
            <th className="h-12 px-4 text-left align-middle font-medium">NIM</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Program Studi</th>
            <th className="h-12 px-4 text-center align-middle font-medium">Status</th>
            <th className="h-12 px-4 text-center align-middle font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((pendaftar) => (
            <tr 
              key={pendaftar.id_pendaftaran}
              className="transition-colors hover:bg-white/5"
            >
              <td className="p-4 align-middle font-medium">{pendaftar.nama_lengkap}</td>
              <td className="p-4 align-middle text-gray-300">{pendaftar.nim}</td>
              <td className="p-4 align-middle text-gray-300">{pendaftar.program_studi}</td>
              <td className="p-4 align-middle text-center">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md 
                  ${pendaftar.status_pendaftaran === 'Menunggu' ? 'bg-yellow-500/20 text-yellow-500' : 
                    pendaftar.status_pendaftaran === 'Diterima' ? 'bg-green-500/20 text-green-400' : 
                  'bg-red-500/20 text-red-400'}`}>
                  {pendaftar.status_pendaftaran || 'Menunggu'}
                </span>
              </td>
              <td className="p-4 align-middle text-center text-sm font-medium space-x-2">
                <button 
                  onClick={() => handleUpdateStatus(pendaftar.id_pendaftaran, 'Diterima')}
                  className="text-white bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded-md transition"
                >
                  Terima
                </button>
                <button 
                  onClick={() => handleUpdateStatus(pendaftar.id_pendaftaran, 'Ditolak')}
                  className="text-white bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-md transition"
                >
                  Tolak
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
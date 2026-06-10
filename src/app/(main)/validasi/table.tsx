'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ValidasiTableProps {
  data: any[];
}

export default function ValidasiTable({ data }: ValidasiTableProps) {
  const router = useRouter();

  const handleUpdateStatus = async (id: number, status: string) => {
    // Ambil token dari cookie 'TOKEN_AUTH' yang kamu simpan saat login
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    
    const token = getCookie('TOKEN_AUTH');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/pendaftaran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Menambahkan Authorization header dengan token
          'Authorization': `Bearer ${token}`, 
          'x-api-key': '881182541952993820593968'
        },
        body: JSON.stringify({ status_pendaftaran: status }),
      });

      if (res.ok) {
        router.refresh(); 
      } else {
        const errorData = await res.json();
        console.error("Gagal update:", errorData);
        alert('Gagal: ' + (errorData.message || 'Unauthorized'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((pendaftar) => (
            <tr key={pendaftar.id_pendaftaran}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {pendaftar.nama_lengkap}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pendaftar.nim}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pendaftar.program_studi}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${pendaftar.status_pendaftaran === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' : 
                    pendaftar.status_pendaftaran === 'Diterima' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {pendaftar.status_pendaftaran || 'Menunggu'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button 
                  onClick={() => handleUpdateStatus(pendaftar.id_pendaftaran, 'Diterima')}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                >
                  Terima
                </button>
                <button 
                  onClick={() => handleUpdateStatus(pendaftar.id_pendaftaran, 'Ditolak')}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
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
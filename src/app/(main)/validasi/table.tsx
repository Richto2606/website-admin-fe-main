"use client";

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Pendaftaran {
  id_pendaftaran: number;
  user_id: number;
  nama_lengkap: string;
  nim: string;
  universitas: string;
  program_studi: string;
  jenis_kelamin: string;
  no_hp: string;
  email: string;
  alamat_asal: string;
  status_pendaftaran: string;
  created_at: string;
}

export default function ValidasiTable() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔥 FETCH DATA DARI API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching pendaftaran data...');
        
        const response = await fetch('https://asramaputrakukar.my.id/api/v1/pendaftaran', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': '881182541952993820593968'
          },
          cache: 'no-store'
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 Data dari API:', result);

        if (result.success && result.data) {
          setData(result.data);
        } else if (result.data) {
          setData(result.data);
        } else {
          setError('Data tidak ditemukan atau format tidak sesuai.');
        }
      } catch (error: any) {
        console.error('❌ Error fetch data:', error);
        setError(error.message || 'Gagal mengambil data pendaftaran.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 FUNGSI UPDATE STATUS
  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: `Apakah Anda yakin ingin mengubah status menjadi ${status}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1F3877',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ubah',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      const response = await fetch(`https://asramaputrakukar.my.id/api/v1/pendaftaran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': '881182541952993820593968'
        },
        body: JSON.stringify({ status_pendaftaran: status })
      });

      if (response.ok) {
        // Update data lokal
        setData(prev => 
          prev.map(item => 
            item.id_pendaftaran === id 
              ? { ...item, status_pendaftaran: status } 
              : item
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Status berhasil diubah menjadi ${status}`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error update status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat mengubah status.'
      });
    }
  };

  // 🔥 RENDER LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  // 🔥 RENDER ERROR
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // 🔥 RENDER TABLE
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Data Pendaftaran</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          Total: {data.length} Pendaftar
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Belum ada data pendaftaran.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Universitas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prodi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No HP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.id_pendaftaran} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama_lengkap || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.nim || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.universitas || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.program_studi || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.no_hp || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.email ? (
                      <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
                        {item.email}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status_pendaftaran === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                      item.status_pendaftaran === 'Diterima' ? 'bg-green-100 text-green-800' :
                      item.status_pendaftaran === 'Ditolak' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status_pendaftaran || 'Menunggu'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex gap-1">
                      {item.status_pendaftaran !== 'Diterima' && (
                        <button
                          onClick={() => updateStatus(item.id_pendaftaran, 'Diterima')}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        >
                          Terima
                        </button>
                      )}
                      {item.status_pendaftaran !== 'Ditolak' && (
                        <button
                          onClick={() => updateStatus(item.id_pendaftaran, 'Ditolak')}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Tolak
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
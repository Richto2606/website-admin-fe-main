"use client";

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asramaputrakukar.my.id/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || API_BASE_URL.replace('/api/v1', '');

function getAuthToken() {
  const localToken = localStorage.getItem('token') || localStorage.getItem('TOKEN_AUTH');

  if (localToken) {
    return localToken;
  }

  const match = document.cookie.match(new RegExp('(^| )TOKEN_AUTH=([^;]+)'));

  return match ? decodeURIComponent(match[2]) : null;
}

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
  nama_wali?: string;
  semester?: number;
  no_ortu_wali?: string;
  nama_ortu_wali?: string;
  file_berkas?: string;
  status_pendaftaran: string;
  created_at: string;
}

export default function ValidasiTable() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  // FETCH DATA DARI API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching pendaftaran data...');
        
        const response = await fetch(`${API_BASE_URL}/pendaftaran`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': API_KEY
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

  // ==============================================
  // 🔥 FUNGSI TERIMA PENDAFTARAN (BARU)
  // ==============================================
  const terimaPendaftaran = async (id: number, dataPendaftaran: Pendaftaran) => {
    try {
      const token = getAuthToken();
      
      // STEP 1: Konfirmasi
      const result = await Swal.fire({
        title: '✅ Konfirmasi Penerimaan',
        html: `
          <div style="text-align:left;">
            <p>Apakah Anda yakin ingin menerima pendaftaran ini?</p>
            <p style="font-weight:bold; margin-top:10px;">${dataPendaftaran.nama_lengkap}</p>
            <p style="font-size:14px; color:#666;">NIM: ${dataPendaftaran.nim}</p>
            <p style="font-size:14px; color:#666;">Universitas: ${dataPendaftaran.universitas}</p>
            <hr style="margin:10px 0; border:1px solid #eee;">
            <p style="color:#059669; font-weight:bold;">📌 Data akan otomatis masuk ke Kelola Penghuni</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#d33',
        confirmButtonText: '✅ Ya, Terima',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      // STEP 2: Update status pendaftaran menjadi "Diterima"
      console.log('📝 STEP 2: Update status pendaftaran...');
      const updateResponse = await fetch(`${API_BASE_URL}/pendaftaran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY
        },
        body: JSON.stringify({ status_pendaftaran: 'Diterima' })
      });

      if (!updateResponse.ok) {
        throw new Error('Gagal mengupdate status pendaftaran');
      }
      console.log('✅ Status pendaftaran berhasil diupdate');

      // STEP 3: Cek apakah user sudah punya data di residents
      console.log('🔍 STEP 3: Cek data resident untuk user_id:', dataPendaftaran.user_id);
      const checkResidentResponse = await fetch(
        `${API_BASE_URL}/residents/user/${dataPendaftaran.user_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': API_KEY
          }
        }
      );

      let residentData = null;
      if (checkResidentResponse.ok) {
        const result = await checkResidentResponse.json();
        if (result.success && result.data) {
          residentData = result.data;
        }
      }

      // STEP 4: Jika user sudah punya data resident, UPDATE
      if (residentData) {
        console.log('📝 STEP 4A: User sudah punya resident, update data...');
        const updateResidentResponse = await fetch(`${API_BASE_URL}/residents/${residentData.id}/from-pendaftaran`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            name: dataPendaftaran.nama_lengkap,
            phone_number: dataPendaftaran.no_hp,
            address: dataPendaftaran.alamat_asal,
            status: 'Aktif',
            tanggal_masuk: new Date().toISOString().split('T')[0]
          })
        });

        if (!updateResidentResponse.ok) {
          throw new Error('Gagal mengupdate data resident');
        }
        console.log('✅ Data resident berhasil diupdate');

      // STEP 5: Jika user belum punya data resident, CREATE BARU
      } else {
        console.log('📝 STEP 4B: User belum punya resident, buat baru...');
        const createResidentResponse = await fetch(`${API_BASE_URL}/residents/from-pendaftaran`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            user_id: dataPendaftaran.user_id,
            name: dataPendaftaran.nama_lengkap,
            phone_number: dataPendaftaran.no_hp,
            address: dataPendaftaran.alamat_asal,
            status: 'Aktif'
          })
        });

        if (!createResidentResponse.ok) {
          const errorText = await createResidentResponse.text();
          console.error('❌ Error response:', errorText);
          throw new Error(`Gagal menambahkan resident: ${createResidentResponse.status}`);
        }
        console.log('✅ Resident baru berhasil dibuat');
      }

      // STEP 6: Update data lokal
      console.log('📝 STEP 5: Update data lokal...');
      setData(prev => 
        prev.map(item => 
          item.id_pendaftaran === id 
            ? { ...item, status_pendaftaran: 'Diterima' } 
            : item
        )
      );

      // STEP 7: Tampilkan notifikasi sukses
      console.log('🎉 STEP 6: Proses selesai!');
      await Swal.fire({
        icon: 'success',
        title: '🎉 Berhasil!',
        html: `
          <p><strong>${dataPendaftaran.nama_lengkap}</strong> telah diterima!</p>
          <p style="color:#059669; font-size:14px;">✅ Data telah otomatis masuk ke Kelola Penghuni</p>
          <p style="font-size:12px; color:#888; margin-top:10px;">
            Status: Diterima | Tanggal Masuk: ${new Date().toLocaleDateString('id-ID')}
          </p>
        `,
        timer: 3000,
        showConfirmButton: true,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Lihat Penghuni'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/admin/kelola-penghuni';
        }
      });

    } catch (error: any) {
      console.error('❌ Error dalam proses penerimaan:', error);
      
      // 🔥 Jika gagal, rollback status pendaftaran
      try {
        const token = getAuthToken();
        await fetch(`${API_BASE_URL}/pendaftaran/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ status_pendaftaran: 'Menunggu' })
        });
        console.log('↩️ Rollback status pendaftaran berhasil');
      } catch (rollbackError) {
        console.error('❌ Gagal rollback status:', rollbackError);
      }

      Swal.fire({
        icon: 'error',
        title: '❌ Gagal!',
        text: error.message || 'Terjadi kesalahan saat menerima pendaftaran. Silakan coba lagi.',
        confirmButtonColor: '#d33'
      });
    }
  };

  // ==============================================
  // 🔥 FUNGSI TOLAK PENDAFTARAN (BARU)
  // ==============================================
  const tolakPendaftaran = async (id: number, nama: string) => {
    try {
      const token = getAuthToken();
      
      const result = await Swal.fire({
        title: '❌ Konfirmasi Penolakan',
        text: `Apakah Anda yakin ingin menolak pendaftaran ${nama}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Tolak',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      const response = await fetch(`${API_BASE_URL}/pendaftaran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY
        },
        body: JSON.stringify({ status_pendaftaran: 'Ditolak' })
      });

      if (!response.ok) {
        throw new Error('Gagal menolak pendaftaran');
      }

      setData(prev => 
        prev.map(item => 
          item.id_pendaftaran === id 
            ? { ...item, status_pendaftaran: 'Ditolak' } 
            : item
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Pendaftaran ${nama} telah ditolak.`,
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error tolak pendaftaran:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menolak pendaftaran.'
      });
    }
  };

  // ==============================================
  // 🔥 FUNGSI LIHAT DETAIL
  // ==============================================
  const viewDetail = (item: Pendaftaran) => {
    Swal.fire({
      title: '📋 Detail Pendaftaran',
      width: 600,
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.8;">
          <p><strong>Nama Lengkap:</strong> ${item.nama_lengkap || '-'}</p>
          <p><strong>NIM:</strong> ${item.nim || '-'}</p>
          <p><strong>Universitas:</strong> ${item.universitas || '-'}</p>
          <p><strong>Program Studi:</strong> ${item.program_studi || '-'}</p>
          <p><strong>Jenis Kelamin:</strong> ${item.jenis_kelamin || '-'}</p>
          <p><strong>No HP:</strong> ${item.no_hp || '-'}</p>
          <p><strong>Email:</strong> ${item.email || '-'}</p>
          <p><strong>Alamat Asal:</strong> ${item.alamat_asal || '-'}</p>
          <hr style="margin: 8px 0; border: 1px solid #eee;" />
          <p><strong>Nama Wali:</strong> ${item.nama_wali || '-'}</p>
          <p><strong>Semester:</strong> ${item.semester || '-'}</p>
          <p><strong>No Orang Tua/Wali:</strong> ${item.no_ortu_wali || '-'}</p>
          <p><strong>Nama Orang Tua/Wali:</strong> ${item.nama_ortu_wali || '-'}</p>
          <hr style="margin: 8px 0; border: 1px solid #eee;" />
          <p><strong>Status:</strong> 
            <span style="padding:2px 8px; border-radius:999px; font-size:12px; font-weight:bold; 
              ${item.status_pendaftaran === 'Menunggu' ? 'background:#fef3c7;color:#92400e;' :
                item.status_pendaftaran === 'Diterima' ? 'background:#d1fae5;color:#065f46;' :
                'background:#fee2e2;color:#991b1b;'}">
              ${item.status_pendaftaran || 'Menunggu'}
            </span>
          </p>
          <p><strong>Tanggal Daftar:</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</p>
          <p><strong>File Berkas:</strong> ${item.file_berkas ? 
            `<a href="${BASE_URL}/${item.file_berkas}" target="_blank" style="color:#2563eb; text-decoration:underline;">📎 Lihat Berkas</a>` 
            : '-'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#1F3877',
      confirmButtonText: 'Tutup'
    });
  };

  // ==============================================
  // FILTER DATA
  // ==============================================
  const filteredData = filterStatus === 'semua' 
    ? data 
    : data.filter(item => item.status_pendaftaran === filterStatus);

  // RENDER LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  // RENDER ERROR
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

  // RENDER TABLE
  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Data Pendaftaran</h2>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Total: {data.length} Pendaftar
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Semua Status</option>
            <option value="Menunggu">🟡 Menunggu</option>
            <option value="Diterima">🟢 Diterima</option>
            <option value="Ditolak">🔴 Ditolak</option>
          </select>
        </div>
      </div>

      {filteredData.length === 0 ? (
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
              {filteredData.map((item, index) => (
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
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => viewDetail(item)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                      >
                        📋 Detail
                      </button>
                      {item.status_pendaftaran === 'Menunggu' && (
                        <>
                          <button
                            onClick={() => terimaPendaftaran(item.id_pendaftaran, item)}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                          >
                            ✅ Terima
                          </button>
                          <button
                            onClick={() => tolakPendaftaran(item.id_pendaftaran, item.nama_lengkap)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                          >
                            ❌ Tolak
                          </button>
                        </>
                      )}
                      {item.status_pendaftaran === 'Diterima' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          ✓ Sudah Diterima
                        </span>
                      )}
                      {item.status_pendaftaran === 'Ditolak' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          ✗ Ditolak
                        </span>
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

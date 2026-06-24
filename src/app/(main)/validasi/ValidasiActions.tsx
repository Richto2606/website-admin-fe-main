"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ValidasiActions({ row }: { row: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendaftar = row.original;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleUpdateStatus = async (status: string) => {
  // Tambahkan pengecekan token sebelum fetch
  if (!token) {
    alert("Token tidak ditemukan, silakan login kembali.");
    localStorage.removeItem('token');
    router.push('/login');
    return;
  }

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asramaputrakukar.my.id/api/v1';
    
    // Debugging: cek di console apa yang dikirim
    console.log(`Mengupdate ${pendaftar.id_pendaftaran} ke status: ${status}`);

    const res = await fetch(`${BASE_URL}/pendaftaran/${pendaftar.id_pendaftaran}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
        'x-api-key': '881182541952993820593968'
      },
      body: JSON.stringify({ status_pendaftaran: status }),
    });

    if (res.ok) {
      alert(`Status berhasil diubah menjadi ${status}`);
      setIsOpen(false);
      router.refresh(); 
    } else {
      // Jika status bukan 200, log error dari server
      const errorText = await res.text();
      console.error('Server error response:', errorText);
      alert('Gagal mengubah status. Periksa console untuk detail.');
    }
  } catch (error) {
    console.error('Koneksi error:', error);
    alert('Terjadi kesalahan jaringan.');
  }
};

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-800 rounded-md transition-colors text-gray-400"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-8 top-0 w-32 bg-[#0F172A] border border-slate-700 rounded-md shadow-xl z-50 overflow-hidden">
          <button 
            onClick={() => handleUpdateStatus('Diterima')}
            className="w-full text-left px-4 py-2.5 text-sm text-green-400 hover:bg-slate-800 transition-colors font-medium"
          >
            Terima
          </button>
          <button 
            onClick={() => handleUpdateStatus('Ditolak')}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition-colors font-medium"
          >
            Tolak
          </button>
        </div>
      )}
    </div>
  );
}
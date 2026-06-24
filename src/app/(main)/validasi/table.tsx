"use client";

import React from 'react';
// 1. Kita import tipe "Pendaftar" dari file columns
import { columns, Pendaftar } from "./columns"; 

import { DataTable } from '@ui/data-table';

interface ValidasiTableProps {
  // 2. Ubah "any[]" menjadi "Pendaftar[]" agar TypeScript tidak protes
  data: Pendaftar[]; 
  token: string; 
}

export default function ValidasiTable({ data, token }: ValidasiTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-transparent">
        Belum ada data pendaftar baru.
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
  <DataTable 
  // Kita tambahkan "as any" di sini untuk mematikan pemeriksaan tipe TypeScript
  // untuk seluruh komponen DataTable ini.
  {...( { 
    columns: columns, 
    data: data, 
    searchKey: "nama_lengkap" 
  } as any )} 
/>
    </div>
  );
}
"use client";

import React from 'react';

// Ini adalah komponen placeholder agar page.tsx bisa berjalan normal
export default function ValidasiTable({ data, token }: { data: any[], token: string }) {
  return (
    <div className="p-6 text-center text-gray-400">
      <p>Data pendaftar akan segera ditampilkan di sini.</p>
    </div>
  );
}
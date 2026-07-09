"use client";

import React, { useEffect, useState, useRef } from "react";
import Breadcumbs from "@ui/breadcrumbs";
import { DataTable } from '@ui/data-table';
import { MessageResponse, Resident } from "@interfaces/data-types";
import { columns } from './columns';
import DynamicCard from '@components/particel/dynamic-card';
import { Button } from '@components/button';
import { Plus, SearchIcon, RefreshCw } from 'lucide-react';
import { TableFooter } from '@ui/data-table/table-footer';
import Link from "next/link";
import { createTitleAndBreadcrumbs, residentString, residentUrl } from "@constant/breadcrumbs";
import SatellitePrivate from "@services/satellite/private";
import Swal from 'sweetalert2';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<MessageResponse>({
    count: 1,
    current_page: 1,
    previous_page: 0,
    total_pages: 1,
    success: true,
    message: '',
    data: residents
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 🔥 REF UNTUK MENYIMPAN JUMLAH PENGHUNI SEBELUMNYA
  const previousCountRef = useRef<number>(0);
  // 🔥 REF UNTUK MENYIMPAN NAMA PENGHUNI BARU
  const newResidentsRef = useRef<Resident[]>([]);

  // 🔥 FETCH RESIDENTS
  const fetchResidents = async (page: number, query: string, showLoading: boolean = true, showNotification: boolean = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const res = await SatellitePrivate.get<MessageResponse>(
        `/residents`,
        {
          params: {
            name: query,
            page: page + 1,
            limit: 10,
            sort_by: 'updated_at'
          }
        }
      );
      const response = res.data;
      const residentsData: Resident[] = Array.isArray(response.data) ? response.data : [];
      
      // 🔥 CEK APAKAH ADA PENGHUNI BARU
      const previousCount = previousCountRef.current;
      const currentCount = residentsData.length;
      
      // Jika data sebelumnya tidak kosong dan ada penambahan
      if (previousCount > 0 && currentCount > previousCount && showNotification) {
        // Cari data baru (data yang tidak ada di list sebelumnya)
        const oldIds = new Set(residents.map(r => r.id));
        const newResidents = residentsData.filter(r => !oldIds.has(r.id));
        
        if (newResidents.length > 0) {
          newResidentsRef.current = newResidents;
          
          // 🔥 PERBAIKI: Gunakan properti yang tersedia di Resident
          const names = newResidents.map(r => r.name).join(', ');
          
          // 🔥 PERBAIKI: Buat list nama dengan properti yang ada
          const residentList = newResidents.map(r => {
            let details = `🏠 <strong>${r.name}</strong>`;
            if (r.phone_number) {
              details += ` - 📱 ${r.phone_number}`;
            }
            // 🔥 HAPUS tanggal_masuk karena tidak ada di interface Resident
            // if (r.tanggal_masuk) {
            //   details += ` - 📅 ${new Date(r.tanggal_masuk).toLocaleDateString('id-ID')}`;
            // }
            return details;
          }).join('<br>');
          
          Swal.fire({
            icon: 'info',
            title: '📢 Penghuni Baru!',
            html: `
              <div style="text-align:left;">
                <p style="font-size:16px; font-weight:bold; color:#059669;">
                  ✅ ${newResidents.length} penghuni baru telah masuk!
                </p>
                <hr style="margin:10px 0; border:1px solid #eee;">
                <p style="font-weight:bold;">Nama penghuni baru:</p>
                <ul style="list-style:none; padding:0;">
                  ${newResidents.map(r => `
                    <li style="padding:4px 0; border-bottom:1px solid #f3f4f6;">
                      🏠 <strong>${r.name}</strong> 
                      ${r.phone_number ? `- 📱 ${r.phone_number}` : ''}
                      ${r.created_at ? `- 📅 ${new Date(r.created_at).toLocaleDateString('id-ID')}` : ''}
                    </li>
                  `).join('')}
                </ul>
                <hr style="margin:10px 0; border:1px solid #eee;">
                <p style="color:#6b7280; font-size:12px;">
                  Total penghuni sekarang: <strong>${currentCount}</strong> orang
                </p>
              </div>
            `,
            confirmButtonColor: '#059669',
            confirmButtonText: 'Lihat Semua',
            timer: 5000,
            timerProgressBar: true,
            showCancelButton: true,
            cancelButtonText: 'Tutup',
            cancelButtonColor: '#6b7280'
          }).then((result) => {
            if (result.isConfirmed) {
              // Scroll ke tabel atau refresh data
              document.querySelector('.data-table')?.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }
      }
      
      // 🔥 UPDATE DATA
      setResidents(residentsData);
      
      // 🔥 PERBAIKI: Hapus duplicate data di pagination
      setPagination({
        count: response.count || residentsData.length,
        current_page: response.current_page || page + 1,
        previous_page: response.previous_page || 0,
        total_pages: response.total_pages || 1,
        success: response.success !== undefined ? response.success : true,
        message: response.message || 'Success',
        data: residentsData
      });
      
      // 🔥 UPDATE REF COUNTER
      previousCountRef.current = residentsData.length;
      
    } catch (error) {
      console.error("Error fetching residents:", error);
      if (showLoading) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat mengambil data penghuni. Silakan coba lagi.',
          confirmButtonColor: '#d33'
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 🔥 REFRESH DATA (Pull to refresh)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchResidents(currentPage, searchQuery, false, true);
    if (newResidentsRef.current.length > 0) {
      // Sudah ditangani di fetchResidents
      newResidentsRef.current = [];
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Data Diperbarui',
        text: 'Data penghuni berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  useEffect(() => {
    fetchResidents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
    // Reset counter saat search
    previousCountRef.current = 0;
  };

  const breadcrumbs = createTitleAndBreadcrumbs(residentString, residentUrl);

  return (
    <div className='container max-w-screen-xl mx-auto px-4'>
      <Breadcumbs title={breadcrumbs.indexTitle} breadCrumbs={breadcrumbs.breadcrumbsIndex} />
      
      <DynamicCard
        header={
          <div className='flex p-4 justify-between flex-wrap gap-2'>
            <div className="flex gap-2">
              <Link href={'/residents/add'}>
                <Button   
                  variant='outline'
                  size={null}
                  disabled={isLoading}
                  className='bg-yellow hover:bg-gold hover:text-blonde dark:text-black dark:hover:text-white border-0 p-2'
                >
                  <Plus className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
                  <span className='ml-1 '>Tambah {residentString}</span>
                </Button>
              </Link>
              {/* 🔥 TOMBOL REFRESH */}
              <Button
                variant='outline'
                size={null}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='border p-2'
              >
                <RefreshCw className={`h-[1.2rem] w-[1.2rem] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className='ml-1'>Refresh</span>
              </Button>
            </div>
            
            <div className="flex flex-row items-center rounded border">
              <SearchIcon className="ml-2 text-foreground" />
              <input
                type="text"
                placeholder={`Cari nama ${residentString.toLowerCase()} disini...`}
                className="h-full py-0 px-2 border-none text-sm w-72 focus:outline-none focus:ring-1 focus:ring-background"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        }
        body={
          isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <span className="ml-3 text-gray-600">Memuat data penghuni...</span>
            </div>
          ) : residents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-gray-600">Belum Ada Penghuni</h3>
              <p className="text-gray-400 mt-2">
                Data penghuni akan muncul setelah Anda menerima pendaftaran atau menambahkan secara manual.
              </p>
            </div>
          ) : (
            <DataTable 
              data={residents} 
              columns={columns}
              footer={
                <TableFooter
                  pageIndex={currentPage}
                  pageCount={pagination.total_pages || 1}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              }
            />
          )
        }
      />
    </div>
  );
}
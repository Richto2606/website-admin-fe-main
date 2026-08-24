"use client";

import React, { useEffect, useState } from "react";
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
  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔥 FETCH RESIDENTS - VERSI SEDERHANA
  const fetchResidents = async (page: number, query: string) => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching residents...');
      
      const res = await SatellitePrivate.get(
        '/residents',
        {
          params: {
            name: query || '',
            page: page + 1,
            limit: 10,
            sort_by: 'updated_at'
          }
        }
      );

      console.log('📦 Raw response:', res);

      // 🔥 AMBIL DATA DENGAN AMAN
      let residentsData: Resident[] = [];
      let count = 0;
      let current_page = 1;
      let total_pages = 1;

      if (res && res.data) {
        const response = res.data;
        console.log('📦 Response data:', response);

        if (Array.isArray(response.data)) {
          residentsData = response.data;
          count = response.count || residentsData.length;
          current_page = response.current_page || page + 1;
          total_pages = response.total_pages || 1;
        } else if (Array.isArray(response)) {
          residentsData = response;
          count = residentsData.length;
        }
      }

      console.log('✅ Data residents:', residentsData);
      console.log('✅ Jumlah data:', residentsData.length);

      // 🔥 UPDATE STATE
      setResidents(residentsData);
      setPagination({
        count: count,
        current_page: current_page,
        total_pages: total_pages
      });

    } catch (error) {
      console.error('❌ Error fetching residents:', error);
      
      let errorMessage = 'Gagal memuat data penghuni. Silakan coba lagi.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
          errorMessage = 'Sesi login habis. Silakan login ulang.';
        } else if (axiosError.code === 'ERR_NETWORK') {
          errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 🔥 REFRESH DATA
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchResidents(currentPage, searchQuery);
  };

  // 🔥 SEARCH
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  // 🔥 PAGINATION
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 🔥 INITIAL FETCH
  useEffect(() => {
    fetchResidents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

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
                  onPageChange={handlePageChange}
                />
              }
            />
          )
        }
      />
    </div>
  );
}
'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@components/button';
import CustomText from '@components/particel/custom-text';
import DynamicCard from '@components/particel/dynamic-card';
import { createTitleAndBreadcrumbs, galleryString, galleryUrl } from '@constant/breadcrumbs';
import Breadcumbs from '@ui/breadcrumbs';
import AddGalleries from '@ui/data/galleries/add';
import Link from 'next/link';
import { GalleryAddForm } from '@interfaces/data-types';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '../hook';
import axios from 'axios';

// ✅ PERBAIKI INI
const urlAPIBE = "http://127.0.0.1:8000/api/v1";
const APIKEY = "881182541952993820593968";

export default function AddGalleriesPage() {
  const router = useRouter();
  const formDataRef = useRef<GalleryAddForm>({
    title: '',
    type: 'Foto',
    category_id: '',
    file: new File([], 'file'),
    files: undefined,
    url: ''
  });
  
  const { isLoading, createGallery } = useQueryClient();
  const [categories, setCategories] = useState([]);

  // 🔥 FETCH KATEGORI - PERBAIKI URL
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urlAPIBE}/public/categories`, {
          headers: { "X-API-KEY": APIKEY }
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFormSubmit = (data: GalleryAddForm) => {
    formDataRef.current = data;
  };

  const handleSave = async () => {
    await createGallery(formDataRef.current, () => {
      router.push('/galleries');
    });
  }
  const breadcrumbs = createTitleAndBreadcrumbs(galleryString, galleryUrl);

  return (
    <>
      <div className="container max-w-screen-xl mx-auto px-4">
        <Breadcumbs title={breadcrumbs.addTitle} breadCrumbs={breadcrumbs.breadcrumbsAdd} />
        <DynamicCard
          border={true}
          header={
            <div className="flex p-4 justify-between items-center">
              <CustomText text={`Tambah Baru`} textSize="2xl" />
              <div className="flex flex-row items-center space-x-4">
                <Link href={'/galleries'}>
                  <Button
                    variant="outline"
                    size={null}
                    disabled={isLoading}
                    className="bg-primary p-2 rounded border"
                  >
                    <span className="ml-1 ">Batal</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  size={null}
                  disabled={isLoading}
                  className="bg-yellow dark:bg-blonde hover:bg-gold hover:text-blonde dark:text-black dark:hover:text-white border-0 p-2"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <span className="ml-1 ">Tambah {galleryString}</span>
                  )}
                </Button>
              </div>
            </div>
          }
          body={<AddGalleries onSubmit={handleFormSubmit} />}
        />
      </div>
    </>
  );
}
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import DynamicCard from '@components/particel/dynamic-card';

// 🔥 TAMBAHKAN INTERFACE UNTUK TIPE DATA
interface Pendaftaran {
  id_pendaftaran?: number;
  nama_lengkap: string;
  nim: string;
  universitas: string;
  program_studi: string;
  jenis_kelamin: string;
  no_hp: string;
  email?: string;
  alamat_asal: string;
  status_pendaftaran: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

async function getPendaftaran(): Promise<Pendaftaran[]> {
  const cookiesObj = await cookies();
  const token = cookiesObj.get('TOKEN_AUTH')?.value;

  if (!token) {
    console.warn('Token tidak ditemukan di cookies');
    return [];
  }

  try {
    const res = await fetch('https://asramaputrakukar.my.id/api/v1/pendaftaran', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': '881182541952993820593968'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const response = await res.json();
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.data) {
      return response.data;
    }
    
    console.warn('Data tidak ditemukan dalam response:', response);
    return [];
    
  } catch (error) {
    console.error('Error fetching pendaftaran:', error);
    return [];
  }
}

export default async function PendaftaranPage() {
  const data = await getPendaftaran();

  if (!data || data.length === 0) {
    return (
      <div className='container max-w-screen-xl mx-auto px-4 pt-4'>
        <h1 className="text-2xl font-bold mb-6">📋 Data Pendaftaran</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Belum ada data pendaftaran.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container max-w-screen-xl mx-auto px-4 pt-4 pb-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Data Pendaftaran</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          Total: {data.length} Pendaftar
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIM</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Universitas</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Program Studi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No HP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item: Pendaftaran, index: number) => ( // 🔥 TAMBAHKAN TIPE DI SINI
              <tr key={item.id_pendaftaran || index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama_lengkap || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.nim || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.universitas || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.program_studi || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.no_hp || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {item.email ? (
                    <a href={`mailto:${item.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {item.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Menampilkan {data.length} data pendaftaran
      </div>
    </div>
  );
}
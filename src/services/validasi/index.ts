'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('TOKEN_AUTH')?.value;

  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login kembali.');
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-api-key': API_KEY,
  };
}

async function readApiResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getPendaftaranList() {
  const response = await fetch(`${API_BASE_URL}/pendaftaran`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  const result = await readApiResponse(response);

  if (!response.ok) {
    throw new Error(result?.message || `Gagal mengambil data pendaftaran (${response.status}).`);
  }

  return result;
}

export async function updatePendaftaranStatus(id: number, status: string) {
  const response = await fetch(`${API_BASE_URL}/pendaftaran/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ status_pendaftaran: status }),
  });

  const result = await readApiResponse(response);

  if (!response.ok) {
    throw new Error(result?.message || 'Gagal mengubah status pendaftaran.');
  }

  return result;
}

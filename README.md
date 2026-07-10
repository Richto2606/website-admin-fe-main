# Website Admin FE

Frontend admin untuk aplikasi Asrama Kutai Kartanegara. Aplikasi ini memakai Next.js dan mengambil data dari backend Laravel melalui environment variable.

## Local Development

1. Install dependency:

```bash
npm install
```

2. Buat file `.env.local` dari contoh:

```bash
cp .env.example .env.local
```

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Isi `.env.local` untuk backend lokal:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_KEY=isi_sesuai_API_KEY_backend
NEXT_PUBLIC_NODE_ENV=development
```

Nilai `NEXT_PUBLIC_API_KEY` harus sama dengan `API_KEY` di file `.env` backend Laravel.

4. Jalankan backend Laravel:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

5. Jalankan frontend:

```bash
npm run dev
```

Buka `http://localhost:3000/login`.

## Production

Saat deploy ke production, jangan hardcode URL API di source code. Set environment variable di server, Vercel, atau panel hosting:

```env
NEXT_PUBLIC_API_BASE_URL=https://domain-backend-anda.com/api/v1
NEXT_PUBLIC_BASE_URL=https://domain-backend-anda.com
NEXT_PUBLIC_API_KEY=isi_sesuai_API_KEY_production
NEXT_PUBLIC_NODE_ENV=production
```

Setelah env production diubah, build ulang aplikasi:

```bash
npm run build
npm run start
```

## Catatan Penting

- `NEXT_PUBLIC_API_BASE_URL` harus langsung mengarah ke prefix API backend, misalnya `/api/v1`.
- `NEXT_PUBLIC_API_KEY` harus sama dengan `API_KEY` di `.env` backend Laravel.
- Untuk local, gunakan `http://127.0.0.1:8000`, bukan `https://127.0.0.1:8000`, kecuali backend lokal memang memakai SSL.
- Setelah mengubah `.env.local`, restart server Next.js.

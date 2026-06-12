// 3. Fungsi untuk mengirim data ke Backend Laravel saat tombol diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Fungsi kecil untuk mencari dan mengambil Cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const token = localStorage.getItem('token') || getCookie('TOKEN_AUTH'); 

    if (!token) {
      setMessage({ type: 'error', text: 'Anda harus login terlebih dahulu untuk mendaftar.' });
      setLoading(false);
      return;
    }

    try {
      // 💡 UBAH URL KE DOMAIN PRODUKSI ANDA
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.asramaputrakukar.my.id/api/v1';
      
      const response = await fetch(`${BASE_URL}/pendaftaran`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // 💡 JANGAN LUPA TAMBAHKAN API KEY
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pendaftaran Anda berhasil dikirim! Silakan tunggu konfirmasi admin.' });
        setFormData({
          nama_lengkap: '',
          nim: '',
          universitas: '',
          program_studi: '',
          jenis_kelamin: 'Laki-laki',
          no_hp: '',
          alamat_asal: ''
        });
      } else if (response.status === 422) {
        // Jika validasi gagal dari Laravel
        setMessage({ type: 'error', text: 'Periksa kembali data Anda, ada field yang tidak sesuai.' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal mengirim pendaftaran.' });
      }
    } catch (error) {
      console.error('Koneksi error:', error);
      setMessage({ type: 'error', text: 'Gagal terhubung ke server backend.' });
    } finally {
      setLoading(false);
    }
  };
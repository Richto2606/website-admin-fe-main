"use client";

// Wajib di baris pertama tanpa ada kode apa pun di atasnya
import React, { useState } from 'react';

export default function Pendaftaran() {
  // 1. Menyiapkan state untuk menampung isi form input
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nim: '',
    universitas: '',
    program_studi: '',
    jenis_kelamin: 'Laki-laki', // Nilai default sesuai ENUM database
    no_hp: '',
    alamat_asal: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 2. Fungsi untuk mencatat perubahan inputan user secara real-time
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Fungsi untuk mengirim data ke Backend Laravel saat tombol diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // 1. Fungsi kecil untuk mencari dan mengambil Cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // 2. Ambil token! (Cek LocalStorage, kalau kosong cek Cookie dari Next.js)
    const token = localStorage.getItem('token') || getCookie('TOKEN_AUTH'); 

    if (!token) {
      setMessage({ type: 'error', text: 'Anda harus login terlebih dahulu untuk mendaftar.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/pendaftaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // Menyisipkan token ke Laravel
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pendaftaran Anda berhasil dikirim! Silakan tunggu konfirmasi admin.' });
        // Mengosongkan form kembali setelah sukses
        setFormData({
          nama_lengkap: '',
          nim: '',
          universitas: '',
          program_studi: '',
          jenis_kelamin: 'Laki-laki',
          no_hp: '',
          alamat_asal: ''
        });
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

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Form Pendaftaran Anggota Baru</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Sistem Informasi Asrama Kutai Kartanegara Yogyakarta</p>

      {/* Menampilkan Notifikasi Sukses / Gagal */}
      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nama Lengkap</label>
          <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>NIM</label>
            <input type="text" name="nim" value={formData.nim} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={inputStyle}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Universitas</label>
          <input type="text" name="universitas" value={formData.universitas} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Program Studi</label>
          <input type="text" name="program_studi" value={formData.program_studi} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>No. HP / WhatsApp</label>
          <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Alamat Asal</label>
          <textarea name="alamat_asal" value={formData.alamat_asal} onChange={handleChange} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} required></textarea>
        </div>

        <button type="submit" disabled={loading} style={{
          padding: '12px',
          backgroundColor: loading ? '#95a5a6' : '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.2s'
        }}>
          {loading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  fontSize: '14px',
  color: '#000' // Memastikan teks input berwarna hitam dan terbaca
};
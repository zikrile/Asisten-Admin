# DocuGen - Aplikasi Pembuat Surat Pesanan & BAST

Aplikasi ini dirancang untuk memudahkan pembuatan dokumen Surat Pesanan (SP) dan Berita Acara Serah Terima (BAST) untuk keperluan sekolah.

## 🚀 Cara Penggunaan

1. **Informasi Pihak Pertama (Vendor)**
   - Isi data vendor seperti Nama Perusahaan, Alamat, Nama Perwakilan, Telepon, dan NPWP.
   - Klik tombol **Simpan ke Database** (ikon disket) untuk menyimpan data vendor agar bisa digunakan lagi di masa depan.
   - Klik tombol **Buka Data Tersimpan** (ikon folder) untuk memilih vendor yang sudah pernah disimpan.

2. **Informasi Pihak Kedua (Sekolah)**
   - Isi data sekolah dan data bendahara (Nama, NIP, Alamat Pribadi).
   - Sama seperti vendor, data sekolah juga bisa disimpan dan dimuat ulang.

3. **Tanggal dan Nomor Surat**
   - Pastikan Anda mengisi Tanggal Dokumen, No. Surat Pesanan, dan No. BAST dengan benar.

4. **Daftar Barang**
   - Masukkan Nama Barang, Jumlah (Qty), Satuan, dan Harga Satuan.
   - Klik tombol **+** (warna hitam) untuk memasukkan barang ke dalam tabel di bawahnya.
   - Anda juga bisa menyimpan barang ke **Database Barang** (ikon disket hijau) agar tidak perlu mengetik ulang nama dan harga barang yang sering dibeli.

5. **Mencetak Dokumen (Download PDF)**
   - Setelah semua data dirasa benar, lihat ke bagian atas kanan layar.
   - Anda bisa mengunduh **Surat Pesanan** saja, **BAST** saja, atau **Keduanya dalam 1 File PDF**.

---

## 🛠️ Cara Mengubah Kop Surat

Kop surat pada aplikasi ini menggunakan gambar agar lebih fleksibel dan rapi.

1. Siapkan gambar kop surat sekolah Anda dalam format `.png` atau `.jpg`.
2. Pastikan gambar tersebut memiliki resolusi yang cukup baik (disarankan lebar minimal 1000px).
3. Ubah nama file gambar tersebut menjadi persis: **`kop-surat.png`** (atau sesuaikan ekstensi jika jpg).
4. Masukkan/Upload gambar tersebut ke dalam folder **`public/`** di dalam proyek ini.
5. Jika Anda menggunakan `.jpg`, Anda harus sedikit mengubah kode di file `src/components/CetakDokumen.tsx` pada bagian `<img src="/kop-surat.png" ... />` menjadi `<img src="/kop-surat.jpg" ... />`.

---

## 💻 Panduan Modifikasi Kode (Untuk Developer)

Jika Anda ingin mengubah tampilan atau logika aplikasi, berikut adalah panduan struktur file utamanya:

### 1. `src/App.tsx`
File ini mengatur **Tampilan Antarmuka (UI)** dan **Logika Penyimpanan Data**.
- **Mengubah Form Input:** Cari bagian `<section className="bg-white p-6...` untuk menambah/menghapus kolom input (seperti input NIP, Nama, dll).
- **Logika Database:** Fungsi seperti `saveCurrentVendor`, `loadVendor`, dan `addItem` berada di bagian atas file ini. Data disimpan menggunakan `localStorage` browser.

### 2. `src/components/CetakDokumen.tsx`
File ini sangat penting karena mengatur **Tampilan PDF yang akan di-download**.
- **Mengubah Margin Kertas:** Cari variabel `opt` di dalam fungsi `cetakPDF`. Ubah nilai `margin: [10, 25.4, 25.4, 25.4]` (urutan: Atas, Kanan, Bawah, Kiri dalam satuan milimeter).
- **Mengubah Ukuran Font PDF:** Cari class Tailwind `text-[12pt]` atau `text-[16pt]` di dalam komponen `SuratPesananContent` atau `BASTContent`.
- **Mengubah Tata Letak Tabel PDF:** Cari tag `<table>` di dalam `SuratPesananContent` atau `BASTContent`. Anda bisa mengubah lebar kolom (misal: `w-16`, `w-32`) atau menambah kolom baru.
- **Mengubah Format Tanggal Terbilang:** Fungsi `terbilang()` digunakan untuk mengubah angka menjadi huruf (contoh: 2026 menjadi "dua ribu dua puluh enam").

### Menjalankan Proyek di Komputer Lokal
Jika Anda mengunduh kode ini ke komputer Anda, pastikan Anda telah menginstal [Node.js](https://nodejs.org/).
1. Buka terminal/Command Prompt di folder proyek.
2. Jalankan perintah: `npm install` (untuk mengunduh dependensi).
3. Jalankan perintah: `npm run dev` (untuk menjalankan aplikasi).
4. Buka browser dan akses `http://localhost:3000` (atau port lain yang tertera di terminal).

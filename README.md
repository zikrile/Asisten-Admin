# Dokumentasi Aplikasi Cetak Dokumen

Aplikasi ini adalah aplikasi berbasis web untuk menginput data, melihat pratinjau (preview) secara real-time, mencetak langsung ke printer, dan mengunduh hasil cetak sebagai file PDF atau Gambar. 

Aplikasi ini memiliki tiga mode cetak:
1. **Honorarium** (Ukuran Kertas F4)
2. **Struk Pulsa / ShopeePay** (Ukuran Struk Kasir)
3. **Bukti Pembayaran WiFi** (Ukuran Setengah F4)

## Teknologi yang Digunakan
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Ikon**: `lucide-react`
- **Ekspor Dokumen**: `html2canvas` (untuk mengubah HTML ke gambar) & `jspdf` (untuk membuat file PDF)

---

## Struktur Folder & File Penting

Jika Anda ingin mengubah kode aplikasi, berikut adalah file-file utama yang perlu Anda ketahui:

1. **`src/App.tsx`**
   Ini adalah file utama aplikasi. Di sini terdapat:
   - State/Data untuk form input (Honorarium, Pulsa, dan WiFi).
   - Tampilan antarmuka (UI) panel sebelah kiri (Form Input).
   - Logika untuk tombol **Cetak** (`window.print()`).
   - Logika untuk tombol **Download PDF** (`handleDownloadPDF`).
   - Logika untuk tombol **Download Gambar** (`handleDownloadImage`).

2. **`src/components/CetakHonorarium.tsx`**
   File ini berisi desain dan tata letak khusus untuk **Tabel Honorarium**. Jika Anda ingin mengubah font, ukuran tabel, teks judul, atau posisi tanda tangan pada cetakan honorarium, ubahlah file ini.

3. **`src/components/CetakPulsa.tsx`**
   File ini berisi desain dan tata letak khusus untuk **Struk Pulsa (ShopeePay)**. Jika Anda ingin mengubah warna latar belakang, posisi teks, atau tata letak struk, ubahlah file ini.

4. **`src/components/CetakWifi.tsx`**
   File ini berisi desain dan tata letak khusus untuk **Bukti Pembayaran WiFi**. Jika Anda ingin mengubah posisi teks rata tengah/kanan, ukuran cap, atau tata letak, ubahlah file ini.

5. **`src/types.ts`**
   File ini berisi definisi tipe data (TypeScript Interfaces). Jika Anda ingin menambah kolom input baru di form, Anda harus menambahkannya di file ini terlebih dahulu.

6. **Folder `public/` (Aset Gambar)**
   Agar logo dan cap muncul di aplikasi dan hasil unduhan, Anda **WAJIB** meletakkan file gambar berikut di dalam folder `public`:
   - `shopee-logo.png` (Untuk logo di struk pulsa)
   - `wifi-logo.png` (Untuk logo perusahaan di struk WiFi, pojok kiri atas)
   - `wifi-stamp.png` (Untuk cap/tanda tangan di struk WiFi, pojok kanan bawah)

---

## Panduan Modifikasi (Cara Mengubah Kode)

### 1. Mengubah Tampilan/Desain Cetakan
Jika Anda ingin mengubah tampilan yang akan dicetak atau diunduh PDF/Gambar:
- Buka file komponen yang sesuai (`CetakHonorarium.tsx`, `CetakPulsa.tsx`, atau `CetakWifi.tsx`).
- **⚠️ ATURAN SANGAT PENTING (Mencegah Error PDF)**: 
  Library pembuat PDF (`html2canvas`) **TIDAK MENDUKUNG** format warna bawaan Tailwind v4 (seperti `bg-white`, `text-gray-500`, `border-black` yang menggunakan format `oklch`).
  **Solusi**: Anda **WAJIB** menggunakan kode warna HEX eksplisit jika ingin memberi warna pada elemen yang akan dicetak.
  - *Salah*: `className="text-black bg-white border-gray-200"`
  - *Benar*: `className="text-[#000000] bg-[#ffffff] border-[#e5e7eb]"`

### 2. Menambah Kolom Input Baru di Form
Misalnya Anda ingin menambah input "Catatan" di Struk WiFi:
1. Buka `src/types.ts`, tambahkan `catatan: string;` di dalam `interface WifiData`.
2. Buka `src/App.tsx`, cari bagian `const [wifiData, setWifiData] = useState<WifiData>({ ... })` dan tambahkan nilai awal `catatan: '',`.
3. Masih di `App.tsx`, cari bagian form input WiFi, lalu tambahkan kode input HTML baru:
   ```tsx
   <div>
     <label className="block text-xs font-medium text-gray-500 mb-1">Catatan</label>
     <input 
       type="text" 
       value={wifiData.catatan} 
       onChange={e => setWifiData({...wifiData, catatan: e.target.value})} 
       className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
     />
   </div>
   ```
4. Buka `src/components/CetakWifi.tsx` dan tampilkan data tersebut menggunakan `{data.catatan}` di tempat yang Anda inginkan.

### 3. Mengubah Ukuran Kertas PDF
Jika Anda ingin mengubah ukuran kertas saat di-download sebagai PDF:
- Buka `src/App.tsx`.
- Cari fungsi `const handleDownloadPDF = async () => { ... }`.
- Di dalam fungsi tersebut, cari bagian `new jsPDF({ ... format: [215, 165] })`.
- Angka `[215, 165]` adalah ukuran kertas Setengah F4 dalam satuan milimeter (Lebar x Tinggi). Anda bisa mengubahnya sesuai kebutuhan.

### 4. Mengubah Margin Saat Print Biasa (Ctrl+P)
Jika Anda menekan tombol "Cetak" (bukan Download PDF), ukuran kertas diatur oleh CSS.
- Buka `src/App.tsx`.
- Cari blok kode `<style type="text/css" media="print">`.
- Anda akan menemukan pengaturan `@page` yang mengatur ukuran (`size`) dan `margin` untuk masing-masing mode. Anda bisa mengubah nilai margin atau size di sini.

---

## Troubleshooting (Penyelesaian Masalah)

- **Error: `Attempting to parse an unsupported color function "oklch"` saat download PDF/Gambar**
  *Penyebab*: Ada elemen di dalam area pratinjau yang menggunakan class warna Tailwind bawaan (seperti `text-red-500` atau `bg-blue-100`).
  *Solusi*: Ganti class warna tersebut dengan kode HEX (misal: `text-[#ef4444]` atau `bg-[#dbeafe]`).

- **Logo atau Cap tidak muncul saat Download PDF/Gambar**
  *Penyebab*: Gambar belum ada di folder `/public` atau namanya salah.
  *Solusi*: Pastikan Anda sudah menyimpan gambar di folder `public` dengan nama file yang persis sama (`shopee-logo.png`, `wifi-logo.png`, `wifi-stamp.png`). Library membutuhkan gambar yang berada di domain yang sama untuk menghindari error CORS.



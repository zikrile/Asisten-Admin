import React, { useRef } from 'react';
import { FileText, Download } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface PartyInfo {
  name: string;
  address: string;
  contact: string;
  representative: string;
  position: string;
  phone?: string;
  npwp?: string;
  nip?: string;
  email?: string;
}

interface CetakDokumenProps {
  dataBarang: Item[];
  dataPihak: {
    vendor: PartyInfo;
    school: PartyInfo;
    treasurer: { name: string; position: string; nip?: string };
    documentDate: string;
    orderNumber: string;
    bastNumber: string;
  };
}

const CetakDokumen: React.FC<CetakDokumenProps> = ({ dataBarang, dataPihak }) => {
  const suratPesananRef = useRef<HTMLDivElement>(null);
  const bastRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDayName = (dateStr: string) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const getMonthName = (dateStr: string) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = new Date(dateStr);
    return months[date.getMonth()];
  };

  const totalAmount = dataBarang.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const cetakPDF = (ref: React.RefObject<HTMLDivElement>, namaFile: string) => {
    if (!ref.current) return;

    const element = ref.current;
    
    const opt = {
      margin: 0,
      filename: `${namaFile}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const KopSurat = () => (
    <div className="relative border-b-4 border-double border-black mb-4 pb-2">
      <div className="flex justify-between items-center px-2">
        {/* Logo Kiri */}
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src="/logo-kiri.png" 
            alt="Logo Kiri" 
            className="max-w-full max-h-full object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>

        {/* Teks Tengah */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-bold uppercase leading-tight">PEMERINTAH KABUPATEN BANDUNG BARAT</h1>
          <h1 className="text-2xl font-bold uppercase leading-tight">{dataPihak.school.name || 'SD NEGERI SINDANGPALAY'}</h1>
          <p className="text-[10px] leading-tight mt-1">
            Alamat : {dataPihak.school.address || 'RT 02 RW 09 Desa Sirnaraja Kecamatan Cipeundeuy Kabupaten Bandung Barat'}
          </p>
          <p className="text-[10px] leading-tight">
            Kode Pos : 40558 Email : <span className="text-blue-600 underline">{dataPihak.school.email || 'sdnsindangpalay01@gmail.com'}</span>
          </p>
        </div>

        {/* Logo Kanan */}
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src="/logo-kanan.png" 
            alt="Logo Kanan" 
            className="max-w-full max-h-full object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Tombol Trigger */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => cetakPDF(suratPesananRef, `Surat_Pesanan_${dataPihak.orderNumber.replace(/\//g, '_')}`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm font-semibold"
        >
          <FileText size={18} />
          Download Surat Pesanan
        </button>
        <button 
          onClick={() => cetakPDF(bastRef, `BAST_${dataPihak.bastNumber.replace(/\//g, '_')}`)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-md text-sm font-semibold"
        >
          <Download size={18} />
          Download BAST
        </button>
      </div>

      {/* AREA CETAK (Hidden from UI) */}
      <div className="absolute left-[-9999px] top-0">
        <style>{`
          .print-area, .print-area * {
            color: #000000 !important;
            border-color: #000000 !important;
          }
          .print-area {
            background-color: #ffffff !important;
          }
          .print-area .text-blue-600 {
            color: #2563eb !important;
          }
        `}</style>
        
        {/* Template 1: Surat Pesanan */}
        <div 
          ref={suratPesananRef} 
          className="print-area w-[21cm] min-h-[29.7cm] bg-white text-black p-[1.5cm] font-serif text-[12px] leading-normal"
        >
          <KopSurat />

          <div className="text-center mb-6">
            <h3 className="text-sm font-bold uppercase">SURAT PESANAN BARANG</h3>
            <p>Nomor : {dataPihak.orderNumber}</p>
            <p>Tanggal : {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
          </div>

          <div className="mb-4">
            <p>Kepada</p>
            <p>Yth. <strong>{dataPihak.vendor.representative || 'Pemilik Toko Kurnia Jaya'}</strong></p>
            <p>{dataPihak.vendor.address || 'Jl. Raya Cipeundeuy - Cikalong Wetan, Bandung Barat'}</p>
            <table className="text-[12px] mt-1">
              <tbody>
                <tr>
                  <td className="w-12 align-top">Telp.</td>
                  <td className="w-2 align-top">:</td>
                  <td>{dataPihak.vendor.phone || '(022) 6973382'}</td>
                </tr>
                <tr>
                  <td className="w-12 align-top">NPWP</td>
                  <td className="w-2 align-top">:</td>
                  <td>{dataPihak.vendor.npwp || '604603597421000'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <p>Dengan hormat, Bersama surat ini kami memesan barang sesuai daftar berikut:</p>
          </div>

          <table className="w-full border-collapse border-2 border-black mb-4">
            <thead>
              <tr>
                <th className="border-2 border-black p-1 text-center w-8">No</th>
                <th className="border-2 border-black p-1 text-center">Nama Barang</th>
                <th className="border-2 border-black p-1 text-center w-12">Jumlah</th>
                <th className="border-2 border-black p-1 text-center w-12">Satuan</th>
                <th className="border-2 border-black p-1 text-center w-24">Harga Satuan (Rp)</th>
                <th className="border-2 border-black p-1 text-center w-24">Jumlah Harga (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {dataBarang.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-2 border-black p-1 text-center">{index + 1}</td>
                  <td className="border-2 border-black p-1">{item.name}</td>
                  <td className="border-2 border-black p-1 text-center">{item.quantity}</td>
                  <td className="border-2 border-black p-1 text-center">{item.unit}</td>
                  <td className="border-2 border-black p-1 text-right">{formatCurrency(item.price)}</td>
                  <td className="border-2 border-black p-1 text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={5} className="border-2 border-black p-1 text-center uppercase">Total</td>
                <td className="border-2 border-black p-1 text-right">{formatCurrency(totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-8">
            <p>Demikian surat pesanan ini kami buat untuk dapat diproses sebagaimana mestinya.</p>
          </div>

          <div className="flex justify-end">
            <div className="text-center w-64">
              <p>Bandung Barat, {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
              <p className="mb-20">Bendahara Sekolah,</p>
              <p className="font-bold underline uppercase">{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</p>
              <p>NIP. {dataPihak.treasurer.nip || '19670614 199301 1 002'}</p>
            </div>
          </div>
        </div>

        {/* Template 2: BAST */}
        <div 
          ref={bastRef} 
          className="print-area w-[21cm] min-h-[29.7cm] bg-white text-black p-[1.5cm] font-serif text-[12px] leading-normal"
        >
          <KopSurat />

          <div className="text-center mb-6">
            <h3 className="text-sm font-bold uppercase">BERITA ACARA SERAH TERIMA BARANG</h3>
            <p>Nomor : {dataPihak.bastNumber}</p>
            <p>Tanggal : {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
          </div>

          <div className="mb-4">
            <p>Pada hari ini, {getDayName(dataPihak.documentDate)} tanggal {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} tahun {new Date(dataPihak.documentDate).getFullYear()}, kami yang bertanda tangan di bawah ini:</p>
          </div>

          <div className="mb-4 space-y-4">
            <div>
              <p className="font-bold mb-1">Pihak Pertama</p>
              <table className="ml-4 text-[12px]">
                <tbody>
                  <tr><td className="w-16 align-top">Nama</td><td className="w-2 align-top">:</td><td><strong>{dataPihak.vendor.representative || 'Siti Kurnia'}</strong></td></tr>
                  <tr><td className="w-16 align-top">Jabatan</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.position || 'Pemilik Toko Kurnia Jaya'}</td></tr>
                  <tr><td className="w-16 align-top">Alamat</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.address || 'Kp. Cipeundeuy RT.01 RW.05'}</td></tr>
                  <tr><td className="w-16 align-top">Telp</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.phone || '087824287893'}</td></tr>
                  <tr><td className="w-16 align-top">NPWP</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.npwp || '604603597421000'}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-bold mb-1">Pihak Kedua</p>
              <table className="ml-4 text-[12px]">
                <tbody>
                  <tr><td className="w-16 align-top">Nama</td><td className="w-2 align-top">:</td><td><strong>{dataPihak.school.representative || 'Kandar Permana, S.Pd'}</strong></td></tr>
                  <tr><td className="w-16 align-top">Jabatan</td><td className="w-2 align-top">:</td><td>{dataPihak.school.position || 'Bendahara SD Negeri Sindangpalay'}</td></tr>
                  <tr><td className="w-16 align-top">Alamat</td><td className="w-2 align-top">:</td><td>{dataPihak.school.address || 'Kp. Nagrak RT. 03 RW. 07 Ds Sirnaraja'}</td></tr>
                  <tr><td className="w-16 align-top">NIP</td><td className="w-2 align-top">:</td><td>{dataPihak.school.nip || '19670614 199301 1 002'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-4">
            <p>Pihak Pertama telah menyerahkan kepada Pihak Kedua barang-barang sesuai pesanan dengan rincian sebagai berikut:</p>
          </div>

          <table className="w-full border-collapse border-2 border-black mb-4">
            <thead>
              <tr>
                <th className="border-2 border-black p-1 text-center w-8">No</th>
                <th className="border-2 border-black p-1 text-center">Nama Barang</th>
                <th className="border-2 border-black p-1 text-center w-12">Jumlah</th>
                <th className="border-2 border-black p-1 text-center w-12">Satuan</th>
                <th className="border-2 border-black p-1 text-center w-24">Satuan Harga (Rp)</th>
                <th className="border-2 border-black p-1 text-center w-24">Jumlah Harga (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {dataBarang.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-2 border-black p-1 text-center">{index + 1}</td>
                  <td className="border-2 border-black p-1">{item.name}</td>
                  <td className="border-2 border-black p-1 text-center">{item.quantity}</td>
                  <td className="border-2 border-black p-1 text-center">{item.unit}</td>
                  <td className="border-2 border-black p-1 text-right">{formatCurrency(item.price)}</td>
                  <td className="border-2 border-black p-1 text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={5} className="border-2 border-black p-1 text-left uppercase">Total</td>
                <td className="border-2 border-black p-1 text-right">Rp. {formatCurrency(totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-4">
            <p>Barang-barang tersebut telah diterima dalam kondisi baik dan lengkap.</p>
            <p>Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
          </div>

          <div className="flex justify-end mb-4">
            <p>Bandung Barat, {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="font-bold">Pihak Pertama</p>
              <p className="mb-20">Pemilik Toko Kurnia Jaya</p>
              <p className="font-bold underline uppercase">{dataPihak.vendor.representative || 'Siti Kurnia'}</p>
            </div>
            <div>
              <p className="font-bold">Pihak Kedua</p>
              <p className="mb-20">Bendahara SD Negeri Sindangpalay</p>
              <p className="font-bold underline uppercase">{dataPihak.school.representative || 'Ahmad Junaedi, S.Pd.I'}</p>
              <p>NIP. {dataPihak.school.nip || '197603052023211002'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CetakDokumen;
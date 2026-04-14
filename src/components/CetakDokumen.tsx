import React, { useRef } from 'react';
import { FileText, Download, Layers } from 'lucide-react';
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
    treasurer: { name: string; position: string; nip?: string; address?: string };
    pelaksana: { name: string; nip?: string };
    documentDate: string;
    perencanaanDate: string;
    orderNumber: string;
    bastNumber: string;
    itemCategory: string;
  };
}

const CetakDokumen: React.FC<CetakDokumenProps> = ({ dataBarang, dataPihak }) => {
  const suratPesananRef = useRef<HTMLDivElement>(null);
  const bastRef = useRef<HTMLDivElement>(null);
  const combinedRef = useRef<HTMLDivElement>(null);
  const perencanaanRef = useRef<HTMLDivElement>(null);

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

  const terbilang = (angka: number): string => {
    const kata = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    let hasil = '';
    if (angka < 12) hasil = kata[angka];
    else if (angka < 20) hasil = kata[angka - 10] + ' belas';
    else if (angka < 100) hasil = kata[Math.floor(angka / 10)] + ' puluh ' + kata[angka % 10];
    else if (angka < 200) hasil = 'seratus ' + terbilang(angka - 100);
    else if (angka < 1000) hasil = kata[Math.floor(angka / 100)] + ' ratus ' + terbilang(angka % 100);
    else if (angka < 2000) hasil = 'seribu ' + terbilang(angka - 1000);
    else if (angka < 1000000) hasil = terbilang(Math.floor(angka / 1000)) + ' ribu ' + terbilang(angka % 1000);
    return hasil.trim().replace(/\s+/g, ' ');
  };

  const totalAmount = dataBarang.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const cetakPDF = (ref: React.RefObject<HTMLDivElement>, namaFile: string) => {
    if (!ref.current) return;

    const element = ref.current;
    
    const opt = {
      margin: [10, 25.4, 25.4, 25.4] as [number, number, number, number], // [Atas 1cm, Kanan 2.54cm, Bawah 2.54cm, Kiri 2.54cm]
      filename: `${namaFile}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['css', 'legacy'], before: '.page-break' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const cetakPerencanaanPDF = (ref: React.RefObject<HTMLDivElement>, namaFile: string) => {
    if (!ref.current) return;

    const element = ref.current;
    
    const opt = {
      margin: [12.7, 12.7, 12.7, 12.7] as [number, number, number, number],
      filename: `${namaFile}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: [330, 210], orientation: 'landscape' as const },
      pagebreak: { mode: ['css', 'legacy'], before: '.page-break' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const KopSurat = () => (
    <div className="mb-6">
      <img 
        src="/kop-surat.png" 
        alt="Kop Surat" 
        className="w-full object-contain"
        onError={(e) => {
          // Fallback text jika gambar kop-surat.png belum diupload ke folder public
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = '<div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px;"><i>(Gambar kop-surat.png belum tersedia di folder public)</i></div>';
          }
        }}
      />
    </div>
  );

  // Lebar konten diset ke 159.2mm (Lebar A4 210mm dikurangi margin kiri 25.4mm dan kanan 25.4mm)
  // Ini memastikan ukuran font 12pt tidak mengecil saat di-convert ke PDF
  const contentStyle = { width: '159.2mm' };

  const SuratPesananContent = () => (
    <div className="bg-white text-black font-serif text-[12pt] leading-normal mx-auto" style={contentStyle}>
      <KopSurat />

      <div className="text-center mb-6">
        <h3 className="text-[16pt] font-bold uppercase underline">SURAT PESANAN BARANG</h3>
        <p>Nomor : {dataPihak.orderNumber}</p>
        <p>Tanggal : {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
      </div>

      <div className="mb-4">
        <p>Kepada</p>
        <p>Yth. <strong>{dataPihak.vendor.representative || 'Pemilik Toko Kurnia Jaya'}</strong></p>
        <p>{dataPihak.vendor.address || 'Jl. Raya Cipeundeuy - Cikalong Wetan, Bandung Barat'}</p>
        <table className="text-[12pt] mt-1">
          <tbody>
            <tr>
              <td className="w-16 align-top">Telp.</td>
              <td className="w-2 align-top">:</td>
              <td>{dataPihak.vendor.phone || '(022) 6973382'}</td>
            </tr>
            <tr>
              <td className="w-16 align-top">NPWP</td>
              <td className="w-2 align-top">:</td>
              <td>{dataPihak.vendor.npwp || '604603597421000'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <p>Dengan hormat, Bersama surat ini kami memesan barang sesuai daftar berikut:</p>
      </div>

      <table className="w-full border-collapse border-2 border-black mb-4 text-[12pt]">
        <thead>
          <tr>
            <th className="border-2 border-black p-1 text-center w-8">No</th>
            <th className="border-2 border-black p-1 text-center">Nama Barang</th>
            <th className="border-2 border-black p-1 text-center w-16">Jumlah</th>
            <th className="border-2 border-black p-1 text-center w-16">Satuan</th>
            <th className="border-2 border-black p-1 text-center w-32">Harga Satuan (Rp)</th>
            <th className="border-2 border-black p-1 text-center w-32">Jumlah Harga (Rp)</th>
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
          <p className="font-bold underline">{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</p>
          <p>NIP. {dataPihak.treasurer.nip || '19670614 199301 1 002'}</p>
        </div>
      </div>
    </div>
  );

  const BASTContent = () => (
    <div className="bg-white text-black font-serif text-[12pt] leading-normal mx-auto" style={contentStyle}>
      <KopSurat />

      <div className="text-center mb-6">
        <h3 className="text-[16pt] font-bold uppercase underline">BERITA ACARA SERAH TERIMA BARANG</h3>
        <p>Nomor : {dataPihak.bastNumber}</p>
      </div>

      <div className="mb-4 text-justify">
        <p>Pada hari ini, {getDayName(dataPihak.documentDate)} tanggal {terbilang(new Date(dataPihak.documentDate).getDate())} bulan {getMonthName(dataPihak.documentDate).toLowerCase()} tahun {terbilang(new Date(dataPihak.documentDate).getFullYear())}, kami yang bertanda tangan di bawah ini:</p>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <p className="font-bold mb-1">Pihak Pertama</p>
          <table className="ml-4 text-[12pt]">
            <tbody>
              <tr><td className="w-20 align-top">Nama</td><td className="w-2 align-top">:</td><td><strong>{dataPihak.vendor.representative || 'Siti Kurnia'}</strong></td></tr>
              <tr><td className="w-20 align-top">Jabatan</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.position || 'Pemilik Toko Kurnia Jaya'}</td></tr>
              <tr><td className="w-20 align-top">Alamat</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.address || 'Kp. Cipeundeuy RT.01 RW.05'}</td></tr>
              <tr><td className="w-20 align-top">Telp</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.phone || '087824287893'}</td></tr>
              <tr><td className="w-20 align-top">NPWP</td><td className="w-2 align-top">:</td><td>{dataPihak.vendor.npwp || '604603597421000'}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="font-bold mb-1">Pihak Kedua</p>
          <table className="ml-4 text-[12pt]">
            <tbody>
              <tr><td className="w-20 align-top">Nama</td><td className="w-2 align-top">:</td><td><strong>{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</strong></td></tr>
              <tr><td className="w-20 align-top">Jabatan</td><td className="w-2 align-top">:</td><td>{dataPihak.treasurer.position || 'Bendahara SD Negeri Sindangpalay'}</td></tr>
              <tr><td className="w-20 align-top">Alamat</td><td className="w-2 align-top">:</td><td>{dataPihak.treasurer.address || 'Alamat Pribadi Bendahara'}</td></tr>
              <tr><td className="w-20 align-top">NIP</td><td className="w-2 align-top">:</td><td>{dataPihak.treasurer.nip || '19670614 199301 1 002'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <p>Pihak Pertama telah menyerahkan kepada Pihak Kedua barang-barang sesuai pesanan dengan rincian sebagai berikut:</p>
      </div>

      <table className="w-full border-collapse border-2 border-black mb-4 text-[12pt]">
        <thead>
          <tr>
            <th className="border-2 border-black p-1 text-center w-8">No</th>
            <th className="border-2 border-black p-1 text-center">Nama Barang</th>
            <th className="border-2 border-black p-1 text-center w-16">Jumlah</th>
            <th className="border-2 border-black p-1 text-center w-16">Satuan</th>
            <th className="border-2 border-black p-1 text-center w-32">Satuan Harga (Rp)</th>
            <th className="border-2 border-black p-1 text-center w-32">Jumlah Harga (Rp)</th>
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

      <div className="grid grid-cols-2 gap-8 text-center" style={{ pageBreakInside: 'avoid' }}>
        <div>
          <p className="font-bold">Pihak Pertama</p>
          <p className="mb-20">Pemilik Toko Kurnia Jaya</p>
          <p className="font-bold underline">{dataPihak.vendor.representative || 'Siti Kurnia'}</p>
        </div>
        <div>
          <p className="font-bold">Pihak Kedua</p>
          <p className="mb-20">Bendahara SD Negeri Sindangpalay</p>
          <p className="font-bold underline">{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</p>
          <p>NIP. {dataPihak.treasurer.nip || '19670614 199301 1 002'}</p>
        </div>
      </div>
    </div>
  );

  const contentStyleLandscape = { width: '304.6mm' };

  const PerencanaanContent = () => {
    const totalItems = dataBarang.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div className="bg-white text-black font-sans text-[11pt] leading-normal mx-auto" style={contentStyleLandscape}>
        <div className="text-center mb-6">
          <h3 className="text-[14pt] font-bold">Dokumen Perencanaan</h3>
        </div>

        <div className="mb-4 space-y-2">
          <div className="grid grid-cols-[200px_auto]">
            <span className="font-bold">Nama Satuan Pendidikan</span>
            <span>: {dataPihak.school.name}</span>
          </div>
          <div className="grid grid-cols-[200px_auto]">
            <span className="font-bold">Alamat Satuan Pendidikan</span>
            <span>: {dataPihak.school.address}</span>
          </div>
          <div className="grid grid-cols-[200px_auto]">
            <span className="font-bold">Category Barang/ Jasa</span>
            <span>: {dataPihak.itemCategory || 'Pembelian ATK'}</span>
          </div>
        </div>

        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }} className="w-full border-collapse border-2 border-black mb-6 text-[10pt]">
          <thead>
            <tr>
              <th className="border border-black p-3 text-center w-12 font-bold"></th>
              <th className="border border-black p-3 text-center w-64 font-bold">Jenis</th>
              <th className="border border-black p-3 text-center font-bold">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3 text-center font-bold">1</td>
              <td className="border border-black p-3 font-bold">Jumlah barang/ jasa</td>
              <td className="border border-black p-3 text-center">{totalItems}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center font-bold align-top">2</td>
              <td className="border border-black p-3 font-bold align-top">Spesifikasi / ruang lingkup barang/ jasa</td>
              <td className="border border-black p-3">
                <div className="space-y-2">
                  {dataBarang.map((item, index) => (
                    <div key={item.id} className="flex gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <div>
                        <span className="font-bold">{item.name}</span>
                        <div className="text-[7pt] mt-0.5 flex flex-col" style={{ gap: '1pt' }}>
                          <div style={{ marginBottom: '1pt' }}>DPP: Rp. {formatCurrency(item.price)}</div>
                          <div style={{ marginBottom: '1pt' }}>PPN (0%): Rp. 0</div>
                          <div style={{ marginBottom: '1pt' }}>{item.quantity} {item.unit} × Rp. {formatCurrency(item.price)} = Rp. {formatCurrency(item.quantity * item.price)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center font-bold">3</td>
              <td className="border border-black p-3 font-bold">Waktu serah terima</td>
              <td className="border border-black p-3"></td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center font-bold">4</td>
              <td className="border border-black p-3 font-bold">Lokasi serah terima</td>
              <td className="border border-black p-3 text-center">{dataPihak.school.address}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center font-bold">5</td>
              <td className="border border-black p-3 font-bold">Alokasi anggaran</td>
              <td className="border border-black p-3 text-center">BOS Reguler</td>
            </tr>
            <tr style={{ pageBreakInside: 'avoid' }}>
              <td className="border border-black p-3 text-center font-bold align-top">6</td>
              <td className="border border-black p-3 font-bold align-top">Persyaratan penyedia</td>
              <td className="border border-black p-3">
                Perorangan/ Badan Usaha Memenuhi syarat sebagai berikut:<br/>
                a. Identitas Penyedia<br/>
                b. NPWP
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end pb-8" style={{ pageBreakInside: 'avoid' }}>
          <div className="w-64">
            <p>Bandung Barat, {new Date(dataPihak.perencanaanDate).getDate()} {getMonthName(dataPihak.perencanaanDate)} {new Date(dataPihak.perencanaanDate).getFullYear()}</p>
            <p className="mb-20">Pelaksana</p>
            <p className="font-bold underline">{dataPihak.pelaksana.name || dataPihak.treasurer.name}</p>
            <p className="pb-2">NIP. {dataPihak.pelaksana.nip || dataPihak.treasurer.nip}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tombol Trigger */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => cetakPDF(suratPesananRef, `Surat_Pesanan_${dataPihak.orderNumber.replace(/\//g, '_')}`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm font-semibold"
        >
          <FileText size={16} />
          SP
        </button>
        <button 
          onClick={() => cetakPDF(bastRef, `BAST_${dataPihak.bastNumber.replace(/\//g, '_')}`)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md text-sm font-semibold"
        >
          <FileText size={16} />
          BAST
        </button>
        <button 
          onClick={() => cetakPDF(combinedRef, `SP_dan_BAST_${dataPihak.orderNumber.replace(/\//g, '_')}`)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2 rounded-lg hover:bg-neutral-800 transition-all shadow-md text-sm font-semibold"
        >
          <Layers size={18} />
          Download SP & BAST (1 File)
        </button>
        {totalAmount > 1000000 && (
          <button 
            onClick={() => cetakPerencanaanPDF(perencanaanRef, `Perencanaan_${dataPihak.itemCategory.replace(/\s+/g, '_')}`)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-md text-sm font-semibold"
          >
            <FileText size={16} />
            Perencanaan
          </button>
        )}
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
        
        {/* Single SP */}
        <div ref={suratPesananRef} className="print-area">
          <SuratPesananContent />
        </div>

        {/* Single BAST */}
        <div ref={bastRef} className="print-area">
          <BASTContent />
        </div>

        {/* Combined SP & BAST */}
        <div ref={combinedRef} className="print-area">
          <SuratPesananContent />
          <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
          <BASTContent />
        </div>

        {/* Perencanaan */}
        <div ref={perencanaanRef} className="print-area">
          <PerencanaanContent />
        </div>

      </div>
    </div>
  );
};

export default CetakDokumen;

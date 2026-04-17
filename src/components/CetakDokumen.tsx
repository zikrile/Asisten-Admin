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
      margin: [10, 25.4, 15, 25.4] as [number, number, number, number], // [Atas 1cm, Kanan 2.5cm, Bawah 1.5cm, Kiri 2.5cm]
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
      margin: [5, 12.7, 12.7, 12.7] as [number, number, number, number],
      filename: `${namaFile}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: [330, 210] as [number, number], orientation: 'landscape' as const },
      pagebreak: { mode: ['css', 'legacy'], before: '.page-break' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const KopSurat = () => (
    <div className="mb-4">
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
    <div className="bg-white text-black font-serif text-[12pt] leading-normal mx-auto" style={{ ...contentStyle, fontFamily: '"Times New Roman", Times, serif' }}>
      <KopSurat />

      <div className="text-center mb-6">
        <h3 className="text-[12pt] font-bold uppercase">SURAT PESANAN BARANG</h3>
        <p className="text-[12pt] font-normal">Nomor : {dataPihak.orderNumber}</p>
        <p className="text-[12pt] font-normal">Tanggal : {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
      </div>

      <div className="mb-4">
        <p>Kepada</p>
        <p>Yth. <strong>{dataPihak.vendor.position || 'Pemilik'} {dataPihak.vendor.name || 'Toko Kurnia Jaya'}</strong></p>
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

      <table className="w-full border-collapse border border-black mb-4 text-[12pt]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <thead>
          <tr>
            <th className="border border-black p-2 text-left align-top w-8">No</th>
            <th className="border border-black p-2 text-left align-top">Nama Barang</th>
            <th className="border border-black p-2 text-left align-top w-14">Jumlah</th>
            <th className="border border-black p-2 text-left align-top w-16">Satuan</th>
            <th className="border border-black p-2 text-left align-top w-28">Harga<br/>Satuan (Rp)</th>
            <th className="border border-black p-2 text-left align-top w-28">Jumlah<br/>Harga (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {dataBarang.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-black p-2 text-left align-top">{index + 1}</td>
              <td className="border border-black p-2 text-left align-top">{item.name}</td>
              <td className="border border-black p-2 text-left align-top">{item.quantity}</td>
              <td className="border border-black p-2 text-left align-top">{item.unit}</td>
              <td className="border border-black p-2 text-left align-top">{formatCurrency(item.price)}</td>
              <td className="border border-black p-2 text-left align-top">{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 text-left">Total</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 text-left">{formatCurrency(totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-8">
        <p>Demikian surat pesanan ini kami buat untuk dapat diproses sebagaimana mestinya.</p>
      </div>

      <div className="flex justify-end" style={{ pageBreakInside: 'avoid' }}>
        <div className="text-center w-64 pb-8">
          <p>Bandung Barat, {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
          <p>Bendahara Sekolah,</p>
          <div className="h-24"></div>
          <p className="font-bold underline">{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</p>
          <p className="pb-2">NIP. {dataPihak.treasurer.nip || '19670614 199301 1 002'}</p>
        </div>
      </div>
    </div>
  );

  const BASTContent = () => (
    <div className="bg-white text-black font-serif text-[12pt] leading-normal mx-auto" style={{ ...contentStyle, fontFamily: '"Times New Roman", Times, serif' }}>
      <KopSurat />

      <div className="text-center mb-4">
        <h3 className="text-[12pt] font-bold uppercase">BERITA ACARA SERAH TERIMA BARANG</h3>
        <p className="text-[12pt] font-normal leading-snug">Nomor : {dataPihak.bastNumber}</p>
        <p className="text-[12pt] font-normal leading-snug">Tanggal : {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
      </div>

      <div className="mb-3 text-justify leading-snug">
        <p>Pada hari ini, {getDayName(dataPihak.documentDate)} tanggal {terbilang(new Date(dataPihak.documentDate).getDate())} bulan {getMonthName(dataPihak.documentDate).toLowerCase()} tahun {terbilang(new Date(dataPihak.documentDate).getFullYear())}, kami yang bertanda tangan di bawah ini:</p>
      </div>

      <div className="mb-3 space-y-2">
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

      <div className="mb-2">
        <p>Pihak Pertama telah menyerahkan kepada Pihak Kedua barang-barang sesuai pesanan dengan rincian sebagai berikut:</p>
      </div>

      <table className="w-full border-collapse border border-black mb-2 text-[12pt]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <thead>
          <tr>
            <th className="border border-black p-2 text-left align-top w-8">No</th>
            <th className="border border-black p-2 text-left align-top">Nama Barang</th>
            <th className="border border-black p-2 text-left align-top w-14">Jumlah</th>
            <th className="border border-black p-2 text-left align-top w-16">Satuan</th>
            <th className="border border-black p-2 text-left align-top w-28">Harga<br/>Satuan (Rp)</th>
            <th className="border border-black p-2 text-left align-top w-28">Jumlah<br/>Harga (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {dataBarang.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-black p-2 text-left align-top">{index + 1}</td>
              <td className="border border-black p-2 text-left align-top">{item.name}</td>
              <td className="border border-black p-2 text-left align-top">{item.quantity}</td>
              <td className="border border-black p-2 text-left align-top">{item.unit}</td>
              <td className="border border-black p-2 text-left align-top">{formatCurrency(item.price)}</td>
              <td className="border border-black p-2 text-left align-top">{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 text-left">Total</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 text-left">{formatCurrency(totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-2">
        <p>Barang-barang tersebut telah diterima dalam kondisi baik dan lengkap.</p>
        <p>Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
      </div>

      <div className="pb-2">
        <table className="w-full mt-2" style={{ pageBreakInside: 'avoid' }}>
          <tbody>
            <tr>
              <td className="w-[60%] text-left align-top"></td>
              <td className="w-[40%] text-left align-top pb-2">
                <p>Bandung Barat, {new Date(dataPihak.documentDate).getDate()} {getMonthName(dataPihak.documentDate)} {new Date(dataPihak.documentDate).getFullYear()}</p>
              </td>
            </tr>
            <tr>
              <td className="w-[60%] text-left align-top">
                <p className="font-bold">Pihak Pertama</p>
                <p>{dataPihak.vendor.position ? `${dataPihak.vendor.position} ${dataPihak.vendor.name}` : 'Pemilik Toko Kurnia Jaya'}</p>
              </td>
              <td className="w-[40%] text-left align-top">
                <p className="font-bold">Pihak Kedua</p>
                <p>{dataPihak.treasurer.position ? dataPihak.treasurer.position : 'Bendahara SD Negeri Sindangpalay'}</p>
              </td>
            </tr>
            <tr>
              <td className="h-16"></td>
              <td className="h-16"></td>
            </tr>
            <tr>
              <td className="w-[60%] text-left align-bottom pb-2">
                <p className="font-bold">{dataPihak.vendor.representative || 'Siti Kurnia'}</p>
              </td>
              <td className="w-[40%] text-left align-bottom pb-2">
                <p className="font-bold underline">{dataPihak.treasurer.name || 'Kandar Permana, S.Pd'}</p>
                <p>NIP. {dataPihak.treasurer.nip || '19670614 199301 1 002'}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const contentStyleLandscape = { width: '304.6mm' };

  const PerencanaanContent = () => {
    const totalItems = dataBarang.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div className="bg-white text-black font-serif text-[11pt] leading-normal mx-auto" style={{ ...contentStyleLandscape, fontFamily: '"Times New Roman", Times, serif' }}>
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

        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }} className="w-full border-collapse border border-black mb-2 text-[10pt]">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-center w-12 font-bold"></th>
              <th className="border border-black px-2 py-1 text-center w-64 font-bold">Jenis</th>
              <th className="border border-black px-2 py-1 text-center font-bold">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 text-center font-bold">1</td>
              <td className="border border-black px-2 py-1 font-bold">Jumlah barang/ jasa</td>
              <td className="border border-black px-2 py-1 text-center">{totalItems}</td>
            </tr>
            <tr>
              <td className="border border-black px-2 pt-1 pb-2 text-center font-bold align-top">2</td>
              <td className="border border-black px-2 pt-1 pb-2 font-bold align-top">Spesifikasi / ruang lingkup barang/ jasa</td>
              <td className="border border-black px-2 pt-1 pb-2 align-top">
                <div>
                  {dataBarang.map((item, index) => (
                    <div key={item.id} className="flex gap-1 mb-2 last:mb-0">
                      <span className="font-bold text-[7pt]" style={{ lineHeight: '1.2' }}>{index + 1}.</span>
                      <div className="flex flex-col text-[7pt]" style={{ lineHeight: '1.2' }}>
                        <span className="font-bold">{item.name}</span>
                        <span>DPP: Rp. {formatCurrency(item.price)}</span>
                        <span>PPN (0%): Rp. 0</span>
                        <span>{item.quantity} {item.unit} × Rp. {formatCurrency(item.price)} = Rp. {formatCurrency(item.quantity * item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1 text-center font-bold">3</td>
              <td className="border border-black px-2 py-1 font-bold">Waktu serah terima</td>
              <td className="border border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1 text-center font-bold">4</td>
              <td className="border border-black px-2 py-1 font-bold">Lokasi serah terima</td>
              <td className="border border-black px-2 py-1 text-center">{dataPihak.school.address}</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1 text-center font-bold">5</td>
              <td className="border border-black px-2 py-1 font-bold">Alokasi anggaran</td>
              <td className="border border-black px-2 py-1 text-center">BOS Reguler</td>
            </tr>
            <tr style={{ pageBreakInside: 'avoid' }}>
              <td className="border border-black px-2 py-1 text-center font-bold align-top">6</td>
              <td className="border border-black px-2 py-1 font-bold align-top">Persyaratan penyedia</td>
              <td className="border border-black px-2 py-1">
                Perorangan/ Badan Usaha Memenuhi syarat sebagai berikut:<br/>
                a. Identitas Penyedia<br/>
                b. NPWP
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end" style={{ pageBreakInside: 'avoid' }}>
          <div className="w-64 pb-2">
            <p>Bandung Barat, {new Date(dataPihak.perencanaanDate).getDate()} {getMonthName(dataPihak.perencanaanDate)} {new Date(dataPihak.perencanaanDate).getFullYear()}</p>
            <p>Pelaksana</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{dataPihak.pelaksana.name || dataPihak.treasurer.name}</p>
            <p>NIP. {dataPihak.pelaksana.nip || dataPihak.treasurer.nip}</p>
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

import { useState, useRef } from 'react';
import { Printer, FileText, Smartphone, Download, Image as ImageIcon, Wifi } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CetakHonorarium } from './components/CetakHonorarium';
import { CetakPulsa } from './components/CetakPulsa';
import { CetakWifi } from './components/CetakWifi';
import { HonorariumData, PulsaData, WifiData, Pegawai } from './types';

type PrintMode = 'honorarium' | 'pulsa' | 'wifi';

export default function App() {
  const [mode, setMode] = useState<PrintMode>('honorarium');
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // State for Honorarium
  const [honorData, setHonorData] = useState<HonorariumData>({
    bulan: 'Januari 2026',
    namaSekolah: 'SDN Sidangpalay',
    kecamatan: 'Cipeundeuy',
    kabupaten: 'Bandung Barat',
    noKegiatan: '07.12.01',
    noRekening: '5.1.02.02.01.0013',
    kepalaSekolah: 'Elis Hermawati, S.Pd.I',
    nipKepalaSekolah: '197104052007012007',
    bendahara: 'Kandar Permana, S.Pd',
    nipBendahara: '196706141993011002',
    tanggal: '21 Januari 2026',
    tempat: 'Cipeundeuy',
    daftarPegawai: [
      {
        id: '1',
        noBukti: 'BNU 001',
        nama: 'Selviyanti',
        jabatan: 'TAS',
        golongan: '-',
        frekuensi: 1,
        satuan: 1500000,
      }
    ]
  });

  // State for Pulsa
  const [pulsaData, setPulsaData] = useState<PulsaData>({
    noPesanan: '7364518293047581629',
    produk: 'myXL 200.000',
    nominal: 200000,
    noHandphone: '087823723690',
    noSerial: '04080500001928374650',
    tanggalTransaksi: '02 Apr 2026 12:26:37',
    harga: 200000,
  });

  // State for Wifi
  const [wifiData, setWifiData] = useState<WifiData>({
    no: '21/FAST/FID—KB/V/2026',
    telahTerimaDari: 'SDN SINDANGPALAY',
    uangSejumlah: 'Dua Ratus Ribu Rupiah',
    untukPembayaran: 'Internet Bulan Maret 2026',
    tempatTanggal: 'Bandung, 1 April 2026',
    namaPenandatangan: 'Lisnawati',
    nominal: 200000,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      let pdf: jsPDF;
      
      if (mode === 'honorarium') {
        // F4 size in mm: 215 x 330
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [215, 330]
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Honorarium_${honorData.bulan.replace(/\s+/g, '_')}.pdf`);
      } else if (mode === 'pulsa') {
        // Pulsa receipt size
        const pdfWidth = 100; // mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Faktur_ShopeePay_${pulsaData.noPesanan}.pdf`);
      } else {
        // Wifi receipt size (Setengah F4: 215mm x 165mm)
        pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [215, 165]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 215, 165);
        pdf.save(`Bukti_Pembayaran_WiFi_${wifiData.no.replace(/\//g, '_')}.pdf`);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!pdfRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = imgData;
      
      if (mode === 'honorarium') {
        link.download = `Honorarium_${honorData.bulan.replace(/\s+/g, '_')}.png`;
      } else if (mode === 'pulsa') {
        link.download = `Faktur_ShopeePay_${pulsaData.noPesanan}.png`;
      } else {
        link.download = `Bukti_Pembayaran_WiFi_${wifiData.no.replace(/\//g, '_')}.png`;
      }
      
      link.click();
    } catch (error) {
      console.error('Error generating Image:', error);
      alert('Gagal membuat Gambar. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAddPegawai = () => {
    setHonorData(prev => ({
      ...prev,
      daftarPegawai: [
        ...prev.daftarPegawai,
        {
          id: Date.now().toString(),
          noBukti: '',
          nama: '',
          jabatan: '',
          golongan: '',
          frekuensi: 1,
          satuan: 0,
        }
      ]
    }));
  };

  const handleUpdatePegawai = (id: string, field: keyof Pegawai, value: string | number) => {
    setHonorData(prev => ({
      ...prev,
      daftarPegawai: prev.daftarPegawai.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleRemovePegawai = (id: string) => {
    setHonorData(prev => ({
      ...prev,
      daftarPegawai: prev.daftarPegawai.filter(p => p.id !== id)
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans print:h-auto print:bg-white">
      {/* Left Panel: Form Input */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 print:hidden">
        <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Printer className="text-blue-600" />
            Cetak Dokumen
          </h1>
          
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('honorarium')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'honorarium' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={16} />
              Honorarium
            </button>
            <button
              onClick={() => setMode('pulsa')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'pulsa' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone size={16} />
              Struk Pulsa
            </button>
            <button
              onClick={() => setMode('wifi')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'wifi' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wifi size={16} />
              WiFi
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'honorarium' ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Informasi Umum</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
                    <input type="text" value={honorData.bulan} onChange={e => setHonorData({...honorData, bulan: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Sekolah</label>
                    <input type="text" value={honorData.namaSekolah} onChange={e => setHonorData({...honorData, namaSekolah: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kecamatan</label>
                    <input type="text" value={honorData.kecamatan} onChange={e => setHonorData({...honorData, kecamatan: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kabupaten</label>
                    <input type="text" value={honorData.kabupaten} onChange={e => setHonorData({...honorData, kabupaten: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">No. Kegiatan</label>
                    <input type="text" value={honorData.noKegiatan} onChange={e => setHonorData({...honorData, noKegiatan: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">No. Rekening</label>
                    <input type="text" value={honorData.noRekening} onChange={e => setHonorData({...honorData, noRekening: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Penandatangan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kepala Sekolah</label>
                    <input type="text" value={honorData.kepalaSekolah} onChange={e => setHonorData({...honorData, kepalaSekolah: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">NIP Kepsek</label>
                    <input type="text" value={honorData.nipKepalaSekolah} onChange={e => setHonorData({...honorData, nipKepalaSekolah: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bendahara</label>
                    <input type="text" value={honorData.bendahara} onChange={e => setHonorData({...honorData, bendahara: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">NIP Bendahara</label>
                    <input type="text" value={honorData.nipBendahara} onChange={e => setHonorData({...honorData, nipBendahara: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tempat</label>
                    <input type="text" value={honorData.tempat} onChange={e => setHonorData({...honorData, tempat: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                    <input type="text" value={honorData.tanggal} onChange={e => setHonorData({...honorData, tanggal: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Daftar Pegawai</h3>
                  <button onClick={handleAddPegawai} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                    + Tambah
                  </button>
                </div>
                
                {honorData.daftarPegawai.map((pegawai, index) => (
                  <div key={pegawai.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
                    <button 
                      onClick={() => handleRemovePegawai(pegawai.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
                    >
                      Hapus
                    </button>
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Pegawai #{index + 1}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Nama Pegawai</label>
                        <input type="text" value={pegawai.nama} onChange={e => handleUpdatePegawai(pegawai.id, 'nama', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">No. Bukti</label>
                        <input type="text" value={pegawai.noBukti} onChange={e => handleUpdatePegawai(pegawai.id, 'noBukti', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jabatan</label>
                        <input type="text" value={pegawai.jabatan} onChange={e => handleUpdatePegawai(pegawai.id, 'jabatan', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Golongan</label>
                        <input type="text" value={pegawai.golongan} onChange={e => handleUpdatePegawai(pegawai.id, 'golongan', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Frekuensi</label>
                        <input type="number" value={pegawai.frekuensi} onChange={e => handleUpdatePegawai(pegawai.id, 'frekuensi', Number(e.target.value))} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Satuan (Rp)</label>
                        <input type="number" value={pegawai.satuan} onChange={e => handleUpdatePegawai(pegawai.id, 'satuan', Number(e.target.value))} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : mode === 'pulsa' ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Detail Transaksi</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">No. Pesanan</label>
                  <input type="text" value={pulsaData.noPesanan} onChange={e => setPulsaData({...pulsaData, noPesanan: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Produk</label>
                  <input type="text" value={pulsaData.produk} onChange={e => setPulsaData({...pulsaData, produk: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nominal (Rp)</label>
                  <input type="number" value={pulsaData.nominal} onChange={e => setPulsaData({...pulsaData, nominal: Number(e.target.value)})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">No. Handphone</label>
                  <input type="text" value={pulsaData.noHandphone} onChange={e => setPulsaData({...pulsaData, noHandphone: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">No. Serial</label>
                  <input type="text" value={pulsaData.noSerial} onChange={e => setPulsaData({...pulsaData, noSerial: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Transaksi</label>
                  <input type="text" value={pulsaData.tanggalTransaksi} onChange={e => setPulsaData({...pulsaData, tanggalTransaksi: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Harga Total (Rp)</label>
                  <input type="number" value={pulsaData.harga} onChange={e => setPulsaData({...pulsaData, harga: Number(e.target.value)})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Detail Pembayaran WiFi</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">No</label>
                  <input type="text" value={wifiData.no} onChange={e => setWifiData({...wifiData, no: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Telah terima dari</label>
                  <input type="text" value={wifiData.telahTerimaDari} onChange={e => setWifiData({...wifiData, telahTerimaDari: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Uang Sejumlah (Terbilang)</label>
                  <input type="text" value={wifiData.uangSejumlah} onChange={e => setWifiData({...wifiData, uangSejumlah: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Untuk pembayaran</label>
                  <input type="text" value={wifiData.untukPembayaran} onChange={e => setWifiData({...wifiData, untukPembayaran: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tempat & Tanggal</label>
                  <input type="text" value={wifiData.tempatTanggal} onChange={e => setWifiData({...wifiData, tempatTanggal: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama Penandatangan</label>
                  <input type="text" value={wifiData.namaPenandatangan} onChange={e => setWifiData({...wifiData, namaPenandatangan: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nominal (Rp)</label>
                  <input type="number" value={wifiData.nominal} onChange={e => setWifiData({...wifiData, nominal: Number(e.target.value)})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className={`flex-1 py-3 px-2 rounded-lg text-white font-medium flex items-center justify-center gap-1 transition-colors text-sm ${
                mode === 'honorarium' ? 'bg-blue-600 hover:bg-blue-700' : mode === 'pulsa' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Printer size={16} />
              Cetak
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`flex-1 py-3 px-2 rounded-lg text-white font-medium flex items-center justify-center gap-1 transition-colors text-sm ${
                isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Download size={16} />
              PDF
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingPDF}
              className={`flex-1 py-3 px-2 rounded-lg text-white font-medium flex items-center justify-center gap-1 transition-colors text-sm ${
                isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <ImageIcon size={16} />
              Gambar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
            * Jika tombol cetak tidak merespon, silakan <strong>buka aplikasi di Tab Baru</strong> (ikon ↗ di pojok kanan atas) lalu tekan cetak.
          </p>
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="w-2/3 bg-gray-200 p-8 overflow-y-auto flex justify-center items-start print:w-full print:p-0 print:bg-white print:overflow-visible">
        {/* The wrapper div that will be printed */}
        <div className="print-container w-full flex justify-center">
          {/* Print-specific styles to ensure background colors and borders print correctly */}
          <style type="text/css" media="print">
            {`
              @page { 
                size: ${mode === 'honorarium' ? '215mm 330mm' : mode === 'wifi' ? '215mm 165mm' : 'auto'}; 
                margin: ${mode === 'honorarium' ? '10mm' : '0mm'}; 
              }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white; }
            `}
          </style>
          
          <div className="shadow-2xl bg-white print:shadow-none">
            <div ref={pdfRef} className="bg-[#ffffff]">
              {mode === 'honorarium' ? (
                <CetakHonorarium data={honorData} />
              ) : mode === 'pulsa' ? (
                <CetakPulsa data={pulsaData} />
              ) : (
                <CetakWifi data={wifiData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { forwardRef } from 'react';
import { PulsaData } from '../types';

interface Props {
  data: PulsaData;
}

export const CetakPulsa = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div ref={ref} className="bg-[#ee4d2d] p-4 font-sans w-[450px] mx-auto min-h-[900px] flex flex-col">
      <div className="bg-[#ffffff] rounded-2xl flex-1 p-8 pt-10 flex flex-col">
        <div className="flex items-center mb-1">
          {/* Logo Shopee - Simpan gambar dengan nama 'shopee-logo.png' di folder 'public' */}
          <img src="/shopee-logo.png" alt="Shopee Logo" className="w-10 h-10 object-contain mr-3 shrink-0" />
          
          <div className="flex items-center">
            <h1 className="text-[#ee4d2d] text-2xl font-medium tracking-tight">ShopeePay</h1>
            <span className="mx-3 text-[#ee4d2d] text-2xl font-light">|</span>
            <h2 className="text-[#ee4d2d] text-xl font-medium">Faktur Pesanan</h2>
          </div>
        </div>

        <div className="ml-[52px] mb-8">
          <p className="text-[#6b7280] text-sm">Powered By Shopee</p>
        </div>
        
        <h3 className="font-bold text-lg mb-2 pb-4 border-b border-[#e5e7eb]">Bukti Pembayaran - Pulsa</h3>

        <div className="text-sm">
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">No. Pesanan</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3 break-all">{data.noPesanan}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">Produk</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3">{data.produk}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">Nominal</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3">{formatRupiah(data.nominal).replace('Rp', 'Rp ')}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">No. Handphone</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3">{data.noHandphone}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">No. Serial</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3 break-all">{data.noSerial}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">Tanggal Transaksi</span>
            <span className="font-medium text-[#1f2937] text-right w-2/3">{data.tanggalTransaksi}</span>
          </div>
          <div className="flex justify-between items-start py-4 border-b border-[#f3f4f6]">
            <span className="text-[#6b7280] w-1/3">Harga</span>
            <div className="text-right w-2/3 flex justify-end">
              <span className="font-medium text-[#1f2937]">{formatRupiah(data.harga)}</span>
            </div>
          </div>
        </div>
        
        {/* Empty space at the bottom to match the image */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
});

CetakPulsa.displayName = 'CetakPulsa';

import { forwardRef } from 'react';
import { WifiData } from '../types';

interface Props {
  data: WifiData;
}

export const CetakWifi = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(angka);
  };

  return (
    <div ref={ref} className="bg-[#ffffff] p-8 font-sans w-[860px] h-[660px] mx-auto text-[#000000] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Logo WiFi - Simpan gambar dengan nama 'wifi-logo.png' di folder 'public' */}
        <img src="/wifi-logo.png" alt="Logo Fastama" className="h-24 object-contain" />
        <div className="text-right">
          <h1 className="text-2xl font-bold tracking-wide">PT.FIQRAN SOLUSINDO MEDIATAMA</h1>
          <p className="text-lg text-center font-semibold mt-1">IT Support ,Service and Network solution</p>
        </div>
      </div>

      {/* Title */}
      <div className="border border-[#000000] py-2 mb-6 text-center">
        <h2 className="text-xl font-bold tracking-wide">TANDA BUKTI PEMBAYARAN</h2>
      </div>

      {/* Content */}
      <div className="space-y-5 text-lg font-bold mb-4 flex-1">
        <div className="flex">
          <div className="w-64">No</div>
          <div className="w-4">:</div>
          <div className="flex-1">{data.no}</div>
        </div>
        <div className="flex">
          <div className="w-64">Telah terima dari</div>
          <div className="w-4">:</div>
          <div className="flex-1">{data.telahTerimaDari}</div>
        </div>
        <div className="flex">
          <div className="w-64">Uang Sejumlah</div>
          <div className="w-4">:</div>
          <div className="flex-1">{data.uangSejumlah}</div>
        </div>
        <div className="flex">
          <div className="w-64">Untuk pembayaran</div>
          <div className="w-4">:</div>
          <div className="flex-1">{data.untukPembayaran}</div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="flex justify-end mb-4">
        <div className="text-center w-72">
          <p className="text-lg font-bold mb-2">{data.tempatTanggal}</p>
          <div className="h-28 flex items-center justify-center my-2">
            {/* Cap/Tanda Tangan - Simpan gambar dengan nama 'wifi-stamp.png' di folder 'public' */}
            <img src="/wifi-stamp.png" alt="Cap Tanda Tangan" className="h-20 object-contain" />
          </div>
          <p className="text-lg font-bold">{data.namaPenandatangan}</p>
        </div>
      </div>

      {/* Amount Box */}
      <div className="border border-[#000000] py-1 px-4 mt-auto">
        <p className="text-2xl font-bold">{formatRupiah(data.nominal).replace('Rp', 'Rp ')}</p>
      </div>
    </div>
  );
});

CetakWifi.displayName = 'CetakWifi';

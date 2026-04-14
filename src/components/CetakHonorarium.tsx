import { forwardRef } from 'react';
import { HonorariumData } from '../types';

interface Props {
  data: HonorariumData;
}

export const CetakHonorarium = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const totalJumlah = data.daftarPegawai.reduce((acc, curr) => acc + (curr.frekuensi * curr.satuan), 0);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div ref={ref} className="p-8 bg-[#ffffff] text-[#000000] w-full max-w-[1000px] mx-auto text-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="text-center font-bold mb-6">
        <h1 className="text-base uppercase">DAFTAR PENERIMAAN HONORARIUM TENAGA ADMINISTRASI SEKOLAH</h1>
        <h2 className="text-base">BULAN {data.bulan}</h2>
      </div>

      <div className="flex justify-between mb-4">
        <table className="w-1/2">
          <tbody>
            <tr>
              <td className="w-32 py-0.5">Nama Sekolah</td>
              <td className="w-4">:</td>
              <td>{data.namaSekolah}</td>
            </tr>
            <tr>
              <td className="py-0.5">Kecamatan</td>
              <td>:</td>
              <td>{data.kecamatan}</td>
            </tr>
            <tr>
              <td className="py-0.5">Kabupaten</td>
              <td>:</td>
              <td>{data.kabupaten}</td>
            </tr>
          </tbody>
        </table>
        <table className="w-1/3">
          <tbody>
            <tr>
              <td className="w-32 py-0.5">No. Kegiatan</td>
              <td className="w-4">:</td>
              <td>{data.noKegiatan}</td>
            </tr>
            <tr>
              <td className="py-0.5">No. Rekening</td>
              <td>:</td>
              <td>{data.noRekening}</td>
            </tr>
            <tr>
              <td className="py-0.5">Pegawai</td>
              <td>:</td>
              <td>{data.daftarPegawai.length} Orang</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="w-full border-collapse border border-[#000000] mb-8">
        <thead>
          <tr className="text-center">
            <th className="border border-[#000000] p-2 font-normal w-10">No</th>
            <th className="border border-[#000000] p-2 font-normal w-24">No. Bukti</th>
            <th className="border border-[#000000] p-2 font-normal">Nama Pegawai</th>
            <th className="border border-[#000000] p-2 font-normal w-20">Jabatan</th>
            <th className="border border-[#000000] p-2 font-normal w-20">Golongan</th>
            <th className="border border-[#000000] p-2 font-normal w-20">Frekwensi</th>
            <th className="border border-[#000000] p-2 font-normal w-32">Satuan (Rp)</th>
            <th className="border border-[#000000] p-2 font-normal w-32">Diterima</th>
            <th className="border border-[#000000] p-2 font-normal w-32">Tanda Tangan</th>
          </tr>
        </thead>
        <tbody>
          {data.daftarPegawai.map((pegawai, index) => {
            const jumlah = pegawai.frekuensi * pegawai.satuan;
            return (
              <tr key={pegawai.id} className="text-center h-10">
                <td className="border border-[#000000] p-1">{index + 1}</td>
                <td className="border border-[#000000] p-1">{pegawai.noBukti}</td>
                <td className="border border-[#000000] p-1 text-left px-2">{pegawai.nama}</td>
                <td className="border border-[#000000] p-1">{pegawai.jabatan}</td>
                <td className="border border-[#000000] p-1">{pegawai.golongan || '-'}</td>
                <td className="border border-[#000000] p-1">{pegawai.frekuensi}</td>
                <td className="border border-[#000000] p-1">
                  <div className="flex justify-between px-1">
                    <span>Rp</span>
                    <span>{formatRupiah(pegawai.satuan).replace('Rp', '').trim()}</span>
                  </div>
                </td>
                <td className="border border-[#000000] p-1">
                  <div className="flex justify-between px-1">
                    <span>Rp</span>
                    <span>{formatRupiah(jumlah).replace('Rp', '').trim()}</span>
                  </div>
                </td>
                <td className="border border-[#000000] p-1 text-left relative">
                </td>
              </tr>
            );
          })}

          <tr className="font-bold text-center h-8">
            <td colSpan={7} className="border border-[#000000] p-1 uppercase">JUMLAH</td>
            <td colSpan={2} className="border border-[#000000] p-1">
              <div className="flex justify-between px-1">
                <span>Rp</span>
                <span>{formatRupiah(totalJumlah).replace('Rp', '').trim()}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between mt-8 px-4">
        <div className="text-left">
          <p className="mb-0">Setuju Bayar</p>
          <p className="mb-16">Kepala Sekolah</p>
          <p className="font-bold underline">{data.kepalaSekolah}</p>
          <p>NIP. {data.nipKepalaSekolah}</p>
        </div>
        <div className="text-center flex flex-col justify-end">
          <p className="mb-16">Lunas Bayar<br/>{data.tanggal}</p>
        </div>
        <div className="text-left">
          <p className="mb-0">{data.tempat}, {data.tanggal}</p>
          <p className="mb-16">Bendahara BOS {data.namaSekolah}</p>
          <p className="font-bold underline">{data.bendahara}</p>
          <p>NIP. {data.nipBendahara}</p>
        </div>
      </div>
    </div>
  );
});

CetakHonorarium.displayName = 'CetakHonorarium';

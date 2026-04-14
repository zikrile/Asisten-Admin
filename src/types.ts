export interface Pegawai {
  id: string;
  noBukti: string;
  nama: string;
  jabatan: string;
  golongan: string;
  frekuensi: number;
  satuan: number;
}

export interface HonorariumData {
  bulan: string;
  namaSekolah: string;
  kecamatan: string;
  kabupaten: string;
  noKegiatan: string;
  noRekening: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  bendahara: string;
  nipBendahara: string;
  tanggal: string;
  tempat: string;
  daftarPegawai: Pegawai[];
}

export interface PulsaData {
  noPesanan: string;
  produk: string;
  nominal: number;
  noHandphone: string;
  noSerial: string;
  tanggalTransaksi: string;
  harga: number;
}

export interface WifiData {
  no: string;
  telahTerimaDari: string;
  uangSejumlah: string;
  untukPembayaran: string;
  tempatTanggal: string;
  namaPenandatangan: string;
  nominal: number;
}
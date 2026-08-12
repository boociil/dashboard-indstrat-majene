import { createApi } from "./createAPI";

const prisma = createApi(process.env.NEXT_PUBLIC_PRISMA_API);

export const getDataFilteredData = () => prisma("api/filteredData");
export const getAndilData = (selectedItem, selectedTahun, selectedBulan) => prisma(`api/getAndil?flag=${selectedItem}&tahun=${selectedTahun}&bulan=${selectedBulan}`);
// Get Andil Detail Data
export const getDetailData = (flag, selectedItem, selectedTahun, selectedBulan) => prisma(`api/getAndilDetail?flag=${flag}&tahun=${selectedTahun}&bulan=${selectedBulan}&kode_filter=${selectedItem}`);

// Get Data Detail per Bulan
export const getDataDetailperBulan = (tipe, selectedItem, selectedTahun, selectedBulan) => prisma(`api/getDataDetail?tipe=${tipe}&nama=${selectedItem}&tahun=${selectedTahun}&bulan=${selectedBulan}`);

// https://prisma-majene.vercel.app/api/getDataDetail?tipe=Inflasi%20MtM&nama=0116055&tahun=2026&bulan=7
// nama itu nomor komoditas nya
// contoh : 
//  https://prisma-majene.vercel.app/api/getDataDetail?tipe=Inflasi%20MtM&nama=1&tahun=2026&bulan=7

export const getKelompok = (type) => prisma(`api/getKelompok?flag=${type}`);


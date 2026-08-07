import { createApi } from "./createAPI";

const prisma = createApi(process.env.NEXT_PUBLIC_PRISMA_API);

export const getDataFilteredData = () => prisma("api/filteredData");
export const getAndilData = (selectedItem, selectedTahun, selectedBulan) => prisma(`api/getAndil?flag=${selectedItem}&tahun=${selectedTahun}&bulan=${selectedBulan}`);
export const getDetailData = (flag, selectedItem, selectedTahun, selectedBulan) => prisma(`api/getAndilDetail?flag=${flag}&tahun=${selectedTahun}&bulan=${selectedBulan}&kode_filter=${selectedItem}`);
// export const getDataFilteredData = () => prisma("api/filteredData");
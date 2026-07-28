import { createApi } from "./createAPI";

const prisma = createApi(process.env.NEXT_PUBLIC_PRISMA_API);

export const getDataFilteredData = () => prisma("api/filteredData");
// export const getDataFilteredData = () => prisma("api/filteredData");
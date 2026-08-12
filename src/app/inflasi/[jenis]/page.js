// Server Component
import Link from "next/link";
import {
  TrendingUp,
  ChevronLeft,
  Calendar,
  ShoppingBag,
  ArrowLeft,
  Download,
  Percent,
  Sliders,
  Info,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";

import InflasiDetailClient from "@/app/components/InflasiDetailClient";
import { getDetailData, getKelompok } from "@/services/prismaAPI";

import { notFound } from "next/navigation";

// /api/getAndilDetail?flag=2&tahun=2026&bulan=7&kode_filter=05

export default async function InflasiDetailPage({ params }) {
  const { jenis } = await params; // ✅ tambahkan async di function + await di params
  
  const detailData = await getDetailData(2, "05", 2026, 7);
  const KelompokData = await getKelompok(1);

  const validJenis = ["MtM", "YtD", "YoY", "IHK"];

  if (!validJenis.includes(jenis)) {
    notFound();
  }

  return (
    <div>
      <InflasiDetailClient jenis={jenis} initialData={detailData} initialKelompok={KelompokData} />
    </div>
  );
}

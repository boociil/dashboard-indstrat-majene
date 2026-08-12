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

import { getDataFilteredData, getAndilData } from "@/services/prismaAPI";

import InflasiClient from "@/app/components/InflasiClient";
import { getDetailData } from "@/services/prismaAPI";

import { notFound } from "next/navigation";

// /api/getAndilDetail?flag=2&tahun=2026&bulan=7&kode_filter=05

export default async function InflasiDetailPage({ params }) {
  
  const data = await getDataFilteredData();

  const validJenis = ["MtM", "YtD", "YoY", "IHK"];


  return (
    <div>
      <InflasiClient initialData={data} />
    </div>
  );
}

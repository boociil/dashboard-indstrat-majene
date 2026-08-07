"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, Download } from "lucide-react";
import { getDetailData } from "@/services/prismaAPI";

export default function InflasiDetailClient({ jenis, initialData }) {
  
const [detailData, setDetailData] = useState(initialData || null);

  const [filter, setFilter] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
    kode_filter: "05",
  });

  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getDetailData(2, filter.kode_filter, filter.tahun, filter.bulan);
            setDetailData(data);
        } catch (error) {
            console.error("Error fetching detail data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [filter, jenis]);

  return (
    <div>
      <div className="flex-1 flex flex-col xl:flex-row h-screen overflow-hidden bg-[#f1f3f5]">
        {/* LEFT COLUMN: Main Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" /> Beranda
            </Link>
            <span className="text-xs text-slate-300 font-bold">/</span>
            <Link
              href="/inflasi"
              className="text-xs text-slate-400 font-bold uppercase tracking-wider"
            >
              Inflasi
            </Link>
            <span className="text-xs text-slate-300 font-bold">/</span>
            <span className="text-xs text-slate-500 font-bold tracking-wider">
              {jenis}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Inflasi Daerah
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Framework Pemantauan Indeks Harga Konsumen (IHK) Kabupaten Majene
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
          <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
        </button>
      </div>
    </div>
  );
}

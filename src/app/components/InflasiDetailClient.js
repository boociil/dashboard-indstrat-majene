"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Download,
  Calendar,
  ShoppingBag,
  CircleDollarSign,
} from "lucide-react";
import {
  getDetailData,
  getKelompok,
  getDataDetailperBulan,
} from "@/services/prismaAPI";
import { filerSelect } from "@/app/components/FilterSelect";

export default function InflasiDetailClient({
  jenis,
  initialData,
  initialKelompok,
}) {
  // console.log(initialData, "initialData");
  // console.log(initialKelompok, "initialKelompok");

  // Filter States
  const [selectedMonthRange, setSelectedMonthRange] = useState("Des"); // Filter up to this month
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [loadingTipe, setLoadingTipe] = useState(false);

  const [data, setData] = useState([]);
  const [kelompokData, setKelompokData] = useState(initialKelompok || null);

  // const [tipe, setTipe] = useState(0);

  const [filter, setFilter] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth(),
    tipe: 1,
    kode_filter: 0,
  });

  const [loading, setLoading] = useState(false);

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDataDetailperBulan(
          `Inflasi ${jenis}`,
          filter.kode_filter,
          filter.tahun,
          filter.bulan,
        );
        setData(data);
        console.log(data, "data yang diperbarui");
      } catch (error) {
        console.error("Error fetching detail data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter.kode_filter, filter.tahun, filter.bulan, jenis]);

  useEffect(() => {
    const fetchKelompokData = async () => {
      try {
        setLoadingTipe(true);
        const data = await getKelompok(filter.tipe);
        setKelompokData(data);
        console.log(data, "kelompokData yang diperbarui");
      } catch (error) {
        console.error("Error fetching kelompok data:", error);
      } finally {
        setLoadingTipe(false);
      }
    };

    fetchKelompokData();
  }, [filter.tipe]);

  return (
    <div>
      <div className="flex-1 flex flex-col xl:flex-row h-screen overflow-hidden bg-[#f1f3f5]">
        {/* LEFT COLUMN: Main Dashboard Content */}
        <div className="w-full">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  Inflasi {jenis}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Pantau Inflasi {jenis} secara real-time dan dapatkan wawasan
                  mendalam tentang tren inflasi di Indonesia.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
                <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
              </button>
            </div>
          </div>

          {/* Tabel */}
          <div className="bg-white bordergrid grid-cols-1 2xl:grid-cols-2 gap-6 mx-8 p-8 rounded-xl border border-slate-200/80 overflow-x-auto">
            <p className="text-xs text-slate-400 font-medium mb-8">
              {filter.tipe == 1
                ? "Kelompok Pengeluaran"
                : filter.tipe == 2
                  ? "Sub-Kelompok Pengeluaran"
                  : "Komoditas"}
                  : 
                  
            </p>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200/80">
                  <th className="px-4 py-2 text-center">Bulan</th>
                  <th className="px-4 py-2 text-center">Tahun</th>
                  <th className="px-4 py-2 text-center">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-slate-200/80">
                      <td className="px-4 py-2 text-center">
                        {namaBulan[item.Bulan - 1]}
                      </td>
                      <td className="px-4 py-2 text-center">{item.Tahun}</td>
                      <td className="px-4 py-2 text-center">{item.nilai}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* RIGHT COLUMN: Filter Panel */}
        <div className="w-full xl:w-96 bg-white border-t xl:border-t-0 xl:border-l border-slate-200/80 p-8 space-y-6 overflow-y-auto h-auto xl:h-screen">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Panel Kontrol Filter
            </h3>
            <p className="text-xs text-slate-400">
              Sesuaikan data dan visualisasi dashboard
            </p>
          </div>
          <hr className="border-slate-100" />

          {/* Filter 1: Komoditas */}
          {loadingTipe ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                Loading...
              </label>
              <select
                disabled
                className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-gray-500 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500`}
              >
                <option value={0}>Loading...</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                {filter.tipe == 1
                  ? "Kelompok Pengeluaran"
                  : filter.tipe == 2
                    ? "Sub-Kelompok Pengeluaran"
                    : "Komoditas"}
              </label>
              <select
                value={filter.kode_filter}
                onChange={(e) =>
                  setFilter({ ...filter, kode_filter: e.target.value })
                }
                className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 ${selectedCategory === 0 ? "text-gray-500" : "text-slate-700"} rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500`}
              >
                <option value={0}>pilih...</option>
                {kelompokData &&
                  kelompokData.result.map((item) => (
                    <option key={item.Kode} value={item.Kode}>
                      {item.NamaKomoditas}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Filter 1: Kelompok Pengeluaran */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              Kelompok
            </label>
            <select
              value={filter.tipe}
              onChange={(e) => setFilter({ ...filter, tipe: e.target.value })}
              className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 ${selectedCategory === 0 ? "text-gray-500" : "text-slate-700"} rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500`}
            >
              <option value={1}>Kelompok Pengeluaran</option>
              <option value={2}>Sub-Kelompok Pengeluaran</option>
              <option value={3}>Komoditas</option>
            </select>
          </div>

          {/* Filter 2: Tahun */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tahun
            </label>
            <select
              value={filter.tahun}
              onChange={(e) => setFilter({ ...filter, tahun: e.target.value })}
              className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 ${selectedCategory === 0 ? "text-gray-500" : "text-slate-700"} rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500`}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* Filter 2: Bulan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Bulan
            </label>
            <select
              value={filter.bulan}
              onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}
              className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 ${selectedCategory === 0 ? "text-gray-500" : "text-slate-700"} rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500`}
            >
              <option value={1}>Januari</option>
              <option value={2}>Februari</option>
              <option value={3}>Maret</option>
              <option value={4}>April</option>
              <option value={5}>Mei</option>
              <option value={6}>Juni</option>
              <option value={7}>Juli</option>
              <option value={8}>Agustus</option>
              <option value={9}>September</option>
              <option value={10}>Oktober</option>
              <option value={11}>November</option>
              <option value={12}>Desember</option>
            </select>
          </div>

          {/* Reset Actions */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => {
                setFilter({
                  tahun: new Date().getFullYear(),
                  bulan: new Date().getMonth(),
                  tipe: 1,
                });
              }}
              className="flex-1 cursor-pointer py-3 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 text-center"
            >
              Reset Filter
            </button>
            <button className="flex-1 cursor-pointer py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center shadow-sm">
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

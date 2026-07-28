'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  ChevronLeft, 
  Calendar, 
  Leaf, 
  ArrowLeft,
  Download,
  Activity,
  Award
} from 'lucide-react';

export default function PertanianPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCommodity, setSelectedCommodity] = useState('Semua');

  useEffect(() => {
    async function fetchTopicData() {
      try {
        const response = await fetch('/api/dashboard?topic=pertanian');
        if (!response.ok) {
          throw new Error('Gagal mengambil data pertanian');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopicData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f1f3f5]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-500">Memuat Framework Pertanian...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8 bg-[#f1f3f5]">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-lg font-bold text-red-600">Error</h2>
          <p className="text-sm text-slate-500">{error || 'Data tidak ditemukan'}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 font-bold">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Get matching record based on selected year
  const historicalRecord = data.historical.find(h => h.year.toString() === selectedYear) || data.historical[data.historical.length - 1];

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-screen overflow-hidden bg-[#f1f3f5]">
      {/* LEFT COLUMN: Main Dashboard Content */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider">
            <ChevronLeft className="w-4 h-4" /> Beranda
          </Link>
          <span className="text-xs text-slate-300 font-bold">/</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pertanian</span>
        </div>

        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Sektor Pertanian & Pangan</h2>
            <p className="text-xs text-slate-400 font-medium">Framework Analisis Komoditas Palawija Unggulan Kabupaten Majene</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
          </button>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Production Volume */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Produksi Palawija</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              {historicalRecord.total.toLocaleString('id-ID')} Ton
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">Tahun {selectedYear}</span>
              <span>Jagung & Ubi Kayu</span>
            </div>
          </div>

          {/* Card 2: Luas Panen */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Luas Panen</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              7,970 Ha
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Hektar Area Lahan Produktif</span>
            </div>
          </div>

          {/* Card 3: Produktivitas Rata-rata */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Produktivitas Rata-rata</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              5.67 Ton/Ha
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Efisiensi Produksi Tinggi</span>
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Production Historical Trends */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Tren Produksi Palawija Daerah (Ton)</h3>
            <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
              {data.historical.map((h) => {
                const heightPercentage = (h.total / 50000) * 100; // normalize
                const isSelected = h.year.toString() === selectedYear;

                return (
                  <div key={h.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {h.total.toLocaleString('id-ID')} T
                    </span>
                    <div 
                      style={{ height: `${heightPercentage}%` }} 
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected 
                          ? 'bg-slate-900 shadow-md shadow-slate-900/10' 
                          : 'bg-emerald-200 group-hover:bg-emerald-400'
                      }`}
                    ></div>
                    <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                      {h.year}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>* Gabungan Jagung & Ubi Kayu</span>
              <span>Sumber: Dinas Pertanian Majene</span>
            </div>
          </div>

          {/* Table Commodity Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Rincian Produksi per Komoditas (2024)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="py-2.5">Nama Komoditas</th>
                    <th className="py-2.5 text-right">Luas Panen (Ha)</th>
                    <th className="py-2.5 text-right">Volume Produksi (Ton)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/60">
                  {data.byCommodity.map((c) => {
                    const isSelected = selectedCommodity === 'Semua' || c.commodity === selectedCommodity;

                    return (
                      <tr 
                        key={c.commodity} 
                        className={`transition-colors ${
                          isSelected ? 'text-slate-700 bg-white' : 'text-slate-300 opacity-40 bg-slate-50/10'
                        }`}
                      >
                        <td className="py-2.5 font-bold">{c.commodity}</td>
                        <td className="py-2.5 text-right font-medium">{c.area_ha.toLocaleString('id-ID')} Ha</td>
                        <td className="py-2.5 text-right font-bold">{c.production.toLocaleString('id-ID')} Ton</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Notes */}
        <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-6">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Kebijakan Pertanian & Pangan</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data dikumpulkan secara berkala melalui laporan SP-Lahan dan SP-Palawija dari setiap Mantri Tani Kecamatan di Kabupaten Majene. Sektor pertanian menyerap tenaga kerja terbesar di Kabupaten Majene dan menjadi prioritas utama ketahanan pangan lokal.
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Filters Panel */}
      <div className="w-full xl:w-96 bg-white border-t xl:border-t-0 xl:border-l border-slate-200/80 p-8 space-y-6 overflow-y-auto h-auto xl:h-screen">
        <div>
          <h3 className="text-base font-bold text-slate-800">Panel Kontrol Filter</h3>
          <p className="text-xs text-slate-400">Sesuaikan data dan visualisasi dashboard</p>
        </div>
        <hr className="border-slate-100" />

        {/* Filter 1: Tahun */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Pilih Tahun Rilis
          </label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {data.historical.map(h => (
              <option key={h.year} value={h.year}>Tahun {h.year}</option>
            ))}
          </select>
        </div>

        {/* Filter 2: Jenis Komoditas */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-slate-400" />
            Fokus Komoditas
          </label>
          <select 
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Komoditas Palawija</option>
            {data.byCommodity.map(c => (
              <option key={c.commodity} value={c.commodity}>{c.commodity}</option>
            ))}
          </select>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => {
              setSelectedYear('2024');
              setSelectedCommodity('Semua');
            }}
            className="flex-1 py-3 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 text-center"
          >
            Reset Filter
          </button>
          <button className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center shadow-sm">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

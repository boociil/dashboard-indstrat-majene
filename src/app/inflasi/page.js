'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ChevronLeft, 
  Calendar, 
  ShoppingBag, 
  ArrowLeft,
  Download,
  Percent,
  Sliders,
  Info
} from 'lucide-react';

export default function InflasiPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedMonthRange, setSelectedMonthRange] = useState('Des'); // Filter up to this month
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    async function fetchTopicData() {
      try {
        const response = await fetch('/api/dashboard?topic=inflasi');
        if (!response.ok) {
          throw new Error('Gagal mengambil data inflasi');
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
          <p className="text-sm font-bold text-slate-500">Memuat Framework Inflasi...</p>
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

  // Get matching record based on selectedMonthRange
  const activeRecord = data.historical.find(h => h.month === selectedMonthRange) || data.historical[data.historical.length - 1];

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
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Inflasi</span>
        </div>

        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Inflasi Daerah</h2>
            <p className="text-xs text-slate-400 font-medium">Framework Pemantauan Indeks Harga Konsumen (IHK) Kabupaten Majene</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
          </button>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Inflation Rate */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inflasi YoY (Indeks Bulanan)</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {activeRecord.rate}%
              <span className="text-xs font-medium text-emerald-600 px-2 py-0.5 bg-green-50 rounded-full self-center">Mendekati Target</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">Bulan {activeRecord.month} 2024</span>
              <span>Year-on-Year</span>
            </div>
          </div>

          {/* Card 2: Sasaran Nasional */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sasaran Inflasi BI (2024)</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              2.5% ± 1%
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Rentang toleransi: 1.5% - 3.5%</span>
            </div>
          </div>

          {/* Card 3: Volatile Food */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kelompok Pangan Bergejolak</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              {data.byCategory[0].rate}%
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-600 font-bold">
              <span>Makanan & Minuman (Kontribusi Tertinggi)</span>
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Line graph representation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Laju Inflasi Bulanan (YoY) - 2024</h3>
            <div className="h-60 flex items-end justify-between gap-2 pt-6 border-b border-slate-100">
              {data.historical.map((h) => {
                const heightPercentage = (h.rate / 4) * 100; // normalize
                const isActive = h.month === selectedMonthRange;

                return (
                  <div key={h.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {h.rate}%
                    </span>
                    <div 
                      style={{ height: `${heightPercentage}%` }} 
                      className={`w-full rounded-t transition-all duration-300 ${
                        isActive 
                          ? 'bg-slate-900 shadow-md shadow-slate-900/10' 
                          : 'bg-amber-200 group-hover:bg-amber-400'
                      }`}
                    ></div>
                    <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                      {h.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>* Target tengah: 2.5%</span>
              <span>Sumber: TPID / BPS Majene</span>
            </div>
          </div>

          {/* Table Category Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Inflasi Berdasarkan Kelompok Pengeluaran (YoY)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="py-2.5">Kelompok Pengeluaran</th>
                    <th className="py-2.5 text-right">Laju Inflasi YoY (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/60">
                  {data.byCategory.map((c) => {
                    const isSelected = selectedCategory === 'Semua' || c.category === selectedCategory;

                    return (
                      <tr 
                        key={c.category} 
                        className={`transition-colors ${
                          isSelected ? 'text-slate-700 bg-white' : 'text-slate-300 opacity-40 bg-slate-50/10'
                        }`}
                      >
                        <td className="py-2.5 font-bold flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.rate > 2.5 ? 'bg-red-400' : 'bg-green-400'}`}></span>
                          {c.category}
                        </td>
                        <td className={`py-2.5 text-right font-bold ${c.rate < 0 ? 'text-green-600' : 'text-slate-700'}`}>
                          {c.rate}%
                        </td>
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
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Keterangan Teknis Inflasi</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inflasi Year-on-Year (YoY) mengukur tingkat kenaikan harga barang dan jasa di bulan berjalan dibanding bulan yang sama tahun sebelumnya. Tim Pengendalian Inflasi Daerah (TPID) Kabupaten Majene rutin melaksanakan operasi pasar di Pasar Sentral Majene untuk menjaga kelompok barang bergejolak (volatile foods).
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

        {/* Filter 1: Bulan Acuan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Bulan Acuan Tren
          </label>
          <select 
            value={selectedMonthRange}
            onChange={(e) => setSelectedMonthRange(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {data.historical.map(h => (
              <option key={h.month} value={h.month}>Bulan {h.month}</option>
            ))}
          </select>
        </div>

        {/* Filter 2: Kelompok Pengeluaran */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
            Kelompok Pengeluaran
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Kelompok</option>
            {data.byCategory.map(c => (
              <option key={c.category} value={c.category}>{c.category.substring(0, 30)}...</option>
            ))}
          </select>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => {
              setSelectedMonthRange('Des');
              setSelectedCategory('Semua');
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

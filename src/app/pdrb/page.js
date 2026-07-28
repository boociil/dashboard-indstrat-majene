'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ChevronLeft, 
  Calendar, 
  Briefcase, 
  Coins, 
  ArrowLeft,
  TrendingUp,
  Download,
  TrendingDown
} from 'lucide-react';

export default function PdrbPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedYear, setSelectedYear] = useState('2024');
  const [priceBasis, setPriceBasis] = useState('adhk'); // adhk (Konstan) or adhb (Berlaku)
  const [selectedSector, setSelectedSector] = useState('Semua');

  useEffect(() => {
    async function fetchTopicData() {
      try {
        const response = await fetch('/api/dashboard?topic=pdrb');
        if (!response.ok) {
          throw new Error('Gagal mengambil data PDRB');
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
          <p className="text-sm font-bold text-slate-500">Memuat Framework PDRB...</p>
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

  // Get active record based on selected year
  const historicalRecord = data.historical.find(h => h.year.toString() === selectedYear) || data.historical[data.historical.length - 1];
  
  // Calculate display values based on price basis
  const displayValue = priceBasis === 'adhk' 
    ? `${historicalRecord.value_adhk} Triliun` 
    : `${(historicalRecord.value_adhk * 1.34).toFixed(2)} Triliun`; // mockup ADHB ratio

  const displayGrowth = `${historicalRecord.growth_rate}%`;

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
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">PDRB</span>
        </div>

        {/* Dashboard Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Produk Domestik Regional Bruto (PDRB)</h2>
            <p className="text-xs text-slate-400 font-medium">Framework Analisis Struktur Ekonomi Kabupaten Majene</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
          </button>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: PDRB Value */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PDRB Nominal ({priceBasis.toUpperCase()})</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              {displayValue}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">Tahun {selectedYear}</span>
              <span>Rupiah (IDR)</span>
            </div>
          </div>

          {/* Card 2: Laju Pertumbuhan Ekonomi */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pertumbuhan Ekonomi</div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {displayGrowth}
              <TrendingUp className="w-5 h-5 text-blue-600 self-center" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Laju Pertumbuhan dibanding tahun sebelumnya</span>
            </div>
          </div>

          {/* Card 3: Kontributor Utama */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sektor Kontributor Utama</div>
            <div className="text-xl font-bold text-slate-800 tracking-tight mb-2 truncate">
              {data.bySector[0].sector}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 font-bold">
              <span>Kontribusi sebesar {data.bySector[0].share}%</span>
            </div>
          </div>
        </div>

        {/* Charts & Sector shares */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Growth rate charts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Tren Pertumbuhan Ekonomi Daerah (%)</h3>
            <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
              {data.historical.map((h) => {
                const heightPercentage = (h.growth_rate / 6) * 100; // normalize
                const isSelected = h.year.toString() === selectedYear;

                return (
                  <div key={h.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      +{h.growth_rate}%
                    </span>
                    <div 
                      style={{ height: `${heightPercentage}%` }} 
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected 
                          ? 'bg-slate-900 shadow-md shadow-slate-900/10' 
                          : 'bg-blue-200 group-hover:bg-blue-400'
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
              <span>Laju Pertumbuhan ADHK Nasional ~ 5.05%</span>
              <span>Sumber: BPS Majene</span>
            </div>
          </div>

          {/* Sector Share breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Distribusi PDRB Menurut Lapangan Usaha</h3>
            <div className="space-y-3.5">
              {data.bySector.map((s) => {
                const isSelected = selectedSector === 'Semua' || s.sector.includes(selectedSector);
                return (
                  <div 
                    key={s.sector} 
                    className={`space-y-1.5 transition-all duration-200 ${
                      isSelected ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="truncate max-w-[80%]">{s.sector}</span>
                      <span>{s.share}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${s.share}%` }}
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Notes */}
        <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-6">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Penjelasan Konsep PDRB</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            PDRB atas dasar harga berlaku (ADHB) menggambarkan nilai tambah barang dan jasa yang dihitung menggunakan harga pada tahun berjalan. Sedangkan PDRB atas dasar harga konstan (ADHK) dihitung menggunakan harga pada tahun dasar (saat ini menggunakan tahun dasar 2010), yang mencerminkan pertumbuhan ekonomi riil tanpa pengaruh inflasi.
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
            Pilih Tahun Analisis
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

        {/* Filter 2: Dasar Harga */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            Dasar Penilaian Harga
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPriceBasis('adhk')}
              className={`px-3 py-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                priceBasis === 'adhk'
                  ? 'bg-slate-900 text-white border-slate-950'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Konstan (ADHK)
            </button>
            <button
              onClick={() => setPriceBasis('adhb')}
              className={`px-3 py-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                priceBasis === 'adhb'
                  ? 'bg-slate-900 text-white border-slate-950'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Berlaku (ADHB)
            </button>
          </div>
        </div>

        {/* Filter 3: Sektor */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Sorot Sektor Usaha
          </label>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Lapangan Usaha</option>
            {data.bySector.map(s => (
              <option key={s.sector} value={s.sector}>{s.sector.substring(0, 30)}...</option>
            ))}
          </select>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => {
              setSelectedYear('2024');
              setPriceBasis('adhk');
              setSelectedSector('Semua');
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

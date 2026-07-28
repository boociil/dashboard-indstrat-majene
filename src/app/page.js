'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Sprout, 
  ArrowRight,
  TrendingDown,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari API');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-[#f1f3f5] space-y-6">
        {/* Skeleton Header */}
        <div className="h-20 bg-slate-200 animate-pulse rounded-2xl w-2/3"></div>
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-200 animate-pulse rounded w-1/3"></div>
                <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-xl"></div>
              </div>
              <div className="h-10 bg-slate-200 animate-pulse rounded w-1/2"></div>
              <div className="h-16 bg-slate-100 animate-pulse rounded-lg w-full"></div>
              <div className="h-10 bg-slate-200 animate-pulse rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-[#f1f3f5] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-red-800">Koneksi API Bermasalah</h2>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-slate-400">Pastikan aplikasi berjalan dan rute API /api/dashboard dapat diakses.</p>
        </div>
      </div>
    );
  }

  // Define details for rendering topic cards
  const cardsConfig = [
    {
      key: 'kemiskinan',
      path: '/kemiskinan',
      icon: Users,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      borderColor: 'border-red-100',
      badgeBg: 'bg-green-100 text-green-700',
      badgeIcon: TrendingDown,
      badgeText: '-0.26% YoY',
    },
    {
      key: 'pdrb',
      path: '/pdrb',
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      badgeBg: 'bg-blue-100 text-blue-700',
      badgeIcon: TrendingUp,
      badgeText: '+4.56% YoY',
    },
    {
      key: 'inflasi',
      path: '/inflasi',
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      badgeBg: 'bg-green-100 text-green-700',
      badgeIcon: Info,
      badgeText: 'Terkendali',
    },
    {
      key: 'pertanian',
      path: '/pertanian',
      icon: Sprout,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      badgeBg: 'bg-emerald-100 text-emerald-700',
      badgeIcon: TrendingUp,
      badgeText: '+2.98% YoY',
    },
  ];

  return (
    <div className="flex-1 p-8 bg-[#f1f3f5] space-y-8">
      {/* Landing Page Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            Kabupaten Majene
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Indikator Strategis
          </h2>
          <p className="text-slate-500 text-sm max-w-xl">
            Satu portal terpadu untuk memantau data strategis pembangunan Kabupaten Majene meliputi tingkat kemiskinan, pertumbuhan PDRB, kestabilan inflasi, dan ketahanan pangan.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Data Terakhir Diperbarui</div>
            <div className="text-xs font-bold text-slate-700">Tahun Rilis 2024 / Q4</div>
          </div>
        </div>
      </div>

      {/* Main Grid for Strategic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardsConfig.map((config) => {
          const topicData = data[config.key];
          const Icon = config.icon;
          const BadgeIcon = config.badgeIcon;

          if (!topicData) return null;

          return (
            <div 
              key={config.key} 
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
              <div>
                {/* Header card */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {topicData.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {topicData.indicatorName}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Main statistics display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    {config.key === 'pertanian' 
                      ? topicData.latestValue.toLocaleString('id-ID')
                      : topicData.latestValue
                    }
                  </span>
                  <span className="text-sm font-bold text-slate-400">{topicData.unit}</span>

                  {/* Dynamic Trend Badge */}
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg} ml-2`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {config.badgeText}
                  </span>
                </div>

                {/* Brief Interpretation */}
                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/50 mb-6 min-h-[90px]">
                  {topicData.interpretation}
                </p>
              </div>

              {/* Navigation button */}
              <div>
                <Link 
                  href={config.path}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors uppercase tracking-wider group/btn"
                >
                  Buka Detail Dashboard 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card explaining source of data and access points */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Sistem Integrasi Data API
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Halaman ini melakukan request data secara asinkron ke server internal menggunakan endpoint API JSON local di <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">/api/dashboard</code>. Data ini nantinya dapat dihubungkan ke spreadsheet Google secara langsung untuk sinkronisasi otomatis oleh administrator.
            </p>
          </div>
          <a
            href="/api/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:text-white hover:bg-slate-700 transition-all text-xs font-bold font-mono"
          >
            GET /api/dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

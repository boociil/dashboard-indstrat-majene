"use client";

import { getDataFilteredData, getAndilData } from "@/services/prismaAPI";
import FilterSelect from "@/app/components/FilterSelect";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
import { Line } from "react-chartjs-2";
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

export default function InflasiPage() {
  const [data, setData] = useState(null);
  const [andilData, setAndilData] = useState([]);
  const [loadingAndil, setLoadingAndil] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState("Inflasi YoY");
  const [selectedItem, setSelectedItem] = useState(3);
  const [selectedTahun, setSelectedTahun] = useState(() =>
    new Date().getFullYear(),
  );
  const router = useRouter();
  const [selectedBulan, setSelectedBulan] = useState(() =>
    new Date().getMonth(),
  );

  const [dataFiltered, setDataFiltered] = useState(null);
  const [dataGraph, setDataGraph] = useState([]);
  const [dataPrev, setDataPrev] = useState(null);
  const [values, setValues] = useState({
    "Inflasi MtM": null,
    "Inflasi YoY": null,
    "Inflasi YtD": null,
    IHK: null,
  });
  const [prevValues, setPrevValues] = useState({
    "Inflasi MtM": null,
    "Inflasi YoY": null,
    "Inflasi YtD": null,
    IHK: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedMonthRange, setSelectedMonthRange] = useState("Des"); // Filter up to this month
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const lineChartRef = useRef(null);

  const targetMin = 1.5;
  const targetMax = 3.5;

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
  const redirect = (dirTo) => {
    router.push(`${dirTo}`);
  };

  const convertItem = (num) => {
    const item = [
      "Kelompok Pengeluaran",
      "Sub Kelompok Pengeluaran",
      "Komoditas",
    ];
    return item[num];
  };

  const sortedGraph = [...dataGraph].sort((a, b) => {
    const yearA = Number(a.Tahun),
      yearB = Number(b.Tahun);
    const monthA = Number(a.Bulan),
      monthB = Number(b.Bulan);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });

  const convertInftoAnd = (word) => {
    const kata = word.split(" ");
    kata[0] = "Andil";
    return kata.join(" ");
  };

  const chartData = {
    // labels: sortedGraph.map((d) => `${d.Bulan}/${d.Tahun}`),

    labels: sortedGraph.map(
      (item) => `${namaBulan[item.Bulan - 1]} ${item.Tahun}`,
    ),
    datasets: [
      {
        label: selectedIndicator,
        data: sortedGraph.map((d) => {
          const raw = d[selectedIndicator];
          if (!raw) return null;

          // Hapus koma ribuan
          const cleaned = String(raw).replace(/,/g, "");
          const num = Number(cleaned);

          return isNaN(num) ? null : num;
        }),
        pointRadius: 4,
        borderColor: "#2196F3",
        backgroundColor: "#ffffff",
        tension: 0.4,
        borderWidth: 3,
      },
      // Target MIN
      ...(selectedIndicator === "Inflasi YoY"
        ? [
            {
              label: "Batas bawah pengendalian inflasi daerah",
              data: sortedGraph.map(() => targetMin),
              borderColor: "#22c55e",
              borderDash: [4, 4],
              pointRadius: 0,
              borderWidth: 3,
              fill: false,
            },
            {
              label: "Batas atas pengendalian inflasi daerah",
              data: sortedGraph.map(() => targetMax),
              borderColor: "#22c55e",
              borderDash: [4, 4],
              pointRadius: 0,
              borderWidth: 3,
              fill: false,
            },
          ]
        : []),
    ],
  };

  const content = [
    {
      title: "Inflasi M-to-M",
      kode: "Inflasi MtM",
      value: values["Inflasi MtM"],
      prevValue: prevValues["Inflasi MtM"],
    },
    {
      title: "Inflasi Y-to-D",
      kode: "Inflasi YtD",
      value: values["Inflasi YtD"],
      prevValue: prevValues["Inflasi YtD"],
    },
    {
      title: "Inflasi Y-on-Y",
      kode: "Inflasi YoY",
      value: values["Inflasi YoY"],
      prevValue: prevValues["Inflasi YoY"],
    },
    {
      title: "IHK",
      kode: "IHK",
      value: values["IHK"],
      prevValue: prevValues["IHK"],
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top", // top | bottom | left | right
        labels: {
          color: "#111",
          font: {
            size: 12,
            weight: "600",
          },
          usePointStyle: true, // 🔥
          pointStyle: "line", //
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 5,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: {
          display: true, // harus true supaya muncul
          text: "Bulan", // label sumbu X
          color: "#111",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: { font: { size: 12 } },
        grid: { color: "#e5e7eb" },
      },
      y: {
        title: {
          display: true,
          text: selectedIndicator,
          color: "#111",
          font: { size: 14, weight: "bold" },
        },
        ticks: { font: { size: 12 } },
        grid: { color: "#e5e7eb" },
        beginAtZero: false,
        suggestedMin: Math.min(
          ...sortedGraph.map((d) => Number(d[selectedIndicator]) || 0),
        ),

        suggestedMax: Math.max(
          ...sortedGraph.map((d) => Number(d[selectedIndicator]) || 0),
        ),
      },
    },
  };

  const bulanString = (number) => {
    const bulan = [
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

    return bulan[number - 1];
  };

  // Use Effect template bawaan
  useEffect(() => {
    async function fetchTopicData() {
      try {
        const response = await fetch("/api/dashboard?topic=inflasi");
        if (!response.ok) {
          throw new Error("Gagal mengambil data inflasi");
        }
        const json = await response.json();
        // console.log(json);

        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopicData();
  }, []);

  // Use Effect untuk memanggil Filttered Data
  useEffect(() => {
    async function fetchTopicData() {
      try {
        const data = await getDataFilteredData();
        console.log(data);

        setDataFiltered(data.filtered);
        setDataGraph(data.graph);
        setDataPrev(data.prev);
        setValues({
          "Inflasi MtM": data.filtered["Inflasi MtM"],
          "Inflasi YoY": data.filtered["Inflasi YoY"],
          "Inflasi YtD": data.filtered["Inflasi YtD"],
          IHK: data.filtered["IHK"],
          // Harga: result.filtered["Harga"],
        });
        setValues({
          "Inflasi MtM": data.prev["Inflasi MtM"],
          "Inflasi YoY": data.prev["Inflasi YoY"],
          "Inflasi YtD": data.prev["Inflasi YtD"],
          IHK: data.prev["IHK"],
          // Harga: result.filtered["Harga"],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopicData();
  }, []);

  // UseEffect untuk memanggil data Andil Inflasi
  useEffect(() => {
    setLoadingAndil(true);
    async function fetchAndilData() {
      try {
        const data = await getAndilData(
          selectedItem,
          selectedTahun,
          selectedBulan,
        );
        console.log("Andil Data : ", data);
        setAndilData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAndil(false);
      }
    }

    fetchAndilData();
  }, [selectedItem, selectedTahun, selectedBulan]);

  const selisihInflasi = (now, prev) => {
    const selisih = now - prev;
    const absSelisih = Math.round(Math.abs(now - prev) * 1000) / 1000;
    const isPos = selisih > 0;

    return (
      <span>
        {isPos ? (
          <>
            <span className="hidden 2xl:block text-xs font-medium text-emerald-600 px-2 py-0.5 bg-green-50 rounded-full self-center">
              <ArrowUp
                className={`w-4 inline h-4 ${isPos ? `text-emerald-500` : `text-red-500`}`}
              />{" "}
              {absSelisih}
            </span>
          </>
        ) : (
          <>
            <span className="hidden 2xl:block text-xs font-medium text-red-600 px-2 py-0.5 bg-red-50 rounded-full self-center">
              <ArrowDown
                className={`w-4 inline h-4 ${isPos ? `text-emerald-500` : `text-red-500`}`}
              />{" "}
              {absSelisih}
            </span>
          </>
        )}
      </span>
    );
  };

  if (loading || !dataFiltered || !dataGraph) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f1f3f5]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-500">
            Memuat Data Inflasi...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-[#f1f3f5]">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-lg font-bold text-red-600">Error</h2>
          <p className="text-sm text-slate-500">
            {error || "Data tidak ditemukan"}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Get matching record based on selectedMonthRange
  const activeRecord =
    data.historical.find((h) => h.month === selectedMonthRange) ||
    data.historical[data.historical.length - 1];

  return (
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
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Inflasi
          </span>
        </div>

        {/* Dashboard Title */}
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

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Inflation Rate */}
          <div
            onClick={() => redirect("/inflasi/MtM")}
            className="group bg-white overflow-hidden border border-slate-200/80 rounded-2xl p-6 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="text-xs font-bold text-slate-400 tracking-wider mb-2">
              INFLASI MtM
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {dataFiltered["Inflasi MtM"]}%
              <span className="hidden 2xl:block text-xs font-medium px-2 py-0.5 rounded-full self-center">
                {selisihInflasi(
                  dataFiltered["Inflasi MtM"],
                  dataPrev["Inflasi MtM"],
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                {bulanString(dataFiltered.Bulan)} {dataFiltered.Tahun}
              </span>
              {/* <span>Year-on-Year</span> */}
            </div>
            <div className="absolute flex items-center justify-center left-1/2 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs">
              Lihat Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => redirect("/inflasi/YtD")}
            className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="text-xs font-bold text-slate-400 tracking-wider mb-2">
              INFLASI YtD
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {dataFiltered["Inflasi YtD"]}%
              <span className="hidden 2xl:block text-xs font-medium px-2 py-0.5 rounded-full self-center">
                {selisihInflasi(
                  dataFiltered["Inflasi YtD"],
                  dataPrev["Inflasi YtD"],
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                {bulanString(dataFiltered.Bulan)} {dataFiltered.Tahun}
              </span>
              {/* <span>Year-on-Year</span> */}
            </div>
            <div className="absolute flex items-center justify-center left-1/2 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs">
              Lihat Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => redirect("/inflasi/YoY")}
            className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="text-xs font-bold text-slate-400 tracking-wider mb-2">
              INFLASI YoY
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {dataFiltered["Inflasi YoY"]} %
              <span className="hidden 2xl:block text-xs font-medium px-2 py-0.5 rounded-full self-center">
                {selisihInflasi(
                  dataFiltered["Inflasi YoY"],
                  dataPrev["Inflasi YoY"],
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                {bulanString(dataFiltered.Bulan)} {dataFiltered.Tahun}
              </span>
              {/* <span>Year-on-Year</span> */}
            </div>
            <div className="absolute flex items-center justify-center left-1/2 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs">
              Lihat Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => redirect("/inflasi/IHK")}
            className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="text-xs font-bold text-slate-400 tracking-wider mb-2">
              IHK
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2 flex items-baseline gap-2">
              {dataFiltered["IHK"]}
              <span className="hidden 2xl:block text-xs font-medium px-2 py-0.5 rounded-full self-center">
                {selisihInflasi(dataFiltered["IHK"], dataPrev["IHK"])}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                {bulanString(dataFiltered.Bulan)} {dataFiltered.Tahun}
              </span>
              {/* <span>Year-on-Year</span> */}
            </div>
            <div className="absolute flex items-center justify-center left-1/2 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs">
              Lihat Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {/* Monthly Line graph representation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="mb-6 flex justify-end">
              <FilterSelect
                filter="Indikator"
                options={content.map((c) => c.kode)}
                onChange={(v) => setSelectedIndicator(v)}
                value={selectedIndicator}
                error={errors.tipe}
              />
            </div>
            <div className="h-100 lg:h-112.5">
              <Line
                ref={lineChartRef}
                data={chartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>* Target tengah: 2.5%</span>
              <span>Sumber: TPID / BPS Majene</span>
            </div>
          </div>

          {/* Table Category Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="w-full">
              <FilterSelect
                filter="Andil"
                options={[
                  { value: "1", label: "Kelompok Pengeluaran" },
                  { value: "2", label: "Sub Kelompok Pengeluaran" },
                  { value: "3", label: "Komoditas" },
                ]}
                onChange={(v) => {
                  setSelectedItem(v); // Cukup ini, useEffect akan otomatis jalan
                  if (errors.item)
                    setErrors((prev) => ({ ...prev, item: null }));
                }}
                value={selectedItem}
                error={errors.item}
              />
              <div className="mt-6 max-h-112.5 overflow-y-auto overflow-x-auto">
                {/* <TopAndilChart data={topAndil} title={selectedIndicator} /> */}
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Inflasi Berdasarkan {convertItem(selectedItem - 1)}
            </h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="py-2.5">Kelompok Pengeluaran</th>
                    <th className="py-2.5 text-right">
                      {convertInftoAnd(selectedIndicator)} (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/60 ">
                  {!loadingAndil &&
                    andilData.map((c) => {
                      const isSelected =
                        selectedCategory === "Semua" ||
                        c.category === selectedCategory;

                      return (
                        <tr
                          key={c.category}
                          className={`transition-colors ${
                            isSelected
                              ? "text-slate-700 bg-white"
                              : "text-slate-300 opacity-40 bg-slate-50/10"
                          }`}
                        >
                          <td className="py-2.5 font-bold flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${c.rate > 2.5 ? "bg-red-400" : "bg-green-400"}`}
                            ></span>
                            {c["Nama Komoditas"]}
                          </td>
                          <td
                            className={`py-2.5 text-right font-bold ${c.rate < 0 ? "text-green-600" : "text-slate-700"}`}
                          >
                            {c[convertInftoAnd(selectedIndicator)]}
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
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Keterangan Teknis Inflasi
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inflasi Year-on-Year (YoY) mengukur tingkat kenaikan harga barang
            dan jasa di bulan berjalan dibanding bulan yang sama tahun
            sebelumnya. Tim Pengendalian Inflasi Daerah (TPID) Kabupaten Majene
            rutin melaksanakan operasi pasar di Pasar Sentral Majene untuk
            menjaga kelompok barang bergejolak (volatile foods).
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Filters Panel */}
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
            {data.historical.map((h) => (
              <option key={h.month} value={h.month}>
                Bulan {h.month}
              </option>
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
            {data.byCategory.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category.substring(0, 30)}...
              </option>
            ))}
          </select>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => {
              setSelectedMonthRange("Des");
              setSelectedCategory("Semua");
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

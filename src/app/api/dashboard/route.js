import { NextResponse } from 'next/server';

// Mock data reflecting realistic stats for Kabupaten Majene
const dashboardData = {
  kemiskinan: {
    title: 'Kemiskinan',
    indicatorName: 'Persentase Penduduk Miskin',
    latestYear: 2024,
    latestValue: 11.89, // in %
    unit: '%',
    interpretation: 'Persentase penduduk miskin di Kabupaten Majene pada tahun 2024 tercatat sebesar 11.89%, mengalami penurunan dibanding tahun 2023 yang sebesar 12.15%. Pemerintah daerah berfokus pada program bantuan sosial dan pemberdayaan ekonomi mikro untuk menekan angka ini.',
    colorTheme: 'red',
    historical: [
      { year: 2020, value: 12.43, population: 21300 },
      { year: 2021, value: 12.38, population: 21450 },
      { year: 2022, value: 12.21, population: 21200 },
      { year: 2023, value: 12.15, population: 21320 },
      { year: 2024, value: 11.89, population: 20950 }
    ],
    byDistrict: [
      { district: 'Banggae', value: 10.25, population: 4500 },
      { district: 'Banggae Timur', value: 9.80, population: 3900 },
      { district: 'Pamboang', value: 11.40, population: 2800 },
      { district: 'Sendana', value: 12.90, population: 3100 },
      { district: 'Tubo Sendana', value: 13.10, population: 1800 },
      { district: 'Tammerodo Sendana', value: 12.60, population: 1700 },
      { district: 'Ulumanda', value: 14.50, population: 1550 },
      { district: 'Malunda', value: 12.10, population: 1600 }
    ]
  },
  pdrb: {
    title: 'PDRB',
    indicatorName: 'PDRB Atas Dasar Harga Konstan (ADHK)',
    latestYear: 2024,
    latestValue: 3.24, // in Triliun Rupiah
    unit: 'Triliun Rp',
    growthRate: '4.56%',
    interpretation: 'PDRB Kabupaten Majene atas dasar harga konstan pada tahun 2024 mencapai 3,24 Triliun Rupiah dengan laju pertumbuhan sebesar 4.56%. Kontribusi terbesar masih disumbang oleh sektor pertanian, kehutanan, dan perikanan, diikuti oleh perdagangan besar.',
    colorTheme: 'blue',
    historical: [
      { year: 2020, value_adhk: 2.85, growth_rate: 1.12 },
      { year: 2021, value_adhk: 2.94, growth_rate: 3.16 },
      { year: 2022, value_adhk: 3.05, growth_rate: 3.74 },
      { year: 2023, value_adhk: 3.10, growth_rate: 1.64 },
      { year: 2024, value_adhk: 3.24, growth_rate: 4.56 }
    ],
    bySector: [
      { sector: 'Pertanian, Kehutanan & Perikanan', share: 32.4 },
      { sector: 'Perdagangan Besar & Eceran', share: 18.2 },
      { sector: 'Konstruksi', share: 11.5 },
      { sector: 'Administrasi Pemerintahan', share: 10.3 },
      { sector: 'Jasa Pendidikan', share: 8.5 },
      { sector: 'Lainnya', share: 19.1 }
    ]
  },
  inflasi: {
    title: 'Inflasi',
    indicatorName: 'Inflasi Indeks Harga Konsumen (YoY)',
    latestYear: 2024,
    latestValue: 2.35, // in %
    unit: '%',
    interpretation: 'Laju inflasi tahunan (Year-on-Year) Kabupaten Majene tercatat stabil dan terkendali pada angka 2.35% pada akhir tahun 2024. Stabilitas harga komoditas pangan pokok berkat keberhasilan program Gerakan Pangan Murah oleh TPID Majene.',
    colorTheme: 'amber',
    historical: [
      { month: 'Jan', rate: 2.10 },
      { month: 'Feb', rate: 2.25 },
      { month: 'Mar', rate: 2.50 },
      { month: 'Apr', rate: 2.75 },
      { month: 'Mei', rate: 2.60 },
      { month: 'Jun', rate: 2.45 },
      { month: 'Jul', rate: 2.30 },
      { month: 'Agu', rate: 2.20 },
      { month: 'Sep', rate: 2.15 },
      { month: 'Okt', rate: 2.25 },
      { month: 'Nov', rate: 2.30 },
      { month: 'Des', rate: 2.35 }
    ],
    byCategory: [
      { category: 'Makanan, Minuman & Tembakau', rate: 3.42 },
      { category: 'Pakaian & Alas Kaki', rate: 1.15 },
      { category: 'Perumahan, Air, Listrik & Bahan Bakar', rate: 1.80 },
      { category: 'Kesehatan', rate: 2.05 },
      { category: 'Transportasi', rate: -0.45 },
      { category: 'Pendidikan', rate: 1.90 },
      { category: 'Penyediaan Makanan & Minuman/Restoran', rate: 2.80 }
    ]
  },
  pertanian: {
    title: 'Pertanian',
    indicatorName: 'Produksi Palawija (Jagung & Ubi Kayu)',
    latestYear: 2024,
    latestValue: 45210, // in Ton
    unit: 'Ton',
    interpretation: 'Produksi tanaman palawija utama (jagung dan ubi kayu) di Kabupaten Majene menembus angka 45.210 ton pada tahun 2024. Kecamatan Sendana dan Pamboang merupakan sentra produksi utama yang mendukung program lumbung pangan lokal.',
    colorTheme: 'emerald',
    historical: [
      { year: 2020, corn_tons: 18200, cassava_tons: 22100, total: 40300 },
      { year: 2021, corn_tons: 19100, cassava_tons: 22400, total: 41500 },
      { year: 2022, corn_tons: 19800, cassava_tons: 23100, total: 42900 },
      { year: 2023, corn_tons: 20500, cassava_tons: 23400, total: 43900 },
      { year: 2024, corn_tons: 21810, cassava_tons: 23400, total: 45210 }
    ],
    byCommodity: [
      { commodity: 'Jagung', production: 21810, area_ha: 4120 },
      { commodity: 'Ubi Kayu', production: 23400, area_ha: 3850 },
      { commodity: 'Ubi Jalar', production: 3120, area_ha: 540 },
      { commodity: 'Kacang Tanah', production: 1450, area_ha: 320 }
    ]
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  // If a specific topic is requested, return only that topic's data
  if (topic && dashboardData[topic.toLowerCase()]) {
    return NextResponse.json(dashboardData[topic.toLowerCase()]);
  }

  // Otherwise, return all data
  return NextResponse.json(dashboardData);
}

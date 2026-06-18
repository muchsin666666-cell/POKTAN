<?php

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/daftar', function () {
    return view('daftar');
})->name('daftar');

Route::get('/daftar-pembeli', function () {
    return view('daftar-pembeli');
})->name('daftar-pembeli');

Route::get('/admin', function () {
    return view('admin');
})->name('admin');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::get('/lahan-saya', function () {
    return view('lahan-saya');
})->name('lahan-saya');

Route::get('/jadwal-tanam', function () {
    return view('jadwal-tanam');
})->name('jadwal-tanam');

Route::get('/cuaca', function () {
    return view('cuaca');
})->name('cuaca');

Route::get('/pupuk', function () {
    return view('pupuk');
})->name('pupuk');

Route::get('/marketplace', function () {
    return view('marketplace');
})->name('marketplace');

Route::get('/notifikasi', function () {
    return view('notifikasi');
})->name('notifikasi');

Route::get('/lumbung-padi', function () {
    return view('lumbung-padi');
})->name('lumbung-padi');

Route::get('/edukasi', function () {
    return view('edukasi');
})->name('edukasi');

Route::get('/hama-penyakit', function () {
    return view('hama-penyakit');
})->name('hama-penyakit');

Route::get('/profile', function () {
    return view('profile');
})->name('profile');

Route::get('/data-diri', function () {
    return view('data-diri');
})->name('data-diri');

Route::get('/riwayat-transaksi', function () {
    return view('riwayat-transaksi');
})->name('riwayat-transaksi');

Route::get('/pembeli', function () {
    return redirect()->route('pembeli.marketplace');
})->name('pembeli');

Route::get('/pembeli/marketplace', function () {
    return view('pembeli.marketplace');
})->name('pembeli.marketplace');

Route::get('/pembeli/notifikasi', function () {
    return view('pembeli.notifikasi');
})->name('pembeli.notifikasi');

Route::get('/pembeli/profile', function () {
    return view('pembeli.profile');
})->name('pembeli.profile');

Route::get('/pembeli/data-diri', function () {
    return view('pembeli.data-diri');
})->name('pembeli.data-diri');

Route::get('/pembeli/riwayat-belanja', function () {
    return view('pembeli.riwayat-belanja');
})->name('pembeli.riwayat-belanja');

Route::get('/api/cuaca-lokasi', function (Request $request) {
    $lat = $request->query('lat');
    $lng = $request->query('lng');

    if (! is_numeric($lat) || ! is_numeric($lng)) {
        return response()->json(['message' => 'Koordinat lokasi tidak valid.'], 422);
    }

    try {
        $data = Cache::store('file')->remember(
            'cuaca-lokasi-' . round((float) $lat, 3) . '-' . round((float) $lng, 3),
            now()->addMinutes(15),
            function () use ($lat, $lng) {
                return Http::timeout(8)
                    ->acceptJson()
                    ->get('https://weather.ewalabs.com/api/v1', [
                        'lat' => $lat,
                        'lon' => $lng,
                    ])
                    ->throw()
                    ->json();
            }
        );

        $forecast = collect(data_get($data, 'data.forecast', []))
            ->filter(fn ($item) => is_array($item))
            ->values();
        $sekarang = now();
        $cuaca = $forecast->first(function ($item) use ($sekarang) {
            $waktuLokal = data_get($item, 'local_datetime');

            if (! $waktuLokal) {
                return false;
            }

            try {
                return Carbon::parse($waktuLokal)->greaterThanOrEqualTo($sekarang);
            } catch (Throwable) {
                return false;
            }
        }) ?? $forecast->first();

        if (! $cuaca) {
            return response()->json(['message' => 'Data cuaca lokasi belum tersedia.'], 404);
        }

        $terjemahanCuaca = [
            'Clear' => 'Cerah',
            'Sunny' => 'Cerah',
            'Partly Cloudy' => 'Cerah Berawan',
            'Mostly Cloudy' => 'Cerah Berawan',
            'Cloudy' => 'Berawan',
            'Overcast' => 'Berawan Tebal',
            'Haze' => 'Berkabut',
            'Mist' => 'Berkabut',
            'Fog' => 'Berkabut',
            'Light Rain' => 'Hujan Ringan',
            'Rain' => 'Hujan',
            'Heavy Rain' => 'Hujan Lebat',
            'Thunderstorm' => 'Hujan Petir',
        ];
        $namaIkonBmkg = [
            'Cerah' => 'cerah',
            'Cerah Berawan' => 'cerah berawan',
            'Berawan' => 'berawan',
            'Berawan Tebal' => 'berawan',
            'Berkabut' => 'kabut',
            'Hujan Ringan' => 'hujan ringan',
            'Hujan' => 'hujan sedang',
            'Hujan Lebat' => 'hujan lebat',
            'Hujan Petir' => 'hujan petir',
        ];
        $hariPanjang = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        $hariPendek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $bulanPendek = [1 => 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $bulanPanjang = [1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        $terjemahkanCuaca = fn ($deskripsi) => $terjemahanCuaca[$deskripsi] ?? $deskripsi ?? 'Cuaca tidak tersedia';
        $buatIkonBmkg = function ($deskripsi, $waktuLokal = null) use ($namaIkonBmkg) {
            try {
                $jamLokal = (int) Carbon::parse($waktuLokal)->format('G');
            } catch (Throwable) {
                $jamLokal = (int) now()->format('G');
            }

            $periodeIkon = $jamLokal >= 18 || $jamLokal < 6 ? 'pm' : 'am';
            $fileIkon = ($namaIkonBmkg[$deskripsi] ?? 'cerah berawan') . "-{$periodeIkon}.svg";

            return 'https://api-apps.bmkg.go.id/storage/icon/cuaca/' . str_replace('%2F', '/', rawurlencode($fileIkon));
        };
        $formatTanggalPanjang = function ($waktuLokal) use ($hariPanjang, $bulanPanjang) {
            $tanggal = Carbon::parse($waktuLokal);

            return $hariPanjang[$tanggal->dayOfWeek] . ', ' . $tanggal->day . ' ' . $bulanPanjang[$tanggal->month] . ' ' . $tanggal->year;
        };
        $formatTanggalPendek = function ($waktuLokal) use ($hariPendek, $bulanPendek) {
            $tanggal = Carbon::parse($waktuLokal);

            return [
                'hari' => $hariPendek[$tanggal->dayOfWeek],
                'tanggal' => $tanggal->day . ' ' . $bulanPendek[$tanggal->month],
                'tanggal_lengkap' => $tanggal->toDateString(),
            ];
        };
        $hitungPeluangHujan = function ($deskripsi) {
            $teks = mb_strtolower((string) $deskripsi);

            return match (true) {
                str_contains($teks, 'petir') => 90,
                str_contains($teks, 'lebat') => 85,
                str_contains($teks, 'hujan') => 70,
                str_contains($teks, 'gerimis') => 55,
                str_contains($teks, 'berawan') => 25,
                str_contains($teks, 'cerah') => 10,
                default => null,
            };
        };

        $deskripsiIndonesia = $terjemahkanCuaca(data_get($cuaca, 'weather'));
        $urlIkon = $buatIkonBmkg($deskripsiIndonesia, data_get($cuaca, 'local_datetime'));

        $prakiraanHarian = $forecast
            ->groupBy(fn ($item) => Carbon::parse(data_get($item, 'local_datetime'))->toDateString())
            ->take(5)
            ->map(function ($items) use ($terjemahkanCuaca, $buatIkonBmkg, $formatTanggalPendek) {
                $items = $items->values();
                $waktuPertama = data_get($items->first(), 'local_datetime');
                $tanggal = $formatTanggalPendek($waktuPertama);
                $suhu = $items
                    ->pluck('temperature')
                    ->filter(fn ($nilai) => is_numeric($nilai))
                    ->map(fn ($nilai) => (float) $nilai);
                $cuacaSiang = $items
                    ->sortBy(function ($item) {
                        try {
                            return abs((int) Carbon::parse(data_get($item, 'local_datetime'))->format('G') - 13);
                        } catch (Throwable) {
                            return 99;
                        }
                    })
                    ->first() ?? $items->first();
                $deskripsi = $terjemahkanCuaca(data_get($cuacaSiang, 'weather'));

                return [
                    'hari' => $tanggal['hari'],
                    'tanggal' => $tanggal['tanggal'],
                    'tanggal_lengkap' => $tanggal['tanggal_lengkap'],
                    'suhu_maks' => $suhu->isNotEmpty() ? round($suhu->max()) : null,
                    'suhu_min' => $suhu->isNotEmpty() ? round($suhu->min()) : null,
                    'deskripsi' => $deskripsi,
                    'ikon' => $buatIkonBmkg($deskripsi, data_get($cuacaSiang, 'local_datetime')),
                ];
            })
            ->values();

        return response()->json([
            'lokasi' => [
                'nama' => data_get($data, 'data.location', 'Lokasi Anda'),
                'lat' => (float) $lat,
                'lng' => (float) $lng,
            ],
            'cuaca' => [
                'suhu' => data_get($cuaca, 'temperature'),
                'kelembaban' => data_get($cuaca, 'humidity'),
                'angin' => data_get($cuaca, 'wind_speed'),
                'arah_angin' => data_get($cuaca, 'wind_direction'),
                'deskripsi' => $deskripsiIndonesia,
                'ikon' => $urlIkon,
                'peluang_hujan' => $hitungPeluangHujan($deskripsiIndonesia),
                'tanggal' => $formatTanggalPanjang(data_get($cuaca, 'local_datetime')),
                'waktu_lokal' => data_get($cuaca, 'local_datetime'),
            ],
            'prakiraan' => $prakiraanHarian,
            'sumber' => 'BMKG',
        ]);
    } catch (Throwable) {
        return response()->json(['message' => 'Gagal mengambil data cuaca lokasi.'], 502);
    }
});

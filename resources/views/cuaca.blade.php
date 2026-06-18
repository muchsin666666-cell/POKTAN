<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuaca</title>

    @vite(['resources/css/cuaca.css', 'resources/css/navigasi-bawah.css', 'resources/js/cuaca.js', 'resources/js/maintenance.js'])
</head>

<body>
    <main class="halaman-cuaca" data-halaman-cuaca>

        <header class="kepala-halaman">
            <a href="{{ route('dashboard') }}" class="tombol-kembali" aria-label="Kembali">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
            </a>

            <h1 class="judul-halaman">Cuaca</h1>

            <span class="ruang-kanan" aria-hidden="true"></span>
        </header>

        <section class="konten-cuaca">

            <section
                class="kartu-cuaca-utama"
                style="--gambar-cuaca-utama: url('{{ asset('assets/cuaca/sawah_dan_awan.png') }}');"
                aria-label="Cuaca lokasi Anda"
            >
                <div class="lapisan-cuaca"></div>

                <img
                    src="{{ asset('assets/cuaca/hari_yang_cerah_dengan_awan_dan_matahari-bersih.png') }}"
                    alt="Ikon cuaca"
                    class="ikon-cuaca-utama"
                    data-cuaca-ikon
                    data-cuaca-ikon-default="{{ asset('assets/cuaca/hari_yang_cerah_dengan_awan_dan_matahari-bersih.png') }}"
                >

                <div class="informasi-cuaca">
                    <div class="lokasi">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                        </svg>
                        <span data-cuaca-lokasi>Lokasi Anda</span>
                    </div>

                    <div class="suhu-besar" data-cuaca-suhu>--</div>

                    <h2 data-cuaca-deskripsi>Mengambil lokasi</h2>

                    <p data-cuaca-tanggal>Izinkan akses lokasi</p>
                </div>
            </section>

            <section class="ringkasan-cuaca" aria-label="Ringkasan cuaca">
                <article class="kartu-ringkasan">
                    <img
                        src="{{ asset('assets/cuaca/tetesan_air_kristal_yang_bersinar-bersih.png') }}"
                        alt=""
                        class="ikon-ringkasan"
                    >
                    <p>Kelembaban</p>
                    <h3 data-cuaca-kelembaban>--%</h3>
                </article>

                <article class="kartu-ringkasan">
                    <img
                        src="{{ asset('assets/cuaca/simbol_angin_gaya_minimalis-bersih.png') }}"
                        alt=""
                        class="ikon-ringkasan"
                    >
                    <p>Angin</p>
                    <h3 data-cuaca-angin>-- <span>km/jam</span></h3>
                </article>

                <article class="kartu-ringkasan">
                    <img
                        src="{{ asset('assets/cuaca/ikon_awan_dan_hujan_glossy-bersih.png') }}"
                        alt=""
                        class="ikon-ringkasan"
                    >
                    <p>Peluang Hujan</p>
                    <h3 data-cuaca-peluang-hujan>--%</h3>
                </article>
            </section>

            <section class="bagian-prakiraan">
                <h2>Prakiraan Cuaca</h2>

                <div class="daftar-prakiraan" data-prakiraan-list>
                    <article class="kartu-prakiraan aktif">
                        <h3>--</h3>
                        <p class="tanggal">Memuat</p>
                        <img
                            src="{{ asset('assets/cuaca/hari_yang_cerah_dengan_awan_dan_matahari-bersih.png') }}"
                            alt=""
                            class="ikon-prakiraan"
                        >
                        <p class="suhu-maks">--&deg;C</p>
                        <p class="suhu-min">--&deg;C</p>
                        <p class="keterangan">Mengambil data Cuaca</p>
                    </article>
                </div>
            </section>

        </section>

        <x-navigasi-bawah aktif="beranda" />

    </main>
</body>
</html>

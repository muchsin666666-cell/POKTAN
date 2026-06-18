<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Riwayat Belanja Pembeli</title>

    @vite(['resources/css/riwayat-transaksi.css', 'resources/css/navigasi-bawah.css', 'resources/js/riwayat-belanja-pembeli.js', 'resources/js/maintenance.js'])
</head>

<body>
    <main class="halaman-riwayat-transaksi">
        <header class="kepala-halaman">
            <a href="{{ route('pembeli.profile') }}" class="tombol-bulat" aria-label="Kembali">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
            </a>

            <h1 class="judul-halaman">Riwayat Belanja</h1>

            <div class="ruang-kanan" aria-hidden="true"></div>
        </header>

        <section class="konten-riwayat-transaksi">
            <article class="kartu-ringkasan-riwayat">
                <span class="ikon-ringkasan-riwayat" aria-hidden="true">
                    <img src="{{ asset('assets/profile/gambar_riwayat_transaksi.png') }}" alt="">
                </span>

                <div>
                    <p>Total Belanja</p>
                    <strong data-total-belanja>0 pesanan</strong>
                    <small data-total-nilai-belanja>Total Rp0</small>
                </div>
            </article>

            <nav class="filter-riwayat" aria-label="Filter riwayat belanja">
                <button class="aktif" type="button" data-filter-belanja="semua" aria-pressed="true">Semua</button>
                <button type="button" data-filter-belanja="menunggu" aria-pressed="false">Menunggu</button>
                <button type="button" data-filter-belanja="disetujui" aria-pressed="false">Disetujui</button>
                <button type="button" data-filter-belanja="ditolak" aria-pressed="false">Ditolak</button>
            </nav>

            <section class="daftar-riwayat-transaksi" data-daftar-riwayat-belanja aria-live="polite"></section>
        </section>

        <x-navigasi-pembeli aktif="profile" />
    </main>
</body>
</html>

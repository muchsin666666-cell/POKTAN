<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumbung Padi</title>

    @vite(['resources/css/lumbung-padi.css', 'resources/css/navigasi-bawah.css', 'resources/js/lumbung-padi.js', 'resources/js/maintenance.js'])
</head>

<body>
    <main class="halaman-lumbung">
        <header class="kepala-halaman">
            <a href="{{ route('dashboard') }}" class="tombol-bulat" aria-label="Kembali">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
            </a>

            <h1 class="judul-halaman">Lumbung Padi</h1>

            <div class="aksi-kanan">
                <button
                    class="tombol-bulat"
                    type="button"
                    aria-label="Tambah Hasil Panen"
                    aria-controls="panel-tambah-panen"
                    aria-expanded="false"
                    data-buka-form-panen
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                    </svg>
                </button>
            </div>
        </header>

        <section class="konten-lumbung">
            <article class="kartu-lumbung">
                <div class="ringkasan-lumbung">
                    <div class="area-gambar-lumbung" role="img" aria-label="Petani memanen padi di sawah"></div>

                    <div class="teks-ringkasan">
                        <h2>Hasil Panen Padi</h2>
                        <p>Kelola hasil panen Padi yang tersimpan di lumbung.</p>
                    </div>
                </div>

                <div class="wadah-tabel">
                    <table class="tabel-panen">
                        <thead>
                            <tr>
                                <th scope="col">Hasil Panen</th>
                                <th scope="col">Jumlah</th>
                                <th scope="col">Jenis Bibit</th>
                                <th scope="col">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody data-tabel-panen>
                            <tr data-baris-kosong>
                                <td>
                                    <strong>Hasil Panen Padi</strong>
                                    <span>(per Kg)</span>
                                </td>
                                <td>0</td>
                                <td>Jenis Bibit Padi</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </section>

        <section
            class="panel-tambah-panen"
            id="panel-tambah-panen"
            aria-label="Tambah hasil panen"
            hidden
            data-panel-panen
        >
            <div class="pegangan-panel" aria-hidden="true"></div>

            <form class="form-panen" data-form-panen>
                <div class="kepala-panel">
                    <h2>Tambah Hasil Panen</h2>
                    <p>Tanggal akan dibuat otomatis saat data disimpan.</p>
                </div>

                <label class="grup-input" for="jumlah-panen">
                    <span>Jumlah (Kg)</span>
                    <input
                        id="jumlah-panen"
                        name="jumlah"
                        type="text"
                        inputmode="decimal"
                        placeholder="1.000,50"
                        required
                        data-input-jumlah
                    >
                </label>

                <label class="grup-input" for="jenis-bibit">
                    <span>Jenis Bibit</span>
                    <input
                        id="jenis-bibit"
                        name="jenis_bibit"
                        type="text"
                        placeholder="Contoh: Ciherang"
                        required
                        data-input-bibit
                    >
                </label>

                <div class="aksi-form">
                    <button class="tombol-batal" type="button" data-tutup-form-panen>BATAL</button>
                    <button class="tombol-simpan" type="submit">SIMPAN</button>
                </div>
            </form>
        </section>

        <x-navigasi-bawah aktif="beranda" />
    </main>
</body>
</html>

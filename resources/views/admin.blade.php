<!doctype html>
<html lang="id" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Panel - POKTAN Lancang Kuning</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    @vite(['resources/css/admin.css', 'resources/js/admin.js'])
</head>

<body class="admin-body">
    <header class="navbar sticky-top bg-white flex-md-nowrap border-bottom shadow-sm px-3">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 d-flex align-items-center gap-2 fw-black" href="{{ route('admin') }}">
            <img src="{{ asset('assets/logo-padi.png') }}" alt="Logo POKTAN" width="34" height="34">
            <span>POKTAN Admin</span>
        </a>

        <div class="d-flex align-items-center gap-2 ms-auto">
            <span class="badge rounded-pill text-bg-success">Desktop Panel</span>
            <a class="btn btn-outline-success btn-sm" href="{{ route('dashboard') }}">Buka Aplikasi</a>
            <button class="btn btn-outline-danger btn-sm" type="button" data-admin-logout data-admin-logout-url="{{ route('login') }}">Logout</button>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <aside class="sidebar col-md-3 col-lg-2 p-0 bg-white border-end">
                <div class="offcanvas-md offcanvas-start bg-white" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="sidebarMenuLabel">POKTAN Admin</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Tutup"></button>
                    </div>

                    <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                        <ul class="nav flex-column admin-nav" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-dashboard" type="button">Dashboard</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-pengguna" type="button">Pengguna</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-jadwal-tanam" type="button">Jadwal Tanam</button>
                            </li>
                           
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-pupuk" type="button">Produk Pupuk</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-pesanan" type="button">Pesanan Pupuk</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-notifikasi" type="button">Notifikasi</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-konten" type="button">Konten Aplikasi</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-pengaturan" type="button">Pengaturan</button>
                            </li>
                        </ul>

                        <hr class="my-3">

                        <div class="px-3 pb-3 small text-secondary">
                            <strong class="d-block text-dark">Admin Lancang Kuning</strong>
                            Kelola data operasional aplikasi dari satu tempat.
                        </div>
                    </div>
                </div>
            </aside>

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 admin-main">
                <div class="tab-content">
                    <section class="tab-pane fade show active" id="tab-dashboard" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Ringkasan Sistem</p>
                                <h1>Dashboard Admin</h1>
                            </div>

                            <button class="btn btn-success" type="button" data-admin-refresh>Refresh Data</button>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-sm-6 col-xl-3">
                                <article class="stat-card">
                                    <span>Petani</span>
                                    <strong data-stat-petani>0</strong>
                                    <small>Akun petani terdaftar</small>
                                </article>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <article class="stat-card">
                                    <span>Pembeli</span>
                                    <strong data-stat-pembeli>0</strong>
                                    <small>Akun pembeli terdaftar</small>
                                </article>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                             
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <article class="stat-card">
                                    <span>Pupuk</span>
                                    <strong data-stat-pupuk>0</strong>
                                    <small>Produk pupuk tambahan</small>
                                </article>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <article class="stat-card">
                                    <span>Pesanan Pupuk</span>
                                    <strong data-stat-pesanan>0</strong>
                                    <small>Pesanan pupuk dari petani</small>
                                </article>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-xl-8">
                                <article class="admin-card">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h2>Aktivitas Terbaru</h2>
                                        <span class="badge text-bg-light">Realtime lokal</span>
                                    </div>

                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Aktivitas</th>
                                                    <th>Kategori</th>
                                                    <th>Status</th>
                                                    <th>Waktu</th>
                                                </tr>
                                            </thead>
                                            <tbody data-admin-aktivitas></tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>

                            <div class="col-xl-4">
                                <article class="admin-card">
                                    <h2>Kesehatan Aplikasi</h2>
                                    <div class="list-group list-group-flush">
                                        <div class="list-group-item d-flex justify-content-between px-0">
                                            <span>Marketplace</span>
                                            <strong class="text-success" data-status-marketplace>Aktif</strong>
                                        </div>
                                        <div class="list-group-item d-flex justify-content-between px-0">
                                            <span>Notifikasi</span>
                                            <strong class="text-success">Siap</strong>
                                        </div>
                                        <div class="list-group-item d-flex justify-content-between px-0">
                                            <span>Mode Data</span>
                                            <strong class="text-secondary">LocalStorage</strong>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="tab-pane fade" id="tab-pengguna" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Manajemen Pengguna</p>
                                <h1>Pengguna</h1>
                            </div>

                            <button class="btn btn-outline-success" type="button" data-admin-seed-users>Isi Contoh Pengguna</button>
                        </div>

                        <div class="user-filter-tabs mb-3" role="group" aria-label="Pilih jenis pengguna">
                            <button class="active" type="button" data-admin-user-filter="Petani">Petani</button>
                            <button type="button" data-admin-user-filter="Pembeli">Pembeli</button>
                        </div>

                        <div class="row g-3">
                            <div class="col-xl-4">
                                <article class="admin-card">
                                    <h2 data-admin-user-form-title>Tambah Pengguna</h2>
                                    <form class="admin-form" data-admin-user-form>
                                        <input type="hidden" data-admin-user-id>
                                        <input type="hidden" value="Petani" data-admin-user-role>

                                        <label class="form-label">
                                            Nama Lengkap
                                            <input class="form-control" type="text" required data-admin-user-name>
                                        </label>

                                        <label class="form-label">
                                            No Handphone
                                            <input class="form-control" type="tel" required data-admin-user-phone>
                                        </label>

                                        <label class="form-label" data-admin-user-farmer-field>
                                            NIK Petani
                                            <input class="form-control" type="text" inputmode="numeric" minlength="16" maxlength="16" pattern="[0-9]{16}" data-admin-user-nik placeholder="16 digit NIK">
                                        </label>

                                        <label class="form-label" data-admin-user-buyer-field hidden>
                                            Nama Gudang
                                            <input class="form-control" type="text" data-admin-user-warehouse placeholder="Nama gudang pembeli">
                                        </label>

                                        <label class="form-label">
                                            Alamat
                                            <textarea class="form-control" rows="2" data-admin-user-address placeholder="Alamat petani atau pembeli"></textarea>
                                        </label>

                                        <div class="row g-2" data-admin-user-farmer-limit>
                                            <div class="col-12">
                                                <label class="form-label">
                                                    Luas Lahan
                                                    <input class="form-control" type="text" inputmode="decimal" data-admin-user-land-area placeholder="Contoh: 2500">
                                                    <small class="text-secondary">Isi luas lahan dalam meter.</small>
                                                </label>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-label mb-2">Batas Pembelian Pupuk per Produk</div>
                                                <div class="d-grid gap-2" data-admin-user-fertilizer-limits></div>
                                                <small class="text-secondary">Isi maksimal paket yang boleh dibeli untuk setiap produk. Kosongkan atau 0 jika produk tersebut belum dibatasi.</small>
                                            </div>
                                        </div>

                                        <label class="form-label">
                                            Status
                                            <select class="form-select" data-admin-user-status>
                                                <option>Aktif</option>
                                                <option>Menunggu</option>
                                                <option>Nonaktif</option>
                                            </select>
                                        </label>

                                        <label class="form-label">
                                            Password Baru
                                            <input class="form-control" type="password" minlength="6" autocomplete="new-password" data-admin-user-password placeholder="Kosongkan jika tidak diganti">
                                        </label>

                                        <label class="form-label">
                                            Konfirmasi Password
                                            <input class="form-control" type="password" minlength="6" autocomplete="new-password" data-admin-user-password-confirmation placeholder="Ulangi password baru">
                                            <small class="text-secondary">Isi hanya saat admin ingin mengubah password pengguna.</small>
                                        </label>

                                        <button class="btn btn-success w-100" type="submit">Simpan Pengguna</button>
                                        <button class="btn btn-outline-secondary w-100" type="button" data-admin-user-reset>Reset Form</button>
                                    </form>
                                </article>
                            </div>

                            <div class="col-xl-8">
                                <article class="admin-card">
                                    <h2 data-admin-user-list-title>Daftar Petani</h2>
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Nama</th>
                                                    <th>No HP</th>
                                                    <th>Data Diri</th>
                                                    <th>Lahan & Pupuk</th>
                                                    <th>Status</th>
                                                    <th>Password</th>
                                                    <th class="text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody data-admin-users></tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="tab-pane fade" id="tab-jadwal-tanam" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Perkembangan Tanam</p>
                                <h1>Jadwal Tanam Petani</h1>
                            </div>

                            <a class="btn btn-outline-success" href="{{ route('jadwal-tanam') }}">Buka Jadwal Tanam</a>
                        </div>

                        <article class="admin-card">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h2>Progress Petani</h2>
                                <span class="badge text-bg-success" data-admin-planting-count>0 petani</span>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Petani</th>
                                            <th>Luas Lahan</th>
                                            <th>Proses Aktif</th>
                                            <th>Progress</th>
                                            <th>Tanggal Semai</th>
                                            <th>Tanggal Selesai</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody data-admin-planting-progress></tbody>
                                </table>
                            </div>
                        </article>
                    </section>

                    <section class="tab-pane fade" id="tab-pupuk" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Katalog Pupuk</p>
                                <h1>Produk Pupuk</h1>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-xl-4">
                                <article class="admin-card">
                                    <h2 data-admin-fertilizer-form-title>Tambah Produk Pupuk</h2>
                                    <form class="admin-form" data-admin-fertilizer-form>
                                        <input type="hidden" data-admin-fertilizer-id>

                                        <label class="form-label">
                                            Nama Pupuk
                                            <input class="form-control" type="text" required data-admin-fertilizer-name>
                                        </label>

                                        <label class="form-label">
                                            Harga
                                            <div class="input-group">
                                                <span class="input-group-text">Rp</span>
                                                <input class="form-control" type="text" inputmode="numeric" required data-admin-fertilizer-price>
                                            </div>
                                        </label>

                                        <div class="row g-2">
                                            <div class="col-6">
                                                <label class="form-label">
                                                    Stok
                                                    <input class="form-control" type="text" inputmode="numeric" required data-admin-fertilizer-stock>
                                                </label>
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">
                                                    Kemasan
                                                    <input class="form-control" type="text" value="/ 50 kg" required data-admin-fertilizer-package>
                                                </label>
                                            </div>
                                        </div>

                                        <label class="form-label">
                                            Deskripsi
                                            <textarea class="form-control" rows="3" required data-admin-fertilizer-description></textarea>
                                        </label>

                                        <div class="form-label">
                                            Gambar Produk Pupuk
                                            <input type="hidden" data-admin-fertilizer-image>
                                            <input class="visually-hidden" type="file" accept="image/*" data-admin-fertilizer-image-file>
                                            <div class="content-image-picker">
                                                <img src="" alt="" data-admin-fertilizer-image-preview hidden>
                                                <div>
                                                    <div class="text-secondary small" data-admin-fertilizer-image-name>Belum ada gambar dipilih.</div>
                                                    <div class="btn-group btn-group-sm mt-2">
                                                        <button class="btn btn-outline-success" type="button" data-admin-fertilizer-image-button>Pilih dari Galeri</button>
                                                        <button class="btn btn-outline-secondary" type="button" data-admin-fertilizer-image-clear>Hapus</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <small class="text-secondary">Pilih gambar dari penyimpanan perangkat. Kosongkan untuk memakai gambar bawaan produk pupuk.</small>
                                        </div>

                                        <button class="btn btn-success w-100" type="submit">Simpan Produk Pupuk</button>
                                        <button class="btn btn-outline-secondary w-100" type="button" data-admin-fertilizer-reset>Reset Form</button>
                                    </form>
                                </article>
                            </div>

                            <div class="col-xl-8">
                                <article class="admin-card">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h2>Daftar Produk Pupuk</h2>
                                        <span class="badge text-bg-success" data-admin-fertilizer-count>0 produk</span>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Produk</th>
                                                    <th>Harga</th>
                                                    <th>Kemasan</th>
                                                    <th>Stok</th>
                                                    <th class="text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody data-admin-fertilizers></tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="tab-pane fade" id="tab-pesanan" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Pesanan Pupuk</p>
                                <h1>Pesanan Pupuk Petani</h1>
                            </div>
                        </div>

                        <article class="admin-card">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Petani</th>
                                            <th>Produk Pupuk</th>
                                            <th>Jumlah</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th class="text-end">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody data-admin-orders></tbody>
                                </table>
                            </div>
                        </article>
                    </section>

                    <section class="tab-pane fade" id="tab-notifikasi" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Pusat Informasi</p>
                                <h1>Notifikasi Aplikasi</h1>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-xl-4">
                                <article class="admin-card">
                                    <h2>Buat Notifikasi</h2>
                                    <form class="admin-form" data-admin-notification-form>
                                        <label class="form-label">
                                            Judul
                                            <input class="form-control" type="text" required data-admin-notification-title>
                                        </label>

                                        <label class="form-label">
                                            Kategori
                                            <select class="form-select" data-admin-notification-category>
                                                <option>Pupuk</option>
                                                <option>Edukasi</option>
                                                <option>Hama & Penyakit</option>
                                                <option>Sistem</option>
                                            </select>
                                        </label>

                                        <label class="form-label">
                                            Pesan
                                            <textarea class="form-control" rows="4" required data-admin-notification-message></textarea>
                                        </label>

                                        <button class="btn btn-success w-100" type="submit">Simpan Notifikasi</button>
                                    </form>
                                </article>
                            </div>

                            <div class="col-xl-8">
                                <article class="admin-card">
                                    <h2>Daftar Notifikasi</h2>
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Judul</th>
                                                    <th>Kategori</th>
                                                    <th>Pesan</th>
                                                    <th class="text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody data-admin-notifications></tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="tab-pane fade" id="tab-konten" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Edukasi dan Hama</p>
                                <h1>Konten Aplikasi</h1>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-xl-4">
                                <article class="admin-card">
                                    <h2 data-admin-content-form-title>Tambah Konten</h2>
                                    <form class="admin-form" data-admin-content-form>
                                        <input type="hidden" data-admin-content-id>

                                        <label class="form-label">
                                            Halaman Tujuan
                                            <select class="form-select" data-admin-content-category>
                                                <option>Edukasi</option>
                                                <option>Hama & Penyakit</option>
                                            </select>
                                        </label>

                                        <label class="form-label">
                                            Judul Konten
                                            <input class="form-control" type="text" required data-admin-content-title>
                                        </label>

                                        <label class="form-label">
                                            Jenis Konten
                                            <select class="form-select" data-admin-content-type>
                                                <option>Artikel</option>
                                                <option>Video</option>
                                                <option>Panduan</option>
                                                <option>Solusi</option>
                                            </select>
                                        </label>

                                        <label class="form-label">
                                            Deskripsi
                                            <textarea class="form-control" rows="3" required data-admin-content-description></textarea>
                                        </label>

                                        <div class="form-label">
                                            Gambar Konten
                                            <input type="hidden" data-admin-content-image>
                                            <input class="visually-hidden" type="file" accept="image/*" data-admin-content-image-file>
                                            <div class="content-image-picker">
                                                <img src="" alt="" data-admin-content-image-preview hidden>
                                                <div>
                                                    <div class="text-secondary small" data-admin-content-image-name>Belum ada gambar dipilih.</div>
                                                    <div class="btn-group btn-group-sm mt-2">
                                                        <button class="btn btn-outline-success" type="button" data-admin-content-image-button>Pilih dari Galeri</button>
                                                        <button class="btn btn-outline-secondary" type="button" data-admin-content-image-clear>Hapus</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <small class="text-secondary">Pilih gambar dari penyimpanan perangkat. Kosongkan untuk memakai gambar bawaan sesuai halaman.</small>
                                        </div>

                                        <label class="form-label">
                                            Link Tujuan Saat Diklik
                                            <input class="form-control" type="text" required data-admin-content-link placeholder="https://contoh.com/artikel atau /edukasi">
                                        </label>

                                        <button class="btn btn-success w-100" type="submit">Simpan Konten</button>
                                        <button class="btn btn-outline-secondary w-100" type="button" data-admin-content-reset>Reset Form</button>
                                    </form>
                                </article>
                            </div>

                            <div class="col-xl-8">
                                <article class="admin-card">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h2>Daftar Konten Tambahan</h2>
                                        <span class="badge text-bg-success" data-admin-content-count>0 konten</span>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Konten</th>
                                                    <th>Halaman</th>
                                                    <th>Link</th>
                                                    <th class="text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody data-admin-contents></tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="tab-pane fade" id="tab-pengaturan" tabindex="0">
                        <div class="admin-title">
                            <div>
                                <p class="text-success fw-bold mb-1">Konfigurasi</p>
                                <h1>Pengaturan Aplikasi</h1>
                            </div>
                        </div>

                        <form class="admin-form" data-admin-settings-form>
                            <div class="row g-3">
                                <div class="col-xl-4">
                                    <article class="admin-card setting-card">
                                        <h2>Pengaturan Pembeli</h2>

                                        <label class="setting-switch">
                                            <span class="setting-switch-copy">
                                                <strong>Marketplace Pembeli</strong>
                                                <small data-setting-switch-state>Aktif</small>
                                            </span>
                                            <span class="setting-switch-control">
                                                <input type="checkbox" role="switch" data-admin-setting-marketplace-switch>
                                                <span class="setting-switch-track" aria-hidden="true"></span>
                                            </span>
                                        </label>

                                        <label class="form-label">
                                            Status Marketplace Pembeli
                                            <select class="form-select" data-admin-setting-marketplace>
                                                <option>Aktif</option>
                                                <option>Perawatan</option>
                                                <option>Nonaktif</option>
                                            </select>
                                        </label>

                                        <div class="form-label">
                                            Pembayaran Marketplace Pembeli
                                            <div class="payment-method-grid" data-admin-payment-group="buyer">
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>Tunai</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="Tunai" data-admin-payment-enabled="buyer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>Transfer</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="Transfer" data-admin-payment-enabled="buyer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>QRIS</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="QRIS" data-admin-payment-enabled="buyer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                            </div>
                                            <small class="text-secondary">Switch aktif berarti metode pembayaran dapat dipilih oleh pembeli.</small>
                                        </div>
                                    </article>
                                </div>

                                <div class="col-xl-4">
                                    <article class="admin-card setting-card">
                                        <h2>Pengaturan Petani</h2>

                                        <div class="form-label">
                                            Pembayaran Pupuk Petani
                                            <div class="payment-method-grid" data-admin-payment-group="farmer">
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>Tunai</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="Tunai" data-admin-payment-enabled="farmer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>Transfer</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="Transfer" data-admin-payment-enabled="farmer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                                <label class="setting-switch">
                                                    <span class="setting-switch-copy">
                                                        <strong>QRIS</strong>
                                                        <small data-setting-switch-state>Aktif</small>
                                                    </span>
                                                    <span class="setting-switch-control">
                                                        <input type="checkbox" role="switch" value="QRIS" data-admin-payment-enabled="farmer">
                                                        <span class="setting-switch-track" aria-hidden="true"></span>
                                                    </span>
                                                </label>
                                            </div>
                                            <small class="text-secondary">Switch aktif berarti metode pembayaran dapat dipilih oleh petani.</small>
                                        </div>
                                    </article>
                                </div>

                                <div class="col-xl-4">
                                    <article class="admin-card setting-card">
                                        <h2>Maintenance Aplikasi</h2>

                                        <label class="setting-switch">
                                            <span class="setting-switch-copy">
                                                <strong>Status Maintenance</strong>
                                                <small data-setting-switch-state>Nonaktif</small>
                                            </span>
                                            <span class="setting-switch-control">
                                                <input type="checkbox" role="switch" data-admin-setting-maintenance>
                                                <span class="setting-switch-track" aria-hidden="true"></span>
                                            </span>
                                        </label>

                                        <label class="form-label">
                                            Pesan Maintenance
                                            <textarea class="form-control" rows="4" data-admin-setting-maintenance-message></textarea>
                                        </label>

                                        <small class="text-secondary">Aktifkan saat aplikasi sedang dalam perawatan agar halaman pengguna dapat menampilkan pemberitahuan maintenance.</small>
                                    </article>
                                </div>
                            </div>

                            <div class="settings-save-row">
                                <button class="btn btn-success" type="submit">Simpan Pengaturan</button>
                            </div>
                        </form>

                        <div class="row g-3 mt-1">
                            <div class="col-xl-5">
                                <article class="admin-card">
                                    <h2>Akun Admin</h2>
                                    <form class="admin-form" data-admin-password-form>
                                        <label class="form-label">
                                            Password Saat Ini
                                            <input class="form-control" type="password" autocomplete="current-password" required data-admin-current-password>
                                        </label>

                                        <label class="form-label">
                                            Password Baru
                                            <input class="form-control" type="password" autocomplete="new-password" minlength="6" required data-admin-new-password>
                                        </label>

                                        <label class="form-label">
                                            Konfirmasi Password Baru
                                            <input class="form-control" type="password" autocomplete="new-password" minlength="6" required data-admin-confirm-password>
                                        </label>

                                        <button class="btn btn-success w-100" type="submit">Ubah Password Admin</button>
                                    </form>
                                </article>
                            </div>

                            <div class="col-xl-5">
                                <article class="admin-card danger-zone">
                                    <h2>Area Data Lokal</h2>
                                    <p class="text-secondary">Gunakan tombol ini hanya saat ingin mengosongkan data uji coba dari browser saat ini.</p>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-outline-danger" type="button" data-admin-clear-fertilizers>Kosongkan Produk Pupuk</button>
                                        <button class="btn btn-outline-danger" type="button" data-admin-clear-orders>Kosongkan Pesanan Pupuk</button>
                                        <button class="btn btn-danger" type="button" data-admin-clear-all>Kosongkan Semua Data Admin</button>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div class="toast align-items-center text-bg-dark border-0" role="status" aria-live="polite" aria-atomic="true" data-admin-toast>
            <div class="d-flex">
                <div class="toast-body" data-admin-toast-body>Data tersimpan.</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>

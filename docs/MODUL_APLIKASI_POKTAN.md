# MODUL PENGGUNAAN APLIKASI POKTAN LANCANG KUNING

**Versi dokumen:** 1.0  
**Tanggal:** 18 Juni 2026  
**Platform:** Web  
**Framework:** Laravel 13, Blade, JavaScript, Vite, dan Bootstrap

---

## 1. Pendahuluan

POKTAN Lancang Kuning adalah aplikasi web untuk membantu kegiatan kelompok tani, khususnya dalam pengelolaan proses tanam padi, informasi cuaca, pembelian pupuk, pencatatan hasil panen, edukasi pertanian, dan transaksi hasil pertanian.

Aplikasi menyediakan tiga jenis pengguna:

1. **Admin**, untuk mengelola pengguna, pupuk, pesanan, notifikasi, konten, dan pengaturan aplikasi.
2. **Petani**, untuk mengelola aktivitas pertanian dan menawarkan produk kepada pembeli.
3. **Pembeli**, untuk mencari serta mengajukan pembelian produk milik petani.

### 1.1 Tujuan Aplikasi

- Memusatkan informasi kegiatan pertanian dalam satu aplikasi.
- Membantu petani mengikuti tahapan tanam padi.
- Menyediakan informasi cuaca berdasarkan lokasi perangkat.
- Memudahkan petani memesan pupuk sesuai batas yang ditetapkan admin.
- Mempertemukan petani dan pembeli melalui marketplace.
- Menyediakan edukasi mengenai pertanian, hama, dan penyakit.
- Membantu admin memantau aktivitas operasional aplikasi.

### 1.2 Sasaran Pengguna

- Pengurus kelompok tani.
- Petani anggota POKTAN Lancang Kuning.
- Pembeli gabah, beras, bibit, dan produk pertanian.
- Pengelola atau operator aplikasi.

---

## 2. Status Implementasi Aplikasi

Aplikasi saat ini merupakan **prototipe fungsional berbasis web**. Tampilan, navigasi, cuaca, jadwal tanam, marketplace, pemesanan pupuk, dan panel admin dapat digunakan.

Namun, terdapat beberapa hal yang perlu dipahami:

- Sebagian besar data operasional disimpan pada `localStorage` browser.
- Data hanya tersedia pada browser dan perangkat yang sama.
- Menghapus data browser dapat menghilangkan data aplikasi.
- Struktur tabel database sudah tersedia melalui migration dan berkas SQL, tetapi belum menjadi sumber data utama halaman aplikasi.
- Formulir pendaftaran dan data diri masih berupa tampilan dan belum mengirim data ke backend.
- Route belum dilindungi middleware autentikasi.
- Password prototipe tersimpan di browser dan belum menggunakan hashing backend.

Karena itu, versi sekarang sesuai untuk demonstrasi, pengujian antarmuka, dan pengembangan lanjutan. Aplikasi belum direkomendasikan untuk menyimpan data produksi yang sensitif.

---

## 3. Kebutuhan Sistem

### 3.1 Kebutuhan Server

- PHP 8.3 atau lebih baru.
- Composer.
- Node.js dan npm.
- MySQL/MariaDB atau SQLite.
- Web server seperti Apache/Nginx, atau Laragon untuk Windows.
- Koneksi internet untuk mengambil stylesheet Bootstrap dan data cuaca.

### 3.2 Kebutuhan Perangkat Pengguna

- Browser modern, misalnya Google Chrome, Microsoft Edge, atau Mozilla Firefox.
- JavaScript aktif.
- Izin lokasi aktif untuk fitur cuaca.
- Aplikasi dibuka melalui `localhost` atau HTTPS agar browser mengizinkan geolocation.

---

## 4. Instalasi dan Menjalankan Aplikasi

### 4.1 Menyiapkan Proyek

Buka terminal pada folder proyek, lalu jalankan:

```bash
composer install
npm install
```

Salin konfigurasi lingkungan:

```bash
copy .env.example .env
php artisan key:generate
```

Atur koneksi database pada berkas `.env`, kemudian jalankan:

```bash
php artisan migrate
npm run build
```

### 4.2 Menjalankan Aplikasi

Untuk menjalankan server Laravel:

```bash
php artisan serve
```

Untuk pengembangan aset secara langsung:

```bash
npm run dev
```

Jika menggunakan Laragon, aplikasi juga dapat dibuka melalui alamat virtual host yang dibuat oleh Laragon.

### 4.3 Alamat Halaman Utama

| Halaman | URL |
|---|---|
| Login | `/login` |
| Daftar petani | `/daftar` |
| Daftar pembeli | `/daftar-pembeli` |
| Admin | `/admin` |
| Dashboard petani | `/dashboard` |
| Marketplace pembeli | `/pembeli/marketplace` |

---

## 5. Akun Uji

### 5.1 Akun Admin Bawaan

| Data | Nilai |
|---|---|
| Username | `admin` |
| Password | `admin123` |

Password admin dapat diubah melalui menu **Admin > Pengaturan > Akun Admin**.

### 5.2 Akun Contoh Petani

| Data | Nilai |
|---|---|
| Nama/username | `Pak Muchsin` |
| Nomor HP | `081234567890` |
| NIK | `1401010101010001` |
| Password | `petani123` |

### 5.3 Akun Contoh Pembeli

| Data | Nilai |
|---|---|
| Nama/username | `Pembeli Lancang` |
| Nomor HP | `082233445566` |
| Nama gudang | `Gudang Lancang Makmur` |
| Password | `pembeli123` |

Pengguna dapat login menggunakan nama, nomor HP, NIK petani, atau nama gudang yang tersimpan oleh admin.

> **Catatan:** akun contoh petani dan pembeli dibuat ketika panel admin pertama kali dibuka. Jika akun belum dapat digunakan, login sebagai admin, buka menu **Pengguna**, lalu tekan **Isi Contoh Pengguna**.

---

## 6. Alur Umum Aplikasi

### 6.1 Alur Admin

1. Admin membuka halaman login.
2. Admin masuk menggunakan akun admin.
3. Admin mengelola data petani dan pembeli.
4. Admin mengatur produk pupuk serta batas pembelian petani.
5. Admin memantau pesanan pupuk.
6. Admin membuat notifikasi dan konten aplikasi.
7. Admin mengatur marketplace, pembayaran, dan mode maintenance.

### 6.2 Alur Petani

1. Petani login menggunakan akun yang dibuat admin.
2. Petani melihat dashboard dan informasi cuaca.
3. Petani membuka jadwal tanam dan menyelesaikan tahapan secara bertahap.
4. Petani membeli pupuk sesuai batas yang diberikan.
5. Petani mencatat hasil panen pada Lumbung Padi.
6. Petani menambahkan produk hasil pertanian ke marketplace.
7. Petani menerima dan menyetujui atau menolak permintaan pembeli.

### 6.3 Alur Pembeli

1. Pembeli login menggunakan akun yang dibuat admin.
2. Pembeli membuka marketplace.
3. Pembeli mencari dan memilih produk petani.
4. Pembeli menentukan jumlah dan metode pembayaran.
5. Pembeli mengirim permintaan pembelian.
6. Petani menerima, menyetujui, atau menolak permintaan.
7. Pembeli memantau status melalui notifikasi dan riwayat belanja.

---

## 7. Panduan Admin

### 7.1 Dashboard Admin

Dashboard menampilkan:

- Jumlah akun petani.
- Jumlah akun pembeli.
- Jumlah produk pupuk tambahan.
- Jumlah pesanan pupuk.
- Aktivitas terbaru.
- Status marketplace.
- Status notifikasi.
- Mode penyimpanan aplikasi.

Gunakan tombol **Refresh Data** untuk memperbarui ringkasan dari data browser.

### 7.2 Mengelola Pengguna

1. Buka menu **Pengguna**.
2. Pilih tab **Petani** atau **Pembeli**.
3. Isi formulir pengguna.
4. Pilih status akun.
5. Isi password dan konfirmasi password.
6. Tekan **Simpan Pengguna**.

#### Data Petani

- Nama lengkap.
- Nomor handphone.
- NIK 16 digit.
- Alamat.
- Luas lahan dalam meter.
- Batas pembelian untuk setiap produk pupuk.
- Status akun.
- Password.

#### Data Pembeli

- Nama lengkap.
- Nomor handphone.
- Nama gudang.
- Alamat.
- Status akun.
- Password.

Status pengguna terdiri dari:

- **Aktif**: pengguna dapat login.
- **Menunggu**: pengguna belum dapat login.
- **Nonaktif**: akses login ditolak.

Tombol **Isi Contoh Pengguna** dapat digunakan untuk mengembalikan akun contoh petani dan pembeli.

### 7.3 Memantau Jadwal Tanam

Menu **Jadwal Tanam** menampilkan:

- Nama petani.
- Luas lahan.
- Tahap tanam aktif.
- Persentase penyelesaian.
- Tanggal semai.
- Tanggal penyelesaian tahapan.
- Status proses.

Tahapan tanam terdiri dari:

1. Pembibitan.
2. Penanaman.
3. Perawatan tanaman.
4. Panen.

Catatan versi saat ini: progress jadwal tanam masih menggunakan satu data browser yang sama, sehingga belum benar-benar terpisah untuk setiap akun petani.

### 7.4 Mengelola Produk Pupuk

1. Buka menu **Produk Pupuk**.
2. Isi nama produk.
3. Isi harga.
4. Isi stok.
5. Isi ukuran kemasan.
6. Isi deskripsi.
7. Pilih gambar dari galeri.
8. Tekan **Simpan Produk**.

Admin dapat mengedit atau menghapus produk pada tabel daftar produk. Gambar yang dipilih dibatasi sekitar 1,5 MB agar tidak terlalu membebani penyimpanan browser.

Selain produk tambahan dari admin, aplikasi memiliki katalog bawaan:

- Urea.
- NPK 16-16-16.
- Pupuk Organik.
- KCL.

### 7.5 Mengelola Pesanan Pupuk

Menu **Pesanan Pupuk** menampilkan:

- Tanggal pesanan.
- Nama atau daftar produk.
- Metode pembayaran.
- Total pembayaran.
- Status pesanan.
- Tombol tindakan.

Riwayat pesanan berasal dari transaksi pada halaman pupuk petani.

### 7.6 Membuat Notifikasi

1. Buka menu **Notifikasi**.
2. Isi judul.
3. Pilih kategori.
4. Isi pesan.
5. Simpan notifikasi.

Kategori yang tersedia pada panel admin saat ini adalah Pupuk, Edukasi, Hama & Penyakit, dan Sistem. Struktur database juga telah menyiapkan kategori transaksi dan cuaca untuk pengembangan berikutnya.

Catatan versi saat ini: data notifikasi admin tersimpan dan tampil pada panel admin, tetapi belum seluruhnya didistribusikan secara dinamis ke halaman notifikasi setiap pengguna.

### 7.7 Mengelola Konten Aplikasi

Admin dapat menambahkan konten untuk:

- Edukasi.
- Hama & Penyakit.

Langkah penggunaan:

1. Pilih kategori.
2. Isi judul.
3. Pilih jenis konten.
4. Isi deskripsi.
5. Pilih gambar.
6. Isi tautan tujuan.
7. Simpan konten.

Konten tambahan akan muncul pada bagian awal daftar di halaman sesuai kategorinya. Tautan dapat berupa alamat internal seperti `/edukasi` atau URL eksternal seperti `https://...`.

### 7.8 Pengaturan Aplikasi

Admin dapat mengatur:

- Status marketplace pembeli: Aktif, Perawatan, atau Nonaktif.
- Metode pembayaran pembeli: Tunai, Transfer, dan QRIS.
- Metode pembayaran petani untuk pupuk: Tunai, Transfer, dan QRIS.
- Mode maintenance.
- Pesan maintenance.

Jika semua metode pembayaran dinonaktifkan, pengguna tidak dapat melanjutkan transaksi.

Jika maintenance aktif, halaman pengguna akan ditutupi pesan **Aplikasi Sedang Maintenance**. Panel admin tetap menjadi tempat untuk menonaktifkan maintenance.

### 7.9 Mengubah Password Admin

1. Buka menu **Pengaturan**.
2. Masukkan password saat ini.
3. Masukkan password baru minimal enam karakter.
4. Ulangi password baru.
5. Simpan perubahan.

### 7.10 Mengosongkan Data Lokal

Admin dapat:

- Mengosongkan produk pupuk.
- Mengosongkan pesanan pupuk.
- Mengosongkan seluruh data admin.

Tindakan ini menghapus data dari browser yang sedang digunakan dan tidak dapat dipulihkan tanpa cadangan.

---

## 8. Panduan Petani

### 8.1 Dashboard Petani

Dashboard menyediakan:

- Menu cepat ke Lahan Saya, Cuaca, Pupuk, dan Marketplace.
- Informasi cuaca lokasi.
- Badge permintaan pembelian yang masih menunggu.
- Menu Jadwal Tanam.
- Menu Edukasi.
- Menu Hama & Penyakit.
- Menu Lumbung Padi.

### 8.2 Mengaktifkan Cuaca Lokasi

1. Buka dashboard atau halaman Cuaca.
2. Tekan **Aktifkan Lokasi** jika diminta.
3. Pilih **Izinkan** pada notifikasi browser.
4. Tunggu aplikasi memuat data.

Informasi yang ditampilkan:

- Nama lokasi.
- Suhu.
- Deskripsi cuaca.
- Kelembapan.
- Kecepatan angin.
- Peluang hujan.
- Prakiraan hingga lima hari.

Backend menyimpan cache permintaan cuaca selama sekitar 15 menit untuk mengurangi permintaan berulang.

### 8.3 Lahan Saya

Halaman Lahan Saya menampilkan ringkasan luas lahan dan pemilik.

Catatan versi saat ini: data pada halaman ini masih berupa tampilan awal dan belum otomatis terhubung dengan data petani yang dikelola admin.

### 8.4 Menggunakan Jadwal Tanam

1. Buka menu **Jadwal Tanam**.
2. Tentukan tanggal semai.
3. Baca rentang waktu dan petunjuk pada setiap tahap.
4. Tandai tahap sebagai selesai jika syarat waktu terpenuhi.
5. Lanjutkan sampai tahap Panen.

Aplikasi menghitung perkiraan tanggal proses berdasarkan tanggal semai. Beberapa tahap memiliki batas minimum sebelum dapat ditandai selesai.

Gunakan tombol reset jika ingin memulai jadwal baru. Reset akan menghapus progress dan tanggal penyelesaian yang tersimpan.

### 8.5 Membeli Pupuk

1. Buka menu **Pupuk**.
2. Pilih produk lalu tekan **BELI**.
3. Produk masuk ke keranjang.
4. Buka tombol checkout.
5. Jika tersedia, pilih nama petani.
6. Periksa batas pembelian pupuk.
7. Pilih metode pembayaran.
8. Tekan **LANJUTKAN**.

Aplikasi akan menolak jumlah yang melebihi batas per produk yang telah ditentukan admin.

Riwayat pesanan dapat dibuka melalui tombol riwayat pada bagian atas halaman.

### 8.6 Menjual Produk di Marketplace

1. Buka menu **Marketplace**.
2. Tekan tombol tambah.
3. Isi nama produk.
4. Isi deskripsi.
5. Isi alamat produk.
6. Isi harga per kilogram.
7. Isi stok dan satuan stok.
8. Pilih foto produk.
9. Tekan **SIMPAN**.

Produk dapat diedit atau dihapus dari daftar marketplace petani.

### 8.7 Mengelola Permintaan Pembeli

1. Buka marketplace petani.
2. Tekan ikon notifikasi pembelian.
3. Baca nama pembeli, jumlah, metode pembayaran, dan catatan.
4. Tekan **APPROVE** untuk menyetujui.
5. Tekan **REJECT** untuk menolak.

Status tersebut akan terbaca pada notifikasi dan riwayat belanja pembeli di browser yang sama.

### 8.8 Mencatat Hasil Panen

1. Buka **Lumbung Padi**.
2. Tekan tombol tambah hasil panen.
3. Isi jumlah hasil panen.
4. Isi jenis bibit.
5. Simpan.

Data hasil panen akan ditampilkan dalam tabel beserta tanggal pencatatan.

### 8.9 Edukasi dan Hama Penyakit

Halaman **Edukasi** berisi artikel, video, dan tips pertanian.

Halaman **Hama & Penyakit** berisi informasi mengenai:

- Wereng.
- Ulat daun.
- Bercak daun.
- Busuk akar.
- Langkah pencegahan.

Konten tambahan yang dibuat admin juga dapat muncul pada kedua halaman tersebut.

### 8.10 Notifikasi

Notifikasi dapat difilter berdasarkan:

- Kategori.
- Urutan terbaru atau terlama.
- Rentang tanggal.

Permintaan pembelian marketplace akan ditambahkan secara otomatis ke daftar notifikasi transaksi.

### 8.11 Profil dan Riwayat Transaksi

Pada halaman profil, petani dapat:

- Mengubah foto profil.
- Melihat lokasi.
- Membuka Data Diri.
- Membuka Riwayat Transaksi.
- Keluar ke halaman login.

Riwayat transaksi menggabungkan:

- Transaksi marketplace.
- Pembelian pupuk.

Filter dapat digunakan untuk menampilkan semua transaksi, marketplace saja, atau pupuk saja.

---

## 9. Panduan Pembeli

### 9.1 Marketplace Pembeli

Halaman marketplace pembeli menampilkan produk yang dibuat petani.

Pembeli dapat:

- Mencari produk berdasarkan nama.
- Melihat foto, harga, stok, dan alamat.
- Menentukan jumlah pembelian.
- Melihat total pembayaran.
- Memilih metode pembayaran.
- Mengirim permintaan pembelian.

Jumlah pembelian tidak dapat melebihi stok produk.

### 9.2 Mengirim Permintaan Pembelian

1. Pilih produk.
2. Atur jumlah dalam kilogram.
3. Pilih Tunai, Transfer, atau QRIS.
4. Tekan **Kirim Permintaan**.
5. Tunggu persetujuan petani.

Permintaan awal memiliki status **Menunggu**.

### 9.3 Melihat Notifikasi

Halaman notifikasi pembeli menampilkan:

- Produk yang dipesan.
- Jumlah pembelian.
- Status Menunggu, Disetujui, atau Ditolak.
- Waktu transaksi.

Pembeli dapat mengurutkan dan memfilter notifikasi berdasarkan tanggal.

### 9.4 Profil dan Riwayat Belanja

Menu profil pembeli menyediakan:

- Penggantian foto profil.
- Data diri pembeli.
- Riwayat belanja.
- Tombol keluar.

Riwayat belanja dapat difilter berdasarkan status pesanan.

---

## 10. Penyimpanan Data

### 10.1 Data Browser yang Aktif

| Data | Kunci Penyimpanan |
|---|---|
| Sesi login | `poktan:session` |
| Pengguna admin | `poktan:admin:pengguna` |
| Akun admin | `poktan:admin:akun` |
| Pengaturan admin | `poktan:admin:pengaturan` |
| Produk marketplace | `poktan:marketplace:produk` |
| Pesanan marketplace | `poktan:marketplace:pesanan` |
| Produk pupuk | `poktan:pupuk:produk` |
| Riwayat pupuk | `poktan-riwayat-pupuk` |
| Konten tambahan | `poktan:admin:konten-aplikasi` |
| Notifikasi admin | `poktan:admin:notifikasi` |
| Progress jadwal tanam | `poktan:jadwal-tanam:proses-selesai` |
| Tanggal semai | `poktan:jadwal-tanam:tanggal-semai` |
| Hasil panen | `poktan:lumbung-padi:panen` |
| Foto profil | `poktan-profile-foto` |
| Lokasi terakhir | `poktan-dashboard-lokasi` |

### 10.2 Struktur Database yang Disiapkan

Migration aplikasi menyiapkan tabel:

- `profil_petani`
- `lahan_petani`
- `jadwal_tanam`
- `hasil_panen_padi`
- `produk_marketplace`
- `pesanan_marketplace`
- `detail_pesanan_marketplace`
- `produk_pupuk`
- `pesanan_pupuk`
- `detail_pesanan_pupuk`
- `notifikasi_aplikasi`
- `riwayat_cuaca`
- `analisis_foto_tanaman`

Tabel tersebut merupakan fondasi untuk memindahkan penyimpanan dari browser ke database pada tahap pengembangan berikutnya.

---

## 11. Skenario Pengujian

### 11.1 Pengujian Login

| Skenario | Hasil yang Diharapkan |
|---|---|
| Login admin dengan akun benar | Masuk ke `/admin` |
| Password admin salah | Pesan kesalahan tampil |
| Login petani aktif | Masuk ke `/dashboard` |
| Login pembeli aktif | Masuk ke `/pembeli/marketplace` |
| Login akun nonaktif | Akses ditolak |

### 11.2 Pengujian Marketplace

| Skenario | Hasil yang Diharapkan |
|---|---|
| Petani menambah produk | Produk tampil pada marketplace petani dan pembeli |
| Pembeli mencari produk | Daftar tersaring sesuai kata kunci |
| Pembeli membeli melebihi stok | Jumlah dibatasi sesuai stok |
| Pembeli mengirim permintaan | Pesanan tampil pada panel petani |
| Petani menyetujui pesanan | Status pembeli berubah menjadi Disetujui |

### 11.3 Pengujian Pupuk

| Skenario | Hasil yang Diharapkan |
|---|---|
| Admin menambah pupuk | Produk tampil pada halaman pupuk |
| Petani menambah pupuk ke keranjang | Badge keranjang bertambah |
| Pembelian melebihi batas | Checkout ditolak |
| Metode pembayaran dinonaktifkan | Metode tidak dapat dipilih |
| Checkout berhasil | Riwayat pupuk bertambah |

### 11.4 Pengujian Cuaca

| Skenario | Hasil yang Diharapkan |
|---|---|
| Izin lokasi diberikan | Data cuaca lokasi tampil |
| Izin lokasi ditolak | Petunjuk aktivasi lokasi tampil |
| API gagal | Pesan cuaca tidak tersedia tampil |
| Aplikasi dibuka bukan melalui HTTPS/localhost | Browser meminta penggunaan konteks aman |

### 11.5 Pengujian Maintenance

| Skenario | Hasil yang Diharapkan |
|---|---|
| Maintenance diaktifkan admin | Overlay maintenance tampil pada halaman pengguna |
| Pesan maintenance diubah | Pesan baru tampil |
| Maintenance dinonaktifkan | Halaman kembali dapat digunakan |

---

## 12. Troubleshooting

### Data tidak muncul pada perangkat lain

Penyebab: data masih disimpan di `localStorage`.

Solusi: gunakan browser dan perangkat yang sama, atau lanjutkan pengembangan agar data menggunakan database dan API backend.

### Lokasi atau cuaca tidak tampil

Periksa hal berikut:

- GPS/lokasi perangkat aktif.
- Izin lokasi browser diberikan.
- Aplikasi dibuka melalui `localhost` atau HTTPS.
- Perangkat terhubung ke internet.
- API cuaca dapat diakses.

### Login pengguna gagal

- Pastikan akun dibuat melalui panel admin.
- Pastikan status akun **Aktif**.
- Coba login menggunakan nama, nomor HP, NIK, atau nama gudang.
- Pastikan password sesuai.

### Perubahan admin tidak terlihat

- Muat ulang halaman.
- Tekan **Refresh Data** pada dashboard admin.
- Pastikan halaman dibuka pada browser yang sama.
- Pastikan data browser tidak diblokir.

### Data hilang setelah membersihkan browser

Data `localStorage` ikut terhapus saat pengguna menghapus data situs. Pada versi prototipe, data tidak dapat dipulihkan kecuali sebelumnya telah dicadangkan secara manual.

### Aplikasi selalu menampilkan maintenance

Masuk ke `/admin`, buka **Pengaturan**, lalu nonaktifkan mode maintenance dan simpan pengaturan.

### Halaman awal `/` menampilkan kesalahan route

Tampilan bawaan pada halaman `/` masih memanggil route `register` yang belum didefinisikan. Gunakan `/login` sebagai halaman masuk utama, atau ubah tautan tersebut agar mengarah ke route `daftar`.

---

## 13. Rekomendasi Pengembangan Lanjutan

Prioritas pengembangan agar aplikasi siap digunakan secara produksi:

1. Hubungkan seluruh formulir dengan controller, model, validasi, dan database Laravel.
2. Terapkan Laravel Authentication dan middleware berbasis peran.
3. Hash password menggunakan mekanisme Laravel.
4. Pisahkan data jadwal, lahan, transaksi, dan profil untuk setiap pengguna.
5. Buat API atau controller untuk marketplace dan pesanan pupuk.
6. Simpan gambar menggunakan Laravel Storage.
7. Hubungkan notifikasi admin dengan penerima tertentu.
8. Tambahkan transaksi database untuk perubahan stok.
9. Tambahkan validasi server dan proteksi akses.
10. Tambahkan feature test untuk login, transaksi, dan hak akses.
11. Perbaiki formulir pendaftaran agar benar-benar membuat akun.
12. Tambahkan proses lupa password.
13. Buat mekanisme backup dan ekspor data.

---

## 14. Penutup

POKTAN Lancang Kuning telah memiliki fondasi antarmuka yang cukup lengkap untuk mendemonstrasikan ekosistem digital kelompok tani. Aplikasi mencakup kebutuhan petani, pembeli, dan admin dalam satu alur yang saling berhubungan.

Untuk tahap berikutnya, fokus utama sebaiknya diarahkan pada pemindahan data dari `localStorage` ke database Laravel, penerapan autentikasi yang aman, dan pemisahan data berdasarkan akun. Setelah tiga bagian tersebut selesai, aplikasi dapat dikembangkan menjadi sistem yang lebih andal untuk penggunaan lapangan.

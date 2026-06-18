<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profil_petani', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->string('nama_lengkap');
            $table->string('peran')->default('Petani');
            $table->string('nomor_hp')->nullable();
            $table->string('foto_profil')->nullable();
            $table->text('alamat')->nullable();
            $table->string('desa')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kabupaten')->nullable();
            $table->string('provinsi')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('lahan_petani', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->string('nama_lahan')->default('Lahan Padi');
            $table->string('nama_pemilik')->nullable();
            $table->decimal('luas_meter', 12, 2)->default(0);
            $table->text('alamat')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('jadwal_tanam', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->foreignId('id_lahan')->nullable()->constrained('lahan_petani')->nullOnDelete();
            $table->string('judul')->default('Jadwal Tanam Padi');
            $table->string('jenis_bibit')->nullable();
            $table->date('tanggal_tanam');
            $table->date('perkiraan_tanggal_panen')->nullable();
            $table->enum('status', ['rencana', 'aktif', 'selesai', 'batal'])->default('rencana');
            $table->text('catatan')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('hasil_panen_padi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->foreignId('id_lahan')->nullable()->constrained('lahan_petani')->nullOnDelete();
            $table->string('nama_panen')->default('Hasil Panen Padi');
            $table->decimal('jumlah_kg', 12, 2)->default(0);
            $table->string('jenis_bibit')->nullable();
            $table->date('tanggal_panen');
            $table->text('catatan')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('produk_marketplace', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->string('nama_produk');
            $table->text('deskripsi')->nullable();
            $table->decimal('jumlah_stok', 12, 2)->default(0);
            $table->string('satuan')->default('kg');
            $table->decimal('harga', 14, 2)->nullable();
            $table->string('gambar_produk')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('pesanan_marketplace', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pembeli')->nullable()->index();
            $table->unsignedBigInteger('id_penjual')->nullable()->index();
            $table->string('nama_pembeli');
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'selesai'])->default('menunggu');
            $table->text('catatan')->nullable();
            $table->decimal('total_harga', 14, 2)->default(0);
            $table->timestamp('dipesan_pada')->nullable();
            $table->timestamp('dikonfirmasi_pada')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('detail_pesanan_marketplace', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pesanan_marketplace')->constrained('pesanan_marketplace')->cascadeOnDelete();
            $table->foreignId('id_produk_marketplace')->nullable()->constrained('produk_marketplace')->nullOnDelete();
            $table->string('nama_produk');
            $table->decimal('jumlah', 12, 2)->default(1);
            $table->string('satuan')->default('kg');
            $table->decimal('harga', 14, 2)->default(0);
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('produk_pupuk', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->text('deskripsi')->nullable();
            $table->string('ukuran_kemasan')->nullable();
            $table->decimal('harga', 14, 2)->default(0);
            $table->decimal('jumlah_stok', 12, 2)->nullable();
            $table->string('gambar_produk')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('pesanan_pupuk', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->enum('metode_pembayaran', ['transfer', 'qris', 'tunai'])->default('tunai');
            $table->enum('status_pembayaran', ['menunggu', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->enum('status_pesanan', ['draft', 'selesai', 'dibatalkan'])->default('draft');
            $table->decimal('total_harga', 14, 2)->default(0);
            $table->timestamp('dipesan_pada')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('detail_pesanan_pupuk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pesanan_pupuk')->constrained('pesanan_pupuk')->cascadeOnDelete();
            $table->foreignId('id_produk_pupuk')->nullable()->constrained('produk_pupuk')->nullOnDelete();
            $table->string('nama_produk');
            $table->unsignedInteger('jumlah')->default(1);
            $table->string('satuan')->nullable();
            $table->decimal('harga_satuan', 14, 2)->default(0);
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('notifikasi_aplikasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->enum('kategori', ['transaksi', 'pupuk', 'cuaca', 'edukasi', 'hama_penyakit', 'sistem'])->default('sistem');
            $table->string('judul');
            $table->text('pesan');
            $table->json('data_tambahan')->nullable();
            $table->timestamp('dibaca_pada')->nullable();
            $table->timestamp('diterbitkan_pada')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('riwayat_cuaca', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->string('nama_lokasi')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('suhu', 5, 2)->nullable();
            $table->unsignedSmallInteger('kelembaban')->nullable();
            $table->decimal('kecepatan_angin', 6, 2)->nullable();
            $table->string('deskripsi_cuaca')->nullable();
            $table->timestamp('diamati_pada')->nullable();
            $table->json('data_mentah')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });

        Schema::create('analisis_foto_tanaman', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pengguna')->nullable()->index();
            $table->string('gambar_tanaman');
            $table->string('jenis_analisis')->default('hama_penyakit');
            $table->text('ringkasan_hasil')->nullable();
            $table->text('rekomendasi')->nullable();
            $table->json('hasil_mentah')->nullable();
            $table->enum('status', ['menunggu', 'selesai', 'gagal'])->default('menunggu');
            $table->timestamp('dianalisis_pada')->nullable();
            $table->timestamp('dibuat_pada')->nullable();
            $table->timestamp('diperbarui_pada')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analisis_foto_tanaman');
        Schema::dropIfExists('riwayat_cuaca');
        Schema::dropIfExists('notifikasi_aplikasi');
        Schema::dropIfExists('detail_pesanan_pupuk');
        Schema::dropIfExists('pesanan_pupuk');
        Schema::dropIfExists('produk_pupuk');
        Schema::dropIfExists('detail_pesanan_marketplace');
        Schema::dropIfExists('pesanan_marketplace');
        Schema::dropIfExists('produk_marketplace');
        Schema::dropIfExists('hasil_panen_padi');
        Schema::dropIfExists('jadwal_tanam');
        Schema::dropIfExists('lahan_petani');
        Schema::dropIfExists('profil_petani');
    }
};

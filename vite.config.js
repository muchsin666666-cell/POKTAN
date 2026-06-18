import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/admin.css',
                'resources/css/login.css',
                'resources/css/dashboard.css',
                'resources/css/lahan-saya.css',
                'resources/css/jadwal-tanam.css',
                'resources/css/notifikasi.css',
                'resources/css/cuaca.css',
                'resources/css/pupuk.css',
                'resources/css/marketplace.css',
                'resources/css/marketplace-pembeli.css',
                'resources/css/lumbung-padi.css',
                'resources/css/edukasi.css',
                'resources/css/hama-penyakit.css',
                'resources/css/profile.css',
                'resources/css/data-diri.css',
                'resources/css/riwayat-transaksi.css',
                'resources/css/navigasi-bawah.css',
                'resources/js/admin.js',
                'resources/js/app.js',
                'resources/js/cuaca.js',
                'resources/js/dashboard-weather.js',
                'resources/js/jadwal-tanam.js',
                'resources/js/login.js',
                'resources/js/konten-aplikasi.js',
                'resources/js/notifikasi.js',
                'resources/js/lumbung-padi.js',
                'resources/js/marketplace.js',
                'resources/js/marketplace-pembeli.js',
                'resources/js/maintenance.js',
                'resources/js/pupuk.js',
                'resources/js/profile.js',
                'resources/js/riwayat-transaksi.js',
                'resources/js/riwayat-belanja-pembeli.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});

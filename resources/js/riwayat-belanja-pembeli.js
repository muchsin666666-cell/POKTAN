const daftarRiwayatBelanja = document.querySelector('[data-daftar-riwayat-belanja]');
const totalBelanja = document.querySelector('[data-total-belanja]');
const totalNilaiBelanja = document.querySelector('[data-total-nilai-belanja]');
const tombolFilterBelanja = document.querySelectorAll('[data-filter-belanja]');

const kunciPesananMarketplace = 'poktan:marketplace:pesanan';

let filterAktif = 'semua';

function bacaPesanan() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPesananMarketplace) || '[]');

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function escapeHtml(nilai) {
    return String(nilai ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatRupiah(nilai) {
    const angka = Number(nilai);

    if (!Number.isFinite(angka) || angka <= 0) {
        return '-';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka).replace(/\s/g, ' ');
}

function formatJumlah(nilai) {
    const angka = Number(nilai);

    if (!Number.isFinite(angka)) {
        return '0';
    }

    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(angka);
}

function ambilAngkaDariId(id) {
    const cocok = String(id || '').match(/(\d{10,})/);

    return cocok ? Number(cocok[1]) : 0;
}

function ambilMetodeDariCatatan(catatan) {
    const cocok = String(catatan || '').match(/Metode pembayaran\s+([^.]+)/i);

    return cocok ? cocok[1].trim() : '-';
}

function ambilTotalDariCatatan(catatan) {
    const cocok = String(catatan || '').match(/Total bayar\s+([^.]+)/i);

    return cocok ? cocok[1].trim() : '-';
}

function labelStatus(status) {
    const statusNormal = String(status || '').toLowerCase();

    if (statusNormal === 'menunggu') {
        return 'Menunggu Konfirmasi';
    }

    if (statusNormal === 'disetujui') {
        return 'Disetujui';
    }

    if (statusNormal === 'ditolak') {
        return 'Ditolak';
    }

    return 'Selesai';
}

function kelasStatus(status) {
    const statusNormal = String(status || 'selesai').toLowerCase();

    if (['menunggu', 'disetujui', 'ditolak', 'dibatalkan'].includes(statusNormal)) {
        return statusNormal;
    }

    return 'selesai';
}

function normalisasiRiwayatBelanja() {
    return bacaPesanan().map((pesanan, index) => {
        const total = Number(pesanan.totalBayar || 0);
        const jumlah = formatJumlah(pesanan.jumlah || 0);
        const satuan = pesanan.satuan || 'Kg';
        const status = pesanan.status || 'menunggu';

        return {
            id: pesanan.id || `pesanan-${index}`,
            produk: pesanan.produk || 'Produk Marketplace',
            detail: `Jumlah beli ${jumlah} ${satuan}`,
            metode: pesanan.metodePembayaran || ambilMetodeDariCatatan(pesanan.catatan),
            total,
            totalLabel: total > 0 ? formatRupiah(total) : ambilTotalDariCatatan(pesanan.catatan),
            waktu: pesanan.waktu || '-',
            status,
            urutan: ambilAngkaDariId(pesanan.id) || Date.now() - index,
        };
    }).sort((a, b) => b.urutan - a.urutan);
}

function buatKartuBelanja(pesanan) {
    const statusClass = kelasStatus(pesanan.status);

    return `
        <article class="kartu-transaksi">
            <div class="kepala-transaksi">
                <span class="label-transaksi">Marketplace</span>
                <time class="tanggal-transaksi">${escapeHtml(pesanan.waktu)}</time>
            </div>
            <div>
                <h2 class="judul-transaksi">${escapeHtml(pesanan.produk)}</h2>
                <p class="detail-transaksi">${escapeHtml(pesanan.detail)}</p>
            </div>
            <span class="status-transaksi status-${statusClass}">${labelStatus(pesanan.status)}</span>
            <div class="kaki-transaksi">
                <span class="metode-transaksi">Pembayaran: ${escapeHtml(pesanan.metode)}</span>
                <strong class="total-transaksi">${escapeHtml(pesanan.totalLabel)}</strong>
            </div>
        </article>
    `;
}

function renderRiwayatBelanja() {
    const semuaPesanan = normalisasiRiwayatBelanja();
    const pesananTampil = filterAktif === 'semua'
        ? semuaPesanan
        : semuaPesanan.filter((pesanan) => kelasStatus(pesanan.status) === filterAktif);
    const nilaiTotal = semuaPesanan.reduce((total, pesanan) => total + (Number(pesanan.total) || 0), 0);

    if (totalBelanja) {
        totalBelanja.textContent = `${semuaPesanan.length} pesanan`;
    }

    if (totalNilaiBelanja) {
        totalNilaiBelanja.textContent = `Total ${nilaiTotal > 0 ? formatRupiah(nilaiTotal) : 'Rp0'}`;
    }

    if (!daftarRiwayatBelanja) {
        return;
    }

    if (pesananTampil.length === 0) {
        daftarRiwayatBelanja.innerHTML = `
            <article class="riwayat-kosong">
                <div>
                    <h2>Belum ada riwayat belanja</h2>
                    <p>Pesanan dari halaman marketplace pembeli akan tampil di sini.</p>
                </div>
            </article>
        `;
        return;
    }

    daftarRiwayatBelanja.innerHTML = pesananTampil.map(buatKartuBelanja).join('');
}

tombolFilterBelanja.forEach((tombol) => {
    tombol.addEventListener('click', () => {
        filterAktif = tombol.dataset.filterBelanja || 'semua';

        tombolFilterBelanja.forEach((item) => {
            const aktif = item === tombol;

            item.classList.toggle('aktif', aktif);
            item.setAttribute('aria-pressed', String(aktif));
        });

        renderRiwayatBelanja();
    });
});

renderRiwayatBelanja();

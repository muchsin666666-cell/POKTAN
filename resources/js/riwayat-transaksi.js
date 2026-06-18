const daftarRiwayatTransaksi = document.querySelector('[data-daftar-riwayat-transaksi]');
const totalTransaksi = document.querySelector('[data-total-transaksi]');
const totalNilai = document.querySelector('[data-total-nilai]');
const tombolFilterRiwayat = document.querySelectorAll('[data-filter-riwayat]');

const kunciPesananMarketplace = 'poktan:marketplace:pesanan';
const kunciRiwayatPupuk = 'poktan-riwayat-pupuk';

let filterAktif = 'semua';

function bacaJson(kunci) {
    try {
        const data = JSON.parse(localStorage.getItem(kunci) || '[]');

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
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

    if (statusNormal === 'dibatalkan') {
        return 'Dibatalkan';
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

function ambilTotalDariCatatan(catatan) {
    const cocok = String(catatan || '').match(/Total bayar\s+([^.]+)/i);

    return cocok ? cocok[1].trim() : '-';
}

function normalisasiMarketplace() {
    return bacaJson(kunciPesananMarketplace).map((pesanan, index) => {
        const jumlah = formatJumlah(pesanan.jumlah || 0);
        const satuan = pesanan.satuan || 'Kg';
        const total = Number(pesanan.totalBayar || 0);
        const metode = pesanan.metodePembayaran || String(pesanan.catatan || '').match(/Metode pembayaran\s+([^.]+)/i)?.[1]?.trim() || '-';

        return {
            id: `marketplace-${pesanan.id || index}`,
            tipe: 'marketplace',
            label: 'Marketplace',
            judul: pesanan.produk || 'Produk Marketplace',
            detail: `${jumlah} ${satuan} dipesan oleh ${pesanan.namaPembeli || 'Pembeli'}`,
            metode,
            total,
            totalLabel: total > 0 ? formatRupiah(total) : ambilTotalDariCatatan(pesanan.catatan),
            waktu: pesanan.waktu || '-',
            status: pesanan.status || 'menunggu',
            urutan: ambilAngkaDariId(pesanan.id) || Date.now() - index,
        };
    });
}

function normalisasiPupuk() {
    return bacaJson(kunciRiwayatPupuk).map((pesanan, index) => {
        const items = Array.isArray(pesanan.items) ? pesanan.items : [];
        const judul = items.map((item) => item.nama).filter(Boolean).join(', ') || 'Pesanan Pupuk';
        const detail = items.map((item) => `${item.nama} x${item.jumlah}`).filter(Boolean).join(', ') || 'Riwayat pesanan pupuk';
        const total = Number(pesanan.total || 0);

        return {
            id: `pupuk-${pesanan.id || index}`,
            tipe: 'pupuk',
            label: 'Pupuk',
            judul,
            detail,
            metode: pesanan.metode || 'Tunai',
            total,
            totalLabel: formatRupiah(total),
            waktu: pesanan.tanggal || '-',
            status: 'selesai',
            urutan: ambilAngkaDariId(pesanan.id) || Date.now() - index,
        };
    });
}

function ambilRiwayatTransaksi() {
    return [...normalisasiMarketplace(), ...normalisasiPupuk()]
        .sort((a, b) => b.urutan - a.urutan);
}

function buatKartuTransaksi(transaksi) {
    const statusClass = kelasStatus(transaksi.status);

    return `
        <article class="kartu-transaksi" data-tipe-transaksi="${transaksi.tipe}">
            <div class="kepala-transaksi">
                <span class="label-transaksi">${transaksi.label}</span>
                <time class="tanggal-transaksi">${transaksi.waktu}</time>
            </div>
            <div>
                <h2 class="judul-transaksi">${transaksi.judul}</h2>
                <p class="detail-transaksi">${transaksi.detail}</p>
            </div>
            <span class="status-transaksi status-${statusClass}">${labelStatus(transaksi.status)}</span>
            <div class="kaki-transaksi">
                <span class="metode-transaksi">Pembayaran: ${transaksi.metode}</span>
                <strong class="total-transaksi">${transaksi.totalLabel}</strong>
            </div>
        </article>
    `;
}

function renderRiwayatTransaksi() {
    const semuaRiwayat = ambilRiwayatTransaksi();
    const riwayatTampil = filterAktif === 'semua'
        ? semuaRiwayat
        : semuaRiwayat.filter((transaksi) => transaksi.tipe === filterAktif);

    const nilaiTotal = semuaRiwayat.reduce((total, transaksi) => total + (Number(transaksi.total) || 0), 0);

    if (totalTransaksi) {
        totalTransaksi.textContent = `${semuaRiwayat.length} transaksi`;
    }

    if (totalNilai) {
        totalNilai.textContent = `Total ${nilaiTotal > 0 ? formatRupiah(nilaiTotal) : 'Rp0'}`;
    }

    if (!daftarRiwayatTransaksi) {
        return;
    }

    if (riwayatTampil.length === 0) {
        daftarRiwayatTransaksi.innerHTML = `
            <article class="riwayat-kosong">
                <div>
                    <h2>Belum ada riwayat</h2>
                    <p>Riwayat transaksi marketplace dan pupuk akan muncul di sini setelah ada pesanan.</p>
                </div>
            </article>
        `;
        return;
    }

    daftarRiwayatTransaksi.innerHTML = riwayatTampil.map(buatKartuTransaksi).join('');
}

tombolFilterRiwayat.forEach((tombol) => {
    tombol.addEventListener('click', () => {
        filterAktif = tombol.dataset.filterRiwayat || 'semua';

        tombolFilterRiwayat.forEach((item) => {
            const aktif = item === tombol;

            item.classList.toggle('aktif', aktif);
            item.setAttribute('aria-pressed', String(aktif));
        });

        renderRiwayatTransaksi();
    });
});

renderRiwayatTransaksi();

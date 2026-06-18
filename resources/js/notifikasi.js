const tombolFilter = document.querySelector('[data-tombol-filter]');
const panelFilter = document.querySelector('[data-panel-filter]');
const filterItems = Array.from(document.querySelectorAll('[data-filter]'));
let notifikasiItems = Array.from(document.querySelectorAll('[data-kategori]'));
const daftarNotifikasi = document.querySelector('[data-daftar-notifikasi]');
const tombolUrut = Array.from(document.querySelectorAll('[data-urut]'));
const inputTanggalMulai = document.querySelector('[data-tanggal-mulai]');
const inputTanggalAkhir = document.querySelector('[data-tanggal-akhir]');
const tombolReset = document.querySelector('[data-filter-reset]');
const tombolTerapkan = document.querySelector('[data-filter-terapkan]');
const tombolTutupFilter = document.querySelector('[data-filter-tutup]');
const kunciPesananMarketplace = 'poktan:marketplace:pesanan';
const idPesananContoh = new Set(['pesanan-andi', 'pesanan-siti']);
let urutanAktif = 'terbaru';
let kategoriAktif = 'semua';

function buatElemen(tag, className, textContent) {
    const elemen = document.createElement(tag);

    if (className) {
        elemen.className = className;
    }

    if (textContent !== undefined) {
        elemen.textContent = textContent;
    }

    return elemen;
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

function tanggalHariIni() {
    const tanggal = new Date();

    tanggal.setMinutes(tanggal.getMinutes() - tanggal.getTimezoneOffset());

    return tanggal.toISOString().slice(0, 10);
}

function labelStatusPesanan(status) {
    if (status === 'disetujui') {
        return 'Disetujui';
    }

    if (status === 'ditolak') {
        return 'Ditolak';
    }

    return 'Menunggu konfirmasi';
}

function kelasStatusPesanan(status) {
    if (status === 'disetujui') {
        return 'status-disetujui';
    }

    if (status === 'ditolak') {
        return 'status-ditolak';
    }

    return 'status-menunggu';
}

function ambilPesananMarketplace() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPesananMarketplace) || '[]');

        if (!Array.isArray(data)) {
            localStorage.setItem(kunciPesananMarketplace, JSON.stringify([]));

            return [];
        }

        const dataBersih = data.filter((item) => !idPesananContoh.has(item.id));

        if (dataBersih.length !== data.length) {
            localStorage.setItem(kunciPesananMarketplace, JSON.stringify(dataBersih));
        }

        return dataBersih;
    } catch {
        localStorage.setItem(kunciPesananMarketplace, JSON.stringify([]));

        return [];
    }
}

function buatNotifikasiKosong() {
    if (!daftarNotifikasi) {
        return null;
    }

    let kosong = daftarNotifikasi.querySelector('[data-notifikasi-kosong]');

    if (!kosong) {
        kosong = buatElemen('article', 'notifikasi-kosong');
        kosong.dataset.notifikasiKosong = 'true';
        kosong.append(
            buatElemen('h2', '', 'Belum ada notifikasi'),
            buatElemen('p', '', 'Notifikasi transaksi dan informasi aplikasi akan tampil di sini.')
        );
        daftarNotifikasi.appendChild(kosong);
    }

    return kosong;
}

function aturNotifikasiKosong(jumlahTampil) {
    const kosong = buatNotifikasiKosong();

    if (kosong) {
        kosong.hidden = jumlahTampil > 0;
    }
}

function buatNotifikasiPembelian(item, index, jenisTampilan = 'penjual') {
    const tanggal = item.tanggal || tanggalHariIni();
    const namaPembeli = item.namaPembeli || 'Pembeli';
    const namaProduk = item.produk || 'produk';
    const jumlah = formatJumlah(item.jumlah || 1);
    const satuan = item.satuan || 'item';
    const status = labelStatusPesanan(item.status);
    const statusBadge = buatElemen(
        'span',
        `status-notifikasi-pembelian ${kelasStatusPesanan(item.status)}`,
        status
    );
    const notifikasi = buatElemen('article', 'item-notifikasi');

    notifikasi.dataset.kategori = 'transaksi';
    notifikasi.dataset.urutan = String(1000 - index);
    notifikasi.dataset.tanggal = tanggal;
    notifikasi.dataset.notifikasiPembelian = 'true';

    const waktu = buatElemen('time', '', item.waktu || 'Baru saja');
    const judul = jenisTampilan === 'pembeli'
        ? `Status pembelian ${namaProduk}`
        : `Permintaan pembelian ${namaProduk}`;
    const pesan = jenisTampilan === 'pembeli'
        ? `Anda membeli ${jumlah} ${satuan} ${namaProduk}.`
        : `${namaPembeli} ingin membeli ${jumlah} ${satuan} ${namaProduk}.`;
    const label = jenisTampilan === 'pembeli' ? 'Status Pesanan' : 'Pembelian';

    waktu.dateTime = tanggal;
    notifikasi.append(
        buatElemen('span', 'label-notifikasi', label),
        buatElemen('h2', '', judul),
        buatElemen('p', '', pesan),
        statusBadge,
        waktu
    );

    return notifikasi;
}

function renderNotifikasiPembelianMarketplace() {
    const tampilkanUntukPenjual = daftarNotifikasi?.hasAttribute('data-notifikasi-pembelian-marketplace');
    const tampilkanUntukPembeli = daftarNotifikasi?.hasAttribute('data-notifikasi-pembeli-marketplace');

    if (!tampilkanUntukPenjual && !tampilkanUntukPembeli) {
        return;
    }

    const pesanan = ambilPesananMarketplace();

    const fragment = document.createDocumentFragment();

    pesanan.slice(0, 20).forEach((item, index) => {
        fragment.appendChild(buatNotifikasiPembelian(
            item,
            index,
            tampilkanUntukPembeli ? 'pembeli' : 'penjual'
        ));
    });

    daftarNotifikasi.prepend(fragment);
    notifikasiItems = Array.from(document.querySelectorAll('[data-kategori]'));
}

function terapkanFilter(nilaiFilter) {
    kategoriAktif = nilaiFilter;

    filterItems.forEach((item) => {
        item.classList.toggle('tabel-aktif', item.dataset.filter === nilaiFilter);
    });

    perbaruiDaftar();
}

function cocokDenganTanggal(item) {
    const tanggalItem = item.dataset.tanggal || '';
    const tanggalMulai = inputTanggalMulai?.value || '';
    const tanggalAkhir = inputTanggalAkhir?.value || '';

    if (!tanggalItem && (tanggalMulai || tanggalAkhir)) {
        return false;
    }

    if (tanggalMulai && tanggalItem < tanggalMulai) {
        return false;
    }

    if (tanggalAkhir && tanggalItem > tanggalAkhir) {
        return false;
    }

    return true;
}

function perbaruiDaftar() {
    let jumlahTampil = 0;

    notifikasiItems.forEach((item) => {
        const cocokKategori = kategoriAktif === 'semua' || item.dataset.kategori === kategoriAktif;
        const tampil = cocokKategori && cocokDenganTanggal(item);
        item.hidden = !tampil;

        if (tampil) {
            jumlahTampil += 1;
        }
    });

    aturNotifikasiKosong(jumlahTampil);
}

function pilihFilter(item) {
    terapkanFilter(item.dataset.filter || 'semua');
}

if (tombolFilter && panelFilter) {
    tombolFilter.addEventListener('click', () => {
        const akanDibuka = panelFilter.hidden;
        panelFilter.hidden = !akanDibuka;
        tombolFilter.setAttribute('aria-expanded', String(akanDibuka));
    });
}

function tutupPanelFilter() {
    if (!panelFilter || !tombolFilter) {
        return;
    }

    panelFilter.hidden = true;
    tombolFilter.setAttribute('aria-expanded', 'false');
}

tombolTutupFilter?.addEventListener('click', tutupPanelFilter);

function pilihUrutan(nilaiUrutan) {
    urutanAktif = nilaiUrutan;
    tombolUrut.forEach((tombol) => {
        tombol.classList.toggle('aktif', tombol.dataset.urut === nilaiUrutan);
    });
}

function urutkanNotifikasi() {
    if (!daftarNotifikasi) {
        return;
    }

    const terurut = [...notifikasiItems].sort((a, b) => {
        const nilaiA = Number(a.dataset.urutan || 0);
        const nilaiB = Number(b.dataset.urutan || 0);

        return urutanAktif === 'terbaru' ? nilaiB - nilaiA : nilaiA - nilaiB;
    });

    terurut.forEach((item) => daftarNotifikasi.appendChild(item));
}

tombolUrut.forEach((tombol) => {
    tombol.addEventListener('click', () => pilihUrutan(tombol.dataset.urut || 'terbaru'));
});

if (tombolReset) {
    tombolReset.addEventListener('click', () => {
        pilihUrutan('terbaru');

        if (inputTanggalMulai) {
            inputTanggalMulai.value = '';
        }

        if (inputTanggalAkhir) {
            inputTanggalAkhir.value = '';
        }

        terapkanFilter('semua');
        urutkanNotifikasi();
    });
}

if (tombolTerapkan && panelFilter && tombolFilter) {
    tombolTerapkan.addEventListener('click', () => {
        urutkanNotifikasi();
        perbaruiDaftar();
        tutupPanelFilter();
    });
}

renderNotifikasiPembelianMarketplace();
urutkanNotifikasi();
perbaruiDaftar();

filterItems.forEach((item) => {
    item.addEventListener('click', () => pilihFilter(item));
    item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            pilihFilter(item);
        }
    });
});

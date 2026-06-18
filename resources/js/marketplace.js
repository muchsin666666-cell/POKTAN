const daftarProduk = document.querySelector('[data-daftar-produk]');
const tombolBukaPesanan = document.querySelector('[data-buka-notifikasi-pesanan]');
const tombolTutupPesanan = document.querySelector('[data-tutup-notifikasi-pesanan]');
const panelPesanan = document.querySelector('[data-panel-notifikasi-pesanan]');
const daftarPesanan = document.querySelector('[data-daftar-pesanan]');
const jumlahPesanan = document.querySelector('[data-jumlah-pesanan]');
const tombolBukaPanel = document.querySelector('[data-buka-panel-produk]');
const tombolTutupPanel = document.querySelector('[data-tutup-panel-produk]');
const panelProduk = document.querySelector('[data-panel-produk]');
const formProduk = document.querySelector('[data-form-produk]');
const judulPanelProduk = document.querySelector('[data-judul-panel-produk]');
const inputIdProduk = document.querySelector('[data-input-id-produk]');
const inputNamaProduk = document.querySelector('[data-input-nama-produk]');
const inputDeskripsiProduk = document.querySelector('[data-input-deskripsi-produk]');
const inputAlamatProduk = document.querySelector('[data-input-alamat-produk]');
const inputHargaProduk = document.querySelector('[data-input-harga-produk]');
const inputStokProduk = document.querySelector('[data-input-stok-produk]');
const inputSatuanProduk = document.querySelector('[data-input-satuan-produk]');
const inputGambarProduk = document.querySelector('[data-input-gambar-produk]');
const kunciProduk = 'poktan:marketplace:produk';
const kunciPesanan = 'poktan:marketplace:pesanan';
const kunciPengaturanAdmin = 'poktan:admin:pengaturan';
const gambarDefault = daftarProduk?.dataset.gambarDefault || '';
const idProdukContoh = new Set(['produk-default-karung-padi']);
const idPesananContoh = new Set(['pesanan-andi', 'pesanan-siti']);
let gambarProdukAktif = gambarDefault;

function ambilPengaturanAdmin() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPengaturanAdmin) || '{}');

        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
}

function pembayaranPetaniAktif() {
    return (ambilPengaturanAdmin().farmerPayment || 'Aktif') === 'Aktif';
}

function pesanPembayaranPetaniNonaktif() {
    return 'Pembayaran marketplace petani sedang dinonaktifkan admin.';
}

function ambilProduk() {
    try {
        const tersimpan = localStorage.getItem(kunciProduk);

        if (!tersimpan) {
            return [];
        }

        const data = JSON.parse(tersimpan);

        if (!Array.isArray(data)) {
            simpanProduk([]);

            return [];
        }

        const dataBersih = data.filter((item) => !idProdukContoh.has(item.id));

        if (dataBersih.length !== data.length) {
            simpanProduk(dataBersih);
        }

        return dataBersih;
    } catch {
        simpanProduk([]);

        return [];
    }
}

function ambilPesanan() {
    try {
        const tersimpan = localStorage.getItem(kunciPesanan);

        if (!tersimpan) {
            return [];
        }

        const data = JSON.parse(tersimpan);

        if (!Array.isArray(data)) {
            simpanPesanan([]);

            return [];
        }

        const dataBersih = data.filter((item) => !idPesananContoh.has(item.id));

        if (dataBersih.length !== data.length) {
            simpanPesanan(dataBersih);
        }

        return dataBersih;
    } catch {
        simpanPesanan([]);

        return [];
    }
}

function simpanProduk(dataProduk) {
    localStorage.setItem(kunciProduk, JSON.stringify(dataProduk));
}

function simpanPesanan(dataPesanan) {
    localStorage.setItem(kunciPesanan, JSON.stringify(dataPesanan));
}

function buatIdProduk() {
    return `produk-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseJumlah(nilai) {
    const teks = String(nilai).trim().replace(/\s/g, '');

    if (!teks) {
        return 0;
    }

    if (teks.includes(',')) {
        return Number.parseFloat(teks.replace(/\./g, '').replace(',', '.'));
    }

    if (/^\d{1,3}(\.\d{3})+$/.test(teks)) {
        return Number.parseFloat(teks.replace(/\./g, ''));
    }

    return Number.parseFloat(teks);
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

function formatRupiah(nilai) {
    const angka = Number(nilai);

    if (!Number.isFinite(angka) || angka <= 0) {
        return 'Harga nego';
    }

    const rupiah = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka);

    return `${rupiah} /Kg`;
}

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

function labelStatus(status) {
    if (status === 'disetujui') {
        return 'Disetujui';
    }

    if (status === 'ditolak') {
        return 'Ditolak';
    }

    return 'Menunggu';
}

function bacaGambar(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(gambarProdukAktif || gambarDefault);
            return;
        }

        const pembaca = new FileReader();
        pembaca.addEventListener('load', () => resolve(String(pembaca.result || gambarDefault)));
        pembaca.addEventListener('error', () => reject(new Error('Gagal membaca foto produk.')));
        pembaca.readAsDataURL(file);
    });
}

function renderKosong() {
    if (!daftarProduk) {
        return;
    }

    const kosong = buatElemen('article', 'produk-kosong');
    const isi = document.createElement('div');

    isi.append(
        buatElemen('h2', '', 'Belum Ada Produk'),
        buatElemen('p', '', 'Tekan tombol tambah di pojok kanan atas untuk menambahkan produk marketplace.')
    );
    kosong.appendChild(isi);
    daftarProduk.appendChild(kosong);
}

function buatKartuProduk(item) {
    const pembungkus = buatElemen('article', 'item-produk');
    const kartu = buatElemen('div', 'kartu-produk');
    const areaGambar = buatElemen('div', 'area-gambar-produk');
    const lingkaran = buatElemen('div', 'lingkaran-gambar');
    const gambar = buatElemen('img', 'gambar-produk');
    const isi = buatElemen('div', 'isi-produk');
    const info = buatElemen('div', 'info-produk');
    const aksiProduk = buatElemen('div', 'aksi-produk');
    const tombolEdit = buatElemen('button', 'tombol-edit', 'EDIT');
    const tombolHapus = buatElemen('button', 'tombol-hapus', 'HAPUS');

    gambar.src = item.gambar || gambarDefault;
    gambar.alt = item.nama;
    tombolEdit.type = 'button';
    tombolHapus.type = 'button';
    tombolEdit.addEventListener('click', () => bukaPanel(item));
    tombolHapus.addEventListener('click', () => hapusProduk(item.id));

    areaGambar.append(lingkaran, gambar);
    info.append(
        buatElemen('strong', '', formatRupiah(item.harga)),
        buatElemen('span', '', `Stok ${formatJumlah(item.jumlah)} ${item.satuan || 'item'}`)
    );
    isi.append(
        buatElemen('h2', '', item.nama),
        buatElemen('p', '', item.deskripsi),
        buatElemen('span', 'alamat-produk', item.alamat || 'Alamat belum ditambahkan'),
        buatElemen('div', 'garis-pemisah'),
        info
    );
    kartu.append(areaGambar, isi);
    aksiProduk.append(tombolEdit, tombolHapus);
    pembungkus.append(kartu, aksiProduk);

    return pembungkus;
}

function renderProduk() {
    if (!daftarProduk) {
        return;
    }

    const dataProduk = ambilProduk();
    daftarProduk.innerHTML = '';

    if (dataProduk.length === 0) {
        renderKosong();
        return;
    }

    dataProduk.forEach((item) => daftarProduk.appendChild(buatKartuProduk(item)));
}

function perbaruiBadgePesanan() {
    if (!jumlahPesanan) {
        return;
    }

    const totalMenunggu = ambilPesanan().filter((item) => item.status === 'menunggu').length;

    jumlahPesanan.textContent = String(totalMenunggu);
    jumlahPesanan.hidden = totalMenunggu === 0;
}

function renderPesananKosong() {
    if (!daftarPesanan) {
        return;
    }

    const kosong = buatElemen('article', 'pesanan-kosong');
    const isi = document.createElement('div');

    isi.append(
        buatElemen('h3', '', 'Belum Ada Permintaan'),
        buatElemen('p', '', 'Permintaan pembelian dari pembeli akan tampil di sini.')
    );
    kosong.appendChild(isi);
    daftarPesanan.appendChild(kosong);
}

function buatKartuPesanan(item) {
    const kartu = buatElemen('article', 'item-pesanan');
    const kepala = buatElemen('div', 'kepala-item-pesanan');
    const detail = buatElemen('div', 'detail-pesanan');
    const status = buatElemen('span', `status-pesanan ${item.status}`, labelStatus(item.status));

    kepala.append(
        buatElemen('h3', '', item.namaPembeli),
        buatElemen('time', '', item.waktu)
    );
    detail.append(
        buatElemen('p', '', `Ingin membeli ${formatJumlah(item.jumlah)} ${item.satuan} ${item.produk}.`),
        buatElemen('p', '', item.catatan)
    );
    kartu.append(kepala, detail, status);

    if (item.status === 'menunggu' && pembayaranPetaniAktif()) {
        const aksi = buatElemen('div', 'aksi-pesanan');
        const tombolApprove = buatElemen('button', 'tombol-approve', 'APPROVE');
        const tombolReject = buatElemen('button', 'tombol-reject', 'REJECT');

        tombolApprove.type = 'button';
        tombolReject.type = 'button';
        tombolApprove.addEventListener('click', () => ubahStatusPesanan(item.id, 'disetujui'));
        tombolReject.addEventListener('click', () => ubahStatusPesanan(item.id, 'ditolak'));
        aksi.append(tombolApprove, tombolReject);
        kartu.appendChild(aksi);
    } else if (item.status === 'menunggu') {
        kartu.appendChild(buatElemen('p', 'pesan-pembayaran-nonaktif', pesanPembayaranPetaniNonaktif()));
    }

    return kartu;
}

function renderPesanan() {
    if (!daftarPesanan) {
        return;
    }

    const dataPesanan = ambilPesanan();
    daftarPesanan.innerHTML = '';

    if (dataPesanan.length === 0) {
        renderPesananKosong();
    } else {
        dataPesanan.forEach((item) => daftarPesanan.appendChild(buatKartuPesanan(item)));
    }

    perbaruiBadgePesanan();
}

function bukaPanel(item = null) {
    if (!panelProduk || !formProduk || !tombolBukaPanel) {
        return;
    }

    tutupPanelPesanan();
    formProduk.reset();
    gambarProdukAktif = item?.gambar || gambarDefault;
    inputIdProduk.value = item?.id || '';
    inputNamaProduk.value = item?.nama || '';
    inputDeskripsiProduk.value = item?.deskripsi || '';
    inputAlamatProduk.value = item?.alamat || '';
    inputHargaProduk.value = item?.harga ? formatJumlah(item.harga) : '';
    inputStokProduk.value = item ? formatJumlah(item.jumlah) : '';
    inputSatuanProduk.value = item?.satuan || '';

    if (judulPanelProduk) {
        judulPanelProduk.textContent = item ? 'Edit Produk' : 'Tambah Produk';
    }

    panelProduk.hidden = false;
    tombolBukaPanel.setAttribute('aria-expanded', 'true');
    inputNamaProduk?.focus();
}

function bukaPanelPesanan() {
    if (!panelPesanan || !tombolBukaPesanan) {
        return;
    }

    tutupPanel();
    renderPesanan();
    panelPesanan.hidden = false;
    tombolBukaPesanan.setAttribute('aria-expanded', 'true');
}

function tutupPanel() {
    if (!panelProduk || !tombolBukaPanel) {
        return;
    }

    panelProduk.hidden = true;
    tombolBukaPanel.setAttribute('aria-expanded', 'false');
}

function tutupPanelPesanan() {
    if (!panelPesanan || !tombolBukaPesanan) {
        return;
    }

    panelPesanan.hidden = true;
    tombolBukaPesanan.setAttribute('aria-expanded', 'false');
}

function hapusProduk(idProduk) {
    const dataProduk = ambilProduk().filter((item) => item.id !== idProduk);

    simpanProduk(dataProduk);
    renderProduk();
}

function ubahStatusPesanan(idPesanan, statusBaru) {
    if (!pembayaranPetaniAktif()) {
        renderPesanan();
        return;
    }

    const dataPesanan = ambilPesanan().map((item) => {
        if (item.id !== idPesanan) {
            return item;
        }

        return {
            ...item,
            status: statusBaru,
        };
    });

    simpanPesanan(dataPesanan);
    renderPesanan();
}

formProduk?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!formProduk.reportValidity()) {
        return;
    }

    const harga = parseJumlah(inputHargaProduk?.value || '0');
    const stok = parseJumlah(inputStokProduk?.value || '0');

    if (!Number.isFinite(harga) || harga < 0) {
        inputHargaProduk?.setCustomValidity('Masukkan harga produk yang valid.');
        inputHargaProduk?.reportValidity();
        return;
    }

    if (!Number.isFinite(stok) || stok < 0) {
        inputStokProduk?.setCustomValidity('Masukkan stok produk yang valid.');
        inputStokProduk?.reportValidity();
        return;
    }

    inputHargaProduk?.setCustomValidity('');
    inputStokProduk?.setCustomValidity('');

    const gambar = await bacaGambar(inputGambarProduk?.files?.[0]);
    const dataProduk = ambilProduk();
    const idProduk = inputIdProduk?.value || buatIdProduk();
    const produkBaru = {
        id: idProduk,
        nama: inputNamaProduk?.value.trim() || 'Produk Baru',
        deskripsi: inputDeskripsiProduk?.value.trim() || '-',
        alamat: inputAlamatProduk?.value.trim() || 'Alamat belum ditambahkan',
        harga,
        jumlah: stok,
        satuan: inputSatuanProduk?.value.trim() || 'item',
        gambar,
    };
    const indexProduk = dataProduk.findIndex((item) => item.id === idProduk);

    if (indexProduk >= 0) {
        dataProduk[indexProduk] = produkBaru;
    } else {
        dataProduk.unshift(produkBaru);
    }

    simpanProduk(dataProduk);
    renderProduk();
    tutupPanel();
});

inputHargaProduk?.addEventListener('input', () => {
    inputHargaProduk.setCustomValidity('');
});

inputStokProduk?.addEventListener('input', () => {
    inputStokProduk.setCustomValidity('');
});

tombolBukaPanel?.addEventListener('click', () => bukaPanel());
tombolTutupPanel?.addEventListener('click', tutupPanel);
tombolBukaPesanan?.addEventListener('click', bukaPanelPesanan);
tombolTutupPesanan?.addEventListener('click', tutupPanelPesanan);

renderProduk();
renderPesanan();

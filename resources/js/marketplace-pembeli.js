const daftarProdukPembeli = document.querySelector('[data-daftar-produk-pembeli]');
const inputCariProduk = document.querySelector('[data-cari-produk]');
const totalProduk = document.querySelector('[data-total-produk]');
const toastPembeli = document.querySelector('[data-toast-pembeli]');
const panelJumlahBeli = document.querySelector('[data-panel-jumlah-beli]');
const tombolTutupPanelBeli = document.querySelector('[data-tutup-panel-beli]');
const namaProdukPanel = document.querySelector('[data-panel-nama-produk]');
const petaniProdukPanel = document.querySelector('[data-panel-petani]');
const gambarProdukPanel = document.querySelector('[data-panel-gambar-produk]');
const hargaProdukPanel = document.querySelector('[data-panel-harga-produk]');
const stokProdukPanel = document.querySelector('[data-panel-stok-produk]');
const alamatProdukPanel = document.querySelector('[data-panel-alamat-produk]');
const tombolPanelKurang = document.querySelector('[data-panel-kurang]');
const tombolPanelTambah = document.querySelector('[data-panel-tambah]');
const angkaJumlahPanel = document.querySelector('[data-panel-jumlah]');
const totalBayarPanel = document.querySelector('[data-panel-total-bayar]');
const tombolKonfirmasiBeli = document.querySelector('[data-konfirmasi-beli]');
const formPembayaranPembeli = document.querySelector('[data-form-pembayaran-pembeli]');
const statusPembayaranPembeli = document.querySelector('[data-status-pembayaran-pembeli]');
const opsiPembayaranPembeli = document.querySelectorAll('.opsi-pembayaran-pembeli');
const kunciProdukPetani = 'poktan:marketplace:produk';
const kunciPesananPetani = 'poktan:marketplace:pesanan';
const kunciPengaturanAdmin = 'poktan:admin:pengaturan';
const idProdukContoh = new Set(['produk-default-karung-padi']);
const metodePembayaran = ['Tunai', 'Transfer', 'QRIS'];
const jumlahBeliProduk = {};
let produkAktif = null;

function ambilPengaturanAdmin() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPengaturanAdmin) || '{}');

        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
}

function statusMarketplacePembeli() {
    const status = ambilPengaturanAdmin().marketplace;

    return ['Aktif', 'Perawatan', 'Nonaktif'].includes(status) ? status : 'Aktif';
}

function marketplacePembeliAktif() {
    return statusMarketplacePembeli() === 'Aktif';
}

function pesanMarketplacePembeliTidakAktif() {
    const status = statusMarketplacePembeli();

    if (status === 'Perawatan') {
        return 'Marketplace pembeli sedang dalam perawatan. Silakan coba lagi nanti.';
    }

    if (status === 'Nonaktif') {
        return 'Marketplace pembeli sedang dinonaktifkan admin.';
    }

    return '';
}

function pembayaranPembeliAktif() {
    return metodePembayaran.some((metode) => metodePembayaranPembeliAktif(metode));
}

function metodePembayaranPembeliNonaktif() {
    const pengaturan = ambilPengaturanAdmin();

    if (Array.isArray(pengaturan.buyerPaymentDisabledMethods)) {
        return pengaturan.buyerPaymentDisabledMethods.filter((metode) => metodePembayaran.includes(metode));
    }

    return pengaturan.buyerPayment === 'Nonaktif' ? [...metodePembayaran] : [];
}

function metodePembayaranPembeliAktif(metode) {
    return !metodePembayaranPembeliNonaktif().includes(metode);
}

function metodePembayaranPembeliPertamaAktif() {
    return metodePembayaran.find((metode) => metodePembayaranPembeliAktif(metode)) || '';
}

function pesanPembayaranPembeliNonaktif() {
    return 'Semua metode pembayaran marketplace pembeli sedang dinonaktifkan admin.';
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

function formatTotalBayar(nilai) {
    const angka = Number(nilai);

    if (!Number.isFinite(angka) || angka <= 0) {
        return 'Harga nego';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka);
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

function hitungMaksimalBeli(produk) {
    const stok = Math.floor(Number(produk.jumlah));

    if (!Number.isFinite(stok)) {
        return 999;
    }

    return Math.max(0, stok);
}

function ambilJumlahBeli(produk) {
    const maksimal = hitungMaksimalBeli(produk);
    const tersimpan = Number(jumlahBeliProduk[produk.id]);
    const jumlah = Number.isFinite(tersimpan) && tersimpan > 0 ? tersimpan : 1;

    if (maksimal <= 0) {
        return 0;
    }

    return Math.min(jumlah, maksimal);
}

function ubahJumlahBeli(produk, perubahan) {
    const maksimal = hitungMaksimalBeli(produk);

    if (maksimal <= 0) {
        jumlahBeliProduk[produk.id] = 0;
        perbaruiPanelBeli();
        return;
    }

    const jumlahSaatIni = ambilJumlahBeli(produk);
    jumlahBeliProduk[produk.id] = Math.min(Math.max(jumlahSaatIni + perubahan, 1), maksimal);
    perbaruiPanelBeli();
}

function setJumlahBeliManual(produk, nilai) {
    const maksimal = hitungMaksimalBeli(produk);
    const jumlah = Math.floor(parseJumlah(nilai));

    if (!Number.isFinite(jumlah) || jumlah <= 0) {
        jumlahBeliProduk[produk.id] = maksimal > 0 ? 1 : 0;
        perbaruiPanelBeli();
        return;
    }

    jumlahBeliProduk[produk.id] = Math.min(jumlah, maksimal);
    perbaruiPanelBeli();
}

function hitungTotalBayar(produk, jumlahBeli) {
    const harga = Number(produk?.harga || 0);

    if (!Number.isFinite(harga) || harga <= 0) {
        return 0;
    }

    return harga * jumlahBeli;
}

function ambilProdukPetani() {
    try {
        const tersimpan = localStorage.getItem(kunciProdukPetani);
        const data = JSON.parse(tersimpan || '[]');

        if (!Array.isArray(data)) {
            return [];
        }

        const dataBersih = data.filter((item) => !idProdukContoh.has(item.id));

        if (dataBersih.length !== data.length) {
            localStorage.setItem(kunciProdukPetani, JSON.stringify(dataBersih));
        }

        return dataBersih.map((item) => ({
            id: item.id,
            nama: item.nama,
            deskripsi: item.deskripsi,
            alamat: item.alamat || 'Alamat belum ditambahkan',
            harga: item.harga || 0,
            jumlah: item.jumlah ?? item.stok ?? 0,
            satuan: item.satuan,
            petani: 'Petani Lokal',
            gambar: item.gambar || '/assets/marketplace/karung_padi_dengan_beras_dan_daun.png',
        }));
    } catch {
        return [];
    }
}

function ambilSemuaProduk() {
    return ambilProdukPetani();
}

function ambilPesananPetani() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPesananPetani) || '[]');

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function simpanPesananPetani(data) {
    localStorage.setItem(kunciPesananPetani, JSON.stringify(data));
}

function waktuSekarang() {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date());
}

function tampilkanToast(pesan) {
    if (!toastPembeli) {
        return;
    }

    toastPembeli.textContent = pesan;
    toastPembeli.hidden = false;
    window.clearTimeout(tampilkanToast.timer);
    tampilkanToast.timer = window.setTimeout(() => {
        toastPembeli.hidden = true;
    }, 2400);
}

function perbaruiPanelBeli() {
    if (!produkAktif) {
        return;
    }

    const jumlahBeli = ambilJumlahBeli(produkAktif);
    const maksimal = hitungMaksimalBeli(produkAktif);
    const marketplaceAktif = marketplacePembeliAktif();
    const pembayaranAktif = pembayaranPembeliAktif();
    const dapatCheckout = marketplaceAktif && pembayaranAktif;

    if (namaProdukPanel) {
        namaProdukPanel.textContent = produkAktif.nama;
    }

    if (petaniProdukPanel) {
        petaniProdukPanel.textContent = produkAktif.petani || 'Petani Lokal';
    }

    if (gambarProdukPanel) {
        gambarProdukPanel.src = produkAktif.gambar;
        gambarProdukPanel.alt = produkAktif.nama;
    }

    if (hargaProdukPanel) {
        hargaProdukPanel.textContent = formatRupiah(produkAktif.harga);
    }

    if (stokProdukPanel) {
        stokProdukPanel.textContent = `Stok ${formatJumlah(produkAktif.jumlah)} ${produkAktif.satuan || 'item'}`;
    }

    if (alamatProdukPanel) {
        alamatProdukPanel.textContent = produkAktif.alamat || 'Alamat belum ditambahkan';
    }

    if (angkaJumlahPanel) {
        angkaJumlahPanel.value = formatJumlah(jumlahBeli);
    }

    if (totalBayarPanel) {
        totalBayarPanel.textContent = formatTotalBayar(hitungTotalBayar(produkAktif, jumlahBeli));
    }

    if (tombolPanelKurang) {
        tombolPanelKurang.disabled = jumlahBeli <= 1 || maksimal <= 0;
    }

    if (tombolPanelTambah) {
        tombolPanelTambah.disabled = jumlahBeli >= maksimal || maksimal <= 0;
    }

    if (tombolKonfirmasiBeli) {
        tombolKonfirmasiBeli.disabled = maksimal <= 0 || !dapatCheckout;
        tombolKonfirmasiBeli.textContent = marketplaceAktif
            ? (pembayaranAktif ? 'Kirim Permintaan' : 'Pembayaran Nonaktif')
            : 'Marketplace Tutup';
    }

    if (statusPembayaranPembeli) {
        statusPembayaranPembeli.textContent = marketplaceAktif
            ? (pembayaranAktif ? '' : pesanPembayaranPembeliNonaktif())
            : pesanMarketplacePembeliTidakAktif();
    }

    opsiPembayaranPembeli.forEach((opsi) => {
        const input = opsi.querySelector('input[type="radio"]');
        const badge = opsi.querySelector('[data-payment-badge]');

        if (input) {
            const aktif = metodePembayaranPembeliAktif(input.value);

            input.disabled = !aktif;
            opsi.classList.toggle('opsi-gangguan', !aktif);

            if (badge) {
                badge.textContent = aktif ? (input.value === 'Tunai' ? 'Rekomendasi' : 'Aktif') : 'Nonaktif';
                badge.classList.toggle('gangguan', !aktif);
            }
        }
    });

    perbaruiOpsiPembayaran();
}

function bukaPanelBeli(produk) {
    if (!panelJumlahBeli) {
        return;
    }

    if (!marketplacePembeliAktif()) {
        tampilkanToast(pesanMarketplacePembeliTidakAktif());
        return;
    }

    if (!pembayaranPembeliAktif()) {
        tampilkanToast(pesanPembayaranPembeliNonaktif());
        return;
    }

    if (hitungMaksimalBeli(produk) <= 0) {
        tampilkanToast(`${produk.nama} sedang tidak tersedia.`);
        return;
    }

    produkAktif = produk;
    jumlahBeliProduk[produk.id] = ambilJumlahBeli(produk);
    perbaruiPanelBeli();
    panelJumlahBeli.hidden = false;
}

function tutupPanelBeli() {
    if (!panelJumlahBeli) {
        return;
    }

    panelJumlahBeli.hidden = true;
    produkAktif = null;
}

function metodePembayaranTerpilih() {
    if (!formPembayaranPembeli) {
        return metodePembayaranPembeliPertamaAktif() || 'Tunai';
    }

    return formPembayaranPembeli.querySelector('input[name="metode_pembayaran"]:checked')?.value
        || metodePembayaranPembeliPertamaAktif()
        || 'Tunai';
}

function perbaruiOpsiPembayaran() {
    const inputTerpilih = formPembayaranPembeli?.querySelector('input[name="metode_pembayaran"]:checked');

    if (inputTerpilih?.disabled) {
        const metodeAktif = metodePembayaranPembeliPertamaAktif();
        const inputAktif = metodeAktif
            ? formPembayaranPembeli.querySelector(`input[name="metode_pembayaran"][value="${metodeAktif}"]`)
            : null;

        if (inputAktif) {
            inputAktif.checked = true;
        } else {
            inputTerpilih.checked = false;
        }
    }

    opsiPembayaranPembeli.forEach((opsi) => {
        const input = opsi.querySelector('input[type="radio"]');

        opsi.classList.toggle('terpilih', Boolean(input?.checked));
        opsi.classList.toggle('tidak-aktif', Boolean(input?.disabled));
    });
}

function kirimPermintaanBeli(produk) {
    const jumlahBeli = ambilJumlahBeli(produk);
    const metode = metodePembayaranTerpilih();
    const totalBayar = hitungTotalBayar(produk, jumlahBeli);
    const totalLabel = formatTotalBayar(totalBayar);

    if (!marketplacePembeliAktif()) {
        const pesan = pesanMarketplacePembeliTidakAktif();

        tampilkanToast(pesan);
        if (statusPembayaranPembeli) {
            statusPembayaranPembeli.textContent = pesan;
        }
        return false;
    }

    if (!pembayaranPembeliAktif()) {
        tampilkanToast(pesanPembayaranPembeliNonaktif());
        if (statusPembayaranPembeli) {
            statusPembayaranPembeli.textContent = pesanPembayaranPembeliNonaktif();
        }
        return false;
    }

    if (!metodePembayaranPembeliAktif(metode)) {
        const pesan = `Metode pembayaran ${metode} sedang dinonaktifkan admin.`;

        tampilkanToast(pesan);
        if (statusPembayaranPembeli) {
            statusPembayaranPembeli.textContent = pesan;
        }
        perbaruiPanelBeli();
        return false;
    }

    if (jumlahBeli <= 0) {
        tampilkanToast(`${produk.nama} sedang tidak tersedia.`);
        return false;
    }

    const pesanan = ambilPesananPetani();

    pesanan.unshift({
        id: `pesanan-pembeli-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        namaPembeli: 'Pembeli Lancang',
        produk: produk.nama,
        jumlah: jumlahBeli,
        satuan: 'Kg',
        catatan: `Metode pembayaran ${metode}. Total bayar ${totalLabel}.`,
        metodePembayaran: metode,
        totalBayar,
        waktu: waktuSekarang(),
        status: 'menunggu',
    });

    simpanPesananPetani(pesanan);
    jumlahBeliProduk[produk.id] = 1;
    tutupPanelBeli();
    tampilkanToast(`Permintaan beli ${formatJumlah(jumlahBeli)} Kg ${produk.nama} senilai ${totalLabel} dikirim ke petani.`);
    return true;
}

function buatKartuProduk(produk) {
    const kartu = buatElemen('article', 'kartu-produk-pembeli');
    const gambar = buatElemen('img', 'gambar-produk-pembeli');
    const isi = buatElemen('div', 'isi-produk-pembeli');
    const meta = buatElemen('div', 'meta-produk-pembeli');
    const tombolBeli = buatElemen('button', 'tombol-beli-pembeli', 'Beli');
    const stokTersedia = hitungMaksimalBeli(produk) > 0;
    const marketplaceAktif = marketplacePembeliAktif();
    const pembayaranAktif = pembayaranPembeliAktif();

    gambar.src = produk.gambar;
    gambar.alt = produk.nama;
    tombolBeli.type = 'button';
    tombolBeli.disabled = !stokTersedia || !marketplaceAktif || !pembayaranAktif;
    tombolBeli.textContent = marketplaceAktif
        ? (pembayaranAktif ? 'Beli' : 'Pembayaran Nonaktif')
        : 'Marketplace Tutup';
    tombolBeli.addEventListener('click', () => bukaPanelBeli(produk));

    meta.append(
        buatElemen('strong', 'harga-produk-pembeli', formatRupiah(produk.harga)),
        buatElemen('span', 'petani-produk-pembeli', produk.petani || 'Petani Lokal'),
        buatElemen('span', 'alamat-produk-pembeli', produk.alamat || 'Alamat belum ditambahkan'),
        buatElemen('span', 'stok-produk-pembeli', `Stok ${formatJumlah(produk.jumlah)} ${produk.satuan || 'item'}`)
    );
    isi.append(
        buatElemen('h2', 'nama-produk-pembeli', produk.nama),
        buatElemen('p', 'deskripsi-produk-pembeli', produk.deskripsi || 'Produk hasil tani dari petani lokal.'),
        meta,
        tombolBeli
    );
    kartu.append(gambar, isi);

    return kartu;
}

function renderProduk() {
    if (!daftarProdukPembeli) {
        return;
    }

    const marketplaceAktif = marketplacePembeliAktif();
    const kataKunci = String(inputCariProduk?.value || '').trim().toLowerCase();
    const semuaProduk = ambilSemuaProduk();
    const produk = semuaProduk.filter((item) => {
        const teks = `${item.nama} ${item.deskripsi} ${item.petani} ${item.alamat}`.toLowerCase();

        return teks.includes(kataKunci);
    });

    daftarProdukPembeli.innerHTML = '';

    if (inputCariProduk) {
        inputCariProduk.disabled = !marketplaceAktif;
        inputCariProduk.placeholder = marketplaceAktif ? 'Cari beras, gabah, bibit...' : 'Marketplace sedang tidak tersedia';
    }

    if (!marketplaceAktif) {
        const kartuStatus = buatElemen('article', 'produk-tidak-ada marketplace-pembeli-tutup');
        const isi = document.createElement('div');

        if (totalProduk) {
            totalProduk.textContent = `Status: ${statusMarketplacePembeli()}`;
        }

        tutupPanelBeli();
        isi.append(
            buatElemen('h2', '', statusMarketplacePembeli() === 'Perawatan' ? 'Marketplace Dalam Perawatan' : 'Marketplace Dinonaktifkan'),
            buatElemen('p', '', pesanMarketplacePembeliTidakAktif())
        );
        kartuStatus.appendChild(isi);
        daftarProdukPembeli.appendChild(kartuStatus);
        return;
    }

    if (totalProduk) {
        totalProduk.textContent = `${produk.length} produk tersedia`;
    }

    if (produk.length === 0) {
        const kosong = buatElemen('article', 'produk-tidak-ada');
        const isi = document.createElement('div');
        const judulKosong = semuaProduk.length === 0 ? 'Belum ada produk petani' : 'Produk tidak ditemukan';
        const pesanKosong = semuaProduk.length === 0
            ? 'Produk yang ditambahkan petani akan tampil di sini.'
            : 'Coba cari dengan kata kunci lain.';

        isi.append(
            buatElemen('h2', '', judulKosong),
            buatElemen('p', '', pesanKosong)
        );
        kosong.appendChild(isi);
        daftarProdukPembeli.appendChild(kosong);
        return;
    }

    produk.forEach((item) => daftarProdukPembeli.appendChild(buatKartuProduk(item)));
}

inputCariProduk?.addEventListener('input', renderProduk);
tombolTutupPanelBeli?.addEventListener('click', tutupPanelBeli);
tombolPanelKurang?.addEventListener('click', () => {
    if (produkAktif) {
        ubahJumlahBeli(produkAktif, -1);
    }
});
tombolPanelTambah?.addEventListener('click', () => {
    if (produkAktif) {
        ubahJumlahBeli(produkAktif, 1);
    }
});
angkaJumlahPanel?.addEventListener('input', () => {
    angkaJumlahPanel.value = angkaJumlahPanel.value.replace(/[^\d]/g, '');

    if (produkAktif && totalBayarPanel) {
        const maksimal = hitungMaksimalBeli(produkAktif);
        const jumlah = Math.min(Math.max(Math.floor(parseJumlah(angkaJumlahPanel.value) || 0), 0), maksimal);

        totalBayarPanel.textContent = formatTotalBayar(hitungTotalBayar(produkAktif, jumlah));
    }
});
angkaJumlahPanel?.addEventListener('change', () => {
    if (produkAktif) {
        setJumlahBeliManual(produkAktif, angkaJumlahPanel.value);
    }
});
angkaJumlahPanel?.addEventListener('blur', () => {
    if (produkAktif) {
        setJumlahBeliManual(produkAktif, angkaJumlahPanel.value);
    }
});
opsiPembayaranPembeli.forEach((opsi) => {
    opsi.addEventListener('change', () => {
        perbaruiOpsiPembayaran();
    });
});
formPembayaranPembeli?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (produkAktif) {
        setJumlahBeliManual(produkAktif, angkaJumlahPanel?.value || '1');
        const terkirim = kirimPermintaanBeli(produkAktif);

        if (terkirim && statusPembayaranPembeli) {
            statusPembayaranPembeli.textContent = 'Permintaan pembelian berhasil dikirim.';
        }
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === kunciPengaturanAdmin) {
        renderProduk();
        perbaruiPanelBeli();
        perbaruiOpsiPembayaran();
    }
});

renderProduk();
perbaruiOpsiPembayaran();

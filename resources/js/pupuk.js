const tombolCheckout = document.querySelector('[data-buka-checkout]');
const tombolRiwayat = document.querySelector('[data-buka-riwayat]');
const panelCheckout = document.querySelector('[data-panel-checkout]');
const panelRiwayat = document.querySelector('[data-panel-riwayat]');
const tombolTutupCheckout = document.querySelector('[data-tutup-checkout]');
const tombolTutupRiwayat = document.querySelector('[data-tutup-riwayat]');
const daftarProdukPupuk = document.querySelector('[data-daftar-produk-pupuk]');
const namaProdukCheckout = document.querySelector('[data-checkout-produk]');
const hargaProdukCheckout = document.querySelector('[data-checkout-harga]');
const daftarCheckout = document.querySelector('[data-daftar-checkout]');
const totalCheckout = document.querySelector('[data-total-checkout]');
const totalBayarCheckout = document.querySelector('[data-total-bayar]');
const panelPembatasPupuk = document.querySelector('[data-pembatas-pupuk]');
const pilihPetaniPupuk = document.querySelector('[data-pilih-petani-pupuk]');
const infoBatasPupuk = document.querySelector('[data-info-batas-pupuk]');
const daftarRiwayat = document.querySelector('[data-daftar-riwayat]');
const jumlahKeranjang = document.querySelector('[data-jumlah-keranjang]');
const jumlahRiwayat = document.querySelector('[data-jumlah-riwayat]');
const formCheckout = document.querySelector('[data-form-checkout]');
const statusCheckout = document.querySelector('[data-status-checkout]');
const opsiPembayaran = document.querySelectorAll('.opsi-pembayaran');
const tombolLanjutCheckout = document.querySelector('.tombol-lanjut-checkout');
const kunciRiwayatPupuk = 'poktan-riwayat-pupuk';
const kunciProdukPupuk = 'poktan:pupuk:produk';
const kunciPenggunaAdmin = 'poktan:admin:pengguna';
const kunciPengaturanAdmin = 'poktan:admin:pengaturan';
const metodePembayaran = ['Tunai', 'Transfer', 'QRIS'];

let keranjangPupuk = [];
let riwayatPupuk = [];
let daftarPetaniPupuk = [];

const formatRupiah = (nilai) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
}).format(nilai).replace(/\s/g, ' ');

const formatJumlah = (nilai) => new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
}).format(Number(nilai) || 0);

const escapeHtml = (nilai) => String(nilai ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const bacaPengaturanAdmin = () => {
    try {
        const data = JSON.parse(localStorage.getItem(kunciPengaturanAdmin) || '{}');

        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
};

const metodePembayaranPupukNonaktif = () => {
    const pengaturan = bacaPengaturanAdmin();

    if (Array.isArray(pengaturan.farmerPaymentDisabledMethods)) {
        return pengaturan.farmerPaymentDisabledMethods.filter((metode) => metodePembayaran.includes(metode));
    }

    return pengaturan.farmerPayment === 'Nonaktif' ? [...metodePembayaran] : [];
};

const metodePembayaranPupukAktif = (metode) => !metodePembayaranPupukNonaktif().includes(metode);

const pembayaranPupukAktif = () => metodePembayaran.some((metode) => metodePembayaranPupukAktif(metode));

const metodePembayaranPupukPertamaAktif = () => metodePembayaran.find((metode) => metodePembayaranPupukAktif(metode)) || '';

const pesanPembayaranPupukNonaktif = () => 'Semua metode pembayaran pupuk sedang dinonaktifkan admin.';

const produkPupukBawaan = [
    {
        id: 'pupuk-urea',
        nama: 'Urea',
        deskripsi: 'Nitrogen 46% untuk pertumbuhan daun',
        harga: 120000,
        satuan: '/ 50 kg',
        stok: 0,
        gambar: '/assets/pupuk/tas_pupuk_urea_dengan_granula.png',
    },
    {
        id: 'pupuk-npk-16-16-16',
        nama: 'NPK 16-16-16',
        deskripsi: 'Seimbang untuk fase vegetatif dan generatif',
        harga: 160000,
        satuan: '/ 50 kg',
        stok: 0,
        gambar: '/assets/pupuk/pupuk_majemuk_npk_16_16_16.png',
    },
    {
        id: 'pupuk-organik',
        nama: 'Pupuk Organik',
        deskripsi: 'Memperbaiki struktur tanah dan meningkatkan kesuburan',
        harga: 85000,
        satuan: '/ 25 kg',
        stok: 0,
        gambar: '/assets/pupuk/pupuk_organik_dengan_tanah_kompos.png',
    },
    {
        id: 'pupuk-kcl',
        nama: 'KCL',
        deskripsi: 'Sumber kalium untuk meningkatkan kualitas hasil',
        harga: 130000,
        satuan: '/ 50 kg',
        stok: 0,
        gambar: '/assets/pupuk/tas_pupuk_kcl_dengan_granula.png',
    },
];

const buatIdProduk = (namaProduk) => namaProduk.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const hitungJumlahKeranjang = () => keranjangPupuk.reduce((total, item) => total + item.jumlah, 0);

const hitungTotalBayar = () => keranjangPupuk.reduce((total, item) => total + (item.hargaAngka * item.jumlah), 0);

const aturBadge = (elemen, nilai) => {
    if (!elemen) {
        return;
    }

    elemen.hidden = nilai <= 0;
    elemen.textContent = String(nilai);
};

const bacaRiwayat = () => {
    try {
        const riwayatTersimpan = localStorage.getItem(kunciRiwayatPupuk);
        return riwayatTersimpan ? JSON.parse(riwayatTersimpan) : [];
    } catch (error) {
        return [];
    }
};

const simpanRiwayat = () => {
    try {
        localStorage.setItem(kunciRiwayatPupuk, JSON.stringify(riwayatPupuk.slice(0, 30)));
    } catch (error) {
        console.info('Riwayat pupuk belum bisa disimpan.', error);
    }
};

const bacaProdukAdmin = () => {
    try {
        const produkTersimpan = JSON.parse(localStorage.getItem(kunciProdukPupuk) || '[]');
        return Array.isArray(produkTersimpan) ? produkTersimpan : [];
    } catch (error) {
        console.info('Produk pupuk admin belum bisa dibaca.', error);
        return [];
    }
};

const bacaSemuaProdukPupuk = () => [
    ...bacaProdukAdmin(),
    ...produkPupukBawaan,
].filter((produk) => produk.nama && Number(produk.harga) > 0);

const bacaPetaniAdmin = () => {
    try {
        const pengguna = JSON.parse(localStorage.getItem(kunciPenggunaAdmin) || '[]');

        if (!Array.isArray(pengguna)) {
            return [];
        }

        return pengguna.filter((item) => item.role === 'Petani' && item.status !== 'Nonaktif');
    } catch (error) {
        console.info('Data petani admin belum bisa dibaca.', error);
        return [];
    }
};

const ambilPetaniTerpilih = () => daftarPetaniPupuk.find((item) => item.id === pilihPetaniPupuk?.value);

const ambilBatasProdukPupuk = (idProduk) => {
    const petani = ambilPetaniTerpilih();
    const batasProduk = Number(petani?.fertilizerLimits?.[idProduk] || 0);
    const batasLama = Number(petani?.fertilizerLimit || 0);
    const batas = batasProduk > 0 ? batasProduk : batasLama;

    return Number.isFinite(batas) && batas > 0 ? batas : 0;
};

const ambilBatasAktifPetani = () => {
    const petani = ambilPetaniTerpilih();
    const batas = petani?.fertilizerLimits && typeof petani.fertilizerLimits === 'object'
        ? petani.fertilizerLimits
        : {};

    return Object.entries(batas)
        .map(([id, limit]) => ({ id, limit: Number(limit || 0) }))
        .filter((item) => Number.isFinite(item.limit) && item.limit > 0);
};

const hitungJumlahProdukKeranjang = (idProduk) => keranjangPupuk
    .filter((item) => item.id === idProduk)
    .reduce((total, item) => total + item.jumlah, 0);

const cariItemMelewatiBatas = () => keranjangPupuk.find((item) => {
    const batas = ambilBatasProdukPupuk(item.id);

    return batas > 0 && item.jumlah > batas;
});

const namaProdukDariId = (idProduk) => {
    const produk = bacaSemuaProdukPupuk().find((item) => buatIdProduk(item.nama) === idProduk);

    return produk?.nama || idProduk;
};

const perbaruiInfoBatasPupuk = () => {
    if (!infoBatasPupuk) {
        return;
    }

    const petani = ambilPetaniTerpilih();

    if (!petani) {
        infoBatasPupuk.textContent = 'Belum ada data petani dari admin.';
        return;
    }

    const batasAktif = ambilBatasAktifPetani();

    if (batasAktif.length > 0) {
        const ringkasan = batasAktif.slice(0, 3).map((item) => (
            `${namaProdukDariId(item.id)} ${formatJumlah(item.limit)}`
        )).join(', ');
        const sisa = batasAktif.length > 3 ? ` +${batasAktif.length - 3} produk` : '';

        infoBatasPupuk.textContent = `Batas per produk: ${ringkasan}${sisa}.`;
        return;
    }

    infoBatasPupuk.textContent = 'Petani ini belum memiliki batas pembelian pupuk per produk.';
};

const renderPilihanPetaniPupuk = () => {
    daftarPetaniPupuk = bacaPetaniAdmin();

    if (!panelPembatasPupuk || !pilihPetaniPupuk || daftarPetaniPupuk.length === 0) {
        if (panelPembatasPupuk) {
            panelPembatasPupuk.hidden = true;
        }

        return;
    }

    panelPembatasPupuk.hidden = false;
    pilihPetaniPupuk.innerHTML = daftarPetaniPupuk.map((petani) => (
        `<option value="${escapeHtml(petani.id)}">${escapeHtml(petani.name || 'Petani')}</option>`
    )).join('');
    perbaruiInfoBatasPupuk();
};

const cekBatasPupuk = (idProduk, tambahan = 0) => {
    const batas = ambilBatasProdukPupuk(idProduk);

    return batas > 0 && hitungJumlahProdukKeranjang(idProduk) + tambahan > batas;
};

const renderProdukPupuk = () => {
    if (!daftarProdukPupuk) {
        return;
    }

    const semuaProduk = bacaSemuaProdukPupuk();

    if (semuaProduk.length === 0) {
        daftarProdukPupuk.innerHTML = '<div class="produk-pupuk-kosong"><p>Belum ada produk pupuk tersedia.</p></div>';
        return;
    }

    daftarProdukPupuk.innerHTML = semuaProduk.map((produk) => {
        const nama = escapeHtml(produk.nama);
        const harga = Number(produk.harga) || 0;
        const satuan = escapeHtml(produk.satuan || '/ 50 kg');
        const stok = Number(produk.stok || 0);
        const teksStok = stok > 0 ? `<p class="stok-produk-pupuk">Stok ${formatJumlah(stok)}</p>` : '';

        return `
            <article class="kartu-produk">
                <img
                    src="${escapeHtml(produk.gambar || '/assets/pupuk/tas_pupuk_urea_dengan_granula.png')}"
                    alt="${nama}"
                    class="gambar-produk"
                >

                <h3>${nama}</h3>
                <p class="deskripsi-produk">${escapeHtml(produk.deskripsi || 'Produk pupuk untuk kebutuhan pertanian')}</p>
                ${teksStok}

                <div class="harga-produk">
                    <strong>${formatRupiah(harga)}</strong>
                    <span>${satuan}</span>
                </div>

                <button
                    class="tombol-beli"
                    type="button"
                    data-produk-pupuk="${nama}"
                    data-harga-pupuk="${formatRupiah(harga)}"
                    data-satuan-pupuk="${satuan}"
                    data-harga-angka="${harga}"
                >
                    BELI
                </button>
            </article>
        `;
    }).join('');
};

const renderRiwayat = () => {
    aturBadge(jumlahRiwayat, riwayatPupuk.length);

    if (!daftarRiwayat) {
        return;
    }

    if (riwayatPupuk.length === 0) {
        daftarRiwayat.innerHTML = '<div class="riwayat-kosong"><p>Belum ada riwayat transaksi pesanan.</p></div>';
        return;
    }

    daftarRiwayat.innerHTML = riwayatPupuk.map((pesanan) => `
        <article class="item-riwayat">
            <header>
                <h3>${pesanan.metode}</h3>
                <time>${pesanan.tanggal}</time>
            </header>
            ${pesanan.petani ? `<p>Petani: ${escapeHtml(pesanan.petani)}</p>` : ''}
            <p>${pesanan.items.map((item) => `${item.nama} x${item.jumlah}`).join(', ')}</p>
            <strong>${formatRupiah(pesanan.total)}</strong>
        </article>
    `).join('');
};

const renderKeranjang = () => {
    const jumlahItem = hitungJumlahKeranjang();
    const totalBayar = hitungTotalBayar();
    const pembayaranAktif = pembayaranPupukAktif();

    aturBadge(jumlahKeranjang, jumlahItem);
    perbaruiInfoBatasPupuk();

    if (jumlahItem === 0) {
        if (namaProdukCheckout) {
            namaProdukCheckout.textContent = 'Belum memilih produk';
        }

        if (hargaProdukCheckout) {
            hargaProdukCheckout.textContent = 'Tekan BELI pada satu atau beberapa produk';
        }

        if (daftarCheckout) {
            daftarCheckout.hidden = true;
            daftarCheckout.innerHTML = '';
        }

        if (totalCheckout) {
            totalCheckout.hidden = true;
        }

        if (tombolLanjutCheckout) {
            tombolLanjutCheckout.disabled = true;
            tombolLanjutCheckout.textContent = 'LANJUTKAN';
        }

        return;
    }

    if (namaProdukCheckout) {
        namaProdukCheckout.textContent = `${keranjangPupuk.length} produk dipilih`;
    }

    if (hargaProdukCheckout) {
        hargaProdukCheckout.textContent = `${jumlahItem} item dalam pesanan`;
    }

    if (totalBayarCheckout) {
        totalBayarCheckout.textContent = formatRupiah(totalBayar);
    }

    if (totalCheckout) {
        totalCheckout.hidden = false;
    }

    if (daftarCheckout) {
        daftarCheckout.hidden = false;
        daftarCheckout.innerHTML = keranjangPupuk.map((item) => `
            <article class="item-checkout">
                <div class="info-checkout">
                    <strong>${item.nama}</strong>
                    <span>${item.hargaLabel} ${item.satuan}</span>
                </div>
                <div class="kontrol-jumlah">
                    <button type="button" aria-label="Kurangi ${item.nama}" data-aksi-jumlah="kurang" data-id-produk="${item.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.8" stroke-linecap="round" aria-hidden="true">
                            <path d="M6 12h12"></path>
                        </svg>
                    </button>
                    <strong>${item.jumlah}</strong>
                    <button type="button" aria-label="Tambah ${item.nama}" data-aksi-jumlah="tambah" data-id-produk="${item.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.8" stroke-linecap="round" aria-hidden="true">
                            <path d="M12 6v12"></path>
                            <path d="M6 12h12"></path>
                        </svg>
                    </button>
                </div>
            </article>
        `).join('');
    }

    if (tombolLanjutCheckout) {
        tombolLanjutCheckout.disabled = !pembayaranAktif;
        tombolLanjutCheckout.textContent = pembayaranAktif ? 'LANJUTKAN' : 'PEMBAYARAN NONAKTIF';
    }

    if (!pembayaranAktif && statusCheckout) {
        statusCheckout.textContent = pesanPembayaranPupukNonaktif();
    }
};

const bukaCheckout = () => {
    if (!panelCheckout) {
        return;
    }

    panelCheckout.hidden = false;
    panelRiwayat && (panelRiwayat.hidden = true);
    tombolCheckout?.setAttribute('aria-expanded', 'true');
    tombolRiwayat?.setAttribute('aria-expanded', 'false');
};

const tutupCheckout = () => {
    if (!panelCheckout) {
        return;
    }

    panelCheckout.hidden = true;
    tombolCheckout?.setAttribute('aria-expanded', 'false');
};

const bukaRiwayat = () => {
    if (!panelRiwayat) {
        return;
    }

    renderRiwayat();
    panelRiwayat.hidden = false;
    panelCheckout && (panelCheckout.hidden = true);
    tombolRiwayat?.setAttribute('aria-expanded', 'true');
    tombolCheckout?.setAttribute('aria-expanded', 'false');
};

const tutupRiwayat = () => {
    if (!panelRiwayat) {
        return;
    }

    panelRiwayat.hidden = true;
    tombolRiwayat?.setAttribute('aria-expanded', 'false');
};

const tambahProduk = (tombol) => {
    const namaProduk = tombol.dataset.produkPupuk;
    const hargaLabel = tombol.dataset.hargaPupuk;
    const satuan = tombol.dataset.satuanPupuk || '';
    const hargaAngka = Number(tombol.dataset.hargaAngka || 0);

    if (!namaProduk || !Number.isFinite(hargaAngka) || hargaAngka <= 0) {
        return;
    }

    const id = buatIdProduk(namaProduk);

    if (cekBatasPupuk(id, 1)) {
        const batas = ambilBatasProdukPupuk(id);

        if (statusCheckout) {
            statusCheckout.textContent = `${namaProduk} dibatasi maksimal ${formatJumlah(batas)} paket untuk petani ini.`;
        }

        bukaCheckout();
        return;
    }

    const produkAda = keranjangPupuk.find((item) => item.id === id);

    if (produkAda) {
        produkAda.jumlah += 1;
    } else {
        keranjangPupuk.push({
            id,
            nama: namaProduk,
            hargaLabel,
            satuan,
            hargaAngka,
            jumlah: 1,
        });
    }

    if (statusCheckout) {
        statusCheckout.textContent = `${namaProduk} ditambahkan ke checkout.`;
    }

    renderKeranjang();
    bukaCheckout();
};

const ubahJumlahProduk = (idProduk, aksi) => {
    const item = keranjangPupuk.find((produk) => produk.id === idProduk);

    if (!item) {
        return;
    }

    if (aksi === 'tambah') {
        if (cekBatasPupuk(idProduk, 1)) {
            const batas = ambilBatasProdukPupuk(idProduk);

            if (statusCheckout) {
                statusCheckout.textContent = `${item.nama} dibatasi maksimal ${formatJumlah(batas)} paket untuk petani ini.`;
            }

            return;
        }

        item.jumlah += 1;
    }

    if (aksi === 'kurang') {
        item.jumlah -= 1;
    }

    keranjangPupuk = keranjangPupuk.filter((produk) => produk.jumlah > 0);
    renderKeranjang();
};

const perbaruiOpsiPembayaran = () => {
    opsiPembayaran.forEach((opsi) => {
        const input = opsi.querySelector('input[type="radio"]');
        const badge = opsi.querySelector('[data-payment-badge]');

        if (!input) {
            return;
        }

        const aktif = metodePembayaranPupukAktif(input.value);

        input.disabled = !aktif;
        opsi.classList.toggle('opsi-gangguan', !aktif);

        if (badge) {
            badge.textContent = aktif ? (input.value === 'Tunai' ? 'Rekomendasi' : 'Aktif') : 'Nonaktif';
            badge.classList.toggle('gangguan', !aktif);
        }
    });

    const inputTerpilih = document.querySelector('input[name="metode_pembayaran"]:checked');

    if (inputTerpilih?.disabled) {
        const metodeAktif = metodePembayaranPupukPertamaAktif();
        const inputAktif = metodeAktif
            ? document.querySelector(`input[name="metode_pembayaran"][value="${metodeAktif}"]`)
            : null;

        if (inputAktif) {
            inputAktif.checked = true;
        } else {
            inputTerpilih.checked = false;
        }
    }

    opsiPembayaran.forEach((opsi) => {
        const input = opsi.querySelector('input[type="radio"]');
        opsi.classList.toggle('terpilih', Boolean(input?.checked));
        opsi.classList.toggle('tidak-aktif', Boolean(input?.disabled));
    });

    if (tombolLanjutCheckout) {
        tombolLanjutCheckout.disabled = keranjangPupuk.length === 0 || !pembayaranPupukAktif();
        tombolLanjutCheckout.textContent = pembayaranPupukAktif() ? 'LANJUTKAN' : 'PEMBAYARAN NONAKTIF';
    }
};

tombolCheckout?.addEventListener('click', () => {
    bukaCheckout();
});

tombolRiwayat?.addEventListener('click', () => {
    bukaRiwayat();
});

tombolTutupCheckout?.addEventListener('click', () => {
    tutupCheckout();
});

tombolTutupRiwayat?.addEventListener('click', () => {
    tutupRiwayat();
});

daftarProdukPupuk?.addEventListener('click', (event) => {
    const tombol = event.target.closest('[data-produk-pupuk]');

    if (!tombol) {
        return;
    }

    tambahProduk(tombol);
});

daftarCheckout?.addEventListener('click', (event) => {
    const tombol = event.target.closest('[data-aksi-jumlah]');

    if (!tombol) {
        return;
    }

    ubahJumlahProduk(tombol.dataset.idProduk, tombol.dataset.aksiJumlah);
});

opsiPembayaran.forEach((opsi) => {
    opsi.addEventListener('change', () => {
        perbaruiOpsiPembayaran();
    });
});

pilihPetaniPupuk?.addEventListener('change', () => {
    perbaruiInfoBatasPupuk();

    const itemMelewatiBatas = cariItemMelewatiBatas();

    if (itemMelewatiBatas && statusCheckout) {
        statusCheckout.textContent = `${itemMelewatiBatas.nama} melewati batas ${formatJumlah(ambilBatasProdukPupuk(itemMelewatiBatas.id))} paket untuk petani ini.`;
    }
});

formCheckout?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (keranjangPupuk.length === 0) {
        if (statusCheckout) {
            statusCheckout.textContent = 'Pilih produk terlebih dahulu sebelum lanjut checkout.';
        }

        return;
    }

    if (!pembayaranPupukAktif()) {
        if (statusCheckout) {
            statusCheckout.textContent = pesanPembayaranPupukNonaktif();
        }

        perbaruiOpsiPembayaran();
        return;
    }

    const itemMelewatiBatas = cariItemMelewatiBatas();

    if (itemMelewatiBatas) {
        if (statusCheckout) {
            statusCheckout.textContent = `${itemMelewatiBatas.nama} melewati batas ${formatJumlah(ambilBatasProdukPupuk(itemMelewatiBatas.id))} paket untuk petani ini.`;
        }

        return;
    }

    const metode = formCheckout.querySelector('input[name="metode_pembayaran"]:checked')?.value
        || metodePembayaranPupukPertamaAktif()
        || 'Tunai';

    if (!metodePembayaranPupukAktif(metode)) {
        if (statusCheckout) {
            statusCheckout.textContent = `Metode pembayaran ${metode} sedang dinonaktifkan admin.`;
        }

        perbaruiOpsiPembayaran();
        return;
    }

    const totalBayar = hitungTotalBayar();
    const jumlahItem = hitungJumlahKeranjang();
    const tanggal = new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    riwayatPupuk.unshift({
        id: Date.now(),
        tanggal,
        metode,
        petani: ambilPetaniTerpilih()?.name || '',
        status: 'menunggu',
        total: totalBayar,
        items: keranjangPupuk.map((item) => ({
            nama: item.nama,
            jumlah: item.jumlah,
            harga: item.hargaAngka,
        })),
    });
    simpanRiwayat();
    renderRiwayat();

    if (statusCheckout) {
        statusCheckout.textContent = `Pesanan dikirim ke admin. Total bayar ${formatRupiah(totalBayar)} untuk ${jumlahItem} item dengan metode ${metode}.`;
    }

    keranjangPupuk = [];
    renderKeranjang();
});

riwayatPupuk = bacaRiwayat();
renderProdukPupuk();
renderPilihanPetaniPupuk();
renderKeranjang();
renderRiwayat();
perbaruiOpsiPembayaran();

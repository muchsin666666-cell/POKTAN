const tombolBuka = document.querySelector('[data-buka-form-panen]');
const tombolTutup = document.querySelector('[data-tutup-form-panen]');
const panelPanen = document.querySelector('[data-panel-panen]');
const formPanen = document.querySelector('[data-form-panen]');
const tabelPanen = document.querySelector('[data-tabel-panen]');
const inputJumlah = document.querySelector('[data-input-jumlah]');
const inputBibit = document.querySelector('[data-input-bibit]');
const kunciPenyimpanan = 'poktan:lumbung-padi:panen';

function ambilDataPanen() {
    try {
        return JSON.parse(localStorage.getItem(kunciPenyimpanan) || '[]');
    } catch {
        return [];
    }
}

function simpanDataPanen(dataPanen) {
    localStorage.setItem(kunciPenyimpanan, JSON.stringify(dataPanen));
}

function formatTanggal(tanggalIso) {
    const [tahun, bulan, hari] = tanggalIso.split('-');

    return `${hari}/${bulan}/${tahun}`;
}

function tanggalHariIni() {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, '0');
    const hari = String(hariIni.getDate()).padStart(2, '0');

    return `${tahun}-${bulan}-${hari}`;
}

function buatSelTeks(teks) {
    const sel = document.createElement('td');
    sel.textContent = teks;

    return sel;
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
    const angka = parseJumlah(nilai);

    if (!Number.isFinite(angka)) {
        return '0';
    }

    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(angka);
}

function buatBarisPanen(item) {
    const baris = document.createElement('tr');
    const hasil = document.createElement('td');
    const judul = document.createElement('strong');
    const satuan = document.createElement('span');

    judul.textContent = item.hasil;
    satuan.textContent = '(per Kg)';

    hasil.append(judul, satuan);
    baris.append(
        hasil,
        buatSelTeks(formatJumlah(item.jumlah)),
        buatSelTeks(item.jenisBibit),
        buatSelTeks(formatTanggal(item.tanggal))
    );

    return baris;
}

function renderTabelPanen() {
    if (!tabelPanen) {
        return;
    }

    const dataPanen = ambilDataPanen();
    tabelPanen.innerHTML = '';

    if (dataPanen.length === 0) {
        const barisKosong = document.createElement('tr');
        const hasil = document.createElement('td');
        const judul = document.createElement('strong');
        const satuan = document.createElement('span');

        judul.textContent = 'Hasil Panen Padi';
        satuan.textContent = '(per Kg)';
        hasil.append(judul, satuan);
        barisKosong.append(hasil, buatSelTeks('0'), buatSelTeks('Jenis Bibit Padi'), buatSelTeks('-'));
        tabelPanen.appendChild(barisKosong);

        return;
    }

    dataPanen.forEach((item) => tabelPanen.appendChild(buatBarisPanen(item)));
}

function bukaPanel() {
    if (!panelPanen || !tombolBuka) {
        return;
    }

    panelPanen.hidden = false;
    tombolBuka.setAttribute('aria-expanded', 'true');
    inputJumlah?.focus();
}

function tutupPanel() {
    if (!panelPanen || !tombolBuka) {
        return;
    }

    panelPanen.hidden = true;
    tombolBuka.setAttribute('aria-expanded', 'false');
}

tombolBuka?.addEventListener('click', bukaPanel);
tombolTutup?.addEventListener('click', tutupPanel);

formPanen?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!formPanen.reportValidity()) {
        return;
    }

    const jumlah = parseJumlah(inputJumlah?.value || '0');

    if (!Number.isFinite(jumlah) || jumlah < 0) {
        inputJumlah?.setCustomValidity('Masukkan jumlah panen yang valid.');
        inputJumlah?.reportValidity();
        return;
    }

    inputJumlah?.setCustomValidity('');

    const dataPanen = ambilDataPanen();
    dataPanen.unshift({
        hasil: 'Hasil Panen Padi',
        jumlah,
        jenisBibit: inputBibit?.value.trim() || '-',
        tanggal: tanggalHariIni(),
    });

    simpanDataPanen(dataPanen);
    renderTabelPanen();
    formPanen.reset();
    tutupPanel();
});

inputJumlah?.addEventListener('input', () => {
    inputJumlah.setCustomValidity('');
});

renderTabelPanen();

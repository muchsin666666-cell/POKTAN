const halamanCuaca = document.querySelector('[data-halaman-cuaca]');

const fallbackIkon = {
    cerah: '/assets/cuaca/hari_yang_cerah_dengan_awan_dan_matahari-bersih.png',
    berawan: '/assets/cuaca/awan_biru_lembut_minimalis-bersih.png',
    hujan: '/assets/cuaca/awan_dengan_hujan_ringan-bersih.png',
};

const pilihIkonFallback = (deskripsi = '') => {
    const teks = deskripsi.toLowerCase();

    if (teks.includes('hujan')) {
        return fallbackIkon.hujan;
    }

    if (teks.includes('berawan')) {
        return fallbackIkon.berawan;
    }

    return fallbackIkon.cerah;
};

const tulisTeks = (selector, teks) => {
    const elemen = halamanCuaca?.querySelector(selector);

    if (elemen && teks !== undefined && teks !== null && teks !== '') {
        elemen.textContent = teks;
    }
};

const tulisHtml = (selector, html) => {
    const elemen = halamanCuaca?.querySelector(selector);

    if (elemen) {
        elemen.innerHTML = html;
    }
};

const pasangIkon = (elemen, urlIkon, deskripsi) => {
    if (!elemen) {
        return;
    }

    const fallback = pilihIkonFallback(deskripsi);
    elemen.onerror = () => {
        elemen.onerror = null;
        elemen.src = fallback;
    };
    elemen.src = urlIkon || fallback;
    elemen.alt = deskripsi || 'Ikon cuaca';
};

const ambilJson = async (url) => {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Request gagal: ${response.status}`);
    }

    return response.json();
};

const ambilLokasiPerangkat = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
        reject(new Error('Browser tidak mendukung Geolocation API.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 10000,
    });
});

const buatKartuPrakiraan = (item, index) => {
    const kartu = document.createElement('article');
    kartu.className = `kartu-prakiraan${index === 0 ? ' aktif' : ''}`;

    const hari = document.createElement('h3');
    hari.textContent = item.hari || '--';

    const tanggal = document.createElement('p');
    tanggal.className = 'tanggal';
    tanggal.textContent = item.tanggal || '--';

    const ikon = document.createElement('img');
    ikon.className = 'ikon-prakiraan';
    pasangIkon(ikon, item.ikon, item.deskripsi);

    const suhuMaks = document.createElement('p');
    suhuMaks.className = 'suhu-maks';
    suhuMaks.textContent = Number.isFinite(Number(item.suhu_maks)) ? `${Math.round(Number(item.suhu_maks))}\u00b0C` : '--\u00b0C';

    const suhuMin = document.createElement('p');
    suhuMin.className = 'suhu-min';
    suhuMin.textContent = Number.isFinite(Number(item.suhu_min)) ? `${Math.round(Number(item.suhu_min))}\u00b0C` : '--\u00b0C';

    const keterangan = document.createElement('p');
    keterangan.className = 'keterangan';
    keterangan.textContent = item.deskripsi || 'Data BMKG';

    kartu.append(hari, tanggal, ikon, suhuMaks, suhuMin, keterangan);

    return kartu;
};

const tampilkanPrakiraan = (prakiraan = []) => {
    const daftar = halamanCuaca?.querySelector('[data-prakiraan-list]');

    if (!daftar) {
        return;
    }

    daftar.innerHTML = '';

    if (!prakiraan.length) {
        const kosong = document.createElement('p');
        kosong.className = 'pesan-prakiraan';
        kosong.textContent = 'Prakiraan BMKG belum tersedia.';
        daftar.append(kosong);
        return;
    }

    prakiraan.slice(0, 5).forEach((item, index) => {
        daftar.append(buatKartuPrakiraan(item, index));
    });
};

const tampilkanCuaca = (data) => {
    const cuaca = data?.cuaca;
    const lokasi = data?.lokasi;

    if (!cuaca) {
        throw new Error('Data cuaca tidak tersedia.');
    }

    if (lokasi?.nama) {
        tulisTeks('[data-cuaca-lokasi]', lokasi.nama);
    }

    if (Number.isFinite(Number(cuaca.suhu))) {
        tulisHtml('[data-cuaca-suhu]', `${Math.round(Number(cuaca.suhu))}<span>\u00b0C</span>`);
    }

    tulisTeks('[data-cuaca-deskripsi]', cuaca.deskripsi || 'Cuaca lokasi Anda');
    tulisTeks('[data-cuaca-tanggal]', cuaca.tanggal);

    if (Number.isFinite(Number(cuaca.kelembaban))) {
        tulisTeks('[data-cuaca-kelembaban]', `${Math.round(Number(cuaca.kelembaban))}%`);
    }

    if (Number.isFinite(Number(cuaca.angin))) {
        tulisHtml('[data-cuaca-angin]', `${Math.round(Number(cuaca.angin))} <span>km/jam</span>`);
    }

    if (Number.isFinite(Number(cuaca.peluang_hujan))) {
        tulisTeks('[data-cuaca-peluang-hujan]', `${Math.round(Number(cuaca.peluang_hujan))}%`);
    }

    pasangIkon(halamanCuaca?.querySelector('[data-cuaca-ikon]'), cuaca.ikon, cuaca.deskripsi);
    tampilkanPrakiraan(data?.prakiraan || []);
};

const tampilkanPesanError = () => {
    tulisTeks('[data-cuaca-deskripsi]', 'Izinkan lokasi');
    tulisTeks('[data-cuaca-tanggal]', 'Data cuaca mengikuti lokasi perangkat Anda.');
    tampilkanPrakiraan([]);
};

const mulaiHalamanCuaca = async () => {
    if (!halamanCuaca) {
        return;
    }

    try {
        const posisi = await ambilLokasiPerangkat();
        const latitude = posisi.coords.latitude.toFixed(4);
        const longitude = posisi.coords.longitude.toFixed(4);
        const lokasi = halamanCuaca.querySelector('[data-cuaca-lokasi]');

        if (lokasi) {
            lokasi.title = `Koordinat: ${latitude}, ${longitude}`;
        }

        const query = new URLSearchParams({
            lat: latitude,
            lng: longitude,
        });

        tampilkanCuaca(await ambilJson(`/api/cuaca-lokasi?${query.toString()}`));
    } catch (error) {
        tampilkanPesanError();
        console.info('Cuaca lokasi perangkat belum bisa dimuat.', error);
    }
};

mulaiHalamanCuaca();

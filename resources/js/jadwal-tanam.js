const daftarProses = document.querySelector('[data-daftar-proses]');
const progressBar = document.querySelector('[data-progress-bar]');
const progressTeks = document.querySelector('[data-progress-teks]');
const ringkasanStatus = document.querySelector('[data-ringkasan-status]');
const ringkasanTahap = document.querySelector('[data-ringkasan-tahap]');
const ringkasanDeskripsi = document.querySelector('[data-ringkasan-deskripsi]');
const ringkasanKalender = document.querySelector('[data-ringkasan-kalender]');
const inputTanggalSemai = document.querySelector('[data-tanggal-semai]');
const tombolReset = document.querySelector('[data-reset-jadwal]');
const kunciProgress = 'poktan:jadwal-tanam:proses-selesai';
const kunciTanggalSemai = 'poktan:jadwal-tanam:tanggal-semai';
const kunciTanggalSelesai = 'poktan:jadwal-tanam:tanggal-selesai';

const tahapanTanam = [
    {
        nama: 'Pembibitan',
        rentang: '0-21 Hari',
        catatan: 'Bibit lewat dari 25 hari akan menurunkan jumlah anakan produktif.',
        deskripsi: 'Waktu ideal: Benih disemai di lahan persemaian selama 15 hingga 21 hari. Pada rentang waktu ini, bibit biasanya sudah memiliki 3-4 helai daun sejati dan perakarannya cukup kuat namun belum kusut, sehingga siap beradaptasi di lahan utama.',
        detail: [],
        mulai: 0,
        akhir: 21,
        durasiSetelahProsesSebelumnya: 21,
        minimalHariSelesai: 14,
    },
    {
        nama: 'Penanaman',
        rentang: '15-21 Hari Setelah Semai',
        catatan: 'Tanam dangkal 1-2 cm agar tunas anakan mudah berkembang.',
        deskripsi: 'Waktu ideal: Segera setelah bibit dicabut dari persemaian, idealnya ditanam pada hari yang sama. Penggunaan sistem Jajar Legowo, misalnya 2:1 atau 4:1, sangat disarankan pada saat penanaman untuk memaksimalkan sirkulasi udara dan intensitas cahaya matahari.',
        detail: [],
        mulai: 15,
        akhir: 21,
        durasiSetelahProsesSebelumnya: 0,
        minimalHariSelesai: 60,
    },
    {
        nama: 'Perawatan Tanaman',
        rentang: '0-90 Hari Setelah Tanam',
        catatan: 'Seluruh rangkaian pemupukan harus selesai sebelum padi berbunga.',
        deskripsi: 'Waktu ideal pemupukan terbagi menjadi tiga titik kritis. Pengairan sebaiknya menggunakan sistem basah-kering sampai fase pengisian bulir selesai, bukan digenangi terus-menerus.',
        detail: [
            'Umur semingguan (7-10 hari setelah tanam): Fokus kasih pupuk Urea. Ini ibarat makanan pembuka biar daunnya cepat hijau dan akarnya cepat menjalar.',
            'Umur 3 sampai 4 mingguan (21-28 hari): Mulai campur dengan pupuk NPK. Tujuannya biar batang padinya kokoh, tidak gampang rebah kalau kena angin, dan akarnya makin banyak.',
            'Umur 1,5 bulanan (40-45 hari): Ini masa kritis karena padi lagi "bunting" (mau keluar malai). Perbanyak pupuk yang ada Kalium-nya. Kalium ini yang bikin isi gabahnya nanti padat, berat, dan tidak kopong.',
        ],
        mulaiSetelahTanam: 0,
        akhirSetelahTanam: 90,
        durasiSetelahProsesSebelumnya: 90,
    },
    {
        nama: 'Panen',
        rentang: '100-115 Hari Setelah Tanam',
        catatan: 'Jangan menunggu 100% kuning karena beras berisiko patah saat digiling.',
        deskripsi: 'Waktu ideal: Dilakukan pada 30-35 hari setelah padi berbunga merata, atau ketika 90% hingga 95% bulir padi pada malai sudah menguning, meskipun pangkal malai bagian bawah masih tampak sedikit hijau.',
        detail: [],
        mulaiSetelahTanam: 100,
        akhirSetelahTanam: 115,
        durasiSetelahProsesSebelumnya: 15,
    },
];

function formatInputTanggal(tanggal) {
    const tahun = tanggal.getFullYear();
    const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
    const hari = String(tanggal.getDate()).padStart(2, '0');

    return `${tahun}-${bulan}-${hari}`;
}

function ambilTanggalSemai() {
    return localStorage.getItem(kunciTanggalSemai) || formatInputTanggal(new Date());
}

function simpanTanggalSemai(tanggal) {
    localStorage.setItem(kunciTanggalSemai, tanggal);
}

function ambilTanggalSelesai() {
    try {
        const data = JSON.parse(localStorage.getItem(kunciTanggalSelesai) || '{}');

        return data && typeof data === 'object' ? data : {};
    } catch {
        return {};
    }
}

function simpanTanggalSelesai(index, tanggal) {
    const data = ambilTanggalSelesai();

    data[index] = tanggal;
    localStorage.setItem(kunciTanggalSelesai, JSON.stringify(data));
}

function hapusTanggalSelesai() {
    localStorage.removeItem(kunciTanggalSelesai);
}

function ambilJumlahSelesai() {
    const nilai = Number(localStorage.getItem(kunciProgress) || '0');

    if (!Number.isFinite(nilai)) {
        return 0;
    }

    return Math.min(Math.max(Math.floor(nilai), 0), tahapanTanam.length);
}

function simpanJumlahSelesai(jumlah) {
    localStorage.setItem(kunciProgress, String(Math.min(jumlah, tahapanTanam.length)));
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

function tambahHari(tanggalDasar, jumlahHari) {
    const tanggal = new Date(`${tanggalDasar}T00:00:00`);

    tanggal.setDate(tanggal.getDate() + jumlahHari);

    return tanggal;
}

function hitungSelisihHari(tanggalMulai, tanggalAkhir) {
    const mulai = new Date(`${tanggalMulai}T00:00:00`);
    const akhir = new Date(`${tanggalAkhir}T00:00:00`);
    const selisih = akhir.getTime() - mulai.getTime();

    return Math.floor(selisih / 86400000);
}

function formatTanggal(tanggal) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(tanggal);
}

function ambilTanggalMulaiProses(index, tanggalSemai, tanggalSelesai) {
    if (index === 0) {
        return tanggalSemai;
    }

    if (tanggalSelesai[index - 1]) {
        return tanggalSelesai[index - 1];
    }

    if (index === 1) {
        return formatInputTanggal(tambahHari(tanggalSemai, 21));
    }

    return tanggalSemai;
}

function cekBolehSelesai(tahap, index, tanggalSemai, tanggalSelesai) {
    const minimalHari = tahap.minimalHariSelesai ?? 0;

    if (minimalHari <= 0) {
        return {
            boleh: true,
            tanggalBoleh: null,
            sisaHari: 0,
        };
    }

    const tanggalMulai = ambilTanggalMulaiProses(index, tanggalSemai, tanggalSelesai);
    const hariBerjalan = hitungSelisihHari(tanggalMulai, formatInputTanggal(new Date()));
    const sisaHari = Math.max(minimalHari - hariBerjalan, 0);

    return {
        boleh: hariBerjalan >= minimalHari,
        tanggalBoleh: formatTanggal(tambahHari(tanggalMulai, minimalHari)),
        sisaHari,
    };
}

function hitungRentangIdeal(tahap, tanggalSemai) {
    const tanggalTanam = formatInputTanggal(tambahHari(tanggalSemai, 21));
    const tanggalAcuan = tahap.mulaiSetelahTanam !== undefined ? tanggalTanam : tanggalSemai;
    const mulai = tahap.mulaiSetelahTanam ?? tahap.mulai ?? 0;
    const akhir = tahap.akhirSetelahTanam ?? tahap.akhir ?? mulai;

    return `${formatTanggal(tambahHari(tanggalAcuan, mulai))} - ${formatTanggal(tambahHari(tanggalAcuan, akhir))}`;
}

function hitungRentangTanggal(tahap, tanggalSemai, index, tanggalSelesai = ambilTanggalSelesai()) {
    if (tanggalSelesai[index]) {
        return `Selesai: ${formatTanggal(tambahHari(tanggalSelesai[index], 0))}`;
    }

    if (index > 0 && tanggalSelesai[index - 1]) {
        const mulai = tanggalSelesai[index - 1];
        const durasi = tahap.durasiSetelahProsesSebelumnya ?? 0;

        if (durasi <= 0) {
            return `Mulai: ${formatTanggal(tambahHari(mulai, 0))}`;
        }

        return `${formatTanggal(tambahHari(mulai, 0))} - ${formatTanggal(tambahHari(mulai, durasi))}`;
    }

    return hitungRentangIdeal(tahap, tanggalSemai);
}

function labelStatus(index, jumlahSelesai) {
    if (index < jumlahSelesai) {
        return 'Selesai';
    }

    if (index === jumlahSelesai) {
        return 'Aktif';
    }

    return 'Menunggu';
}

function statusKelas(label) {
    return label.toLowerCase();
}

function renderRingkasan(jumlahSelesai) {
    const semuaSelesai = jumlahSelesai >= tahapanTanam.length;
    const indexAktif = Math.min(jumlahSelesai, tahapanTanam.length - 1);
    const tahapAktif = tahapanTanam[indexAktif];
    const tanggalSemai = ambilTanggalSemai();
    const tanggalSelesai = ambilTanggalSelesai();

    if (ringkasanStatus) {
        ringkasanStatus.textContent = semuaSelesai ? 'Semua proses selesai' : 'Proses aktif';
    }

    if (ringkasanTahap) {
        ringkasanTahap.textContent = semuaSelesai ? 'Jadwal Selesai' : tahapAktif.nama;
    }

    if (ringkasanDeskripsi) {
        ringkasanDeskripsi.textContent = semuaSelesai
            ? 'Tahapan tanam padi sudah selesai sampai panen.'
            : tahapAktif.catatan;
    }

    if (ringkasanKalender) {
        ringkasanKalender.textContent = `Perkiraan ${tahapAktif.nama}: ${hitungRentangTanggal(tahapAktif, tanggalSemai, indexAktif, tanggalSelesai)}`;
    }
}

function renderProgress(jumlahSelesai) {
    const persen = (jumlahSelesai / tahapanTanam.length) * 100;

    if (progressBar) {
        progressBar.style.width = `${persen}%`;
    }

    if (progressTeks) {
        progressTeks.textContent = `${jumlahSelesai} dari ${tahapanTanam.length} selesai`;
    }

    if (tombolReset) {
        tombolReset.hidden = jumlahSelesai === 0;
    }
}

function renderDetailProses(tahap) {
    if (tahap.detail.length === 0) {
        return null;
    }

    const daftarDetail = buatElemen('ul', 'detail-proses');

    tahap.detail.forEach((item) => {
        daftarDetail.appendChild(buatElemen('li', '', item));
    });

    return daftarDetail;
}

function renderKartuProses(tahap, index, jumlahSelesai) {
    const status = labelStatus(index, jumlahSelesai);
    const kelasStatus = statusKelas(status);
    const kartu = buatElemen('article', `kartu-proses ${kelasStatus}`);
    const nomor = buatElemen('span', 'nomor-proses', index < jumlahSelesai ? 'OK' : String(index + 1).padStart(2, '0'));
    const isi = buatElemen('div', 'isi-proses');
    const baris = buatElemen('div', 'baris-proses');
    const judul = buatElemen('h2', '', tahap.nama);
    const label = buatElemen('span', `label-status ${kelasStatus}`, status);
    const meta = buatElemen('div', 'meta-proses');
    const detail = renderDetailProses(tahap);
    const tanggalSemai = ambilTanggalSemai();
    const tanggalSelesai = ambilTanggalSelesai();
    const bolehSelesai = cekBolehSelesai(tahap, index, tanggalSemai, tanggalSelesai);

    baris.append(judul, label);
    meta.append(
        buatElemen('span', '', tahap.rentang),
        buatElemen('span', '', hitungRentangTanggal(tahap, tanggalSemai, index, tanggalSelesai))
    );
    isi.append(
        baris,
        meta,
        buatElemen('strong', 'catatan-proses', tahap.catatan),
        buatElemen('p', '', tahap.deskripsi)
    );

    if (detail) {
        isi.appendChild(detail);
    }

    if (index === jumlahSelesai && jumlahSelesai < tahapanTanam.length) {
        const tombolSelesai = buatElemen('button', 'tombol-selesai', 'Selesai');

        tombolSelesai.type = 'button';
        tombolSelesai.addEventListener('click', () => {
            if (!bolehSelesai.boleh) {
                const lanjutkan = window.confirm(
                    `Peringatan: ${tahap.nama} belum sesuai hari ideal. Minimal ${tahap.minimalHariSelesai} hari dan idealnya selesai pada ${bolehSelesai.tanggalBoleh}. Tetap tandai proses ini selesai?`
                );

                if (!lanjutkan) {
                    return;
                }
            }

            simpanTanggalSelesai(index, formatInputTanggal(new Date()));
            simpanJumlahSelesai(jumlahSelesai + 1);
            renderJadwal();
        });
        isi.appendChild(tombolSelesai);

        if (!bolehSelesai.boleh) {
            isi.appendChild(
                buatElemen(
                    'span',
                    'peringatan-proses',
                    `Peringatan: belum sesuai hari ideal. Minimal ${tahap.minimalHariSelesai} hari, idealnya selesai pada ${bolehSelesai.tanggalBoleh}.`
                )
            );
        }
    }

    if (index < jumlahSelesai) {
        const teksSelesai = tanggalSelesai[index]
            ? `Selesai pada ${formatTanggal(tambahHari(tanggalSelesai[index], 0))}`
            : 'Proses sudah dilaksanakan';

        isi.appendChild(buatElemen('span', 'teks-selesai', teksSelesai));
    }

    kartu.append(nomor, isi);

    return kartu;
}

function renderJadwal() {
    if (!daftarProses) {
        return;
    }

    const jumlahSelesai = ambilJumlahSelesai();
    const tanggalSemai = ambilTanggalSemai();

    if (inputTanggalSemai) {
        inputTanggalSemai.value = tanggalSemai;
    }

    daftarProses.innerHTML = '';
    tahapanTanam.forEach((tahap, index) => {
        daftarProses.appendChild(renderKartuProses(tahap, index, jumlahSelesai));
    });
    renderProgress(jumlahSelesai);
    renderRingkasan(jumlahSelesai);
}

tombolReset?.addEventListener('click', () => {
    simpanJumlahSelesai(0);
    hapusTanggalSelesai();
    renderJadwal();
});

inputTanggalSemai?.addEventListener('change', () => {
    if (!inputTanggalSemai.value) {
        return;
    }

    simpanTanggalSemai(inputTanggalSemai.value);
    renderJadwal();
});

renderJadwal();

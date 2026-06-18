const kunciFotoProfile = 'poktan-profile-foto';
const kunciLokasiDashboard = 'poktan-dashboard-lokasi';
const inputFotoProfile = document.querySelector('[data-input-foto-profile]');
const avatarProfile = document.querySelector('[data-avatar-profile]');
const tombolPilihFoto = document.querySelector('[data-pilih-foto-profile]');
const statusFotoProfile = document.querySelector('[data-status-foto-profile]');
const lokasiProfile = document.querySelector('[data-profile-lokasi]');

const tulisStatusFoto = (pesan) => {
    if (statusFotoProfile) {
        statusFotoProfile.textContent = pesan;
    }
};

const simpanFotoProfile = (dataUrl) => {
    try {
        localStorage.setItem(kunciFotoProfile, dataUrl);
    } catch (error) {
        tulisStatusFoto('Foto tampil, tetapi tidak dapat disimpan di browser.');
    }
};

const tulisLokasiProfile = (namaLokasi) => {
    if (lokasiProfile && namaLokasi) {
        lokasiProfile.textContent = namaLokasi;
    }
};

const simpanLokasiDashboard = (lokasi) => {
    if (!lokasi?.nama) {
        return;
    }

    try {
        localStorage.setItem(kunciLokasiDashboard, JSON.stringify({
            nama: lokasi.nama,
            lat: lokasi.lat ?? null,
            lng: lokasi.lng ?? null,
            diperbaruiPada: Date.now(),
        }));
    } catch (error) {
        console.info('Lokasi profile belum bisa disimpan.', error);
    }
};

const bacaLokasiDashboard = () => {
    try {
        const lokasiTersimpan = localStorage.getItem(kunciLokasiDashboard);

        if (!lokasiTersimpan) {
            return null;
        }

        return JSON.parse(lokasiTersimpan);
    } catch (error) {
        return null;
    }
};

const ambilLokasiPerangkat = () => new Promise((resolve, reject) => {
    if (!window.isSecureContext || !navigator.geolocation) {
        reject(new Error('Lokasi perangkat tidak tersedia.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 10000,
    });
});

const ambilLokasiProfile = async () => {
    if (!lokasiProfile) {
        return;
    }

    const lokasiTersimpan = bacaLokasiDashboard();

    if (lokasiTersimpan?.nama) {
        tulisLokasiProfile(lokasiTersimpan.nama);
        return;
    }

    try {
        const posisi = await ambilLokasiPerangkat();
        const query = new URLSearchParams({
            lat: posisi.coords.latitude.toFixed(4),
            lng: posisi.coords.longitude.toFixed(4),
        });
        const response = await fetch(`/api/cuaca-lokasi?${query.toString()}`, {
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Lokasi profile belum bisa dimuat.');
        }

        const data = await response.json();

        if (data?.lokasi?.nama) {
            tulisLokasiProfile(data.lokasi.nama);
            simpanLokasiDashboard(data.lokasi);
        }
    } catch (error) {
        console.info('Lokasi profile memakai teks bawaan.', error);
    }
};

const kecilkanFoto = (file) => new Promise((resolve, reject) => {
    const pembaca = new FileReader();

    pembaca.addEventListener('load', () => {
        const gambar = new Image();

        gambar.addEventListener('load', () => {
            const ukuranMaksimal = 900;
            const rasio = Math.min(ukuranMaksimal / gambar.width, ukuranMaksimal / gambar.height, 1);
            const lebar = Math.max(1, Math.round(gambar.width * rasio));
            const tinggi = Math.max(1, Math.round(gambar.height * rasio));
            const kanvas = document.createElement('canvas');
            const konteks = kanvas.getContext('2d');

            if (!konteks) {
                reject(new Error('Canvas tidak tersedia.'));
                return;
            }

            kanvas.width = lebar;
            kanvas.height = tinggi;
            konteks.drawImage(gambar, 0, 0, lebar, tinggi);
            resolve(kanvas.toDataURL('image/jpeg', 0.86));
        });

        gambar.addEventListener('error', () => {
            reject(new Error('Foto tidak dapat dibaca.'));
        });

        gambar.src = pembaca.result;
    });

    pembaca.addEventListener('error', () => {
        reject(new Error('Foto tidak dapat dibaca.'));
    });

    pembaca.readAsDataURL(file);
});

if (inputFotoProfile && avatarProfile) {
    try {
        const fotoTersimpan = localStorage.getItem(kunciFotoProfile);

        if (fotoTersimpan) {
            avatarProfile.src = fotoTersimpan;
        }
    } catch (error) {
        tulisStatusFoto('Penyimpanan foto browser tidak tersedia.');
    }

    tombolPilihFoto?.addEventListener('click', () => {
        inputFotoProfile.click();
    });

    inputFotoProfile.addEventListener('change', async () => {
        const file = inputFotoProfile.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            tulisStatusFoto('File harus berupa gambar.');
            inputFotoProfile.value = '';
            return;
        }

        try {
            const foto = await kecilkanFoto(file);
            avatarProfile.src = foto;
            simpanFotoProfile(foto);
            tulisStatusFoto('Foto profile diperbarui.');
        } catch (error) {
            tulisStatusFoto('Gagal memuat foto profile.');
        } finally {
            inputFotoProfile.value = '';
        }
    });
}

ambilLokasiProfile();

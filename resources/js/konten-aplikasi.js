const contentKey = 'poktan:admin:konten-aplikasi';
const defaultImages = {
    Edukasi: '/assets/edukasi/tumbuhnya_benih_di_tray_kebun.png',
    'Hama & Penyakit': '/assets/hama-penyakit/serangga_hijau_di_atas_daun.png',
};

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function readContents() {
    try {
        const value = JSON.parse(localStorage.getItem(contentKey) || '[]');

        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function normalizeLink(value) {
    const text = String(value || '').trim();

    if (!text) {
        return '#';
    }

    if (/^(https?:\/\/|\/|#)/i.test(text)) {
        return text;
    }

    return `https://${text}`;
}

function linkTargetAttributes(link) {
    return /^https?:\/\//i.test(link) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function articleIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
            <path d="M7 3h8l4 4v14H7z"></path>
            <path d="M15 3v5h5"></path>
            <path d="M10 13h7"></path>
            <path d="M10 17h7"></path>
        </svg>
    `;
}

function videoIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M10 8l6 4-6 4z"></path>
        </svg>
    `;
}

function arrowIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"></path>
        </svg>
    `;
}

function renderEducationCard(content) {
    const title = escapeHtml(content.title || 'Konten Edukasi');
    const type = escapeHtml(content.type || 'Artikel');
    const isVideo = String(content.type || '').toLowerCase().includes('video');
    const link = normalizeLink(content.link);

    return `
        <a class="kartu-artikel kartu-artikel-tautan" href="${escapeHtml(link)}"${linkTargetAttributes(link)} aria-label="Buka ${title}">
            <img
                src="${escapeHtml(content.image || defaultImages.Edukasi)}"
                alt="${title}"
                class="gambar-artikel"
            >

            <div class="isi-artikel">
                <div class="baris-judul-artikel">
                    <h3 class="judul-artikel">${title}</h3>

                    <span class="label-jenis ${isVideo ? 'label-video' : 'label-artikel'}">
                        ${isVideo ? videoIcon() : articleIcon()}
                        ${type}
                    </span>
                </div>

                <p class="deskripsi-artikel">
                    ${escapeHtml(content.description || 'Buka konten dari admin untuk membaca informasi lengkap.')}
                </p>
            </div>

            <span class="panah-kartu" aria-hidden="true">
                ${arrowIcon()}
            </span>
        </a>
    `;
}

function renderPestCard(content) {
    const title = escapeHtml(content.title || 'Konten Hama & Penyakit');
    const link = normalizeLink(content.link);

    return `
        <a class="kartu-masalah kartu-masalah-tautan" href="${escapeHtml(link)}"${linkTargetAttributes(link)} aria-label="Buka ${title}">
            <img
                src="${escapeHtml(content.image || defaultImages['Hama & Penyakit'])}"
                alt="${title}"
                class="gambar-masalah"
            >

            <div class="isi-masalah">
                <h3>${title}</h3>
                <p>
                    ${escapeHtml(content.description || 'Buka konten dari admin untuk melihat detail solusi.')}
                </p>
            </div>

            <span class="tautan-solusi">
                ${escapeHtml(content.type || 'Lihat Solusi')}
                ${arrowIcon()}
            </span>
        </a>
    `;
}

function renderPageContents() {
    const page = document.querySelector('[data-admin-content-page]')?.dataset.adminContentPage;
    const list = document.querySelector('[data-admin-content-list]');

    if (!page || !list) {
        return;
    }

    const contents = readContents().filter((content) => content.category === page);

    if (contents.length === 0) {
        return;
    }

    const html = contents
        .map((content) => (page === 'Hama & Penyakit' ? renderPestCard(content) : renderEducationCard(content)))
        .join('');

    list.insertAdjacentHTML('afterbegin', html);
}

renderPageContents();

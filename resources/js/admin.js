const keys = {
    users: 'poktan:admin:pengguna',
    products: 'poktan:marketplace:produk',
    fertilizers: 'poktan:pupuk:produk',
    orders: 'poktan-riwayat-pupuk',
    notifications: 'poktan:admin:notifikasi',
    appContents: 'poktan:admin:konten-aplikasi',
    settings: 'poktan:admin:pengaturan',
    adminAccount: 'poktan:admin:akun',
    session: 'poktan:session',
};

const productDefaultImage = '/assets/marketplace/karung_padi_dengan_beras_dan_daun.png';
const fertilizerDefaultImage = '/assets/pupuk/tas_pupuk_urea_dengan_granula.png';
const contentDefaultImages = {
    Edukasi: '/assets/edukasi/tumbuhnya_benih_di_tray_kebun.png',
    'Hama & Penyakit': '/assets/hama-penyakit/serangga_hijau_di_atas_daun.png',
};
const maxFertilizerImageSize = 1.5 * 1024 * 1024;
const maxContentImageSize = 1.5 * 1024 * 1024;
const sampleProductIds = new Set(['produk-default-karung-padi']);
const plantingKeys = {
    progress: 'poktan:jadwal-tanam:proses-selesai',
    seedDate: 'poktan:jadwal-tanam:tanggal-semai',
    finishDates: 'poktan:jadwal-tanam:tanggal-selesai',
};
const plantingStages = ['Pembibitan', 'Penanaman', 'Perawatan Tanaman', 'Panen'];
const userRoleFilters = ['Petani', 'Pembeli'];
const paymentMethods = ['Tunai', 'Transfer', 'QRIS'];

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function readJson(key, fallback = []) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

        return Array.isArray(fallback) ? (Array.isArray(value) ? value : fallback) : { ...fallback, ...value };
    } catch {
        localStorage.setItem(key, JSON.stringify(fallback));

        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function parseNumber(value) {
    const text = String(value || '').trim().replace(/\s/g, '');

    if (!text) {
        return 0;
    }

    if (text.includes(',')) {
        return Number.parseFloat(text.replace(/\./g, '').replace(',', '.'));
    }

    if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
        return Number.parseFloat(text.replace(/\./g, ''));
    }

    return Number.parseFloat(text);
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return '0';
    }

    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
}

function formatRupiah(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
        return '-';
    }

    return rupiahFormatter.format(number);
}

function formatDateText(value) {
    if (!value) {
        return '-';
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return dateFormatter.format(date);
}

function normalizeLink(value) {
    const text = String(value || '').trim();

    if (!text) {
        return '';
    }

    if (/^(https?:\/\/|\/|#)/i.test(text)) {
        return text;
    }

    return `https://${text}`;
}

function normalizeImageSource(value) {
    const text = String(value || '').trim();

    if (!text) {
        return '';
    }

    return text;
}

function newId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function productKey(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function defaultFertilizerCatalog() {
    return [
        { id: productKey('Urea'), nama: 'Urea' },
        { id: productKey('NPK 16-16-16'), nama: 'NPK 16-16-16' },
        { id: productKey('Pupuk Organik'), nama: 'Pupuk Organik' },
        { id: productKey('KCL'), nama: 'KCL' },
    ];
}

function getFertilizerCatalog() {
    const catalog = new Map();

    defaultFertilizerCatalog().forEach((item) => {
        catalog.set(item.id, item);
    });

    getFertilizers().forEach((item) => {
        const id = productKey(item.nama);

        if (id) {
            catalog.set(id, { id, nama: item.nama });
        }
    });

    return Array.from(catalog.values());
}

function statusClass(status) {
    return `status-${String(status || '').toLowerCase()}`;
}

function statusBadge(status) {
    return `<span class="status-pill ${statusClass(status)}">${escapeHtml(status || '-')}</span>`;
}

function showToast(message) {
    const toastElement = qs('[data-admin-toast]');
    const toastBody = qs('[data-admin-toast-body]');

    if (!toastElement || !window.bootstrap) {
        return;
    }

    if (toastBody) {
        toastBody.textContent = message;
    }

    window.bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

function getProducts() {
    const products = readJson(keys.products, []).filter((item) => !sampleProductIds.has(item.id));

    writeJson(keys.products, products);

    return products;
}

function getFertilizers() {
    return readJson(keys.fertilizers, []);
}

function normalizeFertilizerOrder(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const fallbackItems = order.produk ? [{
        nama: order.produk,
        jumlah: Number(order.jumlah || 0),
        harga: Number(order.harga || 0),
    }] : [];

    return {
        id: order.id || newId('pesanan-pupuk'),
        tanggal: order.tanggal || order.waktu || '-',
        metode: order.metode || 'Tunai',
        petani: order.petani || order.namaPetani || order.namaPembeli || 'Petani',
        status: order.status || 'menunggu',
        total: Number(order.total ?? order.totalBayar ?? 0),
        items: items.length > 0 ? items : fallbackItems,
    };
}

function getOrders() {
    const orders = readJson(keys.orders, []).map(normalizeFertilizerOrder);

    writeJson(keys.orders, orders);

    return orders;
}

function setProducts(products) {
    writeJson(keys.products, products);
}

function setFertilizers(fertilizers) {
    writeJson(keys.fertilizers, fertilizers);
}

function setOrders(orders) {
    writeJson(keys.orders, orders);
}

function defaultUsers() {
    return [
        {
            id: 'contoh-petani-muchsin',
            name: 'Pak Muchsin',
            phone: '081234567890',
            role: 'Petani',
            nik: '1401010101010001',
            warehouseName: '',
            address: 'Lancang Kuning, Kab. Sleman, Daerah Istimewa Yogyakarta',
            landAreaMeter: 2500,
            fertilizerLimits: {
                [productKey('Urea')]: 5,
                [productKey('NPK 16-16-16')]: 3,
                [productKey('Pupuk Organik')]: 4,
                [productKey('KCL')]: 2,
            },
            status: 'Aktif',
            password: 'petani123',
            passwordUpdatedAt: '2026-06-16T00:00:00.000Z',
        },
        {
            id: 'contoh-pembeli-lancang',
            name: 'Pembeli Lancang',
            phone: '082233445566',
            role: 'Pembeli',
            nik: '',
            warehouseName: 'Gudang Lancang Makmur',
            address: 'Jl. Gudang Padi No. 7, Lancang Kuning, Kab. Sleman',
            landAreaMeter: 0,
            fertilizerLimits: {},
            status: 'Aktif',
            password: 'pembeli123',
            passwordUpdatedAt: '2026-06-16T00:00:00.000Z',
        },
    ];
}

function normalizeFertilizerLimits(user) {
    if (user.fertilizerLimits && typeof user.fertilizerLimits === 'object' && !Array.isArray(user.fertilizerLimits)) {
        return user.fertilizerLimits;
    }

    const legacyLimit = Number(user.fertilizerLimit || 0);

    if (!Number.isFinite(legacyLimit) || legacyLimit <= 0) {
        return {};
    }

    return Object.fromEntries(getFertilizerCatalog().map((item) => [item.id, legacyLimit]));
}

function normalizeUser(user) {
    const sample = defaultUsers().find((item) => item.id === user.id) || {};
    const hasLandArea = user.landAreaMeter !== undefined && user.landAreaMeter !== null;

    return {
        ...user,
        landAreaMeter: Number(hasLandArea ? user.landAreaMeter : sample.landAreaMeter || 0) || 0,
        fertilizerLimits: user.fertilizerLimits ? normalizeFertilizerLimits(user) : sample.fertilizerLimits || normalizeFertilizerLimits(user),
    };
}

function getUsers() {
    if (localStorage.getItem(keys.users) === null) {
        const users = defaultUsers();

        setUsers(users);
        return users;
    }

    const users = readJson(keys.users, []).map(normalizeUser);

    writeJson(keys.users, users);

    return users;
}

function setUsers(users) {
    writeJson(keys.users, users);
}

function addSampleUsers() {
    const users = getUsers();
    const existingIds = new Set(users.map((user) => user.id));
    const samples = defaultUsers().filter((user) => !existingIds.has(user.id));

    if (samples.length === 0) {
        showToast('Contoh petani dan pembeli sudah ada.');
        return;
    }

    setUsers([...samples, ...users]);
    renderAll();
    showToast('Contoh petani dan pembeli ditambahkan.');
}

function getNotifications() {
    return readJson(keys.notifications, []);
}

function setNotifications(notifications) {
    writeJson(keys.notifications, notifications);
}

function normalizeContent(content) {
    const category = content.category === 'Hama & Penyakit' ? 'Hama & Penyakit' : 'Edukasi';

    return {
        id: content.id || newId('konten'),
        category,
        title: content.title || content.judul || '',
        type: content.type || content.jenis || (category === 'Hama & Penyakit' ? 'Solusi' : 'Artikel'),
        description: content.description || content.deskripsi || '',
        image: normalizeImageSource(content.image || content.gambar || ''),
        link: normalizeLink(content.link || content.url || ''),
        createdAt: content.createdAt || new Date().toISOString(),
    };
}

function getContents() {
    const contents = readJson(keys.appContents, []).map(normalizeContent);

    writeJson(keys.appContents, contents);

    return contents;
}

function setContents(contents) {
    writeJson(keys.appContents, contents.map(normalizeContent));
}

function defaultSettings() {
    return {
        appName: 'POKTAN Lancang Kuning',
        location: 'Lancang Kuning, Kab. Sleman',
        marketplace: 'Aktif',
        buyerPayment: 'Aktif',
        farmerPayment: 'Aktif',
        buyerPaymentDisabledMethods: [],
        farmerPaymentDisabledMethods: [],
        maintenance: 'Nonaktif',
        maintenanceMessage: 'Aplikasi sedang dalam perawatan. Silakan coba lagi nanti.',
        note: 'Kelola data aplikasi dengan teliti sebelum digunakan di lapangan.',
    };
}

function getSettings() {
    return readJson(keys.settings, defaultSettings());
}

function setSettings(settings) {
    writeJson(keys.settings, settings);
}

function defaultAdminAccount() {
    return {
        username: 'admin',
        name: 'Admin Lancang Kuning',
        password: 'admin123',
        passwordUpdatedAt: '',
    };
}

function getAdminAccount() {
    return readJson(keys.adminAccount, defaultAdminAccount());
}

function setAdminAccount(account) {
    writeJson(keys.adminAccount, { ...defaultAdminAccount(), ...account });
}

function normalizeDisabledPaymentMethods(settings, legacyKey, disabledKey) {
    if (Array.isArray(settings[disabledKey])) {
        return settings[disabledKey].filter((method) => paymentMethods.includes(method));
    }

    return settings[legacyKey] === 'Nonaktif' ? [...paymentMethods] : [];
}

function readDisabledPaymentMethods(group) {
    return qsa(`[data-admin-payment-enabled="${group}"]`)
        .filter((input) => !input.checked)
        .map((input) => input.value)
        .filter((method) => paymentMethods.includes(method));
}

function setPaymentMethodSwitches(group, disabledMethods = []) {
    qsa(`[data-admin-payment-enabled="${group}"]`).forEach((input) => {
        input.checked = !disabledMethods.includes(input.value);
        updateSettingSwitch(input);
    });
}

function updateSettingSwitch(input, statusText = null) {
    const container = input?.closest('.setting-switch');
    const state = container?.querySelector('[data-setting-switch-state]');

    if (!container || !state) {
        return;
    }

    container.classList.toggle('is-active', input.checked);
    state.textContent = statusText || (input.checked ? 'Aktif' : 'Nonaktif');
}

function renderStats() {
    const users = getUsers();
    const products = getProducts();
    const fertilizers = getFertilizers();
    const orders = getOrders();
    const settings = getSettings();

    qs('[data-stat-petani]').textContent = users.filter((item) => item.role === 'Petani').length;
    qs('[data-stat-pembeli]').textContent = users.filter((item) => item.role === 'Pembeli').length;
    qs('[data-stat-produk]').textContent = products.length;
    qs('[data-stat-pupuk]').textContent = fertilizers.length;
    qs('[data-stat-pesanan]').textContent = orders.length;

    const statusMarketplace = qs('[data-status-marketplace]');
    if (statusMarketplace) {
        statusMarketplace.textContent = settings.marketplace || 'Aktif';
        statusMarketplace.className = settings.marketplace === 'Aktif' ? 'text-success' : 'text-warning';
    }
}

function emptyRow(colspan, message) {
    return `<tr><td class="empty-row" colspan="${colspan}">${escapeHtml(message)}</td></tr>`;
}

function formatFertilizerLimitSummary(limits = {}) {
    const activeLimits = getFertilizerCatalog()
        .map((item) => ({
            name: item.nama,
            limit: Number(limits[item.id] || 0),
        }))
        .filter((item) => Number.isFinite(item.limit) && item.limit > 0);

    if (activeLimits.length === 0) {
        return 'Belum dibatasi';
    }

    const visible = activeLimits.slice(0, 3).map((item) => `${escapeHtml(item.name)} ${formatNumber(item.limit)}`);
    const rest = activeLimits.length > 3 ? ` +${activeLimits.length - 3} produk` : '';

    return `Batas: ${visible.join(', ')}${rest}`;
}

function getActiveUserRole() {
    const activeButton = qs('[data-admin-user-filter].active');
    const role = activeButton?.dataset.adminUserFilter || qs('[data-admin-user-role]')?.value || 'Petani';

    return userRoleFilters.includes(role) ? role : 'Petani';
}

function updateUserFilterUi(role = getActiveUserRole()) {
    const nextRole = userRoleFilters.includes(role) ? role : 'Petani';
    const roleInput = qs('[data-admin-user-role]');
    const listTitle = qs('[data-admin-user-list-title]');
    const formTitle = qs('[data-admin-user-form-title]');
    const editingUserId = qs('[data-admin-user-id]')?.value;

    qsa('[data-admin-user-filter]').forEach((button) => {
        const isActive = button.dataset.adminUserFilter === nextRole;

        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (roleInput) {
        roleInput.value = nextRole;
    }

    if (listTitle) {
        listTitle.textContent = `Daftar ${nextRole}`;
    }

    if (formTitle && !editingUserId) {
        formTitle.textContent = `Tambah ${nextRole}`;
    }
}

function setActiveUserRole(role) {
    updateUserFilterUi(role);
    updateUserRoleFields();
    renderUsers();
}

function renderUsers() {
    const tbody = qs('[data-admin-users]');
    const role = getActiveUserRole();
    const users = getUsers().filter((user) => user.role === role);

    if (!tbody) {
        return;
    }

    if (users.length === 0) {
        tbody.innerHTML = emptyRow(7, `Belum ada ${role.toLowerCase()}. Tambahkan ${role.toLowerCase()} dari form di samping.`);
        return;
    }

    tbody.innerHTML = users.map((user) => `
        <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.phone)}</td>
            <td>
                ${user.role === 'Petani' ? `<strong>NIK:</strong> ${escapeHtml(user.nik || '-')}` : ''}
                ${user.role === 'Pembeli' ? `<strong>Gudang:</strong> ${escapeHtml(user.warehouseName || '-')}` : ''}
                <div class="text-secondary small">${escapeHtml(user.address || 'Alamat belum diisi')}</div>
            </td>
            <td>
                ${user.role === 'Petani' ? `
                    <div>${formatNumber(user.landAreaMeter || 0)} meter</div>
                    <div class="text-success small fw-bold">
                        ${formatFertilizerLimitSummary(user.fertilizerLimits)}
                    </div>
                ` : '<span class="text-secondary">Tidak berlaku</span>'}
            </td>
            <td>${statusBadge(user.status)}</td>
            <td>
                <span class="badge ${user.password ? 'text-bg-success' : 'text-bg-secondary'}">
                    ${user.password ? 'Diatur' : 'Belum'}
                </span>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" type="button" data-edit-user="${escapeHtml(user.id)}">Edit</button>
                    <button class="btn btn-outline-danger" type="button" data-delete-user="${escapeHtml(user.id)}">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getPlantingProgressSnapshot() {
    const savedProgress = Number(localStorage.getItem(plantingKeys.progress) || '0');
    const completed = Number.isFinite(savedProgress)
        ? Math.min(Math.max(Math.floor(savedProgress), 0), plantingStages.length)
        : 0;
    let finishDates = {};

    try {
        const parsedFinishDates = JSON.parse(localStorage.getItem(plantingKeys.finishDates) || '{}');

        finishDates = parsedFinishDates && typeof parsedFinishDates === 'object' && !Array.isArray(parsedFinishDates)
            ? parsedFinishDates
            : {};
    } catch {
        finishDates = {};
    }

    const allDone = completed >= plantingStages.length;
    const activeStage = allDone ? 'Selesai Panen' : plantingStages[completed];

    return {
        completed,
        activeStage,
        finishDates,
        percent: Math.round((completed / plantingStages.length) * 100),
        seedDate: localStorage.getItem(plantingKeys.seedDate) || '',
        status: allDone ? 'selesai' : completed > 0 ? 'aktif' : 'menunggu',
    };
}

function formatFinishDateSummary(finishDates = {}) {
    const summaries = plantingStages
        .map((stage, index) => ({ stage, date: finishDates[index] }))
        .filter((item) => item.date)
        .map((item) => `${escapeHtml(item.stage)}: ${escapeHtml(formatDateText(item.date))}`);

    return summaries.length > 0 ? summaries.join('<br>') : '-';
}

function renderPlantingProgress() {
    const tbody = qs('[data-admin-planting-progress]');
    const count = qs('[data-admin-planting-count]');
    const farmers = getUsers().filter((user) => user.role === 'Petani');
    const progress = getPlantingProgressSnapshot();

    if (count) {
        count.textContent = `${farmers.length} petani`;
    }

    if (!tbody) {
        return;
    }

    if (farmers.length === 0) {
        tbody.innerHTML = emptyRow(7, 'Belum ada data petani untuk dipantau.');
        return;
    }

    tbody.innerHTML = farmers.map((farmer) => `
        <tr>
            <td>
                <strong>${escapeHtml(farmer.name)}</strong>
                <div class="text-secondary small">${escapeHtml(farmer.phone || '-')}</div>
            </td>
            <td>${formatNumber(farmer.landAreaMeter || 0)} meter</td>
            <td>
                <strong>${escapeHtml(progress.activeStage)}</strong>
                <div class="text-secondary small">${progress.completed} dari ${plantingStages.length} proses selesai</div>
            </td>
            <td style="min-width: 150px;">
                <div class="d-flex justify-content-between small mb-1">
                    <span>${progress.percent}%</span>
                    <span>${progress.completed}/${plantingStages.length}</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${progress.percent}%;" aria-valuenow="${progress.percent}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td>${escapeHtml(formatDateText(progress.seedDate))}</td>
            <td class="small">${formatFinishDateSummary(progress.finishDates)}</td>
            <td>${statusBadge(progress.status)}</td>
        </tr>
    `).join('');
}

function renderUserFertilizerLimits(limits = {}) {
    const container = qs('[data-admin-user-fertilizer-limits]');

    if (!container) {
        return;
    }

    const catalog = getFertilizerCatalog();

    if (catalog.length === 0) {
        container.innerHTML = '<div class="text-secondary small">Belum ada produk pupuk.</div>';
        return;
    }

    container.innerHTML = catalog.map((item) => `
        <label class="input-group input-group-sm">
            <span class="input-group-text">${escapeHtml(item.nama)}</span>
            <input
                class="form-control"
                type="text"
                inputmode="numeric"
                placeholder="0"
                value="${escapeHtml(formatNumber(limits[item.id] || 0))}"
                data-admin-user-fertilizer-limit
                data-product-id="${escapeHtml(item.id)}"
            >
            <span class="input-group-text">paket</span>
        </label>
    `).join('');
}

function readUserFertilizerLimits() {
    const limits = {};

    qsa('[data-admin-user-fertilizer-limit]').forEach((input) => {
        const value = parseNumber(input.value);

        if (value > 0) {
            limits[input.dataset.productId] = value;
        }
    });

    return limits;
}

function resetUserForm() {
    const role = getActiveUserRole();

    qs('[data-admin-user-form]')?.reset();
    qs('[data-admin-user-id]').value = '';
    qs('[data-admin-user-role]').value = role;
    qs('[data-admin-user-nik]').value = '';
    qs('[data-admin-user-warehouse]').value = '';
    qs('[data-admin-user-address]').value = '';
    qs('[data-admin-user-land-area]').value = '';
    renderUserFertilizerLimits({});
    qs('[data-admin-user-password]').value = '';
    qs('[data-admin-user-password-confirmation]').value = '';
    qs('[data-admin-user-form-title]').textContent = `Tambah ${role}`;
    updateUserRoleFields();
}

function updateUserRoleFields() {
    const role = qs('[data-admin-user-role]')?.value || 'Petani';

    qsa('[data-admin-user-farmer-field], [data-admin-user-farmer-limit]').forEach((element) => {
        element.hidden = role !== 'Petani';
    });

    qsa('[data-admin-user-buyer-field]').forEach((element) => {
        element.hidden = role !== 'Pembeli';
    });
}

function renderProducts() {
    const tbody = qs('[data-admin-products]');
    const count = qs('[data-admin-product-count]');
    const products = getProducts();

    if (count) {
        count.textContent = `${products.length} produk`;
    }

    if (!tbody) {
        return;
    }

    if (products.length === 0) {
        tbody.innerHTML = emptyRow(5, 'Belum ada produk marketplace. Produk yang ditambahkan admin akan tampil di marketplace petani dan pembeli.');
        return;
    }

    tbody.innerHTML = products.map((product) => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img class="product-thumb" src="${escapeHtml(product.gambar || productDefaultImage)}" alt="">
                    <div>
                        <strong>${escapeHtml(product.nama)}</strong>
                        <div class="text-secondary small">${escapeHtml(product.deskripsi || '-')}</div>
                    </div>
                </div>
            </td>
            <td>${formatRupiah(product.harga)} /Kg</td>
            <td>${formatNumber(product.jumlah)} ${escapeHtml(product.satuan || 'kg')}</td>
            <td>${escapeHtml(product.alamat || '-')}</td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" type="button" data-edit-product="${escapeHtml(product.id)}">Edit</button>
                    <button class="btn btn-outline-danger" type="button" data-delete-product="${escapeHtml(product.id)}">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function resetProductForm() {
    qs('[data-admin-product-form]')?.reset();
    qs('[data-admin-product-id]').value = '';
    qs('[data-admin-product-unit]').value = 'kg';
    qs('[data-admin-product-form-title]').textContent = 'Tambah Produk';
}

function renderFertilizers() {
    const tbody = qs('[data-admin-fertilizers]');
    const count = qs('[data-admin-fertilizer-count]');
    const fertilizers = getFertilizers();

    if (count) {
        count.textContent = `${fertilizers.length} produk`;
    }

    if (!tbody) {
        return;
    }

    if (fertilizers.length === 0) {
        tbody.innerHTML = emptyRow(5, 'Belum ada produk pupuk tambahan. Produk yang ditambahkan admin akan tampil di halaman Pupuk.');
        return;
    }

    tbody.innerHTML = fertilizers.map((fertilizer) => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img class="product-thumb" src="${escapeHtml(fertilizer.gambar || fertilizerDefaultImage)}" alt="">
                    <div>
                        <strong>${escapeHtml(fertilizer.nama)}</strong>
                        <div class="text-secondary small">${escapeHtml(fertilizer.deskripsi || '-')}</div>
                    </div>
                </div>
            </td>
            <td>${formatRupiah(fertilizer.harga)}</td>
            <td>${escapeHtml(fertilizer.satuan || '/ 50 kg')}</td>
            <td>${formatNumber(fertilizer.stok || 0)}</td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" type="button" data-edit-fertilizer="${escapeHtml(fertilizer.id)}">Edit</button>
                    <button class="btn btn-outline-danger" type="button" data-delete-fertilizer="${escapeHtml(fertilizer.id)}">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function resetFertilizerForm() {
    qs('[data-admin-fertilizer-form]')?.reset();
    qs('[data-admin-fertilizer-id]').value = '';
    qs('[data-admin-fertilizer-package]').value = '/ 50 kg';
    qs('[data-admin-fertilizer-form-title]').textContent = 'Tambah Produk Pupuk';
    qs('[data-admin-fertilizer-image-file]').value = '';
    updateFertilizerImagePreview('');
}

function updateFertilizerImagePreview(value, label = '') {
    const input = qs('[data-admin-fertilizer-image]');
    const preview = qs('[data-admin-fertilizer-image-preview]');
    const name = qs('[data-admin-fertilizer-image-name]');

    if (input) {
        input.value = value || '';
    }

    if (preview) {
        if (value) {
            preview.src = value;
            preview.hidden = false;
        } else {
            preview.removeAttribute('src');
            preview.hidden = true;
        }
    }

    if (name) {
        name.textContent = label || (value ? 'Gambar siap digunakan.' : 'Belum ada gambar dipilih.');
    }
}

function renderOrders() {
    const tbody = qs('[data-admin-orders]');
    const orders = getOrders();

    if (!tbody) {
        return;
    }

    if (orders.length === 0) {
        tbody.innerHTML = emptyRow(6, 'Belum ada pesanan pupuk dari petani.');
        return;
    }

    tbody.innerHTML = orders.map((order) => `
        <tr>
            <td>
                <strong>${escapeHtml(order.petani || 'Petani')}</strong>
                <div class="text-secondary small">${escapeHtml(order.tanggal || '-')}</div>
            </td>
            <td>${escapeHtml(order.items.map((item) => item.nama).join(', ') || '-')}</td>
            <td>${formatNumber(order.items.reduce((total, item) => total + Number(item.jumlah || 0), 0))} paket</td>
            <td>
                <strong>${formatRupiah(order.total)}</strong>
                <div class="text-secondary small">${escapeHtml(order.metode || 'Tunai')}</div>
            </td>
            <td>${statusBadge(order.status || 'menunggu')}</td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" type="button" data-order-status="diterima" data-order-id="${escapeHtml(order.id)}">Terima</button>
                    <button class="btn btn-outline-warning" type="button" data-order-status="menunggu" data-order-id="${escapeHtml(order.id)}">Tunggu</button>
                    <button class="btn btn-outline-danger" type="button" data-order-status="ditolak" data-order-id="${escapeHtml(order.id)}">Tolak</button>
                    <button class="btn btn-danger" type="button" data-delete-order="${escapeHtml(order.id)}">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderNotifications() {
    const tbody = qs('[data-admin-notifications]');
    const notifications = getNotifications();

    if (!tbody) {
        return;
    }

    if (notifications.length === 0) {
        tbody.innerHTML = emptyRow(4, 'Belum ada notifikasi admin.');
        return;
    }

    tbody.innerHTML = notifications.map((notification) => `
        <tr>
            <td>${escapeHtml(notification.title)}</td>
            <td>${escapeHtml(notification.category)}</td>
            <td>${escapeHtml(notification.message)}</td>
            <td class="text-end">
                <button class="btn btn-outline-danger btn-sm" type="button" data-delete-notification="${escapeHtml(notification.id)}">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function renderContents() {
    const tbody = qs('[data-admin-contents]');
    const count = qs('[data-admin-content-count]');
    const contents = getContents();

    if (count) {
        count.textContent = `${contents.length} konten`;
    }

    if (!tbody) {
        return;
    }

    if (contents.length === 0) {
        tbody.innerHTML = emptyRow(4, 'Belum ada konten tambahan. Konten yang disimpan akan tampil di halaman Edukasi atau Hama & Penyakit.');
        return;
    }

    tbody.innerHTML = contents.map((content) => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img class="product-thumb" src="${escapeHtml(content.image || contentDefaultImages[content.category])}" alt="">
                    <div>
                        <strong>${escapeHtml(content.title)}</strong>
                        <div class="text-secondary small">${escapeHtml(content.description || '-')}</div>
                        <span class="badge text-bg-light mt-1">${escapeHtml(content.type || 'Artikel')}</span>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(content.category)}</td>
            <td>
                <a class="link-success fw-bold" href="${escapeHtml(content.link || '#')}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(content.link || '-')}
                </a>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" type="button" data-edit-content="${escapeHtml(content.id)}">Edit</button>
                    <button class="btn btn-outline-danger" type="button" data-delete-content="${escapeHtml(content.id)}">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function resetContentForm() {
    qs('[data-admin-content-form]')?.reset();
    qs('[data-admin-content-id]').value = '';
    qs('[data-admin-content-form-title]').textContent = 'Tambah Konten';
    qs('[data-admin-content-image-file]').value = '';
    updateContentImagePreview('');
}

function updateContentImagePreview(value, label = '') {
    const input = qs('[data-admin-content-image]');
    const preview = qs('[data-admin-content-image-preview]');
    const name = qs('[data-admin-content-image-name]');

    if (input) {
        input.value = value || '';
    }

    if (preview) {
        if (value) {
            preview.src = value;
            preview.hidden = false;
        } else {
            preview.removeAttribute('src');
            preview.hidden = true;
        }
    }

    if (name) {
        name.textContent = label || (value ? 'Gambar siap digunakan.' : 'Belum ada gambar dipilih.');
    }
}

function renderActivities() {
    const tbody = qs('[data-admin-aktivitas]');
    const plantingProgress = getPlantingProgressSnapshot();
    const plantingActivity = plantingProgress.completed > 0 ? [{
        title: `Jadwal tanam ${plantingProgress.activeStage}`,
        category: 'Jadwal Tanam',
        status: plantingProgress.status,
        time: `${plantingProgress.completed}/${plantingStages.length} proses selesai`,
    }] : [];
    const contents = getContents().slice(0, 3).map((item) => ({
        title: `Konten ${item.title}`,
        category: item.category,
        status: 'Aktif',
        time: item.type || 'Konten aplikasi',
    }));
    const products = getProducts().slice(0, 3).map((item) => ({
        title: `Produk ${item.nama}`,
        category: 'Marketplace',
        status: 'Aktif',
        time: 'Data produk',
    }));
    const fertilizers = getFertilizers().slice(0, 3).map((item) => ({
        title: `Pupuk ${item.nama}`,
        category: 'Pupuk',
        status: 'Aktif',
        time: 'Data pupuk',
    }));
    const orders = getOrders().slice(0, 5).map((item) => ({
        title: `Pesanan pupuk ${item.petani || 'Petani'}`,
        category: 'Pesanan Pupuk',
        status: item.status || 'menunggu',
        time: item.tanggal || '-',
    }));
    const activities = [...plantingActivity, ...contents, ...orders, ...products, ...fertilizers].slice(0, 8);

    if (!tbody) {
        return;
    }

    if (activities.length === 0) {
        tbody.innerHTML = emptyRow(4, 'Belum ada aktivitas terbaru.');
        return;
    }

    tbody.innerHTML = activities.map((item) => `
        <tr>
            <td>${escapeHtml(item.title)}</td>
            <td>${escapeHtml(item.category)}</td>
            <td>${statusBadge(item.status)}</td>
            <td>${escapeHtml(item.time)}</td>
        </tr>
    `).join('');
}

function loadSettingsForm() {
    const settings = getSettings();
    const defaults = defaultSettings();
    const marketplaceStatus = settings.marketplace || defaults.marketplace;
    const marketplaceSwitch = qs('[data-admin-setting-marketplace-switch]');
    const maintenanceSwitch = qs('[data-admin-setting-maintenance]');

    qs('[data-admin-setting-marketplace]').value = marketplaceStatus;
    marketplaceSwitch.checked = marketplaceStatus === 'Aktif';
    updateSettingSwitch(marketplaceSwitch, marketplaceStatus);
    setPaymentMethodSwitches('buyer', normalizeDisabledPaymentMethods(settings, 'buyerPayment', 'buyerPaymentDisabledMethods'));
    setPaymentMethodSwitches('farmer', normalizeDisabledPaymentMethods(settings, 'farmerPayment', 'farmerPaymentDisabledMethods'));
    maintenanceSwitch.checked = (settings.maintenance || defaults.maintenance) === 'Aktif';
    updateSettingSwitch(maintenanceSwitch);
    qs('[data-admin-setting-maintenance-message]').value = settings.maintenanceMessage || defaults.maintenanceMessage;
}

function readSettingsForm() {
    const settings = getSettings();

    return {
        ...settings,
        marketplace: qs('[data-admin-setting-marketplace]').value,
        buyerPayment: readDisabledPaymentMethods('buyer').length === paymentMethods.length ? 'Nonaktif' : 'Aktif',
        farmerPayment: readDisabledPaymentMethods('farmer').length === paymentMethods.length ? 'Nonaktif' : 'Aktif',
        buyerPaymentDisabledMethods: readDisabledPaymentMethods('buyer'),
        farmerPaymentDisabledMethods: readDisabledPaymentMethods('farmer'),
        maintenance: qs('[data-admin-setting-maintenance]').checked ? 'Aktif' : 'Nonaktif',
        maintenanceMessage: qs('[data-admin-setting-maintenance-message]').value.trim() || defaultSettings().maintenanceMessage,
    };
}

function saveSettingsForm(message = 'Pengaturan aplikasi disimpan.') {
    setSettings(readSettingsForm());
    renderAll();
    showToast(message);
}

function resetAdminPasswordForm() {
    qs('[data-admin-password-form]')?.reset();
}

function renderAll() {
    renderStats();
    updateUserFilterUi();
    renderUsers();
    renderPlantingProgress();
    renderProducts();
    renderFertilizers();
    renderOrders();
    renderNotifications();
    renderContents();
    renderActivities();
    loadSettingsForm();
    renderUserFertilizerLimits(readUserFertilizerLimits());
}

qs('[data-admin-user-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const users = getUsers();
    const id = qs('[data-admin-user-id]').value || newId('user');
    const index = users.findIndex((item) => item.id === id);
    const existingUser = index >= 0 ? users[index] : {};
    const role = qs('[data-admin-user-role]').value;
    const nik = qs('[data-admin-user-nik]').value.trim();
    const password = qs('[data-admin-user-password]').value.trim();
    const passwordConfirmation = qs('[data-admin-user-password-confirmation]').value.trim();

    if (role === 'Petani' && nik && !/^\d{16}$/.test(nik)) {
        showToast('NIK petani harus 16 digit angka.');
        return;
    }

    if (password || passwordConfirmation) {
        if (password.length < 6) {
            showToast('Password minimal 6 karakter.');
            return;
        }

        if (password !== passwordConfirmation) {
            showToast('Konfirmasi password tidak sama.');
            return;
        }
    }

    const user = {
        id,
        name: qs('[data-admin-user-name]').value.trim(),
        phone: qs('[data-admin-user-phone]').value.trim(),
        role,
        nik: role === 'Petani' ? nik : '',
        warehouseName: role === 'Pembeli' ? qs('[data-admin-user-warehouse]').value.trim() : '',
        address: role === 'Petani' || role === 'Pembeli' ? qs('[data-admin-user-address]').value.trim() : '',
        landAreaMeter: role === 'Petani' ? parseNumber(qs('[data-admin-user-land-area]').value) : 0,
        fertilizerLimits: role === 'Petani' ? readUserFertilizerLimits() : {},
        status: qs('[data-admin-user-status]').value,
        password: password || existingUser.password || '',
        passwordUpdatedAt: password ? new Date().toISOString() : existingUser.passwordUpdatedAt || '',
    };

    if (index >= 0) {
        users[index] = user;
    } else {
        users.unshift(user);
    }

    setUsers(users);
    resetUserForm();
    renderAll();
    showToast('Data pengguna disimpan.');
});

qs('[data-admin-product-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const products = getProducts();
    const id = qs('[data-admin-product-id]').value || newId('produk-admin');
    const product = {
        id,
        nama: qs('[data-admin-product-name]').value.trim(),
        harga: parseNumber(qs('[data-admin-product-price]').value),
        jumlah: parseNumber(qs('[data-admin-product-stock]').value),
        satuan: qs('[data-admin-product-unit]').value.trim() || 'kg',
        alamat: qs('[data-admin-product-address]').value.trim(),
        deskripsi: qs('[data-admin-product-description]').value.trim(),
        gambar: qs('[data-admin-product-image]').value.trim() || productDefaultImage,
    };
    const index = products.findIndex((item) => item.id === id);

    if (index >= 0) {
        products[index] = product;
    } else {
        products.unshift(product);
    }

    setProducts(products);
    resetProductForm();
    renderAll();
    showToast('Produk marketplace disimpan.');
});

qs('[data-admin-fertilizer-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const fertilizers = getFertilizers();
    const id = qs('[data-admin-fertilizer-id]').value || newId('pupuk-admin');
    const image = normalizeImageSource(qs('[data-admin-fertilizer-image]').value);
    const fertilizer = {
        id,
        nama: qs('[data-admin-fertilizer-name]').value.trim(),
        harga: parseNumber(qs('[data-admin-fertilizer-price]').value),
        stok: parseNumber(qs('[data-admin-fertilizer-stock]').value),
        satuan: qs('[data-admin-fertilizer-package]').value.trim() || '/ 50 kg',
        deskripsi: qs('[data-admin-fertilizer-description]').value.trim(),
        gambar: image || fertilizerDefaultImage,
    };
    const index = fertilizers.findIndex((item) => item.id === id);

    if (index >= 0) {
        fertilizers[index] = fertilizer;
    } else {
        fertilizers.unshift(fertilizer);
    }

    setFertilizers(fertilizers);
    resetFertilizerForm();
    renderAll();
    showToast('Produk pupuk disimpan.');
});

qs('[data-admin-notification-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const notifications = getNotifications();

    notifications.unshift({
        id: newId('notifikasi'),
        title: qs('[data-admin-notification-title]').value.trim(),
        category: qs('[data-admin-notification-category]').value,
        message: qs('[data-admin-notification-message]').value.trim(),
    });

    setNotifications(notifications);
    event.currentTarget.reset();
    renderAll();
    showToast('Notifikasi admin disimpan.');
});

qs('[data-admin-content-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const contents = getContents();
    const id = qs('[data-admin-content-id]').value || newId('konten');
    const link = normalizeLink(qs('[data-admin-content-link]').value);

    if (!link) {
        showToast('Link tujuan konten wajib diisi.');
        return;
    }

    const category = qs('[data-admin-content-category]').value;
    const image = normalizeImageSource(qs('[data-admin-content-image]').value);
    const content = {
        id,
        category,
        title: qs('[data-admin-content-title]').value.trim(),
        type: qs('[data-admin-content-type]').value,
        description: qs('[data-admin-content-description]').value.trim(),
        image: image || contentDefaultImages[category],
        link,
        createdAt: new Date().toISOString(),
    };
    const index = contents.findIndex((item) => item.id === id);

    if (index >= 0) {
        content.createdAt = contents[index].createdAt || content.createdAt;
        contents[index] = content;
    } else {
        contents.unshift(content);
    }

    setContents(contents);
    resetContentForm();
    renderAll();
    showToast('Konten aplikasi disimpan.');
});

qs('[data-admin-setting-marketplace-switch]')?.addEventListener('change', (event) => {
    const statusInput = qs('[data-admin-setting-marketplace]');
    statusInput.value = event.currentTarget.checked ? 'Aktif' : 'Nonaktif';
    updateSettingSwitch(event.currentTarget, statusInput.value);
});

qs('[data-admin-setting-marketplace]')?.addEventListener('change', (event) => {
    const marketplaceSwitch = qs('[data-admin-setting-marketplace-switch]');
    marketplaceSwitch.checked = event.currentTarget.value === 'Aktif';
    updateSettingSwitch(marketplaceSwitch, event.currentTarget.value);
});

qsa('[data-admin-payment-enabled], [data-admin-setting-maintenance]').forEach((input) => {
    input.addEventListener('change', () => updateSettingSwitch(input));
});

qs('[data-admin-settings-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettingsForm();
});

qs('[data-admin-password-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const account = getAdminAccount();
    const currentPassword = qs('[data-admin-current-password]').value;
    const newPassword = qs('[data-admin-new-password]').value;
    const confirmPassword = qs('[data-admin-confirm-password]').value;

    if (currentPassword !== account.password) {
        showToast('Password saat ini tidak sesuai.');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password baru minimal 6 karakter.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Konfirmasi password baru tidak sama.');
        return;
    }

    setAdminAccount({
        ...account,
        password: newPassword,
        passwordUpdatedAt: new Date().toISOString(),
    });
    resetAdminPasswordForm();
    showToast('Password admin berhasil diubah.');
});

qs('[data-admin-logout]')?.addEventListener('click', (event) => {
    localStorage.removeItem(keys.session);
    window.location.href = event.currentTarget.dataset.adminLogoutUrl || '/login';
});

document.addEventListener('click', (event) => {
    const userFilter = event.target.closest('[data-admin-user-filter]');
    const editUser = event.target.closest('[data-edit-user]');
    const deleteUser = event.target.closest('[data-delete-user]');
    const editProduct = event.target.closest('[data-edit-product]');
    const deleteProduct = event.target.closest('[data-delete-product]');
    const editFertilizer = event.target.closest('[data-edit-fertilizer]');
    const deleteFertilizer = event.target.closest('[data-delete-fertilizer]');
    const orderStatus = event.target.closest('[data-order-status]');
    const deleteOrder = event.target.closest('[data-delete-order]');
    const deleteNotification = event.target.closest('[data-delete-notification]');
    const editContent = event.target.closest('[data-edit-content]');
    const deleteContent = event.target.closest('[data-delete-content]');

    if (userFilter) {
        resetUserForm();
        setActiveUserRole(userFilter.dataset.adminUserFilter);
        return;
    }

    if (editUser) {
        const user = getUsers().find((item) => item.id === editUser.dataset.editUser);

        if (user) {
            setActiveUserRole(user.role);
            qs('[data-admin-user-id]').value = user.id;
            qs('[data-admin-user-name]').value = user.name;
            qs('[data-admin-user-phone]').value = user.phone;
            qs('[data-admin-user-role]').value = user.role;
            qs('[data-admin-user-nik]').value = user.nik || '';
            qs('[data-admin-user-warehouse]').value = user.warehouseName || '';
            qs('[data-admin-user-address]').value = user.address || '';
            qs('[data-admin-user-land-area]').value = formatNumber(user.landAreaMeter || 0);
            renderUserFertilizerLimits(user.fertilizerLimits || {});
            qs('[data-admin-user-status]').value = user.status;
            qs('[data-admin-user-password]').value = '';
            qs('[data-admin-user-password-confirmation]').value = '';
            qs('[data-admin-user-form-title]').textContent = `Edit ${user.role}`;
            updateUserRoleFields();
        }
    }

    if (deleteUser) {
        setUsers(getUsers().filter((item) => item.id !== deleteUser.dataset.deleteUser));
        renderAll();
        showToast('Pengguna dihapus.');
    }

    if (editProduct) {
        const product = getProducts().find((item) => item.id === editProduct.dataset.editProduct);

        if (product) {
            qs('[data-admin-product-id]').value = product.id;
            qs('[data-admin-product-name]').value = product.nama;
            qs('[data-admin-product-price]').value = formatNumber(product.harga);
            qs('[data-admin-product-stock]').value = formatNumber(product.jumlah);
            qs('[data-admin-product-unit]').value = product.satuan || 'kg';
            qs('[data-admin-product-address]').value = product.alamat || '';
            qs('[data-admin-product-description]').value = product.deskripsi || '';
            qs('[data-admin-product-image]').value = product.gambar || '';
            qs('[data-admin-product-form-title]').textContent = 'Edit Produk';
        }
    }

    if (deleteProduct) {
        setProducts(getProducts().filter((item) => item.id !== deleteProduct.dataset.deleteProduct));
        renderAll();
        showToast('Produk dihapus.');
    }

    if (editFertilizer) {
        const fertilizer = getFertilizers().find((item) => item.id === editFertilizer.dataset.editFertilizer);

        if (fertilizer) {
            qs('[data-admin-fertilizer-id]').value = fertilizer.id;
            qs('[data-admin-fertilizer-name]').value = fertilizer.nama;
            qs('[data-admin-fertilizer-price]').value = formatNumber(fertilizer.harga);
            qs('[data-admin-fertilizer-stock]').value = formatNumber(fertilizer.stok);
            qs('[data-admin-fertilizer-package]').value = fertilizer.satuan || '/ 50 kg';
            qs('[data-admin-fertilizer-description]').value = fertilizer.deskripsi || '';
            updateFertilizerImagePreview(fertilizer.gambar || '', fertilizer.gambar ? 'Gambar produk tersimpan.' : '');
            qs('[data-admin-fertilizer-form-title]').textContent = 'Edit Produk Pupuk';
        }
    }

    if (deleteFertilizer) {
        setFertilizers(getFertilizers().filter((item) => item.id !== deleteFertilizer.dataset.deleteFertilizer));
        renderAll();
        showToast('Produk pupuk dihapus.');
    }

    if (orderStatus) {
        setOrders(getOrders().map((item) => (
            item.id === orderStatus.dataset.orderId ? { ...item, status: orderStatus.dataset.orderStatus } : item
        )));
        renderAll();
        showToast('Status pesanan diperbarui.');
    }

    if (deleteOrder) {
        setOrders(getOrders().filter((item) => item.id !== deleteOrder.dataset.deleteOrder));
        renderAll();
        showToast('Pesanan dihapus.');
    }

    if (deleteNotification) {
        setNotifications(getNotifications().filter((item) => item.id !== deleteNotification.dataset.deleteNotification));
        renderAll();
        showToast('Notifikasi dihapus.');
    }

    if (editContent) {
        const content = getContents().find((item) => item.id === editContent.dataset.editContent);

        if (content) {
            qs('[data-admin-content-id]').value = content.id;
            qs('[data-admin-content-category]').value = content.category;
            qs('[data-admin-content-title]').value = content.title;
            qs('[data-admin-content-type]').value = content.type || 'Artikel';
            qs('[data-admin-content-description]').value = content.description || '';
            qs('[data-admin-content-link]').value = content.link || '';
            qs('[data-admin-content-form-title]').textContent = 'Edit Konten';
            updateContentImagePreview(content.image || '', content.image ? 'Gambar konten tersimpan.' : '');
        }
    }

    if (deleteContent) {
        setContents(getContents().filter((item) => item.id !== deleteContent.dataset.deleteContent));
        renderAll();
        showToast('Konten aplikasi dihapus.');
    }

});

qs('[data-admin-user-reset]')?.addEventListener('click', resetUserForm);
qs('[data-admin-seed-users]')?.addEventListener('click', addSampleUsers);
qs('[data-admin-user-role]')?.addEventListener('change', updateUserRoleFields);
qs('[data-admin-product-reset]')?.addEventListener('click', resetProductForm);
qs('[data-admin-fertilizer-reset]')?.addEventListener('click', resetFertilizerForm);
qs('[data-admin-fertilizer-image-button]')?.addEventListener('click', () => {
    qs('[data-admin-fertilizer-image-file]')?.click();
});
qs('[data-admin-fertilizer-image-clear]')?.addEventListener('click', () => {
    const fileInput = qs('[data-admin-fertilizer-image-file]');

    if (fileInput) {
        fileInput.value = '';
    }

    updateFertilizerImagePreview('');
});
qs('[data-admin-fertilizer-image-file]')?.addEventListener('change', (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        event.currentTarget.value = '';
        showToast('File harus berupa gambar.');
        return;
    }

    if (file.size > maxFertilizerImageSize) {
        event.currentTarget.value = '';
        showToast('Ukuran gambar maksimal 1,5 MB.');
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        updateFertilizerImagePreview(String(reader.result || ''), file.name);
    });
    reader.readAsDataURL(file);
});
qs('[data-admin-content-reset]')?.addEventListener('click', resetContentForm);
qs('[data-admin-content-image-button]')?.addEventListener('click', () => {
    qs('[data-admin-content-image-file]')?.click();
});
qs('[data-admin-content-image-clear]')?.addEventListener('click', () => {
    const fileInput = qs('[data-admin-content-image-file]');

    if (fileInput) {
        fileInput.value = '';
    }

    updateContentImagePreview('');
});
qs('[data-admin-content-image-file]')?.addEventListener('change', (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        event.currentTarget.value = '';
        showToast('File harus berupa gambar.');
        return;
    }

    if (file.size > maxContentImageSize) {
        event.currentTarget.value = '';
        showToast('Ukuran gambar maksimal 1,5 MB.');
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        updateContentImagePreview(String(reader.result || ''), file.name);
    });
    reader.readAsDataURL(file);
});
qs('[data-admin-refresh]')?.addEventListener('click', () => {
    renderAll();
    showToast('Data admin diperbarui.');
});

qs('[data-admin-clear-products]')?.addEventListener('click', () => {
    setProducts([]);
    renderAll();
    showToast('Produk marketplace dikosongkan.');
});

qs('[data-admin-clear-fertilizers]')?.addEventListener('click', () => {
    setFertilizers([]);
    resetFertilizerForm();
    renderAll();
    showToast('Produk pupuk dikosongkan.');
});

qs('[data-admin-clear-orders]')?.addEventListener('click', () => {
    setOrders([]);
    renderAll();
    showToast('Pesanan pupuk dikosongkan.');
});

qs('[data-admin-clear-all]')?.addEventListener('click', () => {
    setUsers([]);
    setProducts([]);
    setFertilizers([]);
    setOrders([]);
    setNotifications([]);
    setContents([]);
    setSettings(defaultSettings());
    resetUserForm();
    resetProductForm();
    resetFertilizerForm();
    resetContentForm();
    renderAll();
    showToast('Semua data lokal admin dikosongkan.');
});

renderAll();
updateUserRoleFields();

const loginForm = document.querySelector('[data-login-form]');
const loginMessage = document.querySelector('[data-login-message]');
const adminAccountKey = 'poktan:admin:akun';
const usersKey = 'poktan:admin:pengguna';
const sessionKey = 'poktan:session';

function defaultAdminAccount() {
    return {
        username: 'admin',
        name: 'Admin Lancang Kuning',
        password: 'admin123',
        passwordUpdatedAt: '',
    };
}

function readJson(key, fallback) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

        if (Array.isArray(fallback)) {
            return Array.isArray(data) ? data : fallback;
        }

        return data && typeof data === 'object' && !Array.isArray(data) ? { ...fallback, ...data } : fallback;
    } catch {
        return fallback;
    }
}

function normalizeCredential(value) {
    return String(value || '').trim().toLowerCase();
}

function showLoginMessage(message) {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;
    loginMessage.hidden = false;
}

function saveSession(user) {
    localStorage.setItem(sessionKey, JSON.stringify({
        ...user,
        loginAt: new Date().toISOString(),
    }));
}

function findRegisteredUser(username) {
    const credential = normalizeCredential(username);

    return readJson(usersKey, []).find((user) => {
        const options = [user.name, user.phone, user.nik, user.warehouseName]
            .filter(Boolean)
            .map(normalizeCredential);

        return options.includes(credential);
    });
}

loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');
    const adminAccount = readJson(adminAccountKey, defaultAdminAccount());
    const usernameKey = normalizeCredential(username);
    const adminUsernameKey = normalizeCredential(adminAccount.username);

    if (!username || !password) {
        showLoginMessage('Username dan password wajib diisi.');
        return;
    }

    if (usernameKey === adminUsernameKey || usernameKey === 'admin') {
        if (password !== adminAccount.password) {
            showLoginMessage('Username atau password admin tidak sesuai.');
            return;
        }

        saveSession({
            role: 'Admin',
            username: adminAccount.username,
            name: adminAccount.name,
        });
        window.location.href = loginForm.dataset.adminUrl || '/admin';
        return;
    }

    const user = findRegisteredUser(username);

    if (!user || user.password !== password) {
        showLoginMessage('Username atau password tidak sesuai.');
        return;
    }

    if (user.status && user.status !== 'Aktif') {
        showLoginMessage('Akun sedang tidak aktif. Hubungi admin.');
        return;
    }

    saveSession({
        role: user.role || 'Petani',
        username,
        name: user.name || username,
        userId: user.id,
    });
    window.location.href = user.role === 'Pembeli'
        ? (loginForm.dataset.pembeliUrl || '/pembeli/marketplace')
        : (loginForm.dataset.dashboardUrl || '/dashboard');
});

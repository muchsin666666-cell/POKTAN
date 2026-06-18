const maintenanceSettingsKey = 'poktan:admin:pengaturan';
const defaultMaintenanceMessage = 'Aplikasi sedang dalam perawatan. Silakan coba lagi nanti.';

function readMaintenanceSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem(maintenanceSettingsKey) || '{}');

        return settings && typeof settings === 'object' && !Array.isArray(settings) ? settings : {};
    } catch {
        return {};
    }
}

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;

    return element;
}

function addMaintenanceStyle() {
    if (document.querySelector('[data-maintenance-style]')) {
        return;
    }

    const style = document.createElement('style');
    style.dataset.maintenanceStyle = 'true';
    style.textContent = `
        body.maintenance-active {
            overflow: hidden;
        }

        .maintenance-overlay {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #f7faf6;
            color: #17351d;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .maintenance-panel {
            width: min(100%, 460px);
            padding: 28px;
            border: 1px solid rgba(28, 82, 37, 0.14);
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0 22px 70px rgba(17, 57, 27, 0.16);
            text-align: center;
        }

        .maintenance-label {
            margin: 0 0 10px;
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0;
            text-transform: uppercase;
            color: #2f8f46;
        }

        .maintenance-title {
            margin: 0;
            font-size: clamp(1.55rem, 5vw, 2rem);
            line-height: 1.15;
        }

        .maintenance-message {
            margin: 14px 0 0;
            color: #55715d;
            line-height: 1.6;
        }
    `;

    document.head.appendChild(style);
}

function showMaintenanceOverlay() {
    const settings = readMaintenanceSettings();

    if (settings.maintenance !== 'Aktif' || document.querySelector('[data-maintenance-overlay]')) {
        return;
    }

    addMaintenanceStyle();
    document.body.classList.add('maintenance-active');

    const overlay = document.createElement('section');
    overlay.className = 'maintenance-overlay';
    overlay.dataset.maintenanceOverlay = 'true';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'maintenance-title');

    const panel = document.createElement('div');
    panel.className = 'maintenance-panel';

    const title = createTextElement('h1', 'maintenance-title', 'Aplikasi Sedang Maintenance');
    title.id = 'maintenance-title';

    panel.append(
        createTextElement('p', 'maintenance-label', 'Maintenance'),
        title,
        createTextElement('p', 'maintenance-message', settings.maintenanceMessage || defaultMaintenanceMessage),
    );

    overlay.append(panel);
    document.body.append(overlay);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showMaintenanceOverlay);
} else {
    showMaintenanceOverlay();
}

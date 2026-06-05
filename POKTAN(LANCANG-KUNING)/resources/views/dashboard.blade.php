<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - POKTAN Lancang Kuning</title>
    <style>
        :root {
            --green-900: #14532d;
            --green-700: #15803d;
            --green-600: #16a34a;
            --green-100: #dcfce7;
            --blue-100: #d9f0fb;
            --blue-200: #b8e2f4;
            --yellow-100: #fff6cf;
            --purple-100: #efe3ff;
            --rose-100: #ffe1e7;
            --ink: #172014;
            --muted: #677267;
            --line: #dfe8df;
            --surface: #ffffff;
            --shadow: 0 12px 30px rgba(20, 83, 45, 0.12);
            --soft-shadow: 0 8px 18px rgba(23, 32, 20, 0.12);
            --app-max: 440px;
            --nav-height: 74px;
        }

        * {
            box-sizing: border-box;
        }

        html {
            min-height: 100%;
            background: #f1f8f2;
        }

        body {
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            color: var(--ink);
            font-family: "Inter", "Poppins", "Nunito", Arial, sans-serif;
            background:
                radial-gradient(circle at top left, rgba(187, 247, 208, 0.48), transparent 32rem),
                #f4faf4;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        button {
            border: 0;
            font: inherit;
        }

        img,
        svg {
            display: block;
        }

        .app-shell {
            width: 100%;
            max-width: var(--app-max);
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0 auto;
            padding-bottom: calc(var(--nav-height) + env(safe-area-inset-bottom) + 18px);
            overflow: hidden;
            background: var(--surface);
            box-shadow: 0 28px 80px rgba(20, 83, 45, 0.16);
        }

        .hero {
            position: relative;
            height: clamp(190px, 52vw, 230px);
            overflow: hidden;
            border-radius: 0 0 clamp(22px, 7vw, 34px) clamp(22px, 7vw, 34px);
            background: var(--blue-100);
        }

        .hero::after {
            position: absolute;
            inset: auto 0 0;
            height: 46px;
            content: "";
            background: linear-gradient(180deg, rgba(255, 255, 255, 0), #ffffff 74%);
            pointer-events: none;
        }

        .hero__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
        }

        .hero__actions {
            position: absolute;
            inset: clamp(14px, 4vw, 22px) clamp(14px, 4vw, 22px) auto;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            pointer-events: none;
        }

        .icon-button {
            width: clamp(38px, 11vw, 46px);
            height: clamp(38px, 11vw, 46px);
            display: grid;
            place-items: center;
            padding: 0;
            border-radius: 50%;
            color: var(--ink);
            background: rgba(255, 255, 255, 0.94);
            box-shadow: 0 8px 20px rgba(23, 32, 20, 0.13);
            cursor: pointer;
            pointer-events: auto;
        }

        .icon-button svg {
            width: clamp(19px, 5vw, 23px);
            height: clamp(19px, 5vw, 23px);
            margin: auto;
            stroke-width: 2.5;
        }

        .content {
            display: grid;
            gap: clamp(20px, 5vw, 28px);
            padding: clamp(14px, 4vw, 22px) clamp(14px, 4.4vw, 24px) 0;
        }

        .section-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            margin-bottom: clamp(10px, 3vw, 14px);
        }

        .section-heading h2 {
            margin: 0;
            font-size: clamp(1rem, 4vw, 1.2rem);
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: 0;
        }

        .see-all {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            min-width: max-content;
            color: var(--green-700);
            font-size: clamp(0.72rem, 2.8vw, 0.86rem);
            font-weight: 800;
        }

        .see-all svg {
            width: 15px;
            height: 15px;
            stroke-width: 3;
        }

        .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: clamp(8px, 2.8vw, 16px);
        }

        .quick-item {
            min-width: 0;
            display: grid;
            justify-items: center;
            gap: clamp(6px, 2vw, 9px);
            color: #24301f;
            text-align: center;
            font-size: clamp(0.66rem, 2.55vw, 0.82rem);
            line-height: 1.18;
            font-weight: 800;
        }

        .quick-icon {
            width: min(100%, clamp(56px, 18vw, 78px));
            aspect-ratio: 1.08;
            display: grid;
            place-items: center;
            border-radius: clamp(14px, 4vw, 20px);
        }

        .quick-icon img {
            width: clamp(31px, 9vw, 44px);
            height: clamp(31px, 9vw, 44px);
            object-fit: contain;
        }

        .quick-icon--green {
            background: #d9f7d2;
        }

        .quick-icon--blue {
            background: #dbeeff;
        }

        .quick-icon--yellow {
            background: var(--yellow-100);
        }

        .quick-icon--purple {
            background: var(--purple-100);
        }

        .weather-card {
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(118px, 0.9fr);
            align-items: center;
            gap: clamp(12px, 4vw, 20px);
            padding: clamp(13px, 4vw, 18px);
            border-radius: clamp(18px, 5vw, 24px);
            background: linear-gradient(135deg, #a9daf0, #c7ecfb);
            box-shadow: var(--shadow);
        }

        .weather-summary {
            min-width: 0;
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            align-items: center;
            gap: clamp(8px, 3vw, 14px);
        }

        .weather-icon {
            width: clamp(58px, 18vw, 86px);
            height: clamp(58px, 18vw, 86px);
            object-fit: contain;
        }

        .weather-temp {
            min-width: 0;
        }

        .weather-temp strong {
            display: block;
            color: #07120a;
            font-size: clamp(2.15rem, 10vw, 3.5rem);
            line-height: 0.95;
            font-weight: 900;
            letter-spacing: 0;
        }

        .weather-temp span {
            display: block;
            margin-top: 4px;
            color: #213121;
            font-size: clamp(0.72rem, 2.8vw, 0.88rem);
            line-height: 1.2;
            font-weight: 800;
        }

        .weather-details {
            min-width: 0;
            display: grid;
            gap: clamp(7px, 2.4vw, 10px);
            padding-left: clamp(12px, 3.5vw, 18px);
            border-left: 1px solid rgba(20, 83, 45, 0.32);
        }

        .weather-detail {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 7px;
            color: #1d2b1d;
            font-size: clamp(0.68rem, 2.55vw, 0.84rem);
            line-height: 1.25;
            font-weight: 800;
        }

        .weather-detail svg {
            width: clamp(15px, 4vw, 18px);
            height: clamp(15px, 4vw, 18px);
            flex: 0 0 auto;
            stroke-width: 2.6;
        }

        .weather-detail span {
            overflow-wrap: anywhere;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(11px, 3.3vw, 16px);
        }

        .feature-card {
            min-width: 0;
            min-height: clamp(112px, 30vw, 132px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: clamp(6px, 2vw, 9px);
            padding: clamp(10px, 3vw, 15px) clamp(7px, 2.5vw, 12px);
            border: 1px solid rgba(223, 232, 223, 0.78);
            border-radius: clamp(14px, 4vw, 20px);
            background: #ffffff;
            box-shadow: var(--soft-shadow);
            text-align: center;
        }

        .feature-icon {
            width: clamp(40px, 12vw, 52px);
            height: clamp(40px, 12vw, 52px);
            display: grid;
            place-items: center;
            border-radius: clamp(13px, 3.8vw, 17px);
        }

        .feature-icon img {
            width: clamp(25px, 7.2vw, 33px);
            height: clamp(25px, 7.2vw, 33px);
            object-fit: contain;
        }

        .feature-icon--green {
            background: var(--green-100);
        }

        .feature-icon--yellow {
            background: var(--yellow-100);
        }

        .feature-icon--purple {
            background: var(--purple-100);
        }

        .feature-icon--rose {
            background: var(--rose-100);
        }

        .feature-card strong {
            color: #1c2a19;
            font-size: clamp(0.7rem, 2.65vw, 0.9rem);
            line-height: 1.12;
            font-weight: 900;
            letter-spacing: 0;
        }

        .feature-card span:last-child {
            max-width: 11rem;
            color: var(--muted);
            font-size: clamp(0.62rem, 2.3vw, 0.76rem);
            line-height: 1.24;
            font-weight: 700;
        }

        .bottom-nav {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 50%;
            z-index: 10;
            width: min(100%, var(--app-max));
            min-height: var(--nav-height);
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            align-items: center;
            padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
            border: 1px solid var(--line);
            border-bottom: 0;
            border-radius: 22px 22px 0 0;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 -14px 34px rgba(20, 83, 45, 0.12);
            transform: translateX(-50%);
            backdrop-filter: blur(16px);
        }

        .bottom-nav__item {
            min-width: 0;
            display: grid;
            justify-items: center;
            gap: 4px;
            color: #7a8378;
            text-align: center;
            font-size: clamp(0.62rem, 2.2vw, 0.76rem);
            line-height: 1.12;
            font-weight: 800;
        }

        .bottom-nav__item svg {
            width: clamp(21px, 6vw, 26px);
            height: clamp(21px, 6vw, 26px);
            stroke-width: 2.5;
        }

        .bottom-nav__item.is-active {
            color: var(--green-700);
        }

        @media (max-width: 359px) {
            .content {
                gap: 18px;
                padding-right: 12px;
                padding-left: 12px;
            }

            .quick-grid {
                gap: 7px;
            }

            .weather-card {
                grid-template-columns: 1fr;
            }

            .weather-details {
                padding-top: 11px;
                padding-left: 0;
                border-top: 1px solid rgba(20, 83, 45, 0.28);
                border-left: 0;
            }
        }

        @media (min-width: 768px) {
            :root {
                --app-max: 760px;
                --nav-height: 78px;
            }

            body {
                padding: 24px 0 0;
            }

            .app-shell {
                min-height: calc(100dvh - 24px);
                border-radius: 28px 28px 0 0;
            }

            .hero {
                height: 250px;
                border-radius: 28px 28px 34px 34px;
            }

            .hero__image {
                object-position: center 12%;
            }

            .content {
                padding-right: 28px;
                padding-left: 28px;
            }

            .feature-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }

        @media (min-width: 1024px) {
            :root {
                --app-max: 900px;
                --nav-height: 80px;
            }

            body {
                padding-top: 32px;
            }

            .app-shell {
                min-height: calc(100dvh - 32px);
                border-radius: 32px 32px 0 0;
            }

            .hero {
                height: 270px;
            }

            .content {
                padding-right: 34px;
                padding-left: 34px;
            }
        }
    </style>
</head>
<body>
    <main class="app-shell" aria-label="Dashboard POKTAN Lancang Kuning">
        <header class="hero">
            <img
                class="hero__image"
                src="{{ asset('assets/f0ac4358d9c35d6394ebe10f9134021c.jpg') }}"
                alt="Ilustrasi sawah hijau, gunung, langit cerah, awan, dan petani memakai caping memegang tablet"
            >

            <div class="hero__actions" aria-label="Aksi utama">
                <button class="icon-button" type="button" aria-label="Buka menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>
                    </svg>
                </button>

                <button class="icon-button" type="button" aria-label="Buka notifikasi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </header>

        <section class="content">
            <section aria-labelledby="quick-title">
                <div class="section-heading">
                    <h2 id="quick-title">Menu Cepat</h2>
                    <a class="see-all" href="#" aria-label="Lihat semua menu cepat">
                        Lihat Semua
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>

                <div class="quick-grid">
                    <a class="quick-item" href="#">
                        <span class="quick-icon quick-icon--green">
                            <img src="{{ asset('assets/380b60f2347e3d7e3398557810a28570.png') }}" alt="">
                        </span>
                        <span>Lahan Saya</span>
                    </a>

                    <a class="quick-item" href="#">
                        <span class="quick-icon quick-icon--blue">
                            <img src="{{ asset('assets/64f868d5b8420abeee611d71587187f4.png') }}" alt="">
                        </span>
                        <span>Cuaca</span>
                    </a>

                    <a class="quick-item" href="#">
                        <span class="quick-icon quick-icon--yellow">
                            <img src="{{ asset('assets/22e64d98711f269d11b18c73acbc0640.png') }}" alt="">
                        </span>
                        <span>Pupuk</span>
                    </a>

                    <a class="quick-item" href="#">
                        <span class="quick-icon quick-icon--purple">
                            <img src="{{ asset('assets/8207277b91ab508f851fdb73aae6af45.png') }}" alt="">
                        </span>
                        <span>Marketplace</span>
                    </a>
                </div>
            </section>

            <section class="weather-card" aria-label="Cuaca Lancang Kuning">
                <div class="weather-summary">
                    <img class="weather-icon" src="{{ asset('assets/c0d58d3639360db73301bf07dd1e74a7.png') }}" alt="">
                    <div class="weather-temp">
                        <strong>28°C</strong>
                        <span>Cerah Berawan</span>
                    </div>
                </div>

                <div class="weather-details">
                    <div class="weather-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#ef3b66" aria-hidden="true">
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke-linejoin="round"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Lancang Kuning</span>
                    </div>

                    <div class="weather-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#0f9b6e" aria-hidden="true">
                            <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" stroke-linejoin="round"/>
                        </svg>
                        <span>Kelembaban 75%</span>
                    </div>

                    <div class="weather-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#547589" aria-hidden="true">
                            <path d="M3 8h11a3 3 0 1 0-3-3" stroke-linecap="round"/>
                            <path d="M3 12h16a3 3 0 1 1-3 3" stroke-linecap="round"/>
                            <path d="M3 16h8" stroke-linecap="round"/>
                        </svg>
                        <span>Angin 11 km/jam</span>
                    </div>
                </div>
            </section>

            <section aria-labelledby="feature-title">
                <div class="section-heading">
                    <h2 id="feature-title">Fitur Utama</h2>
                </div>

                <div class="feature-grid">
                    <a class="feature-card" href="#">
                        <span class="feature-icon feature-icon--green">
                            <img src="{{ asset('assets/c8bf8beb54ee409ed96f36c298a08745.png') }}" alt="">
                        </span>
                        <strong>Lahan Saya</strong>
                        <span>Kelola lahan pertanian</span>
                    </a>

                    <a class="feature-card" href="#">
                        <span class="feature-icon feature-icon--yellow">
                            <img src="{{ asset('assets/15b76236080b2a5c0f77766f782d5a90.png') }}" alt="">
                        </span>
                        <strong>Jadwal Tanam</strong>
                        <span>Catat dan kelola jadwal tanam</span>
                    </a>

                    <a class="feature-card" href="#">
                        <span class="feature-icon feature-icon--purple">
                            <img src="{{ asset('assets/cd1f383c69b93d4fbbb5d7faff7d4675.png') }}" alt="">
                        </span>
                        <strong>Edukasi</strong>
                        <span>Tips &amp; informasi pertanian</span>
                    </a>

                    <a class="feature-card" href="#">
                        <span class="feature-icon feature-icon--rose">
                            <img src="{{ asset('assets/e0abcd1368c3aded38abeab48ba8995c.png') }}" alt="">
                        </span>
                        <strong>Hama &amp; Penyakit</strong>
                        <span>Kenali dan atasi masalah</span>
                    </a>
                </div>
            </section>
        </section>
    </main>

    <nav class="bottom-nav" aria-label="Navigasi utama">
        <a class="bottom-nav__item is-active" href="#" aria-current="page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="m3 10 9-7 9 7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 9v11h14V9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 20v-6h4v6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Beranda</span>
        </a>

        <a class="bottom-nav__item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M12 21V9" stroke-linecap="round"/>
                <path d="M8 9c-3.2 0-5-2.4-5-6 3.6 0 6 1.8 6 5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 9c3.2 0 5-2.4 5-6-3.6 0-6 1.8-6 5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Lahan</span>
        </a>

        <a class="bottom-nav__item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M6 7h12l1 14H5L6 7Z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 7a3 3 0 0 1 6 0" stroke-linecap="round"/>
            </svg>
            <span>Marketplace</span>
        </a>

        <a class="bottom-nav__item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Notifikasi</span>
        </a>

        <a class="bottom-nav__item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round"/>
            </svg>
            <span>Profile</span>
        </a>
    </nav>
</body>
</html>

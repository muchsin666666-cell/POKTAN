<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - POKTAN Lancang Kuning</title>
    <style>
        :root {
            --green-950: #052e16;
            --green-900: #14532d;
            --green-800: #166534;
            --green-700: #15803d;
            --green-600: #16a34a;
            --blue-600: #0ea5e9;
            --ink: #080d08;
            --muted: #7c847b;
            --line: #cfd8cf;
            --surface: rgba(255, 255, 255, 0.96);
            --shadow: 0 18px 42px rgba(20, 83, 45, 0.2);
            --field-shadow: 0 4px 10px rgba(8, 13, 8, 0.18);
            --app-max: 430px;
        }

        * {
            box-sizing: border-box;
        }

        html {
            min-height: 100%;
            background: #e9f7df;
        }

        body {
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            display: grid;
            place-items: center;
            overflow-x: hidden;
            color: var(--ink);
            font-family: "Poppins", "Inter", "Nunito", Arial, sans-serif;
            background:
                radial-gradient(circle at top, rgba(255, 255, 255, 0.78), transparent 34rem),
                linear-gradient(135deg, #dff4d2, #f7fff2 45%, #d7efd0);
        }

        a {
            color: inherit;
        }

        button,
        input {
            font: inherit;
        }

        img {
            display: block;
            max-width: 100%;
        }

        .login-page {
            width: 100%;
            max-width: var(--app-max);
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            gap: clamp(22px, 4.5dvh, 42px);
            margin: 0 auto;
            padding: clamp(54px, 10dvh, 86px) clamp(26px, 8vw, 36px) clamp(24px, 4.8dvh, 36px);
            overflow: hidden;
            background:
                linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(237, 252, 230, 0.24)),
                var(--login-bg) center / cover no-repeat;
            box-shadow: 0 28px 90px rgba(20, 83, 45, 0.18);
        }

        .login-brand {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            animation: fade-up 620ms ease both;
        }

        .login-brand__logo-frame {
            width: clamp(98px, 30vw, 128px);
            height: clamp(98px, 30vw, 128px);
            display: grid;
            place-items: center;
            border-radius: 50%;
        }

        .login-brand__logo {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .login-brand h1,
        .login-brand p,
        .login-form h2,
        .register-text {
            margin: 0;
        }

        .login-brand h1 {
            margin-top: clamp(6px, 1.5vw, 10px);
            color: #050505;
            font-size: clamp(1.7rem, 7.5vw, 2.15rem);
            line-height: 0.98;
            font-weight: 950;
            letter-spacing: 0;
        }

        .login-brand p {
            margin-top: 6px;
            color: #050505;
            font-size: clamp(1.08rem, 5.2vw, 1.36rem);
            line-height: 1.05;
            font-weight: 900;
            letter-spacing: 0;
        }

        .login-card {
            width: 100%;
            max-width: 336px;
            margin: auto auto 0;
            padding: clamp(18px, 5vw, 24px) clamp(14px, 4.5vw, 18px) clamp(14px, 4vw, 18px);
            border: 1px solid rgba(255, 255, 255, 0.72);
            border-radius: 24px;
            background: var(--surface);
            box-shadow: var(--shadow);
            animation: fade-up 720ms 100ms ease both;
            backdrop-filter: blur(10px);
        }

        .login-form {
            display: grid;
            gap: clamp(10px, 2.8vw, 13px);
        }

        .login-form h2 {
            margin-bottom: 2px;
            color: #080808;
            font-size: clamp(1rem, 4.1vw, 1.16rem);
            line-height: 1.2;
            font-weight: 950;
            text-align: center;
            letter-spacing: 0;
        }

        .form-field {
            min-width: 0;
        }

        .form-field label {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .form-field input {
            width: 100%;
            min-height: clamp(46px, 12vw, 50px);
            padding: 0 clamp(12px, 4vw, 16px);
            border: 1px solid #9ca39c;
            border-radius: 11px;
            outline: 0;
            color: #121812;
            background: #ffffff;
            font-size: clamp(0.88rem, 3.5vw, 0.98rem);
            font-weight: 650;
            box-shadow: var(--field-shadow);
            transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .form-field input::placeholder {
            color: #9aa09a;
            font-weight: 600;
        }

        .form-field input:focus {
            border-color: var(--green-700);
            box-shadow:
                0 0 0 3px rgba(21, 128, 61, 0.16),
                0 4px 10px rgba(8, 13, 8, 0.15);
        }

        .login-options {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            min-width: 0;
            color: #6d756d;
            font-size: clamp(0.68rem, 2.65vw, 0.76rem);
            line-height: 1.15;
            font-weight: 800;
        }

        .remember-me {
            min-width: 0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
            cursor: pointer;
        }

        .remember-me input {
            width: clamp(13px, 3.6vw, 15px);
            height: clamp(13px, 3.6vw, 15px);
            flex: 0 0 auto;
            margin: 0;
            accent-color: var(--green-700);
        }

        .forgot-link {
            flex: 0 1 auto;
            color: #111711;
            font-weight: 900;
            text-align: right;
            text-decoration: none;
            white-space: nowrap;
        }

        .login-button {
            width: 100%;
            min-height: clamp(48px, 13vw, 54px);
            display: inline-grid;
            place-items: center;
            border: 0;
            border-radius: 11px;
            color: #ffffff;
            background: #008b18;
            box-shadow: 0 10px 18px rgba(0, 139, 24, 0.18);
            font-size: clamp(1.35rem, 6vw, 1.62rem);
            line-height: 1;
            font-weight: 950;
            cursor: pointer;
            transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
        }

        .login-button:hover {
            background: #047819;
            box-shadow: 0 12px 22px rgba(4, 120, 25, 0.24);
            transform: translateY(-1px);
        }

        .login-button:active {
            transform: translateY(0);
        }

        .register-text {
            color: #2a302a;
            font-size: clamp(0.85rem, 3.5vw, 0.98rem);
            line-height: 1.25;
            font-weight: 650;
            text-align: center;
        }

        .register-text a {
            color: var(--blue-600);
            font-weight: 950;
            text-decoration: none;
        }

        @keyframes fade-up {
            from {
                opacity: 0;
                transform: translateY(12px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 359px) {
            .login-page {
                padding-right: 20px;
                padding-left: 20px;
            }

            .login-options {
                flex-wrap: wrap;
            }

            .forgot-link {
                margin-left: auto;
            }
        }

        @media (max-height: 680px) {
            .login-page {
                gap: 16px;
                padding-top: 38px;
                padding-bottom: 18px;
            }

            .login-brand__logo-frame {
                width: clamp(86px, 25vw, 102px);
                height: clamp(86px, 25vw, 102px);
            }

            .login-card {
                padding-top: 16px;
            }
        }

        @media (min-width: 768px) {
            body {
                padding: 24px 0;
            }

            .login-page {
                min-height: min(880px, calc(100dvh - 48px));
                border-radius: 30px;
            }
        }

        @media (min-width: 1024px) {
            body {
                padding: 32px 0;
            }

            .login-page {
                min-height: min(900px, calc(100dvh - 64px));
                border-radius: 34px;
            }
        }
    </style>
</head>
<body>
    <main class="login-page" style="--login-bg: url('{{ asset('assets/bg-sawah.jpg') }}');">
        <section class="login-brand" aria-label="POKTAN Lancang Kuning">
            <div class="login-brand__logo-frame">
                <img class="login-brand__logo" src="{{ asset('assets/logo-padi.png') }}" alt="Logo POKTAN Lancang Kuning">
            </div>
            <h1>POKTAN</h1>
            <p>Lancang Kuning</p>
        </section>

        <section class="login-card" aria-labelledby="login-title">
            <form class="login-form" action="#" method="POST">
                @csrf

                <h2 id="login-title">Masuk ke Akun Anda</h2>

                <div class="form-field">
                    <label for="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        autocomplete="username"
                        required
                    >
                </div>

                <div class="form-field">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <div class="login-options">
                    <label class="remember-me" for="remember">
                        <input id="remember" name="remember" type="checkbox">
                        <span>Ingat saya</span>
                    </label>

                    <a href="#" class="forgot-link">Lupa kata sandi?</a>
                </div>

                <button class="login-button" type="submit">Masuk</button>

                <p class="register-text">
                    Belum punya akun?
                    <a href="#">Daftar di sini</a>
                </p>
            </form>
        </section>
    </main>
</body>
</html>

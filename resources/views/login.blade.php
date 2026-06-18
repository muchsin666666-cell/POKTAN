<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - POKTAN Lancang Kuning</title>
    @vite(['resources/css/login.css', 'resources/js/login.js'])
</head>
<body>
    <main class="halaman-login" style="--login-bg: url('{{ asset('assets/bg-sawah.jpg') }}');">
        <section class="identitas-aplikasi" aria-label="POKTAN Lancang Kuning">
            <div class="bingkai-logo">
                <img class="logo-aplikasi" src="{{ asset('assets/logo-padi.png') }}" alt="Logo POKTAN Lancang Kuning">
            </div>
            <h1>POKTAN</h1>
            <p>Lancang Kuning</p>
        </section>

        <section class="kartu-login" aria-labelledby="login-title">
            <form class="form-login" action="#" method="POST" data-login-form data-admin-url="{{ route('admin') }}" data-dashboard-url="{{ route('dashboard') }}" data-pembeli-url="{{ route('pembeli.marketplace') }}">
                @csrf

                <h2 id="login-title">Masuk ke Akun Anda</h2>

                <div class="kolom-formulir">
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

                <div class="kolom-formulir">
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

                <div class="opsi-login">
                    <label class="ingat-saya" for="remember">
                        <input id="remember" name="remember" type="checkbox">
                        <span>Ingat saya</span>
                    </label>

                    <a href="#" class="tautan-lupa-password">Lupa kata sandi?</a>
                </div>

                <button class="tombol-masuk" type="submit">Masuk</button>

                <p class="pesan-login" hidden data-login-message></p>

                <p class="teks-daftar">
                    Belum punya akun?
                    <a href="{{ route('daftar') }}">Daftar Petani</a>
                    atau
                    <a href="{{ route('daftar-pembeli') }}">Daftar Pembeli</a>
                </p>
            </form>
        </section>
    </main>
</body>
</html>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar - POKTAN Lancang Kuning</title>
    @vite('resources/css/login.css')
</head>
<body>
    <main class="halaman-login halaman-daftar" style="--login-bg: url('{{ asset('assets/bg-sawah.jpg') }}');">
        <section class="identitas-aplikasi" aria-label="POKTAN Lancang Kuning">
            <div class="bingkai-logo">
                <img class="logo-aplikasi" src="{{ asset('assets/logo-padi.png') }}" alt="Logo POKTAN Lancang Kuning">
            </div>
            <h1>POKTAN</h1>
            <p>Lancang Kuning</p>
        </section>

        <section class="kartu-login kartu-daftar" aria-labelledby="daftar-title">
            <form class="form-login" action="#" method="POST">
                @csrf

                <h2 id="daftar-title">Buat Akun Baru</h2>

                <div class="kolom-formulir">
                    <label for="nik">NIK</label>
                    <input
                        id="nik"
                        name="nik"
                        type="text"
                        inputmode="numeric"
                        minlength="16"
                        maxlength="16"
                        pattern="[0-9]{16}"
                        placeholder="NIK"
                        autocomplete="off"
                        required
                    >
                </div>

                <div class="kolom-formulir">
                    <label for="nama">Nama</label>
                    <input
                        id="nama"
                        name="nama"
                        type="text"
                        placeholder="Nama"
                        autocomplete="name"
                        required
                    >
                </div>

                <div class="kolom-formulir">
                    <label for="no_hp">No HP</label>
                    <input
                        id="no_hp"
                        name="no_hp"
                        type="tel"
                        inputmode="tel"
                        placeholder="No HP"
                        autocomplete="tel"
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
                        autocomplete="new-password"
                        required
                    >
                </div>

                <div class="kolom-formulir">
                    <label for="password_confirmation">Konfirmasi Password</label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        placeholder="Konfirmasi Password"
                        autocomplete="new-password"
                        required
                    >
                </div>

                <button class="tombol-masuk" type="submit">Daftar</button>

                <p class="teks-daftar">
                    Sudah punya akun?
                    <a href="{{ route('login') }}">Masuk di sini</a>
                </p>
            </form>
        </section>
    </main>
</body>
</html>

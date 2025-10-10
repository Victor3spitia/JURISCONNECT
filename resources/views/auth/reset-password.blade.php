<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>JurisConnect SENA - Restablecer Contraseña</title>
    <link rel="stylesheet" href="{{ asset('/css/register.css') }}">
    <style>
        /* Para que el ojito quede dentro del input */
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .password-wrapper input {
            width: 100%;
            padding-right: 35px; /* espacio para el ojito */
        }

        .toggle-password {
            position: absolute;
            right: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .toggle-password svg {
            width: 20px;
            height: 20px;
        }
    </style>
</head>
<body>
    <!-- Fondo -->
    <div class="background-image">
        <img src="{{ asset('img/Login.jpg') }}" alt="Fondo de Pantalla" class="background-image">
    </div>

    <!-- Izquierda: logo -->
    <div class="branding">
        <img src="{{ asset('img/LogoJ.png') }}" alt="JurisConnect">
    </div>

    <!-- Derecha: formulario -->
    <div class="login-box">
        <h2>Actualizar Contraseña</h2>


        <!-- Formulario -->
        <form method="POST" action="{{ route('password.store') }}">
            @csrf
            <input type="hidden" name="token" value="{{ request()->route('token') }}">

            <!-- Email -->
            <label for="email">Correo Electrónico</label>
            <input id="email" type="email" name="email" value="{{ old('email', request('email')) }}" required autofocus>
            @error('email')
                <span class="error-message">{{ $message }}</span>
            @enderror

            <!-- Password -->
            <label for="password">Nueva Contraseña</label>
            <div class="password-wrapper">
                <input id="password" type="password" name="password" required>
                <span class="toggle-password" onclick="togglePassword('password')">
                    <!-- Ojo cerrado -->
                    <svg xmlns="http://www.w3.org/2000/svg" id="eyeClosed-password"
                        viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.12 10.12 0 0 1 12 20c-7 0-11-8-11-8
                                 a19.44 19.44 0 0 1 4.24-5.94M9.9 4.24A9.77 9.77 0 0 1 12 4
                                 c7 0 11 8 11 8a19.44 19.44 0 0 1-4.24 5.94M1 1l22 22"/>
                    </svg>
                    <!-- Ojo abierto -->
                    <svg xmlns="http://www.w3.org/2000/svg" id="eyeOpen-password"
                        viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </span>
            </div>
            @error('password')
                <span class="error-message">{{ $message }}</span>
            @enderror

            <!-- Confirm Password -->
            <label for="password_confirmation">Confirmar Contraseña</label>
            <div class="password-wrapper">
                <input id="password_confirmation" type="password" name="password_confirmation" required>
                <span class="toggle-password" onclick="togglePassword('password_confirmation')">
                    <svg xmlns="http://www.w3.org/2000/svg" id="eyeClosed-password"
                        viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.12 10.12 0 0 1 12 20c-7 0-11-8-11-8
                                 a19.44 19.44 0 0 1 4.24-5.94M9.9 4.24A9.77 9.77 0 0 1 12 4
                                 c7 0 11 8 11 8a19.44 19.44 0 0 1-4.24 5.94M1 1l22 22"/>
                    </svg>
                    <!-- Ojo abierto -->
                    <svg xmlns="http://www.w3.org/2000/svg" id="eyeOpen-password"
                        viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </span>
            </div>
            @error('password_confirmation')
                <span class="error-message">{{ $message }}</span>
            @enderror

            <!-- Botones -->
            
            <div class="button-group">
                <button type="button" class="btn btn-back" onclick="window.location='{{ url('/') }}'">
                    Cancelar
                </button>
                <button class="btn" type="submit">Guardar</button>
            </div>
        </form>

        <img src="{{ asset('img/Sena.png') }}" alt="Logo SENA" class="sena-logo">
    </div>

    <script>
        function togglePassword(fieldId) {
            const input = document.getElementById(fieldId);
            const eyeClosed = document.getElementById(`eyeClosed-${fieldId}`);
            const eyeOpen = document.getElementById(`eyeOpen-${fieldId}`);

            if (input.type === "password") {
                input.type = "text";
                eyeClosed.style.display = "none";
                eyeOpen.style.display = "inline";
            } else {
                input.type = "password";
                eyeClosed.style.display = "inline";
                eyeOpen.style.display = "none";
            }
        }
    </script>
</body>
</html>

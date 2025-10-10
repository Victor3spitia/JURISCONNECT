<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>JurisConnect SENA - register</title>
        <link rel="stylesheet" href="styles.css">
    </head>

<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background-color: #ffffff;
            overflow: hidden;
        }

        /* Franja verde superior */
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 80px;
            width: 100%;
            background-color: #39A900;
            z-index: 0;
        }

        /* Onda más oscura (capa inferior) */
        .wave1 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 850px;
            background-color: #39A900;
            clip-path: polygon(0% 100%, 0% 50%, 50% 70%, 100% 50%, 100% 100%);
            z-index: 4;
        }

        /* Onda intermedia (verde medio) */
        .wave2 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 560px;
            background-color: #8dc73f;
            clip-path: polygon(0% 100%, 0% 60%, 50% 75%, 100% 60%, 100% 100%);
            z-index: 4;
        }

        /* Onda más clara (capa superior) */
        .wave3 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 300px;
            background-color: #4e9b10;
            clip-path: polygon(0% 100%, 0% 65%, 50% 78%, 100% 65%, 100% 100%);
            z-index: 4;
            }

        .login-container {
            z-index: 5;
            background-color: white;
            padding: 2.5rem 4rem; /* Aumenta el padding horizontal */
            border-radius: 10px;
            box-shadow: 0 4px 15px rgb(0, 0, 0);
            text-align: center;
            position: relative;
            width: 420px; /* Añade un ancho fijo mayor */
            max-width: 95vw;
        }

        .logo-arriba {
            margin-bottom: 15px;
            margin-top: 5px;      
        }

        h2 {
            font-size: 1.6rem;
            margin-bottom: 30px;
            font-family: 'Times New Roman';
            text-transform: uppercase;
        }

        form {
            text-align: left;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 0.95rem;
        }

        input[type="email"], input[type="password"], input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 2px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
        }

        input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus {
            border-color: #39A900;
            outline: none;
        }

        /* Checkbox remember me */
        .remember-container {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .remember-container input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
            margin-bottom: 0;
        }

        .remember-container label {
            margin-bottom: 0;
            font-weight: normal;
            font-size: 0.9rem;
        }

        button {
            width: 100%;
            background-color: #39A900;
            color: white;
            padding: 12px;
            font-weight: bold;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 1rem;
        }

        button:hover {
            background-color: #2d7a00;
        }

        .forgot-link {
            margin-top: 10px;
            font-size: 0.9rem;
            text-align: right;
        }

        .forgot-link a {
            color: #39A900;
            text-decoration: none;
        }

        .forgot-link a:hover {
            text-decoration: underline;
        }

        .logo_container {
            padding: 10%;
        }

        /* Estilos para mensajes de error */
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: -10px;
            margin-bottom: 15px;
        }

        /* Estilos para mensajes de estado de sesión */
        .session-status {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-size: 0.9rem;
        }

        /* Estilos para campos con errores */
        .error-input {
            border-color: #dc3545 !important;
        }

        a {
            display:inline-block; 
            text-align:center; 
            width:100%; 
            background-color:#39A900; 
            color:white; 
            padding:12px; 
            font-weight:bold; 
            border-radius:20px; 
            margin-top:10px; 
            text-decoration:none;
        }
</style>

<body>
        <!-- Ondas del fondo -->
        <div class="wave1"></div>
        <div class="wave2"></div>
        <div class="wave3"></div>

    <div class="login-container">

        <form method="POST" action="{{ route('register.validate') }}">
        @csrf

        <!-- Título -->
            <h3>ingrese el correo electronico y su contraseña que le fue enviado</h3>

            <!-- Email Address -->
                <label for="email">{{ __('Correo Electrico') }}</label>
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value="{{ old('email') }}" 
                    required 
                    autofocus 
                    autocomplete="username"
                    class="{{ $errors->get('email') ? 'error-input' : '' }}"
                >
                @if ($errors->get('email'))
                    <div class="error-message">
                        @foreach ($errors->get('email') as $error)
                            {{ $error }}
                        @endforeach
                    </div>
                @endif

                <!-- Password -->
                <label for="password">{{ __('Contraseña') }}</label>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    required 
                    autocomplete="current-password"
                    class="{{ $errors->get('password') ? 'error-input' : '' }}"
                >
                @if ($errors->get('password'))
                    <div class="error-message">
                        @foreach ($errors->get('password') as $error)
                            {{ $error }}
                        @endforeach
                    </div>
                @endif

      

                <x-primary-button class="ms-4" type="submit">
                    {{ __('Validar') }}
                </x-primary-button>


                <a href='{{ route('login') }}'" class="ms-4" >
                    {{ __('volver al login') }}
                </a>

        </form>
    </div>

        <div class="flex items-center justify-end mt-4">
            <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('login') }}">
                {{ __('¿Ya estás registrado?') }}
            </a>

            <x-primary-button class="ms-4">
                {{ __('Register') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>

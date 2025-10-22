    <!DOCTYPE html>
    <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="{{ asset('Css/lawyer-dashboard.css') }}">

        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


        <!-- Scripts -->
        @vite([
        'resources/css/app.css',
        'resources/css/dashboard.css',
        'resources/js/app.js',
        'resources/js/dash.js'
        ])

    </head>

    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            <!-- Page Heading -->
            @isset($header)
            @endisset

            <!-- Page Content -->
            <main>
                {{ $slot }}
                <!-- SweetAlert2 Messages -->
@if ($errors->any())
    <script>
        let errorMessages = `
            @foreach ($errors->all() as $error)
                - {{ $error }}<br>
            @endforeach
        `;
        Swal.fire({
            icon: 'error',
            title: 'Errores de validación',
            html: errorMessages,
            confirmButtonColor: '#d33',
        });
    </script>
@endif

@if (session('error'))
    <script>
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "{{ session('error') }}",
            confirmButtonColor: '#d33',
        });
    </script>
@endif

@if (session('success'))
    <script>
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: "{{ session('success') }}",
            confirmButtonColor: '#3085d6',
        });
    </script>
@endif

@if (session('warning'))
    <script>
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: "{{ session('warning') }}",
            confirmButtonColor: '#f1c40f',
        });
    </script>
@endif

            </main>
        </div>
    </body>

    </html>
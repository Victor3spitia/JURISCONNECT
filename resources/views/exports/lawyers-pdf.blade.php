<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Listado de Abogados</title>
    <style>
        body {
            font-family: sans-serif;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 6px;
            text-align: left;
        }
    </style>
</head>

<body>
    <h2>Listado de Abogados</h2>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo Doc</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
            </tr>
        </thead>
        <tbody>
            @foreach($lawyers as $lawyer)
            <tr>
                <td>{{ $lawyer->nombre }}</td>
                <td>{{ $lawyer->apellido }}</td>
                <td>{{ $lawyer->tipo_documento }}</td>
                <td>{{ $lawyer->numero_documento }}</td>
                <td>{{ $lawyer->correo }}</td>
                <td>{{ $lawyer->telefono }}</td>
                <td>{{ $lawyer->especialidad }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
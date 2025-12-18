<x-app-layout>
    <div class="container">
        <h1 class="mb-4">Detalles del Proceso Judicial</h1>

        <div class="card">
            <div class="card-body">
                {{-- Datos Generales --}}
                <h4>Datos Generales</h4>
                <p><strong>Tipo de proceso:</strong> {{ $concepto->titulo }}</p>
                <p><strong>Número de radicado:</strong> {{ $concepto->categoria }}</p>
                <p><strong>Juzgado / Tribunal:</strong> {{ $concepto->descripcion ?? 'No registrado' }}</p>
                <p><strong>Etapa procesal:</strong> {{ $concepto->estado ?? 'No registrada' }}</p>
                <p><strong>Fecha de radicación:</strong> {{ $concepto->fecha_radicacion ?? 'No registrada' }}</p>

                {{-- Partes Involucradas --}}
                <h4>Partes Involucradas</h4>
                <p><strong>Demandante(s):</strong> {{ $concepto->demandante }}</p>
                <p><strong>Demandado(s):</strong> {{ $concepto->demandado }}</p>
                <!-- <p><strong>Abogado(s):</strong> {{ $conceptos->abogado ?? 'No registrado' }}</p> -->

                <hr>

                {{-- Información Jurídica --}}
                <h4>Información Jurídica</h4>
                <p><strong>Pretensiones:</strong> {{ $concepto->pretensiones ?? 'No registradas' }}</p>
                <p><strong>Hechos:</strong> {{ $concepto->hechos ?? 'No registrados' }}</p>
                <p><strong>Fundamentos de derecho:</strong> {{ $concepto->fundamentos_derecho ?? 'No registrados' }}</p>
                <p><strong>Pruebas:</strong> {{ $concepto->pruebas ?? 'No registradas' }}</p>
                <p><strong>Medidas cautelares:</strong> {{ $concepto->medidas_cautelares ?? 'No registradas' }}</p>

                <hr>

                {{-- Documentos --}}
                <h4>Documentos</h4>
                @if($concepto->documento)
                <a href="{{ asset('storage/' . $concepto->documento) }}" target="_blank" class="btn btn-sm btn-primary">
                    Ver documento adjunto
                </a>
                @else
                <p>No hay documento adjunto</p>
                @endif

                <hr>

                {{-- Seguimiento --}}
                <h4>Seguimiento</h4>
                <p><strong>Estado actual:</strong> {{ $concepto->estado ?? 'No registrado' }}</p>
                <p><strong>Observaciones:</strong> {{ $concepto->observaciones ?? 'No registradas' }}</p>

                <div class="mt-4">
                    <a href="{{ route('procesos.edit', $concepto->id) }}" class="btn btn-warning">Editar</a>
                    <a href="{{ route('procesos.index') }}" class="btn btn-secondary">Volver al listado</a>
                </div>
            </div>
        </div>
    </div>

</x-app-layout>
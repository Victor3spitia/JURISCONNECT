<!DOCTYPE html>
<html lang="es">

    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Procesos Pendientes - CSS Puro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Enlace a CSS corregido -->
    <link rel="stylesheet" href="{{ asset('css/editCon.css') }}">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <i class="fas fa-balance-scale"></i>
                <span>Sistema Jurídico</span>
            </div>
        </div>
    </nav>


    <div class="container">
        <div class="header">
            <div class="header-content">
                <h1>Conceptos Jurídicos</h1>
                <p class="text-muted">Listado de los conceptos asociados al proceso seleccionado.</p>
            </div>
            <div>
                <a href="{{ route('conceptos.create') }}" class="cancel-btn">Volver al listado</a>
                <a class="cancel-btn" href="{{ route('dashboard.abogado') }}">
                <i class="fas fa-arrow-left"></i>
                Cancelar
            </a>
            </div>
        </div>

        @if(isset($conceptos) && $conceptos->isNotEmpty())
            <div class="concepts-container">
                <div class="concepts-list">
                    <div class="mb-2">
                        <h4>Conceptos del proceso:</h4>
                        <p class="font-bold">{{ $proceso->numero_radicado ?? ('ID ' . $proceso->id) }}</p>
                    </div>

                    @foreach($conceptos as $c)
                        <div class="concept-card fade-in-up">
                            <h5>{{ $c->titulo }}</h5>
                            <div class="concept-meta">Redactado por: {{ $c->abogado->name ?? ($c->abogado->user->name ?? '—') }} · {{ $c->created_at->format('d M Y') ?? '' }}</div>
                            <p>{{ \Illuminate\Support\Str::limit($c->descripcion ?? $c->concepto ?? '', 300) }}</p>
                            <div class="concept-actions">
                                <a href="{{ route('concepto.show', $c->id) }}" class="action-btn">Ver detalle</a>
                                <a href="{{ route('procesos.edit', $proceso->id) }}" class="action-btn" style="background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%)">Editar proceso</a>
                            </div>
                        </div>
                    @endforeach
                </div>

                <aside class="concept-sidebar">
                    <h5>Resumen</h5>
                    <p><strong>Total de conceptos:</strong> {{ $conceptos->count() }}</p>
                    <p><strong>Proceso:</strong> {{ $proceso->tipo_proceso ?? '—' }}</p>
                    <p><strong>Demandante:</strong> {{ $proceso->demandante ?? '—' }}</p>
                    <p><strong>Demandado:</strong> {{ $proceso->demandado ?? '—' }}</p>
                </aside>
            </div>

        <!-- Detalle de un concepto específico -->
        @elseif(isset($concepto))
            <div class="detail-card fade-in-up">
                <div class="detail-header">
                    <div>
                        <div class="detail-title">{{ $concepto->titulo }}</div>
                        <div class="detail-meta">Proceso: {{ $concepto->proceso->numero_radicado ?? ('ID ' . $concepto->proceso_id) }} · Redactado: {{ $concepto->created_at->format('d M Y') }}</div>
                    </div>
                    <div class="detail-actions">
                        <a href="{{ route('procesos.edit', $concepto->proceso_id) }}" class="action-btn" style="background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%)"><i class="fas fa-edit"></i> Editar proceso</a>
                        <a href="javascript:history.back()" class="action-btn" style="background:linear-gradient(135deg,#6b7280 0%,#4b5563 100%)"><i class="fas fa-arrow-left"></i> Volver</a>
                    </div>
                </div>

                <div class="detail-body">
                    <div>
                        <div class="detail-section">
                            <h4>Descripción</h4>
                            <p>{!! nl2br(e($concepto->descripcion ?? $concepto->concepto)) !!}</p>
                        </div>

                        <!-- <div class="detail-section">
                            <h4>Información Jurídica</h4>
                            <p><strong>Estado:</strong> {{ $proceso->estado ?? 'No registrado' }}</p>
                            <p><strong>Observaciones:</strong> {{ $concepto->observaciones ?? 'No registradas' }}</p>
                        </div> -->
                    </div>

                    <aside class="concept-sidebar">
                        <h5>Detalles</h5>
                        <p><strong>Abogado:</strong> {{ auth()->user()->name ?? ($concepto->abogado->user->name ?? '—') }}</p>
                        <p><strong>Fecha:</strong> {{ $concepto->created_at->format('d M Y H:i') }}</p>
                        <!-- <p><strong>Categoría:</strong> {{ $concepto->categoria ?? '—' }}</p> -->
                        @if($concepto->documento)
                            <p><a href="{{ asset('storage/' . $concepto->documento) }}" target="_blank" class="action-btn">Ver documento</a></p>
                        @endif
                    </aside>
                </div>
            </div>
        @else
            <p>No hay conceptos para mostrar.</p>
            <a href="{{ route('procesos.index') }}" class="btn btn-secondary">Volver al listado</a>
        @endif

        
</body>
</html>
<!DOCTYPE html>
<html lang="es">

    <!-- pagina para ver que procesos tiene pendiente para concepto  -->
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
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <h1>Procesos Pendientes de Concepto Jurídico</h1>
                <p>Gestiona los procesos que requieren análisis jurídico</p>
            </div>
            <!-- busqueda -->
            <!-- Buscador moderno -->
            <div class="search-wrapper">
                <div class="search-group">
                    <input
                    type="text"
                    id="searchInput"
                    class="search-input-modern"
                    placeholder="Buscar por ID, radicado o fecha...">
                    <button id="searchBtn" class="search-button-modern">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <a class="cancel-btn" href="{{ route('dashboard.abogado') }}">
                <i class="fas fa-arrow-left"></i>
                Cancelar
            </a>
        </div>

        <!-- Alerta de éxito (oculta por defecto) -->
        <div id="success-alert" class="alert alert-success hidden">
            <i class="fas fa-check-circle"></i>
            <span>Operación realizada exitosamente.</span>
            <button class="alert-close" onclick="closeAlert('success-alert')">
                <i class="fas fa-times"></i>
            </button>
        </div>


        <!-- Info de procesos pendientes -->
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <p class="font-bold">Procesos Pendientes</p>

            </div>
        </div>

        <!-- Lista de Procesos -->
        <div class="process-grid">
            @include('profile.partials.process-card', ['proceso' => $procesos])
        </div>

        <!-- Recordatorio -->
        <div class="reminder">
            <div class="reminder-content">
                <div class="reminder-icon">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="reminder-text">
                    <h4>Recordatorio Importante</h4>
                    <p>Los conceptos jurídicos deben ser claros, precisos y fundamentados en la normatividad vigente. Asegúrate de incluir todas las referencias legales pertinentes y un análisis detallado del caso.</p>
                </div>
            </div>
        </div>
    </div>





    <script>
function closeAlert(alertId) {
        document.getElementById(alertId).classList.add('hidden');
    }

    // Ejemplo para mostrar alerta de éxito
function showSuccessAlert() {
        document.getElementById('success-alert').classList.remove('hidden');
    }

// ===== FUNCIONALIDAD DE BÚSQUEDA AJAX =====
let searchTimeout;

function performSearch(searchTerm) {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        params.append('ajax', '1');

// Usar la ruta actual (o reemplaza por route('procesos.index'))
fetch(`${window.location.pathname}?${params.toString()}`, {
        method: 'GET',
        headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
        if (data.success && data.html) {
            // Reemplaza el grid de tarjetas con el HTML devuelto
            const grid = document.querySelector('.process-grid');
            if (grid) {
                grid.innerHTML = data.html;
            }

            // Si el backend devuelve un total, actualiza el contador si existe
            if (data.total !== undefined) {
                const totalEl = document.getElementById('totalCount');
                if (totalEl) totalEl.textContent = data.total;
            }

            // Actualizar URL sin recargar
            const newUrl = new URL(window.location);
            if (searchTerm) newUrl.searchParams.set('search', searchTerm);
            else newUrl.searchParams.delete('search');
            newUrl.searchParams.delete('page');
            window.history.replaceState({}, '', newUrl.toString());
                } else {
                    console.error('Respuesta inválida de búsqueda', data);
                }
            })
            .catch(err => console.error('Error en búsqueda:', err));
    }

// ===== ABRIR Y CERRAR MODAL DE PROCESO =====
// Funcionalidad removida - Ahora redirige directamente a la página de detalles


function confirmDelete(id, nombre) {
    Swal.fire({
        title: 'Confirmar Eliminación',
        html: `¿Estás seguro de eliminar el proceso de <b>${nombre}</b>?<br>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            htmlContainer: 'custom-text',
            confirmButton: 'custom-confirm',
            cancelButton: 'custom-cancel',
            icon: 'custom-icon'
        }
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById(`delete-form-${id}`).submit();
            }
        });
    }
    </script>

</body>

</html>
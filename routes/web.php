<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LawyerController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AbogadoController;
use App\Http\Controllers\AsistenteController;
use App\Http\Controllers\LegalProcessController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ConceptoController;
use App\Http\Controllers\ProcesoReportController;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AssistantExport;


// ===================================================================
// RUTA POR DEFECTO
// ===================================================================
Route::get('/', function () {
    return redirect()->route('login');
}); 


// ===================================================================
// RUTAS DE AUTENTICACIÓN
// =================================================================== 
require __DIR__ . '/auth.php';

// ===================================================================
// RUTAS PÚBLICAS
// ===================================================================
Route::post('/validar-registro', [RegisteredUserController::class, 'validarRegistro'])
    ->name('register.validate');

// ===================================================================
// RUTAS PROTEGIDAS POR AUTENTICACIÓN
// ===================================================================
Route::middleware(['auth'])->group(function () {

    // ===============================================================
    // DASHBOARDS
    // ===============================================================
    Route::get('/dashboard', [AdminController::class, 'index'])
        ->name('dashboard');

    Route::get('/dashboard/abogado', [AbogadoController::class, 'index'])
        ->name('dashboard.abogado');

    Route::get('/dashboard/asistente', [AsistenteController::class, 'index'])
        ->name('dashboard.asistente');

    // ===============================================================
    // PERFIL
    // ===============================================================
    Route::prefix('perfil')->name('profile.')->group(function () {
        Route::get('/foto', [ProfileController::class, 'editPhoto'])->name('photo');
        Route::post('/foto', [ProfileController::class, 'updatePhoto'])->name('photo.update');
    });

    // ===============================================================
    // ABOGADOS (LAWYERS)
    // ===============================================================
    Route::prefix('lawyers')->name('lawyers.')->group(function () {

        Route::post('/check-duplicates', [LawyerController::class, 'checkDuplicates'])
            ->name('check-duplicates');

        Route::post('/check-field', [LawyerController::class, 'checkField'])
            ->name('check-field');

        // EXPORTACIÓN ABOGADOS
        Route::get('/export-pdf', [LawyerController::class, 'exportPDF'])
            ->name('export.pdf');

        Route::get('/export-excel', function () {
            return Excel::download(new \App\Exports\LawyersExport, 'abogados.xlsx');
        })->name('export.excel');
    });
    Route::put('/lawyers/{lawyer}', [LawyerController::class, 'update'])
        ->name('lawyers.update');

    // Resource lawyers
    Route::resource('lawyers', LawyerController::class);

    Route::delete('/asistentes/{assistant}', [LawyerController::class, 'destroyAsist'])
        ->name('asistentes.destroy');

    Route::put('/assistants/{assistant}', [LawyerController::class, 'updateAssistant'])
        ->name('assistants.update');

    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');


    // ===============================================================
    // PROCESOS LEGALES
    // ===============================================================
    Route::prefix('procesos')->name('procesos.')->group(function () {

        // EXPORTACIONES — CONTROLADOR NUEVO Y CORRECTO
        Route::get('/export-pdf', [ProcesoReportController::class, 'exportPdf'])
            ->name('export.pdf');

        Route::get('/export-excel', [ProcesoReportController::class, 'exportExcel'])
            ->name('export.excel');

        // CRUD
        Route::get('/', [LegalProcessController::class, 'index'])->name('index');
        Route::get('/create', [LegalProcessController::class, 'create'])->name('create');
        Route::post('/', [LegalProcessController::class, 'store'])->name('store');
        Route::get('/{proceso}', [LegalProcessController::class, 'show'])->name('show');
        Route::get('/{proceso}/edit', [LegalProcessController::class, 'edit'])->name('edit');
        Route::put('/{proceso}', [LegalProcessController::class, 'update'])->name('update');
        Route::delete('/{proceso}', [LegalProcessController::class, 'destroy'])->name('destroy');

        // Conceptos
        Route::get('/{proceso}/concepto', [AbogadoController::class, 'mostrarFormularioConcepto'])
            ->name('concepto.create');

        Route::post('/{proceso}/concepto', [AbogadoController::class, 'guardarConcepto'])
            ->name('concepto.store');

        Route::put('/{proceso}/conceptos/{concepto}', [AbogadoController::class, 'updateConcepto'])
            ->name('conceptos.update');
    });

    // Rutas alternativas
    Route::get('/mis-procesos', [LegalProcessController::class, 'index'])
        ->name('mis.procesos');

    Route::get('/legal-processes/create', [LegalProcessController::class, 'create'])
        ->name('legal_processes.create');

    // ===============================================================
    // CONCEPTOS JURÍDICOS (ABOGADO)
    // ===============================================================
    Route::prefix('abogado')->name('abogado.')->group(function () {

        Route::get('/mis-procesos', [AbogadoController::class, 'misProcesos'])
            ->name('misConceptos');

        Route::get('/procesos', [AbogadoController::class, 'listarProcesos'])
            ->name('listar-procesos');

        Route::post('/finalizar-proceso/{id}', [AbogadoController::class, 'finalizarProceso'])
            ->name('finalizar-proceso');

        Route::post('/proceso/{id}/concepto', [AbogadoController::class, 'guardarConcepto'])
            ->name('guardar-concepto');

        Route::get('/crear-concepto/{id}', [AbogadoController::class, 'mostrarFormularioConcepto'])
            ->name('crear-concepto');

        Route::post('/procesos/{id}/conceptos', [ConceptoController::class, 'storeProceso'])
            ->name('conceptos.storeProceso');
    });

    

    // ===============================================================
    // CONCEPTOS (GENERALES)
    // ===============================================================
    Route::prefix('conceptos')->name('conceptos.')->group(function () {
        Route::get('/create', [ConceptoController::class, 'create'])->name('create');
        Route::post('/procesos/{proceso}/conceptos', [ConceptoController::class, 'store'])
            ->name('store');
    });
    Route::get('/concepto_juridicos/{id}', [ConceptoController::class, 'show'])
        ->name('concepto.show');

    // ===============================================================
    // Asistentes (LAWYERS)
    // ===============================================================
    Route::prefix('asistente')->name('asistente.')->group(function () {
        // Exportaciones
        Route::get('/export-pdf', [AssistantExport::class, 'exportPDF'])
            ->name('export.pdf');

        Route::get('/export-excel', function () {
            return Excel::download(new AssistantExport, 'Asistentes.xlsx');
        })->name('export.excel');
    });
});

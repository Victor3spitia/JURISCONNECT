<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LawyerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AbogadoController;
use App\Http\Controllers\AsistenteController;
use App\Http\Controllers\LegalProcessController;
use App\Exports\LawyersExport;
use Maatwebsite\Excel\Facades\Excel;

// Ruta por defecto
Route::get('/', function () {
    return redirect()->route('login');
});

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {

    // Dashboards según rol
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard'); // Administrador
    Route::get('/dashboard/abogado', [AbogadoController::class, 'index'])->name('dashboard.abogado'); // Abogado
    Route::get('/dashboard/asistente', [AsistenteController::class, 'index'])->name('dashboard.asistente'); // Asistente Jurídico

    // Perfil (foto)
    Route::get('/perfil/foto', [ProfileController::class, 'editPhoto'])->name('profile.photo');
    Route::post('/perfil/foto', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');

    // Exportaciones
    Route::get('/lawyers/export-pdf', [LawyerController::class, 'exportPDF'])
        ->name('lawyers.export.pdf');

    Route::get('/lawyers/export-excel', function () {
        return Excel::download(new LawyersExport, 'abogados.xlsx');
    })->name('lawyers.export.excel');

    // Abogados (CRUD)
    Route::resource('lawyers', LawyerController::class)->except(['edit', 'update', 'destroy']);
    Route::get('/lawyers/{lawyer}/edit', [LawyerController::class, 'edit'])->name('lawyers.edit');
    Route::put('/lawyers/{lawyer}', [LawyerController::class, 'update'])->name('lawyers.update');
    Route::delete('/lawyers/{lawyer}', [LawyerController::class, 'destroy'])->name('lawyers.destroy');

    // Otros accesos del abogado
    Route::get('/mis-procesos', [LegalProcessController::class, 'index'])->name('mis.procesos');
    Route::get('/conceptos/create', [AbogadoController::class, 'crearConcepto'])->name('conceptos.create');
    Route::get('/legal-processes/create', [LegalProcessController::class, 'create'])->name('legal_processes.create');

    
});

// Rutas resource para lawyers (incluye store, destroy, edit, update, etc.)
Route::resource('lawyers', LawyerController::class)->middleware('auth');
Route::resource('procesos', LegalProcessController::class);

Route::get('/exportar-usuarios', [ExportController::class, 'exportUsers'])->name('exportar.usuarios');

Route::post('/validar-registro', [RegisteredUserController::class, 'validarRegistro'])->name('register.validate');

//rutas de proceso legal
Route::get('/procesos/create', [LegalProcessController::class, 'create'])->name('procesos.create');
Route::post('/procesos', [LegalProcessController::class, 'store'])->name('procesos.store');
Route::resource('procesos', LegalProcessController::class);


// GRUPO CONSOLIDADO: Rutas de perfil protegidas por autenticación
Route::middleware('auth')->group(function() {
    // Rutas básicas de perfil
    Route::get('/profile/avatar', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile/avatar', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rutas de manejo de avatares/imágenes
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar'])->name('profile.avatar.delete');
    
    // Ruta para subir imagen (la que estás usando actualmente)
    Route::post('/upload-image', [ProfileController::class, 'uploadImage'])->name('upload-image');
});

// Ruta para servir las imágenes si tienes problemas con storage:link
Route::post('/upload-image', [ProfileController::class, 'upload'])->name('upload.image');

// Rutas de autenticación
require __DIR__ . '/auth.php';
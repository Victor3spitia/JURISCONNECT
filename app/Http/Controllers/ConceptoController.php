<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proceso;
use App\Models\ConceptoJuridico;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class ConceptoController extends Controller
{
    // ===============================
    // MÉTODOS PRINCIPALES
    // ===============================


    public function index(Request $request)
    {
        try {
            // Iniciar query builder
            $query = Proceso::query();
            $searchTerm = $request->get('search');

            // Aplicar búsqueda si existe el término de búsqueda
            if ($searchTerm) {
                $query->where(function($q) use ($searchTerm) {
                    $q->where('id', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('estado', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('numero_radicado', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('tipo_proceso', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('demandante', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('demandado', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('created_at', 'LIKE', '%' . $searchTerm . '%');
                      // Agrega más campos según tu modelo Lawyer
                });
            }

            // Obtener abogados paginados
            $procesos = $query->paginate(10);

            // Mantener parámetros de búsqueda en la paginación
            $procesos->appends($request->query());

            // Si es una petición AJAX, devolver solo la vista parcial
            if ($request->ajax()) {
                $html = view('profile.partials.lawyers-table', compact('lawyers'))->render();

                return response()->json([
                    'html' => $html,
                    'success' => true,
                    'total' => $procesos->total(),
                    'current_page' => $procesos->currentPage(),
                    'last_page' => $procesos->lastPage(),
                    'search_term' => $searchTerm
                ]);
            }


        } catch (\Exception $e) {
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al cargar los datos: ' . $e->getMessage()
                ], 500);
            }

            // Para peticiones normales, redirigir con error
            return back()->with('error', 'Error al cargar los datos');
        }
    }

    /**
     * Show the form for creating a new resource
     */
    public function create() 
    {
        $procesos = Proceso::all();
        return view('legal_processes.showConceptos', compact('procesos')); 
    }

    /**
     * Guardar el concepto para un proceso específico
     */
    public function store(Request $request, Proceso $proceso)
{
    $this->validateConceptoData($request);
    
    $this->createConceptoForProceso($request, $proceso);
    $this->updateProcesoEstado($proceso);

    return redirect()->route('abogado.dashboard')
                    ->with('success', 'Concepto jurídico creado exitosamente.');
}

    /**
     * Mostrar el formulario para crear un concepto para un proceso específico
     */
    public function verFormulario($procesoId)
    {
        $proceso = $this->getProcesoWithRelations($procesoId);
        
        $this->checkExistingConcepto($procesoId);
        
        return view('legal_processes.showConceptos', compact('proceso'));
    }

    // ===============================
    // MÉTODOS PRIVADOS DE APOYO
    // ===============================

    /**
     * Validar datos del concepto
     */
    private function validateConceptoData(Request $request)
{
    $request->validate([
        'titulo' => 'required|string|max:255',
        'categoria' => 'required|string|max:255',
        'descripcion' => 'required|min:50'
    ]);
}

    /**
     * Obtener proceso con sus relaciones
     */
    private function getProcesoWithRelations($procesoId)
    {
        return Proceso::with(['cliente', 'abogado'])->findOrFail($procesoId);
    }

    /**                                    
     * Verificar si ya existe un concepto para el proceso
     */
    private function checkExistingConcepto($procesoId)
    {
        $conceptoExistente = ConceptoJuridico::where('proceso_id', $procesoId)->first();
        
        if ($conceptoExistente) {
            abort(redirect()->back()->with('error', 'Ya existe un concepto para este proceso.'));
        }
    }

    /**
     * Crear concepto jurídico para el proceso
     */
    private function createConceptoForProceso(Request $request)
    {
        $concepto = new ConceptoJuridico();
        $concepto->titulo = $request->titulo;
        $concepto->categoria = $request->categoria;
        $concepto->descripcion = $request->descripcion;
        $concepto->save();
    }

    /**
     * Actualizar estado del proceso
     */
    private function updateProcesoEstado(Proceso $proceso)
    {
        $proceso->update(['estado' => 'con_concepto']);
    }

    // Método adicional para búsqueda rápida (opcional)
    public function search(Request $request)
    {
        try {
            $searchTerm = $request->get('term');

            if (!$searchTerm) {
                return response()->json([]);
            }

            $lawyers = ConceptoJuridico::where(function($q) use ($searchTerm) {
                $q->where('id', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('estado', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('numero_radicado', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('tipo_proceso', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('demandante', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('demandado', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('created_at', 'LIKE', '%' . $searchTerm . '%');
            })->limit(20)->get(['id', 'demandante', 'demandado', 'numero_radicado']);

            return response()->json([
                'success' => true,
                'data' => $lawyers,
                'count' => $lawyers->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ], 500);
        }
    }
}
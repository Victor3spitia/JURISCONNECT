<x-app-layout>
    <!-- Página para el dashboard de los administradores -->
    <x-slot name="header">
        <!-- Header vacío para evitar conflictos -->
    </x-slot>
    

    <div class="header">
        <button class="hamburger" id="hamburgerBtn">☰</button>
        <div class="title-logo-container">
            <h1 class="title">JustConnect SENA</h1>
        </div>
            <div class="logo-container">
                <img src="{{ asset('img/LogoSena_Verde.png') }}" alt="Logo Empresa" class="logo">
            </div>
    </div>


<div class="main-content">
  <div class="dashboard-stats">
    <div class="stat-card" id="lawyersStatCard" >
      <div class="stat-icon">👨‍⚖️</div>
        <div class="stat-info">
            <h3>125</h3>
            <p>total sentencias</p>
        </div>
    </div>
    <div class="stat-card" id="casesStatCard">
      <div class="stat-icon">📋</div>
        <div class="stat-info">
          <h3>89</h3>
          <p>pagos realizados</p>
        </div>
    </div>
    <div class="stat-card" id="assistantsStatCard" >
      <div class="stat-icon">👨‍💼</div>
        <div class="stat-info">
          <h3>25</h3>
          <p>pendientes de pago</p>
        </div>
    </div>
    <div class="stat-card" id="conceptsStatCard">
      <div class="stat-icon">✍️</div>
        <div class="stat-info">
          <h3>11</h3>
          <p>vencidos</p>
        </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Estado de Procesos</h3>
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">Pago Realizado</span>
            <span class="text-sm font-bold text-green-600">71%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">Pendiente Pago</span>
            <span class="text-sm font-bold text-yellow-600">20%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">Vencidos</span>
            <span class="text-sm font-bold text-red-600">9%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full" ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Montos por Concepto</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <span class="font-medium text-slate-700">Capital</span>
          <span class="font-bold text-blue-600">$450M</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
          <span class="font-medium text-slate-700">Intereses</span>
          <span class="font-bold text-purple-600">$125M</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
          <span class="font-medium text-slate-700">Costas</span>
          <span class="font-bold text-orange-600">$75M</span>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-lg font-bold text-slate-800 mb-6">Actividad Reciente</h3>
              <div class="space-y-4">
                 
                  <div key={idx} class="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                    <div class={`w-2 h-2 ${item.color} rounded-full`}></div>
                    <div class="flex-1">
                      <p class="text-slate-800 font-medium">{item.action}</p>
                    </div>
                    <span class="text-sm text-slate-500">{item.time}</span>
                  </div>
              
              </div>
            </div>
          </div>
</div>


<!-- Sidebar -->
<div class="sidebar" id="sidebar">
    <div class="profile">
        <!-- Input file oculto para la foto de perfil -->
        <input type="file" id="fileInput" accept="image/jpeg,image/jpg,image/png" style="display: none;">

        <!-- Indicador de carga (oculto por defecto) -->
        <div id="loadingIndicator"
            style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; z-index: 1000;">
            Subiendo...
        </div>

        <!-- Contenedor de la foto de perfil -->
        <div class="profile-pic" onclick="document.getElementById('fileInput').click();"
            style="cursor: pointer; position: relative;" title="Haz clic para cambiar tu foto">
            <img src="{{ Auth::user()->foto_perfil ? asset('storage/' . Auth::user()->foto_perfil) : asset('img/silueta-atardecer-foto-perfil.webp') }}"
                id="profileImage" alt="Foto de perfil">
        </div>
            <h3>{{ Auth::user()->name }}</h3>
            <p>{{ Auth::user()->email }}</p>
    </div>

    <div class="nav-menu">

        <button class="nav-btn active" data-section="dashboard">
            Dashboard
        </button>

        <button class="nav-btn" data-section="lawyers">
            Gestión de Abogados
        </button>

        <button class="nav-btn" data-section="assistants">
            Gestión de Asistentes
        </button>

        <a href="{{ route('dashboard.metodos-pago') }}" >
            Métodos de Pago
        </a>

    </div>

    <div class="sena-logo">
        <img src="{{ asset('img/LogoSena_Verde.png') }}" alt="Logo SENA">
    </div>

    <!-- Botón de Cerrar Sesión -->
    <form method="POST" action="{{ route('logout') }}" style="width: 100%;">
        @csrf
        <button type="submit" class="logout-btn">
            Cerrar Sesión
        </button>
    </form>
</div>



</x-app-layout>

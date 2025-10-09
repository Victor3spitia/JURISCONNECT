// Variables principales
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const mainContent = document.getElementById("mainContent");
const createLawyerModal = document.getElementById("createLawyerModal");
const createBtn = document.getElementById("createBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

// Variables para modal de edición
const editLawyerModal = document.getElementById("editLawyerModal");
const editLawyerForm = document.getElementById("editLawyerForm");
const closeEditModalBtn = document.getElementById("closeEditModal");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// ===== SISTEMA DE ALERTAS PERSONALIZADAS=====
// ===== 
function showCustomAlert(type, title = '', message = '', showCancel = false, confirmText = 'Aceptar', cancelText = 'Cancelar') {

    // Crear overlay si no existe
    let overlay = document.getElementById('alertOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'alertOverlay';
        overlay.className = 'alert-overlay';

        const buttonsHTML = showCancel
            ? `<div class="alert-buttons">
                <button class="alert-button secondary" id="cancelAlertBtn">${cancelText}</button>
                <button class="alert-button ${type}" id="confirmAlertBtn">${confirmText}</button>
                </div>`
            : `<button class="alert-button ${type}" id="confirmAlertBtn">${confirmText}</button>`;

        overlay.innerHTML = `
            <div class="custom-alert" id="customAlert">
                <div class="alert-icon" id="alertIcon"></div>
                <div class="alert-title" id="alertTitle"></div>
                <div class="alert-message" id="alertMessage"></div>
                ${buttonsHTML}
            </div>
        `;
        document.body.appendChild(overlay);

        // Agregar estilos CSS si no existen
        if (!document.getElementById('customAlertStyles')) {
            const style = document.createElement('style');
            style.id = 'customAlertStyles';
            document.head.appendChild(style);
        }
    }

    const alert = document.getElementById('customAlert');
    const icon = document.getElementById('alertIcon');
    const titleEl = document.getElementById('alertTitle');
    const messageEl = document.getElementById('alertMessage');

    // Configurar según el tipo
    alert.className = `custom-alert alert-${type}`;

    switch(type) {
        case 'success':
            icon.innerHTML = '✓';
            titleEl.textContent = title || '¡Éxito!';
            messageEl.textContent = message || 'Operación completada exitosamente';
            break;
        case 'error':
            icon.innerHTML = '❌';
            titleEl.textContent = title || '¡Error!';
            messageEl.textContent = message || 'Algo salió mal. Inténtalo de nuevo.';
            break;
        case 'warning':
            icon.innerHTML = '⚠️';
            titleEl.textContent = title || '¡Atención!';
            messageEl.textContent = message || 'Verifica la información antes de continuar.';
            break;
        case 'info':
            icon.innerHTML = 'ℹ';
            titleEl.textContent = title || 'Información';
            messageEl.textContent = message || 'Proceso en desarrollo.';
            break;
    }

    overlay.classList.add('show');

    // SIEMPRE retornar una promesa
    return new Promise((resolve) => {
        document.getElementById('confirmAlertBtn').onclick = () => {
            hideCustomAlert();
            resolve(true);
        };

        // Solo agregar el botón cancelar si existe
        const cancelBtn = document.getElementById('cancelAlertBtn');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                hideCustomAlert();
                resolve(false);
            };
        }
    });
}

function hideCustomAlert() {
    const overlay = document.getElementById('alertOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// ===== FUNCIONES DE MANEJO DE ERRORES DE DUPLICADOS MEJORADAS =====

/**
 * Maneja errores específicos de duplicados y los presenta de forma clara
 * @param {Object} error - Objeto de error del servidor
 * @param {number} status - Código de estado HTTP
 * @param {string} context - Contexto de la operación ('create' o 'edit')
 */
async function handleDuplicateError(error, status, context = 'create') {
    if (status === 422) {
        const errorMessage = error.message || '';
        const errors = error.errors || {};
        
        // Verificar si es un error de duplicado específico
        if (errorMessage.includes('documento') && errorMessage.includes('ya existe')) {
            await showCustomAlert(
                'error', 
                'Documento Duplicado', 
                `Ya existe un abogado registrado con este número de documento. Por favor, verifica que el número sea correcto o usa un documento diferente.`
            );
            return true;
        }
        
        if (errorMessage.includes('correo') && (errorMessage.includes('ya existe') || errorMessage.includes('unique'))) {
            await showCustomAlert(
                'error', 
                'Correo Duplicado', 
                `Ya existe un abogado registrado con este correo electrónico. Por favor, usa una dirección de correo diferente.`
            );
            return true;
        }
        
        // Verificar errores específicos en el objeto errors
        if (errors.numero_documento && errors.numero_documento.some(err => err.includes('ya existe'))) {
            await showCustomAlert(
                'error', 
                'Número de Documento Ya Registrado', 
                `El número de documento ingresado ya está registrado en el sistema. Cada abogado debe tener un número de documento único.`
            );
            return true;
        }
        
        if (errors.correo && errors.correo.some(err => err.includes('ya existe'))) {
            await showCustomAlert(
                'error', 
                'Correo Electrónico Ya Registrado', 
                `El correo electrónico ingresado ya está registrado en el sistema. Cada abogado debe tener un correo único.`
            );
            return true;
        }
        
        // Error general de duplicado
        if (errorMessage.includes('ya existe') || errorMessage.includes('duplicado') || errorMessage.includes('unique')) {
            const actionText = context === 'create' ? 'crear' : 'actualizar';
            await showCustomAlert(
                'error', 
                'Información Duplicada', 
                `No se puede ${actionText} el abogado porque ya existe otro con la misma información (número de documento o correo electrónico). Por favor, verifica los datos ingresados.`
            );
            return true;
        }
        
        // Error de validación general
        await showCustomAlert(
            'warning', 
            'Error de Validación', 
            errorMessage || "Los datos ingresados no son válidos. Por favor, verifica que todos los campos estén completos y correctos."
        );
        return true;
    }
    
    return false; // No fue un error manejado
}

/**
 * Función específica para validar duplicados antes del envío
 * Avísa
 * @param {FormData} formData - Datos del formulario
 * @param {string} currentId - ID actual (para edición)
 * @returns {Promise<boolean>} - true si hay duplicados, false si no
 */
async function checkForDuplicates(formData, currentId = null) {
    try {
        const response = await fetch('/lawyers/check-duplicates', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                numero_documento: formData.get('numeroDocumento'),
                correo: formData.get('correo'),
                current_id: currentId
            })
        });

        if (response.ok) {
            const result = await response.json();
            
            if (result.duplicates && result.duplicates.length > 0) {
                const duplicateMessages = result.duplicates.map(duplicate => {
                    if (duplicate.field === 'numero_documento') {
                        return `• Número de documento ${duplicate.value} ya está registrado`;
                    } else if (duplicate.field === 'correo') {
                        return `• Correo electrónico ${duplicate.value} ya está registrado`;
                    }
                    return `• ${duplicate.field}: ${duplicate.value} ya existe`;
                });

                await showCustomAlert(
                    'warning',
                    'Información Duplicada Detectada',
                    `Se encontraron los siguientes duplicados:\n\n${duplicateMessages.join('\n')}\n\nPor favor, modifica estos campos antes de continuar.`
                );
                return true;
            }
        }
    } catch (error) {
        console.log('No se pudo verificar duplicados:', error);
        // No mostramos error aquí, se manejará en el envío principal
    }
    
    return false;
}

// ===== FUNCIONES DE VALIDACIÓN =====
function validateForm(formData) {
    const errors = [];

    // Validar campos requeridos
    if (!formData.get('nombre') || formData.get('nombre').trim() === '') {
        errors.push('El nombre es obligatorio');
    }

    if (!formData.get('apellido') || formData.get('apellido').trim() === '') {
        errors.push('El apellido es obligatorio');
    }

    if (!formData.get('tipoDocumento') || formData.get('tipoDocumento').trim() === '') {
        errors.push('El tipo de documento es obligatorio');
    }

    if (!formData.get('numeroDocumento') || formData.get('numeroDocumento').trim() === '') {
        errors.push('El número de documento es obligatorio');
    }

    if (!formData.get('correo') || formData.get('correo').trim() === '') {
        errors.push('El correo electrónico es obligatorio');
    }

    // NUEVAS VALIDACIONES - Campos ahora obligatorios
    if (!formData.get('telefono') || formData.get('telefono').trim() === '') {
        errors.push('El teléfono es obligatorio');
    }

    if (!formData.get('especialidad') || formData.get('especialidad').trim() === '') {
        errors.push('La especialidad es obligatoria');
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.get('correo') && !emailRegex.test(formData.get('correo'))) {
        errors.push('El formato del correo electrónico no es válido');
    }

    return errors;
}

// ===== FUNCIONES DE VALIDACIÓN para editar=====
function validateEditForm(formData) {
    const errors = [];

    // Validar campos requeridos para edición
    if (!formData.get('nombre') || formData.get('nombre').trim() === '') {
        errors.push('El nombre es obligatorio');
    }

    if (!formData.get('apellido') || formData.get('apellido').trim() === '') {
        errors.push('El apellido es obligatorio');
    }

    if (!formData.get('tipoDocumento') || formData.get('tipoDocumento').trim() === '') {
        errors.push('El tipo de documento es obligatorio');
    }

    if (!formData.get('numeroDocumento') || formData.get('numeroDocumento').trim() === '') {
        errors.push('El número de documento es obligatorio');
    }

    if (!formData.get('correo') || formData.get('correo').trim() === '') {
        errors.push('El correo electrónico es obligatorio');
    }

    // NUEVAS VALIDACIONES PARA EDICIÓN - Campos ahora obligatorios
    if (!formData.get('telefono') || formData.get('telefono').trim() === '') {
        errors.push('El teléfono es obligatorio');
    }

    if (!formData.get('especialidad') || formData.get('especialidad').trim() === '') {
        errors.push('La especialidad es obligatoria');
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.get('correo') && !emailRegex.test(formData.get('correo'))) {
        errors.push('El formato del correo electrónico no es válido');
    }

    return errors;
}

// ===== FUNCIONES DE VALIDACIÓN para el registro=====
function validateRegisterForm(formData) {
    const errors = [];
    
    // Validar campos requeridos
    
    if (!formData.get('correo') || formData.get('correo').trim() === '') {
        errors.push('El correo electrónico es obligatorio');
    }
    
    // NUEVAS VALIDACIONES - Campos ahora obligatorios
    if (!formData.get('telefono') || formData.get('telefono').trim() === '') {
        errors.push('El teléfono es obligatorio');
    }
    
    if (!formData.get('especialidad') || formData.get('especialidad').trim() === '') {
        errors.push('La especialidad es obligatoria');
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.get('correo') && !emailRegex.test(formData.get('correo'))) {
        errors.push('El formato del correo electrónico no es válido');
    }
    
    return errors;
}

// ===== VALIDACIÓN EN TIEMPO REAL (OPCIONAL) =====
/**
 * Valida duplicados mientras el usuario escribe (con debounce)
 * @param {string} fieldName - Nombre del campo ('numeroDocumento' o 'correo')
 * @param {HTMLElement} inputElement - Elemento del input
 */
function setupRealTimeValidation(fieldName, inputElement) {
    let timeoutId;
    
    inputElement.addEventListener('input', function() {
        clearTimeout(timeoutId);
        
        // Esperar 1 segundo después de que el usuario deje de escribir
        timeoutId = setTimeout(async () => {
            const value = this.value.trim();
            
            if (value.length < 3) return; // No validar valores muy cortos
            
            try {
                const response = await fetch('/lawyers/check-field', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        field: fieldName,
                        value: value
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.exists) {
                        // Agregar clase de error visual
                        inputElement.classList.add('error');
                        inputElement.classList.remove('success');
                        
                        // Opcional: mostrar tooltip o mensaje
                        showFieldError(inputElement, `Este ${fieldName === 'numeroDocumento' ? 'número de documento' : 'correo'} ya está registrado`);
                    } else {
                        // Agregar clase de éxito visual
                        inputElement.classList.add('success');
                        inputElement.classList.remove('error');
                        hideFieldError(inputElement);
                    }
                }
            } catch (error) {
                console.log('Error en validación en tiempo real:', error);
            }
        }, 1000);
    });
}

// Funciones auxiliares para mostrar/ocultar errores de campo
function showFieldError(inputElement, message) {
    let errorElement = inputElement.parentNode.querySelector('.field-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        inputElement.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function hideFieldError(inputElement) {
    const errorElement = inputElement.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== FUNCIONALIDAD PRINCIPAL =====

// Sidebar y modales
function toggleSidebar() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

function openModal() {
    createLawyerModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModalFunction() {
    createLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    document.querySelector("#createLawyerModal form").reset();
}

function openEditModal(lawyerData) {
    document.getElementById("editNombre").value = lawyerData.nombre || "";
    document.getElementById("editApellido").value = lawyerData.apellido || "";
    document.getElementById("editTipoDocumento").value = lawyerData.tipo_documento || "";
    document.getElementById("editNumeroDocumento").value = lawyerData.numero_documento || "";
    document.getElementById("editCorreo").value = lawyerData.correo || "";
    document.getElementById("editTelefono").value = lawyerData.telefono || "";
    document.getElementById("editEspecialidad").value = lawyerData.especialidad || "";

    editLawyerForm.action = "/lawyers/" + lawyerData.id;
    editLawyerModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeEditModal() {
    editLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    editLawyerForm.reset();
}

function updateRowInTable(id, updatedData) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;

    row.children[0].textContent = updatedData.nombre;
    row.children[1].textContent = updatedData.apellido;
    row.children[2].textContent = updatedData.tipo_documento;
    row.children[3].textContent = updatedData.numero_documento;
    row.children[4].textContent = updatedData.correo;
    row.children[5].textContent = updatedData.telefono || "";
    row.children[6].textContent = updatedData.especialidad || "";
}

// Event listeners básicos
hamburgerBtn.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", closeSidebar);

createBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", closeModalFunction);
cancelBtn.addEventListener("click", closeModalFunction);

closeEditModalBtn.addEventListener("click", closeEditModal);
cancelEditBtn.addEventListener("click", closeEditModal);

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeSidebar();
        closeModalFunction();
        closeEditModal();
        hideCustomAlert();
    }
});

// Manejo de formularios de eliminación
document.addEventListener('submit', async function(e) {
    if (e.target.classList.contains('delete-lawyer-form')) {
        e.preventDefault();

        const form = e.target;
        const lawyerName = form.dataset.name;

        const confirmed = await showCustomAlert(
            'warning',
            'Confirmar Eliminación',
            `¿Estás seguro de eliminar al abogado ${lawyerName}? Esta acción no se puede deshacer.`,
            true,
            'Eliminar',
            'Cancelar'
        );

        if (confirmed) {
            form.submit();
        }
    }
});

// Edición de abogados<
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-edit")) {
        const row = e.target.closest("tr");
        const lawyerData = {
            id: row.dataset.id,
            nombre: row.children[0].textContent,
            apellido: row.children[1].textContent,
            tipo_documento: row.children[2].textContent,
            numero_documento: row.children[3].textContent,
            correo: row.children[4].textContent,
            telefono: row.children[5].textContent,
            especialidad: row.children[6].textContent,
        };
        openEditModal(lawyerData);
    }
});

// ===== FORMULARIO DE EDICIÓN MEJORADO =====
editLawyerForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const lawyerId = form.action.split("/").pop();
    
    // VALIDACIÓN DE CAMPOS OBLIGATORIOS
    const validationErrors = validateEditForm(data);
    if (validationErrors.length > 0) {
        await showCustomAlert('warning', 'Campos Incompletos', validationErrors.join('\n'));
        return;
    }

    // VERIFICACIÓN DE DUPLICADOS (opcional - si implementas el endpoint)
    const hasDuplicates = await checkForDuplicates(data, lawyerId);
    if (hasDuplicates) {
        return; // Detener si hay duplicados
    }

    try {
        const response = await fetch(form.action, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: data,
        });

        if (response.ok) {
            const updatedLawyer = {
                nombre: data.get("nombre"),
                apellido: data.get("apellido"),
                tipo_documento: data.get("tipoDocumento"),
                numero_documento: data.get("numeroDocumento"),
                correo: data.get("correo"),
                telefono: data.get("telefono"),
                especialidad: data.get("especialidad"),
            };

            updateRowInTable(lawyerId, updatedLawyer);
            await showCustomAlert('success', '¡Perfecto!', `El abogado ${updatedLawyer.nombre} ${updatedLawyer.apellido} ha sido actualizado exitosamente.`);
            closeEditModal();
        } else {
            const error = await response.json();
            
            // Usar el nuevo manejador de errores de duplicados
            const handled = await handleDuplicateError(error, response.status, 'edit');
            
            if (!handled) {
                // Error no específico de duplicados
                await showCustomAlert('error', 'Error de Actualización', "Error al actualizar: " + (error.message || "Verifica que todos los campos estén correctos."));
            }
        }
    } catch (error) {
        console.error(error);
        await showCustomAlert('error', 'Error Inesperado', 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo o contacta al soporte técnico.');
    }
});

// ===== CREACIÓN DE ABOGADOS CON VALIDACIONES MEJORADAS =====
document.getElementById("createLawyerModal").querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    // VALIDACIÓN DE CAMPOS OBLIGATORIOS
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
        await showCustomAlert('warning', 'Campos Incompletos', 'Por favor, completa todos los campos obligatorios:\n\n' + validationErrors.join('\n'));
        return;
    }

    // VERIFICACIÓN DE DUPLICADOS (opcional - si implementas el endpoint)
    //
    const hasDuplicates = await checkForDuplicates(data);
    if (hasDuplicates) {
        return; // Detener si hay duplicados
    }

    try {
        const response = await fetch("/lawyers", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: data,
        });

        if (response.ok) {
            await showCustomAlert('success', '¡Excelente!', `El abogado ${data.get('nombre')} ${data.get('apellido')} ha sido registrado exitosamente.`);
            form.reset();
            closeModalFunction();
            location.reload();
        } else {
            const error = await response.json();
            
            // Usar el nuevo manejador de errores de duplicados
            const handled = await handleDuplicateError(error, response.status, 'create');
            
            if (!handled) {
                // Error no específico de duplicados
                await showCustomAlert('error', 'Error al Crear', "Error al guardar: " + (error.message || "Verifica que todos los campos estén completos y correctos."));
            }
        }
    } catch (error) {
        console.error(error);
        await showCustomAlert('error', 'Error de Conexión', 'No se pudo crear el abogado. Verifica tu conexión a internet e inténtalo de nuevo.');
    }
});

// ===== FUNCIONALIDAD DE BÚSQUEDA AJAX =====
// Búsqueda en tiempo real simplificada
let searchTimeout;

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("searchInput");
    
    if (searchInput) {
        // Búsqueda en tiempo real mientras escribes
        searchInput.addEventListener("input", function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 300); // Esperar 300ms después de escribir
        });
    }
});


// Función principal de búsqueda
function performSearch(searchTerm) {
    // Preparar parámetros
    const params = new URLSearchParams();
    if (searchTerm) {
        params.append('search', searchTerm);
    }
    params.append('ajax', '1');
    
    // Hacer petición AJAX
    fetch(`${window.location.pathname}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.html) {
            // Actualizar tabla
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.html;
            
            const newTableBody = tempDiv.querySelector('#tableBody');
            const currentTableBody = document.querySelector('#tableBody');
            
            if (newTableBody && currentTableBody) {
                currentTableBody.innerHTML = newTableBody.innerHTML;
            }
            
            // Actualizar paginación si existe
            const newPagination = tempDiv.querySelector('.pagination');
            const currentPagination = document.querySelector('.pagination')?.parentElement;
            if (currentPagination) {
                if (newPagination) {
                    currentPagination.innerHTML = newPagination.parentElement.innerHTML;
                } else {
                    currentPagination.innerHTML = '';
                }
            }
            
            // Actualizar URL
            const newUrl = new URL(window.location);
            if (searchTerm) {
                newUrl.searchParams.set('search', searchTerm);
            } else {
                newUrl.searchParams.delete('search');
            }
            newUrl.searchParams.delete('page');
            window.history.replaceState({}, '', newUrl.toString());
        }
    })
    .catch(error => {
        console.error('Error en búsqueda:', error);
    });
}

// Función para limpiar búsqueda (opcional)
function clearSearch() {
    document.getElementById("searchInput").value = '';
    performSearch('');
}


// ===== FUNCIONALIDAD DE SUBIDA DE IMAGEN DE PERFIL =====
function setupImageUpload() {
    const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage'); // unificado
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (!fileInput || !profileImage) {
        console.warn('Elementos para subida de imagen no encontrados.');
        return;
    }

    // Guardar la imagen original como referencia
    // No sirve para la edición porque se recarga la página después de subir la imagen y se pierde la referencia original 

    profileImage.dataset.originalSrc = profileImage.src;

    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            await showCustomAlert('error', 'Archivo no válido', 'Solo se permiten archivos JPG, JPEG y PNG.');
            fileInput.value = '';
            return;
        }

        // Validar tamaño (2MB máximo)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            await showCustomAlert('error', 'Archivo muy grande', 'El archivo debe ser menor a 2MB.');
            fileInput.value = '';
            return;
        }

        // Mostrar preview inmediato
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Mostrar indicador de carga
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('profile_photo', file); // 👈 nombre correcto

            fetch('/user/profile-photo', {
                method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        },
                        body: formData
            });

        // CSRF
        const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
        if (!csrfTokenElement) {
            await showCustomAlert('error', 'Error de seguridad', 'Token CSRF no encontrado.');
            return;
        }

        const csrfToken = csrfTokenElement.getAttribute('content');

        try {
            const response = await fetch('/user/profile-photo', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                profileImage.src = data.url + '?t=' + new Date().getTime(); // evitar cache
                profileImage.dataset.originalSrc = data.url;
                await showCustomAlert('success', '¡Perfecto!', 'Imagen actualizada correctamente.');
            } else {
                profileImage.src = profileImage.dataset.originalSrc;
                await showCustomAlert('error', 'Error', data.message || 'No se pudo actualizar la imagen.');
            }

        } catch (error) {
            profileImage.src = profileImage.dataset.originalSrc;
            console.error('Error al subir imagen:', error);
            await showCustomAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
        } finally {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }

        fileInput.value = ''; // limpiar input
    });
}


// iOS: Prevenir zoom en inputs
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.querySelectorAll("input").forEach((input) => {
        input.addEventListener("focus", function() {
            this.style.fontSize = "16px";
        });
    });
}

// Hacer funciones disponibles globalmente
window.showCustomAlert = showCustomAlert;
window.hideCustomAlert = hideCustomAlert;
window.handleDuplicateError = handleDuplicateError;
window.checkForDuplicates = checkForDuplicates;

// ===== INICIALIZACIÓN DE TODAS LAS FUNCIONALIDADES =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar la subida de imagen
    setupImageUpload();
    
    // Guardar la imagen original como referencia
    const profileImage = document.getElementById('profile_photo');
    if (profileImage) {
        profileImage.dataset.originalSrc = profileImage.src;
    }

    // ===== INICIALIZACIÓN DE VALIDACIÓN EN TIEMPO REAL =====
    // Para el modal de creación
    const createNumeroDocumento = document.getElementById('numeroDocumento');
    const createCorreo = document.getElementById('correo');
    
    if (createNumeroDocumento) {
        setupRealTimeValidation('numeroDocumento', createNumeroDocumento);
    }
    
    if (createCorreo) {
        setupRealTimeValidation('correo', createCorreo);
    }
    
    // Para el modal de edición
    const editNumeroDocumento = document.getElementById('editNumeroDocumento');
    const editCorreo = document.getElementById('editCorreo');
    
    if (editNumeroDocumento) {
        setupRealTimeValidation('numeroDocumento', editNumeroDocumento);
    }
    
    if (editCorreo) {
        setupRealTimeValidation('correo', editCorreo);
    }

    // Inicializar otros elementos si es necesario
    console.log('Sistema de alertas y validaciones inicializado correctamente');
});

// ===== NAVEGACIÓN ENTRE SECCIONES Y PAGINACIÓN AJAX =====
document.addEventListener('DOMContentLoaded', function() {
    // Manejo de navegación entre secciones
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento por defecto
            const sectionId = this.getAttribute('data-section');
            
            // Remover clase activa de todos los botones y secciones
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Mostrar la sección correspondiente
            const targetSection = document.getElementById(sectionId + '-section');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

// Manejo de paginación AJAX para la sección de abogados
function handleAjaxPagination() {
    const lawyersSection = document.querySelector('#lawyers-section');
    if (!lawyersSection) {
        console.log('No se encontró #lawyers-section');
        return;
    }

    // Event delegation para manejar clics en enlaces de paginación
    lawyersSection.addEventListener('click', function(e) {
        // Verificar si el elemento clickeado es un enlace de paginación AJAX
        if (e.target.closest('.pagination-btn.ajax-page')) {
            e.preventDefault();
            
            const link = e.target.closest('.pagination-btn.ajax-page');
            const url = link.getAttribute('href');
            
            console.log('URL de paginación:', url);
            
            if (!url || url === '#') {
                console.log('URL inválida');
                return;
            }
            
            // Mostrar indicador de carga
            const container = lawyersSection.querySelector('.table-container');
            if (container) {
                container.style.opacity = '0.5';
                container.style.pointerEvents = 'none';
            }
            
            console.log('Iniciando petición AJAX...');
            
            // Realizar petición AJAX
            fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                console.log('Respuesta recibida:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                
                if (data.success && data.html) {
                    // Actualizar el contenido
                    const tableContainer = lawyersSection.querySelector('.table-container');
                    if (tableContainer) {
                        tableContainer.outerHTML = data.html;
                        console.log('Contenido actualizado exitosamente');
                    }
                    
                    // Actualizar URL sin recargar página
                    if (window.history && window.history.pushState) {
                        window.history.pushState({}, '', url);
                    }
                    
                    // Re-inicializar el manejo de paginación para los nuevos elementos
                    handleAjaxPagination();
                } else {
                    throw new Error(data.message || 'Formato de respuesta inválido');
                }
            })
            .catch(error => {
                console.error('Error completo:', error);
                
                // Mostrar mensaje de error al usuario
                const container = lawyersSection.querySelector('.table-container');
                if (container) {
                    container.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>Error:</strong> ${error.message}<br>
                            <small>Revisa la consola para más detalles</small>
                        </div>
                    `;
                }
            })
            .finally(() => {
                // Quitar indicador de carga
                const container = lawyersSection.querySelector('.table-container');
                if (container) {
                    container.style.opacity = '1';
                    container.style.pointerEvents = 'auto';
                }
            });
        }
    });
}
    // Inicializar el manejo de paginación
    handleAjaxPagination();
});
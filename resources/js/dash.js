/* ========= utils y constantes ========= */
const getCsrfToken = () => {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el ? el.getAttribute("content") : null;
};

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

/* ========= ALERTAS PERSONALIZADAS (VERSIÓN MEJORADA) ========= */

function showCustomAlert(
    type,
    title = "",
    message = "",
    showCancel = false,
    confirmText = "Aceptar",
    cancelText = "Cancelar"
) {
    return new Promise((resolve) => {
        // Crear overlay si no existe
        let alertOverlay = document.getElementById("alertOverlay");
        if (alertOverlay) {
            alertOverlay.remove();
        }

        // Crear nuevo overlay
        alertOverlay = document.createElement("div");
        alertOverlay.id = "alertOverlay";
        alertOverlay.className = "alert-overlay";

        // Configurar iconos según el tipo
        const icons = {
            success: "✓",
            error: "✕",
            warning: "⚠",
            info: "ℹ",
        };

        // Configurar títulos por defecto
        const defaultTitles = {
            success: "¡Éxito!",
            error: "¡Error!",
            warning: "¡Atención!",
            info: "Información",
        };

        // Configurar mensajes por defecto
        const defaultMessages = {
            success: "Operación completada exitosamente",
            error: "Algo salió mal. Inténtalo de nuevo.",
            warning: "Verifica la información antes de continuar.",
            info: "Proceso en desarrollo.",
        };

        const icon = icons[type] || icons.info;
        const alertTitle = title || defaultTitles[type] || defaultTitles.info;
        const alertMessage =
            message || defaultMessages[type] || defaultMessages.info;

        // Crear botones
        const buttonsHTML = showCancel
            ? `<div class="alert-buttons">
                <button class="alert-button secondary" id="cancelAlertBtn">${cancelText}</button>
                <button class="alert-button ${type}" id="confirmAlertBtn">${confirmText}</button>
               </div>`
            : `<div class="alert-buttons">
                <button class="alert-button ${type}" id="confirmAlertBtn">${confirmText}</button>
               </div>`;

        alertOverlay.innerHTML = `
            <div class="custom-alert alert-${type}" id="customAlert" role="dialog" aria-modal="true">
                <div class="alert-icon">${icon}</div>
                <div class="alert-title">${alertTitle}</div>
                <div class="alert-message">${alertMessage}</div>
                ${buttonsHTML}
            </div>
        `;

        document.body.appendChild(alertOverlay);

        // Mostrar con animación
        setTimeout(() => alertOverlay.classList.add("show"), 10);

        const cleanup = () => {
            alertOverlay.classList.remove("show");
            setTimeout(() => {
                if (alertOverlay && alertOverlay.parentNode) {
                    alertOverlay.parentNode.removeChild(alertOverlay);
                }
            }, 350);
        };

        // Event listeners para botones
        const confirmBtn = document.getElementById("confirmAlertBtn");
        const cancelBtn = document.getElementById("cancelAlertBtn");

        if (confirmBtn) {
            confirmBtn.onclick = () => {
                cleanup();
                resolve(true);
            };
        }

        if (cancelBtn) {
            cancelBtn.onclick = () => {
                cleanup();
                resolve(false);
            };
        }

        // Cerrar con ESC
        const escHandler = (e) => {
            if (e.key === "Escape") {
                cleanup();
                resolve(false);
                document.removeEventListener("keydown", escHandler);
            }
        };
        document.addEventListener("keydown", escHandler);

        // Cerrar al hacer click fuera del modal
        alertOverlay.addEventListener("click", function (e) {
            if (e.target === alertOverlay) {
                cleanup();
                resolve(false);
            }
        });
    });
}


function showAlert(type, title, message, buttons = null) {
    // Si se proporcionan botones personalizados, usar la versión antigua
    if (buttons) {
        return showCustomAlert(
            type,
            title,
            message,
            false,
            "Aceptar",
            "Cancelar"
        );
    }

    // Usar la nueva versión mejorada
    return showCustomAlert(type, title, message, false, "Aceptar", "Cancelar");
}

/**
 * Cerrar alerta manualmente
 */
function closeAlert() {
    const overlayEl = document.getElementById("alertOverlay");
    if (overlayEl) {
        overlayEl.classList.remove("show");
        setTimeout(() => {
            if (overlayEl && overlayEl.parentNode) {
                overlayEl.parentNode.removeChild(overlayEl);
            }
        }, 350);
    }
}

/**
 * Alias de closeAlert para compatibilidad
 */
function hideCustomAlert() {
    closeAlert();
}

// ========================================
// FUNCIONES DE CONVENIENCIA
// ========================================

/**
 * Alerta de éxito rápida
 */
function alertSuccess(message, title = "¡Éxito!") {
    return showCustomAlert("success", title, message, false, "Aceptar");
}

/**
 * Alerta de error rápida
 */
function alertError(message, title = "¡Error!") {
    return showCustomAlert("error", title, message, false, "Entendido");
}

/**
 * Alerta de advertencia rápida
 */
function alertWarning(message, title = "¡Atención!") {
    return showCustomAlert("warning", title, message, false, "De acuerdo");
}

/**
 * Alerta de información rápida
 */
function alertInfo(message, title = "Información") {
    return showCustomAlert("info", title, message, false, "Ok");
}

/**
 * Alerta de confirmación con botones Sí/No
 */
async function alertConfirm(message, title = "¿Continuar?") {
    return await showCustomAlert(
        "info",
        title,
        message,
        true,
        "Confirmar",
        "Cancelar"
    );
}

/**
 * Alerta de eliminación peligrosa
 */
async function alertDelete(message, title = "¿Eliminar?") {
    return await showCustomAlert(
        "error",
        title,
        message,
        true,
        "Eliminar",
        "Cancelar"
    );
}

/* ========= MANEJO DE DUPLICADOS Y VALIDACIONES ========= */
async function handleDuplicateError(error, status, context = "create") {
    if (status === 422) {
        const errorMessage = error.message || "";
        const errors = error.errors || {};

        if (
            errorMessage.includes("documento") &&
            errorMessage.includes("ya existe")
        ) {
            await showCustomAlert(
                "error",
                "Documento Duplicado",
                "Ya existe un abogado registrado con este número de documento. Por favor, verifica el número o usa otro."
            );
            return true;
        }
        if (
            errorMessage.includes("correo") &&
            (errorMessage.includes("ya existe") ||
                errorMessage.includes("unique"))
        ) {
            await showCustomAlert(
                "error",
                "Correo Duplicado",
                "Ya existe un abogado registrado con este correo electrónico. Usa otra dirección."
            );
            return true;
        }

        if (
            errors.numero_documento &&
            errors.numero_documento.some((err) =>
                err.toLowerCase().includes("ya existe")
            )
        ) {
            await showCustomAlert(
                "error",
                "Número de Documento Ya Registrado",
                "El número de documento ingresado ya está registrado."
            );
            return true;
        }
        if (
            errors.correo &&
            errors.correo.some((err) => err.toLowerCase().includes("ya existe"))
        ) {
            await showCustomAlert(
                "error",
                "Correo Electrónico Ya Registrado",
                "El correo electrónico ingresado ya está registrado."
            );
            return true;
        }

        if (
            errorMessage.includes("ya existe") ||
            errorMessage.includes("duplicado") ||
            errorMessage.includes("unique")
        ) {
            const actionText = context === "create" ? "crear" : "actualizar";
            await showCustomAlert(
                "error",
                "Información Duplicada",
                `No se puede ${actionText} porque existe otro registro con la misma información.`
            );
            return true;
        }

        await showCustomAlert(
            "warning",
            "Error de Validación",
            errorMessage || "Los datos ingresados no son válidos."
        );
        return true;
    }
    return false;
}

async function checkForDuplicates(formData, currentId = null) {
    try {
        const body = {
            numero_documento: formData.get("numeroDocumento"),
            correo: formData.get("correo"),
            current_id: currentId,
        };

        const csrf = getCsrfToken();
        const response = await fetch("/lawyers/check-duplicates", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrf,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.duplicates && result.duplicates.length > 0) {
                const duplicateMessages = result.duplicates.map((duplicate) => {
                    if (duplicate.field === "numero_documento")
                        return `• Número de documento ${duplicate.value} ya está registrado`;
                    if (duplicate.field === "correo")
                        return `• Correo electrónico ${duplicate.value} ya está registrado`;
                    return `• ${duplicate.field}: ${duplicate.value} ya existe`;
                });
                await showCustomAlert(
                    "warning",
                    "Información Duplicada Detectada",
                    `Se encontraron los siguientes duplicados:\n\n${duplicateMessages.join(
                        "\n"
                    )}\n\nPor favor, modifica estos campos antes de continuar.`
                );
                return true;
            }
        }
    } catch (err) {
        console.log("No se pudo verificar duplicados:", err);
        // no forzamos nada aquí
    }
    return false;
}

/* ========= VALIDACIONES ========= */
function validateForm(formData) {
    const errors = [];
    if (!formData.get("nombre") || formData.get("nombre").trim() === "")
        errors.push("El nombre es obligatorio");
    if (!formData.get("apellido") || formData.get("apellido").trim() === "")
        errors.push("El apellido es obligatorio");
    if (
        !formData.get("tipoDocumento") ||
        formData.get("tipoDocumento").trim() === ""
    )
        errors.push("El tipo de documento es obligatorio");
    if (
        !formData.get("numeroDocumento") ||
        formData.get("numeroDocumento").trim() === ""
    )
        errors.push("El número de documento es obligatorio");
    if (!formData.get("correo") || formData.get("correo").trim() === "")
        errors.push("El correo electrónico es obligatorio");
    if (!formData.get("telefono") || formData.get("telefono").trim() === "")
        errors.push("El teléfono es obligatorio");
    if (
        !formData.get("especialidad") ||
        formData.get("especialidad").trim() === ""
    )
        errors.push("La especialidad es obligatoria");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.get("correo") && !emailRegex.test(formData.get("correo")))
        errors.push("El formato del correo electrónico no es válido");

    return errors;
}

function validateEditForm(formData) {
    // idéntica a validateForm en este caso, pero separada por claridad
    return validateForm(formData);
}

function validateRegisterForm(formData) {
    const errors = [];
    if (!formData.get("correo") || formData.get("correo").trim() === "")
        errors.push("El correo electrónico es obligatorio");
    if (!formData.get("telefono") || formData.get("telefono").trim() === "")
        errors.push("El teléfono es obligatorio");
    if (
        !formData.get("especialidad") ||
        formData.get("especialidad").trim() === ""
    )
        errors.push("La especialidad es obligatoria");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.get("correo") && !emailRegex.test(formData.get("correo")))
        errors.push("El formato del correo electrónico no es válido");

    return errors;
}

/* ========= VALIDACIÓN EN TIEMPO REAL (debounce) ========= */
function setupRealTimeValidation(fieldName, inputElement) {
    let timeoutId;
    inputElement.addEventListener("input", function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            const value = this.value.trim();
            if (value.length < 3) {
                inputElement.classList.remove("error", "success");
                hideFieldError(inputElement);
                return;
            }
            try {
                const csrf = getCsrfToken();
                const response = await fetch("/lawyers/check-field", {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ field: fieldName, value }),
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.exists) {
                        inputElement.classList.add("error");
                        inputElement.classList.remove("success");
                        showFieldError(
                            inputElement,
                            `Este ${fieldName === "numeroDocumento" ||
                                fieldName === "numero_documento"
                                ? "número de documento"
                                : "correo"
                            } ya está registrado`
                        );
                    } else {
                        inputElement.classList.add("success");
                        inputElement.classList.remove("error");
                        hideFieldError(inputElement);
                    }
                }
            } catch (err) {
                console.log("Error en validación en tiempo real:", err);
            }
        }, 800);
    });
}

function showFieldError(inputElement, message) {
    let errorElement = inputElement.parentNode.querySelector(".field-error");
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "field-error";
        errorElement.style.color = "#e74c3c";
        errorElement.style.fontSize = "12px";
        errorElement.style.marginTop = "4px";
        inputElement.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(inputElement) {
    const errorElement = inputElement.parentNode.querySelector(".field-error");
    if (errorElement) errorElement.remove();
}

/* ========= LÓGICA DE UI: sidebar, modales, tablas ========= */
function toggleSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}
function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}
function openModal() {
    if (!createLawyerModal) return;
    createLawyerModal.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeModalFunction() {
    if (!createLawyerModal) return;
    createLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    const f = createLawyerModal.querySelector("form");
    if (f) f.reset();
}
function openEditModal(lawyerData) {
    if (!editLawyerModal) return;
    document.getElementById("editNombre").value = lawyerData.nombre || "";
    document.getElementById("editApellido").value = lawyerData.apellido || "";
    document.getElementById("editTipoDocumento").value =
        lawyerData.tipo_documento || "";
    document.getElementById("editNumeroDocumento").value =
        lawyerData.numero_documento || "";
    document.getElementById("editCorreo").value = lawyerData.correo || "";
    document.getElementById("editTelefono").value = lawyerData.telefono || "";
    document.getElementById("editEspecialidad").value =
        lawyerData.especialidad || "";

    editLawyerForm.action = "/lawyers/" + lawyerData.id;
    editLawyerModal.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeEditModal() {
    if (!editLawyerModal) return;
    editLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    editLawyerForm.reset();
}

function updateRowInTable(id, updatedData) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;
    // Asumo orden: nombre, apellido, tipo_documento, numero_documento, correo, telefono, especialidad
    row.children[0].textContent = updatedData.nombre || "";
    row.children[1].textContent = updatedData.apellido || "";
    row.children[2].textContent = updatedData.tipo_documento || "";
    row.children[3].textContent = updatedData.numero_documento || "";
    row.children[4].textContent = updatedData.correo || "";
    row.children[5].textContent = updatedData.telefono || "";
    row.children[6].textContent = updatedData.especialidad || "";
}

// ===== FUNCIONALIDAD DE SUBIDA DE IMAGEN DE PERFIL =====
function setupImageUpload() {
    const fileInput = document.getElementById("fileInput");
    const profileImage = document.getElementById("profileImage");
    const loadingIndicator = document.getElementById("loadingIndicator");

    if (!fileInput || !profileImage) {
        console.warn("Elementos para subida de imagen no encontrados.");
        return;
    }

    profileImage.dataset.originalSrc = profileImage.src;

    fileInput.addEventListener("change", async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            await showCustomAlert(
                "error",
                "Archivo no válido",
                "Solo se permiten archivos JPG, JPEG y PNG."
            );
            fileInput.value = "";
            return;
        }

        // Validar tamaño (2MB máximo)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            await showCustomAlert(
                "error",
                "Archivo muy grande",
                "El archivo debe ser menor a 2MB."
            );
            fileInput.value = "";
            return;
        }

        // Mostrar preview inmediato
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Mostrar indicador de carga
        if (loadingIndicator) {
            loadingIndicator.style.display = "block";
        }

        // Obtener CSRF token
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            await showCustomAlert(
                "error",
                "Error de seguridad",
                "Token CSRF no encontrado."
            );
            profileImage.src = profileImage.dataset.originalSrc;
            if (loadingIndicator) loadingIndicator.style.display = "none";
            return;
        }

        // Crear FormData
        const formData = new FormData();
        formData.append("profile_photo", file);

        try {
            const response = await fetch("/perfil/foto", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                    // NO pongas Content-Type aquí cuando usas FormData
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                profileImage.src = data.url + "?t=" + new Date().getTime();
                profileImage.dataset.originalSrc = data.url;
                await showCustomAlert(
                    "success",
                    "¡Perfecto!",
                    "Imagen actualizada correctamente."
                );
            } else {
                profileImage.src = profileImage.dataset.originalSrc;
                await showCustomAlert(
                    "error",
                    "Error",
                    data.message || "No se pudo actualizar la imagen."
                );
            }
        } catch (error) {
            profileImage.src = profileImage.dataset.originalSrc;
            console.error("Error al subir imagen:", error);
            await showCustomAlert(
                "error",
                "Error de conexión",
                "No se pudo conectar con el servidor."
            );
        } finally {
            if (loadingIndicator) {
                loadingIndicator.style.display = "none";
            }
            fileInput.value = "";
        }
    });
}

/* ========= BÚSQUEDA AJAX -- BARRA DE BUSQUEDA ========= */
let searchTimeout;
function performSearch(searchTerm) {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    params.append("ajax", "1");

    fetch(`${window.location.pathname}?${params.toString()}`, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success && data.html) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data.html;

                const newTableBody = tempDiv.querySelector("#tableBody");
                const currentTableBody = document.querySelector("#tableBody");
                if (newTableBody && currentTableBody)
                    currentTableBody.innerHTML = newTableBody.innerHTML;

                const newPagination = tempDiv.querySelector(".pagination");
                const currentPaginationContainer =
                    document.querySelector(".pagination")?.parentElement;
                if (currentPaginationContainer) {
                    if (newPagination)
                        currentPaginationContainer.innerHTML =
                            newPagination.parentElement.innerHTML;
                    else currentPaginationContainer.innerHTML = "";
                }

                const newUrl = new URL(window.location);
                if (searchTerm) newUrl.searchParams.set("search", searchTerm);
                else newUrl.searchParams.delete("search");
                newUrl.searchParams.delete("page");
                window.history.replaceState({}, "", newUrl.toString());
            }
        })
        .catch((error) => console.error("Error en búsqueda:", error));
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    performSearch("");
}

/* ========= FUNSION DE LETRAS EN MAYUSCULAS EN LOS NOMBRE Y APELLIDOS ========= */
document.addEventListener("DOMContentLoaded", function () {
    const campos = ["nombre", "apellido"];

    campos.forEach((id) => {
        const input = document.getElementById(id);

        input.addEventListener("blur", () => {
            if (input.value.trim() !== "") {
                // Convierte solo la primera letra a mayúscula
                input.value = input.value
                    .toLowerCase()
                    .replace(/^\p{L}/u, (c) => c.toUpperCase());
            }
        });
    });
});

/* ========= PAGINACIÓN AJAX ========= */
function handleAjaxPagination() {
    // Aplicar a AMBAS secciones: lawyers y assistants
    const sections = [
        document.querySelector("#lawyers-section"),
        document.querySelector("#assistants-section"),
        document.querySelector("#lawyersTableWrapper"),
        document.querySelector("#assistantsTableWrapper"),
        
    ];

    sections.forEach(section => {
        if (!section) return;

        section.addEventListener("click", function (e) {
            const link = e.target.closest(".pagination-btn.ajax-page");
            if (!link) return;
            e.preventDefault();
 
            const url = link.getAttribute("href");
            if (!url || url === "#") return;

            // Buscar el contenedor de tabla (puede ser .table-container o .table-wrapper)
            const container = section.querySelector(".table-container, .table-wrapper");
            if (container) {
                container.style.opacity = "0.5";
                container.style.pointerEvents = "none";
            }

            fetch(url, {
                method: "GET",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            })
                .then(async (resp) => {
                    if (!resp.ok)
                        throw new Error(`HTTP error! status: ${resp.status}`);
                    return resp.json();
                })
                .then((data) => {
                    if (data.success && data.html) {
                        // Reemplazar TODO el contenedor (tabla + paginación)
                        const newContainer = document.createElement("div");
                        newContainer.innerHTML = data.html;
                        const newContent = newContainer.querySelector(".table-container, .table-wrapper");
                        
                        if (container && newContent) {
                            container.replaceWith(newContent);
                        }

                        // Actualizar URL sin recargar
                        if (window.history && window.history.pushState)
                            window.history.pushState({}, "", url);

                        // Re-inicializar paginación para el nuevo contenido
                        handleAjaxPagination();
                    } else {
                        throw new Error(
                            data.message || "Formato de respuesta inválido"
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error en paginación AJAX:", error);
                    if (container) {
                        container.innerHTML = `<div class="alert alert-danger" style="padding: 20px; color: red;"><strong>Error:</strong> ${error.message}</div>`;
                        container.style.opacity = "1";
                        container.style.pointerEvents = "auto";
                    }
                })
                .finally(() => {
                    if (container) {
                        container.style.opacity = "1";
                        container.style.pointerEvents = "auto";
                    }
                });
        });
    });
}

// ...existing code...


/* ========= EVENTOS GLOBALES (inicialización única) ========= */
document.addEventListener("DOMContentLoaded", function () {
    // Inicial UI
    if (hamburgerBtn) hamburgerBtn.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);

    if (createBtn) createBtn.addEventListener("click", openModal);
    if (closeModal) closeModal.addEventListener("click", closeModalFunction);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModalFunction);

    if (closeEditModalBtn)
        closeEditModalBtn.addEventListener("click", closeEditModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModal);

    // Cerrar con ESC (global)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeSidebar();
            closeModalFunction();
            closeEditModal();
            hideCustomAlert();
        }
    });

    // Delegación: eliminar abogado con confirmación
    document.addEventListener("submit", async function (e) {
        if (e.target.classList.contains("delete-lawyer-form")) {
            e.preventDefault();
            const form = e.target;
            const lawyerName = form.dataset.name || "";
            const confirmed = await showCustomAlert(
                "warning",
                "Confirmar Eliminación",
                `¿Estás seguro de eliminar al abogado ${lawyerName}? Esta acción no se puede deshacer.`,
                true,
                "Eliminar",
                "Cancelar"
            );
            if (confirmed) form.submit();
        }
    });

    // Delegación: eliminar proceso con confirmación personalizada
    document.addEventListener("submit", async function (e) {
        if (e.target.classList.contains("delete-proceso-form")) {
            e.preventDefault();
            const confirmed = await showCustomAlert(
                "warning",
                "Confirmar Eliminación",
                "¿Seguro que deseas eliminar este proceso?",
                true,
                "Eliminar",
                "Cancelar"
            );
            if (confirmed) e.target.submit();
        }
    });

    // Delegación: abrir modal de edición
    document.addEventListener("click", function (e) {
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

    // Edición: envío del formulario
    if (editLawyerForm) {
        editLawyerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const lawyerId = form.action.split("/").pop();

            const validationErrors = validateEditForm(data);
            if (validationErrors.length > 0) {
                await showCustomAlert(
                    "warning",
                    "Campos Incompletos",
                    validationErrors.join("\n")
                );
                return;
            }

            const hasDuplicates = await checkForDuplicates(data, lawyerId);
            if (hasDuplicates) return;

            try {
                const csrf = getCsrfToken();
                const response = await fetch(form.action, {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
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
                    await showCustomAlert(
                        "success",
                        "¡Perfecto!",
                        `El abogado ${updatedLawyer.nombre} ${updatedLawyer.apellido} ha sido actualizado exitosamente.`
                    );
                    closeEditModal();
                } else {
                    const error = await response.json();
                    const handled = await handleDuplicateError(
                        error,
                        response.status,
                        "edit"
                    );
                    if (!handled)
                        await showCustomAlert(
                            "error",
                            "Error de Actualización",
                            "Error al actualizar: " +
                            (error.message ||
                                "Verifica que todos los campos estén correctos.")
                        );
                }
            } catch (err) {
                console.error(err);
                await showCustomAlert(
                    "error",
                    "Error Inesperado",
                    "Ocurrió un error inesperado. Inténtalo de nuevo."
                );
            }
        });
    }

    // Creación: envío del formulario
    const createForm = document
        .getElementById("createLawyerModal")
        ?.querySelector("form");
    if (createForm) {
        createForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);

            const validationErrors = validateForm(data);
            if (validationErrors.length > 0) {
                await showCustomAlert(
                    "warning",
                    "Campos Incompletos",
                    "Por favor, completa todos los campos obligatorios:\n\n" +
                    validationErrors.join("\n")
                );
                return;
            }

            const hasDuplicates = await checkForDuplicates(data);
            if (hasDuplicates) return;

            try {
                const csrf = getCsrfToken();
                const response = await fetch("/lawyers", {
                    method: "POST",
                    headers: { "X-CSRF-TOKEN": csrf },
                    body: data,
                });

                if (response.ok) {
                    await showCustomAlert(
                        "success",
                        "¡Excelente!",
                        `El abogado ${data.get("nombre")} ${data.get(
                            "apellido"
                        )} ha sido registrado exitosamente.`
                    );
                    form.reset();
                    closeModalFunction();
                    location.reload();
                } else {
                    const error = await response.json();
                    const handled = await handleDuplicateError(
                        error,
                        response.status,
                        "create"
                    );
                    if (!handled)
                        await showCustomAlert(
                            "error",
                            "Error al Crear",
                            "Error al guardar: " +
                            (error.message || "Verifica los campos.")
                        );
                }
            } catch (err) {
                console.error(err);
                await showCustomAlert(
                    "error",
                    "Error de Conexión",
                    "No se pudo crear el abogado. Verifica tu conexión e inténtalo de nuevo."
                );
            }
        });
    }

    // Inicializar subida de imagen
    setupImageUpload();

    // Inicializar validaciones en tiempo real (si existen inputs)
    const createNumeroDocumento = document.getElementById("numeroDocumento");
    const createCorreo = document.getElementById("correo");
    if (createNumeroDocumento)
        setupRealTimeValidation("numeroDocumento", createNumeroDocumento);
    if (createCorreo) setupRealTimeValidation("correo", createCorreo);

    const editNumeroDocumento = document.getElementById("editNumeroDocumento");
    const editCorreo = document.getElementById("editCorreo");
    if (editNumeroDocumento)
        setupRealTimeValidation("numeroDocumento", editNumeroDocumento);
    if (editCorreo) setupRealTimeValidation("correo", editCorreo);

    // Búsqueda en tiempo real
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            searchTimeout = setTimeout(() => performSearch(searchTerm), 300);
        });
    }

    // Navegación entre secciones
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".section-content");
    navButtons.forEach((button) =>
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute("data-section");
            navButtons.forEach((btn) => btn.classList.remove("active"));
            sections.forEach((section) => section.classList.remove("active"));
            this.classList.add("active");
            const targetSection = document.getElementById(
                sectionId + "-section"
            );
            if (targetSection) targetSection.classList.add("active");
        })
    );

    // Inicializar paginación AJAX
    handleAjaxPagination();

    console.log("Sistema de alertas y validaciones inicializado correctamente");
});

document.addEventListener("DOMContentLoaded", function () {
    const lawyersCard = document.getElementById("lawyersStatCard");
    const assistantsCard = document.getElementById("assistantsStatCard");

    const lawyersWrapper = document.getElementById("lawyersTableWrapper");
    const assistantsWrapper = document.getElementById("assistantsTableWrapper");

    // función para deslizar
    function slideToggle(element) {
        if (element.style.display === "none") {
            element.style.display = "block";
            element.style.maxHeight = "0px";
            element.style.overflow = "hidden";
            setTimeout(() => {
                element.style.transition = "max-height 0.4s ease";
                element.style.maxHeight = element.scrollHeight + "px";
            }, 10);
        } else {
            element.style.transition = "max-height 0.4s ease";
            element.style.maxHeight = "0px";
            setTimeout(() => (element.style.display = "none"), 400);
        }
    }

    // clic en la tarjeta de abogados
    lawyersCard.addEventListener("click", () => {
        if (assistantsWrapper.style.display === "block") {
            slideToggle(assistantsWrapper);
        }
        slideToggle(lawyersWrapper);
    });

    // clic en la tarjeta de asistentes
    assistantsCard.addEventListener("click", () => {
        if (lawyersWrapper.style.display === "block") {
            slideToggle(lawyersWrapper);
        }
        slideToggle(assistantsWrapper);
    });
});


const btnOpenAsistente = document.getElementById("btnOpenAsistente");
const modalAsistente = document.getElementById("modalAsistente");
const btnCloseAsistente = document.getElementById("closeAsistente");
const btnCancelAsistente = document.getElementById("cancelAsistente");

function openAssistantModal() {
    modalAsistente.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeAssistantModal() {
    modalAsistente.classList.remove("active");
    document.body.style.overflow = "auto";
}

if (btnOpenAsistente) {
    btnOpenAsistente.addEventListener("click", openAssistantModal);
}

if (btnCloseAsistente) {
    btnCloseAsistente.addEventListener("click", closeAssistantModal);
}

if (btnCancelAsistente) {
    btnCancelAsistente.addEventListener("click", closeAssistantModal);
}

document.addEventListener("click", function (e) {

    /* =============================
       =    EDITAR ASISTENTE       =
       ============================= */
    if (e.target.classList.contains("btn-edit-assistant")) {

        const btn = e.target;
        const id = btn.dataset.id;

        // Llenar campos del formulario
        editAssistantNombre.value = btn.dataset.nombre;
        editAssistantApellido.value = btn.dataset.apellido;
        editAssistantTipoDocumento.value = btn.dataset.tipo_documento;
        editAssistantNumeroDocumento.value = btn.dataset.numero_documento;
        editAssistantCorreo.value = btn.dataset.correo;
        editAssistantTelefono.value = btn.dataset.telefono || '';

        // Ruta
        editAssistantForm.action = `/assistants/${id}`;

        // Mostrar modal
        editAssistantModal.style.display = "flex";
    }

    /* =============================
       =       CERRAR MODAL        =
       ============================= */
    if (e.target.id === "closeEditAssistantModal" || e.target.id === "cancelEditBtn") {
        editAssistantModal.style.display = "none";
    }
});

/* ===========================================
   =   FUNCIÓN AGREGAR SELECT DE ABOGADO (EDITAR)     =
   =========================================== */
function addLawyerSelectEdit(selectedId = null) {

    const baseSelect = document.querySelector(".lawyer-select");
    const container = document.getElementById("assignedLawyersContainer");

    // Clonar select
    const select = baseSelect.cloneNode(true);
    select.style.display = "block";
    select.style.flex = "1";
    select.name = "lawyers[]";

    if (selectedId) select.value = selectedId;

    // Contenedor de cada fila
    const wrapper = document.createElement("div");
    wrapper.classList.add("lawyer-wrapper");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "10px";
    wrapper.style.marginBottom = "10px";

    // Botón eliminar
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Eliminar";
    removeBtn.classList.add("remove-lawyer", "btn-cancel");

    // Añadir
    wrapper.appendChild(select);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
}


/* ===========================================
   =    ENVÍO AJAX DEL FORMULARIO UPDATE      =
   =========================================== */
document.querySelector('#form-update').addEventListener('submit', function (e) {
    e.preventDefault();

    let form = this;
    let formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData, // No agregar headers de tipo JSON !
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                const msg = document.createElement('div');
                msg.innerText = data.message;
                msg.classList.add('notification-success');

                document.body.appendChild(msg);

                setTimeout(() => msg.remove(), 2000);

                editAssistantModal.style.display = "none";

            } else {
                alert('Error: ' + data.message);
            }

        })
        .catch(err => console.error(err));
});




/* ========= Exponer funciones útiles globalmente (si las necesitas) ========= */
window.showCustomAlert = showCustomAlert;
window.hideCustomAlert = hideCustomAlert;
window.handleDuplicateError = handleDuplicateError;
window.checkForDuplicates = checkForDuplicates;
window.performSearch = performSearch;
window.clearSearch = clearSearch;
/**
 * Módulo de Interfas de Usuario: modales, sidebar, tablas, imagen
 */

import { showCustomAlert } from "./alerts.js";
import { getCsrfToken } from "./api.js";

// ===== REFERENCIAS GLOBALES =====
let hamburgerBtn, sidebar, overlay, mainContent;
let createLawyerModal, createBtn, closeModal, cancelBtn;
let editLawyerModal, editLawyerForm, closeEditModalBtn, cancelEditBtn;
let modalAsistente, btnOpenAsistente, btnCloseAsistente, btnCancelAsistente;
let editAssistantModal, editAssistantForm;

/**
 * Cachear referencias a elementos del DOM
 */
export function cacheElements() {
    hamburgerBtn = document.getElementById("hamburgerBtn");
    sidebar = document.getElementById("sidebar");
    overlay = document.getElementById("overlay");
    mainContent = document.getElementById("mainContent");
    createLawyerModal = document.getElementById("createLawyerModal");
    createBtn = document.getElementById("createBtn");
    closeModal = document.getElementById("closeModal");
    cancelBtn = document.getElementById("cancelBtn");

    editLawyerModal = document.getElementById("editLawyerModal");
    editLawyerForm = document.getElementById("editLawyerForm");
    closeEditModalBtn = document.getElementById("closeEditModal");
    cancelEditBtn = document.getElementById("cancelEditBtn");

    modalAsistente = document.getElementById("modalAsistente");
    btnOpenAsistente = document.getElementById("btnOpenAsistente");
    btnCloseAsistente = document.getElementById("closeAsistente");
    btnCancelAsistente = document.getElementById("cancelAsistente");

    editAssistantModal = document.getElementById("editAssistantModal");
    editAssistantForm = document.getElementById("form-update");
}

// ===== SIDEBAR =====
export function toggleSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

export function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

// ===== MODALES: CREATE LAWYER =====
export function openModal() {
    if (!createLawyerModal) return;
    createLawyerModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

export function closeModalFunction() {
    if (!createLawyerModal) return;
    createLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    const f = createLawyerModal.querySelector("form");
    if (f) f.reset();
}

// ===== MODALES: EDIT LAWYER =====
export function openEditModal(lawyerData) {
    if (!editLawyerModal) return;
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

export function closeEditModal() {
    if (!editLawyerModal) return;
    editLawyerModal.classList.remove("active");
    document.body.style.overflow = "auto";
    if (editLawyerForm) editLawyerForm.reset();
}

// ===== TABLA: ACTUALIZAR FILA =====
export function updateRowInTable(id, updatedData) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;
    row.children[0].textContent = updatedData.nombre || "";
    row.children[1].textContent = updatedData.apellido || "";
    row.children[2].textContent = updatedData.tipo_documento || "";
    row.children[3].textContent = updatedData.numero_documento || "";
    row.children[4].textContent = updatedData.correo || "";
    row.children[5].textContent = updatedData.telefono || "";
    row.children[6].textContent = updatedData.especialidad || "";
}

// ===== SUBIDA DE IMAGEN =====
export function setupImageUpload() {
    const fileInput = document.getElementById("fileInput");
    const profileImage = document.getElementById("profileImage");
    const loadingIndicator = document.getElementById("loadingIndicator");

    if (!fileInput || !profileImage) {
        console.warn("Elementos para subida de imagen no encontrados.");
        return;
    }

    // Guardar URL original por si hay error
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

        // Validar tamaño de archivo (máx 2MB)
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

        // Preparar FormData
        const formData = new FormData();
        formData.append("profile_photo", file);

        try {
            const response = await fetch("/perfil/foto", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                    // NO establecer Content-Type cuando se usa FormData
                },
                body: formData,
            });

            const data = await response.json();

            // Verificar si fue exitoso
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

// ===== MODALES: ASSISTANT =====
export function openAssistantModal() {
    if (!modalAsistente) return;
    modalAsistente.classList.add("active");
    document.body.style.overflow = "hidden";
}

export function closeAssistantModal() {
    if (!modalAsistente) return;
    modalAsistente.classList.remove("active");
    document.body.style.overflow = "auto";
}

// ===== AGREGAR SELECT DE ABOGADO =====
export function addLawyerSelect(selectedId = null) {
    const baseSelect = document.querySelector(".lawyer-select");
    const container = document.getElementById("assignedLawyersContainer");

    if (!baseSelect || !container) return;

    const select = baseSelect.cloneNode(true);
    select.style.display = "block";
    select.name = "lawyers[]";

    if (selectedId) {
        select.value = selectedId;
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Eliminar";
    removeBtn.onclick = () => {
        select.parentElement.remove();
    };

    const wrapper = document.createElement("div");
    wrapper.appendChild(select);
    wrapper.appendChild(removeBtn);

    container.appendChild(wrapper);
}

// ===== CONVERTIR NOMBRES A MAYÚSCULA INICIAL =====
export function setupNameCapitalization() {
    const campos = ["nombre", "apellido"];

    campos.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("blur", () => {
            if (input.value.trim() !== "") {
                input.value = input.value
                    .toLowerCase()
                    .replace(/^\p{L}/u, (c) => c.toUpperCase());
            }
        });
    });
}

// ===== TOGGLE CARDS (LAWYERS/ASSISTANTS) =====
export function setupCardToggles() {
    const lawyersCard = document.getElementById("lawyersStatCard");
    const assistantsCard = document.getElementById("assistantsStatCard");

    const lawyersWrapper = document.getElementById("lawyersTableWrapper");
    const assistantsWrapper = document.getElementById("assistantsTableWrapper");

    if (!lawyersCard || !assistantsCard) return;

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

    lawyersCard.addEventListener("click", () => {
        if (assistantsWrapper && assistantsWrapper.style.display === "block") {
            slideToggle(assistantsWrapper);
        }
        if (lawyersWrapper) slideToggle(lawyersWrapper);
    });

    assistantsCard.addEventListener("click", () => {
        if (lawyersWrapper && lawyersWrapper.style.display === "block") {
            slideToggle(lawyersWrapper);
        }
        if (assistantsWrapper) slideToggle(assistantsWrapper);
    });
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
export function setupSectionNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".section-content");

    navButtons.forEach((button) =>
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute("data-section");
            navButtons.forEach((btn) => btn.classList.remove("active"));
            sections.forEach((section) => section.classList.remove("active"));
            this.classList.add("active");
            const targetSection = document.getElementById(sectionId + "-section");
            if (targetSection) targetSection.classList.add("active");
        })
    );
}
// asistentes.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("asistentes.js cargado");

    // ==========================================
    // CONFIGURACIÓN DE SWEETALERT2 (TOAST)
    // Se usará para notificaciones de eliminación no críticas.
    // ==========================================
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

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
            const alertTitle =
                title || defaultTitles[type] || defaultTitles.info;
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
        return showCustomAlert(
            type,
            title,
            message,
            false,
            "Aceptar",
            "Cancelar"
        );
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

    // ==========================================
    // ALERTAS (CREACIÓN / ACTUALIZACIÓN / ELIMINACIÓN / ERROR)
    // ==========================================
    const successMessage = document.querySelector("[data-success-message]");
    if (successMessage) {
        const message = successMessage.dataset.successMessage;
        Toast.fire({
            icon: "success",
            title: message,
            background: "#d4edda",
            color: "#155724",
        });
    }

    const updateMessage = document.querySelector("[data-update-message]");
    if (updateMessage) {
        const message = updateMessage.dataset.updateMessage;
        Toast.fire({
            icon: "success",
            title: message,
            background: "#d1ecf1",
            color: "#0c5460",
        });
    }

    const deleteMessage = document.querySelector("[data-delete-message]");
    if (deleteMessage) {
        const message = deleteMessage.dataset.deleteMessage;
        Toast.fire({
            icon: "success",
            title: message,
            background: "#d4edda",
            color: "#155724",
        });
    }

    const errorMessage = document.querySelector("[data-error-message]");
    if (errorMessage) {
        const message = errorMessage.dataset.errorMessage;
        Swal.fire({
            icon: "success",
            title: "¡ Exitosa!", // Título unificado para creación
            text: message,
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745", // Botón verde
        });
    }

    // ==========================================
    // BOTONES EDITAR (soporta .btn-edit y .btn-edit-assistant)
    // ==========================================
    const editButtons = document.querySelectorAll(".btn-edit-assistant");
    editButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const assistantId = this.dataset.id;
            if (!assistantId) return;

            Swal.fire({
                title: "Cargando...",
                text: "Preparando formulario de edición",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Si es botón de asistente, tu flujo anterior abría modal y cargaba datos.
            // Aquí asumimos que en tu app la edición de asistentes es una ruta edit.
            // Redirigimos a la ruta de edición (si así lo quieres).
            // Si en tu app abres modal en lugar de redirigir, reemplaza esto por la lógica modal.
            if (this.classList.contains("btn-edit-assistant")) {
                // Si usas modal para editar (según código previo), disparar evento custom para manejarlo
                // Por compatibilidad, intentamos abrir modal si existe código que lo gestione
                const event = new CustomEvent("openEditAssistantModal", {
                    detail: { button: this },
                });
                document.dispatchEvent(event);
                Swal.close();
            } else {
                // Redirección clásica
                window.location.href = `/asistentes/${assistantId}/edit`;
            }
        });
    });

    // ==========================================
    // VALIDACIÓN DE FORMULARIO (si existe #assistantForm)
    // ==========================================
    const assistantForm = document.querySelector("#assistantForm");
    if (assistantForm) {
        assistantForm.addEventListener("submit", function (e) {
            const requiredFields = this.querySelectorAll("[required]");
            let isValid = true;
            let emptyFields = [];

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add("error");

                    const label = document.querySelector(
                        `label[for="${field.id}"]`
                    );
                    if (label) {
                        emptyFields.push(
                            label.textContent.replace("*", "").trim()
                        );
                    }
                } else {
                    field.classList.remove("error");
                }
            });

            if (!isValid) {
                e.preventDefault();

                Swal.fire({
                    icon: "warning",
                    title: "🛑 ¡Atención! Campos Requeridos",
                    html: `<p>Debe completar los siguientes campos obligatorios para continuar:</p>
                        <ul style="text-align: left; margin: 10px auto; display: inline-block;">
                        ${emptyFields
                            .map((field) => `<li>**${field}**</li>`)
                            .join("")}
                        </ul>`,
                    confirmButtonText: "Corregir",
                    confirmButtonColor: "#ffc107",
                });
            }
        });

        const allInputs = assistantForm.querySelectorAll(
            "input, select, textarea"
        );
        allInputs.forEach((input) => {
            input.addEventListener("input", function () {
                this.classList.remove("error");
            });
        });
    }

    // ==========================================
    // HOVER EFFECTS
    // ==========================================
    const actionButtons = document.querySelectorAll(
        ".btn-edit, .btn-delete, .btn-edit-assistant"
    );
    actionButtons.forEach((button) => {
        button.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05)";
            this.style.transition = "transform 0.2s ease";
        });

        button.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    });

    // ==========================================
    // BUSCADOR REAL AJAX (consulta al servidor)
    // ==========================================
    const searchInputAjax = document.getElementById("searchInput");
    if (searchInputAjax) {
        let typingTimer;

        searchInputAjax.addEventListener("input", function () {
            clearTimeout(typingTimer);

            typingTimer = setTimeout(() => {
                const search = this.value;

                fetch(
                    `/dashboard?search=${encodeURIComponent(
                        search
                    )}&assistantsPage=1`,
                    {
                        headers: { "X-Requested-With": "XMLHttpRequest" },
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success && data.html) {
                            document.querySelector(
                                "#assistantsTableContainer"
                            ).innerHTML = data.html;
                        }
                    })
                    .catch((err) =>
                        console.error("Error AJAX búsqueda asistentes:", err)
                    );
            }, 250); // para que no dispare 50 peticiones por segundo
        });
    }

    // ==========================================
    // LISTEN FOR CUSTOM EVENT (opcional) para abrir modal de edición de asistente
    // si tu otra lógica lo espera
    // ==========================================
    document.addEventListener("openEditAssistantModal", function (ev) {
        try {
            const btn = ev.detail.button;
            // si tienes un modal editAssistantModal definido globalmente, usa eso
            const editAssistantModal =
                document.getElementById("editAssistantModal");
            const editAssistantForm =
                document.getElementById("editAssistantForm");

            // llenar inputs si existen
            const editAssistantNombre = document.getElementById(
                "editAssistantNombre"
            );
            const editAssistantApellido = document.getElementById(
                "editAssistantApellido"
            );
            const editAssistantTipoDocumento = document.getElementById(
                "editAssistantTipoDocumento"
            );
            const editAssistantNumeroDocumento = document.getElementById(
                "editAssistantNumeroDocumento"
            );
            const editAssistantCorreo = document.getElementById(
                "editAssistantCorreo"
            );
            const editAssistantTelefono = document.getElementById(
                "editAssistantTelefono"
            );

            if (!editAssistantModal) return;

            if (editAssistantNombre)
                editAssistantNombre.value = btn.dataset.nombre || "";
            if (editAssistantApellido)
                editAssistantApellido.value = btn.dataset.apellido || "";
            if (editAssistantTipoDocumento)
                editAssistantTipoDocumento.value =
                    btn.dataset.tipo_documento || "";
            if (editAssistantNumeroDocumento)
                editAssistantNumeroDocumento.value =
                    btn.dataset.numero_documento || "";
            if (editAssistantCorreo)
                editAssistantCorreo.value = btn.dataset.correo || "";
            if (editAssistantTelefono)
                editAssistantTelefono.value = btn.dataset.telefono || "";

            if (editAssistantForm && btn.dataset.id) {
                editAssistantForm.action = `/assistants/${btn.dataset.id}`;
            }

            // limpiar contenedor y agregar selects según data-lawyers si procede
            const assignedContainer = document.getElementById(
                "assignedLawyersContainer"
            );
            if (assignedContainer) assignedContainer.innerHTML = "";
            try {
                const lawyerIds = JSON.parse(btn.dataset.lawyers || "[]");
                if (Array.isArray(lawyerIds) && lawyerIds.length > 0) {
                    lawyerIds.forEach((id) => {
                        // si usas función addLawyerSelect, disprar evento para que la función existente lo procese
                        if (typeof window.addLawyerSelect === "function") {
                            window.addLawyerSelect(id);
                        } else {
                            // fallback sencillo: crear un select clonado si existe .lawyer-select
                            const base =
                                document.querySelector(".lawyer-select");
                            if (base && assignedContainer) {
                                const sel = base.cloneNode(true);
                                sel.style.display = "block";
                                sel.name = "lawyers[]";
                                sel.value = id;
                                const w = document.createElement("div");
                                w.classList.add("lawyer-wrapper");
                                w.appendChild(sel);
                                assignedContainer.appendChild(w);
                            }
                        }
                    });
                }
            } catch (err) {
                // ignore parse errors
            }

            // mostrar modal
            editAssistantModal.style.display = "flex";
            document.body.style.overflow = "hidden";
        } catch (err) {
            console.error(
                "Error al abrir modal de edición vía evento custom:",
                err
            );
        }
    });
});

// ==========================================
// BUSCADOR REAL AJAX (consulta al servidor)
// ==========================================
const searchInputAjax = document.getElementById("searchInput");
if (searchInputAjax) {
    let typingTimer;

    searchInputAjax.addEventListener("input", function () {
        clearTimeout(typingTimer);

        typingTimer = setTimeout(() => {
            const search = this.value;

            fetch(
                `/dashboard?search=${encodeURIComponent(
                    search
                )}&assistantsPage=1`,
                {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.html) {
                        document.querySelector(
                            "#assistantsTableContainer"
                        ).innerHTML = data.html;
                    }
                })
                .catch((err) =>
                    console.error("Error AJAX búsqueda asistentes:", err)
                );
        }, 250); // para que no dispare 50 peticiones por segundo
    });
}
// Delegación: eliminar asistente con AJAX (SIN RECARGAR)
document.addEventListener("submit", async function (e) {
    if (!e.target.classList.contains("delete-assistant-form")) return;

    e.preventDefault();

    const form = e.target;
    const assistantName = form.dataset.name || "";

    const confirmed = await showCustomAlert(
        "warning",
        "Confirmar Eliminación",
        `¿Estás seguro de eliminar al asistente ${assistantName}? Esta acción no se puede deshacer.`,
        true,
        "Eliminar",
        "Cancelar"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": getCsrfToken(),
                Accept: "application/json",
            },
            body: new FormData(form),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Error al eliminar");
        }

        // 🔥 quitar fila de la tabla
        const row = form.closest("tr");
        if (row) row.remove();

        await showCustomAlert(
            "success",
            "Eliminado",
            `El asistente ${assistantName} fue eliminado exitosamente.`
        );
    } catch (error) {
        console.error(error);
        await showCustomAlert(
            "error",
            "Error",
            "Ocurrió un error al eliminar el asistente."
        );
    }
});

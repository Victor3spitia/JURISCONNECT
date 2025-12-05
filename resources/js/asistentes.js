// asistentes.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CONFIGURACIÓN DE SWEETALERT2
    // ==========================================
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // ==========================================
    // ALERTA DE CREACIÓN EXITOSA
    // ==========================================
    const successMessage = document.querySelector('[data-success-message]');
    if (successMessage) {
        const message = successMessage.dataset.successMessage;
        Toast.fire({
            icon: 'success',
            title: message,
            background: '#d4edda',
            color: '#155724'
        });
    }

    // ==========================================
    // ALERTA DE ACTUALIZACIÓN EXITOSA
    // ==========================================
    const updateMessage = document.querySelector('[data-update-message]');
    if (updateMessage) {
        const message = updateMessage.dataset.updateMessage;
        Toast.fire({
            icon: 'success',
            title: message,
            background: '#d1ecf1',
            color: '#0c5460'
        });
    }

    // ==========================================
    // ALERTA DE ELIMINACIÓN EXITOSA
    // ==========================================
    const deleteMessage = document.querySelector('[data-delete-message]');
    if (deleteMessage) {
        const message = deleteMessage.dataset.deleteMessage;
        Toast.fire({
            icon: 'success',
            title: message,
            background: '#d4edda',
            color: '#155724'
        });
    }

    // ==========================================
    // ALERTA DE ERROR
    // ==========================================
    const errorMessage = document.querySelector('[data-error-message]');
    if (errorMessage) {
        const message = errorMessage.dataset.errorMessage;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d33'
        });
    }

    // ==========================================
    // CONFIRMACIÓN DE ELIMINACIÓN
    // ==========================================
    const deleteForms = document.querySelectorAll('.delete-form');
    
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            Swal.fire({
                title: '¿Está seguro?',
                text: "Esta acción eliminará permanentemente el asistente jurídico y no se podrá revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
                cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn-confirm-delete',
                    cancelButton: 'btn-cancel-delete'
                },
                buttonsStyling: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar indicador de carga
                    Swal.fire({
                        title: 'Eliminando...',
                        text: 'Por favor espere un momento',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    
                    // Enviar el formulario
                    form.submit();
                }
            });
        });
    });

    // ==========================================
    // BOTÓN EDITAR
    // ==========================================
    const editButtons = document.querySelectorAll('.btn-edit');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assistantId = this.dataset.id;
            
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Cargando...',
                text: 'Preparando formulario de edición',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Redirigir a la página de edición
            window.location.href = `/asistentes/${assistantId}/edit`;
        });
    });

    // ==========================================
    // VALIDACIÓN DE FORMULARIO (si existe)
    // ==========================================
    const assistantForm = document.querySelector('#assistantForm');
    
    if (assistantForm) {
        assistantForm.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            let emptyFields = [];
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Obtener el label del campo
                    const label = document.querySelector(`label[for="${field.id}"]`);
                    if (label) {
                        emptyFields.push(label.textContent.replace('*', '').trim());
                    }
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    html: `<p>Por favor complete los siguientes campos:</p>
                        <ul style="text-align: left; margin: 10px auto; display: inline-block;">
                        ${emptyFields.map(field => `<li>${field}</li>`).join('')}
                        </ul>`,
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            }
        });
        
        // Remover la clase de error cuando el usuario empiece a escribir
        const allInputs = assistantForm.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
    

    // ==========================================
    // HOVER EFFECTS (opcional)
    // ==========================================
    const actionButtons = document.querySelectorAll('.btn-edit, .btn-delete');
    
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

});
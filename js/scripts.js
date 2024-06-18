document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');

    function openModal() {
        fetch('register.html')
            .then(response => response.text())
            .then(data => {
                modal.innerHTML = data;
                modal.style.display = 'block';

                const closeButton = modal.querySelector('.close-button');
                closeButton.addEventListener('click', closeModal);

                loadFormData();
            })
            .catch(error => console.error('Error al cargar el contenido del modal:', error));
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    const registerLink = document.getElementById('register-link');
    registerLink.addEventListener('click', function (event) {
        event.preventDefault();
        openModal();
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Abrir el modal automáticamente al cargar la página por primera vez
    window.addEventListener('load', function() {
        openModal();
    });

    document.body.addEventListener('submit', function(event) {
        if (event.target && event.target.id === 'registration-form') {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            // Validar contraseñas
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                params.append(key, value);
            });

            const url = 'https://jsonplaceholder.typicode.com/users?' + params.toString();

            fetch(url, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos enviados con éxito:', data);
                localStorage.setItem('formData', JSON.stringify(Object.fromEntries(formData.entries())));
                closeModal();
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                const modalMessage = document.getElementById('modal-message');
                modalMessage.textContent = 'Error al enviar los datos. Inténtalo de nuevo.';
            });
        }
    });

    function loadFormData() {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            const form = document.getElementById('registration-form');
            if (form) {
                for (const key in formData) {
                    if (formData.hasOwnProperty(key) && form.elements[key]) {
                        form.elements[key].value = formData[key];
                    }
                }
            }
        }
    }
});

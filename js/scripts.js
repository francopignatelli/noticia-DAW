document.addEventListener('DOMContentLoaded', function () {
	const modal = document.getElementById('modal');

	function openModal() {
			fetch('./register.html')
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

					const errors = validateForm(formData);
					if (Object.keys(errors).length > 0) {
							displayErrors(errors, form);
							return;
					}

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

	function validateForm(formData) {
			const errors = {};

			// Nombre completo
			const firstName = formData.get('firstName');
			const lastName = formData.get('lastName');
			if (!firstName || !lastName || (firstName + " " + lastName).length <= 6 || !/\s/.test(firstName + " " + lastName)) {
					errors.firstName = 'El nombre completo debe tener más de 6 letras y al menos un espacio.';
			}

			// Email
			const email = formData.get('email');
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
					errors.email = 'El formato del correo electrónico no es válido.';
			}

			// Contraseña
			const password = formData.get('password');
			if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password)) {
					errors.password = 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.';
			}

			// Edad
			const age = formData.get('age');
			if (!Number.isInteger(+age) || age < 18) {
					errors.age = 'La edad debe ser un número entero mayor o igual a 18.';
			}

			// Teléfono
			const phone = formData.get('phone');
			if (!/^\d{7,}$/.test(phone)) {
					errors.phone = 'El teléfono debe tener al menos 7 dígitos, sin espacios, guiones ni paréntesis.';
			}

			// Dirección
			const address = formData.get('address');
			if (!/.{5,}/.test(address) || !/\s/.test(address)) {
					errors.address = 'La dirección debe tener al menos 5 caracteres, con letras, números y un espacio en el medio.';
			}

			// Ciudad
			const city = formData.get('city');
			if (city.length < 3) {
					errors.city = 'La ciudad debe tener al menos 3 caracteres.';
			}

			// Código Postal
			const postalCode = formData.get('postalCode');
			if (postalCode.length < 3) {
					errors.postalCode = 'El código postal debe tener al menos 3 caracteres.';
			}

			// DNI
			const dni = formData.get('dni');
			if (!/^\d{7,8}$/.test(dni)) {
					errors.dni = 'El DNI debe ser un número de 7 u 8 dígitos.';
			}

			return errors;
	}

	function displayErrors(errors, form) {
			clearErrors(form);
			for (const key in errors) {
					if (errors.hasOwnProperty(key)) {
							const errorElement = document.createElement('div');
							errorElement.className = 'error-message';
							errorElement.textContent = errors[key];
							form.querySelector(`[name="${key}"]`).parentNode.appendChild(errorElement);
					}
			}
	}

	function clearErrors(form) {
			const errorMessages = form.querySelectorAll('.error-message');
			errorMessages.forEach(errorMessage => errorMessage.remove());
	}

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

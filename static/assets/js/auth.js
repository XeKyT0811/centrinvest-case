document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const errorBlock = document.getElementById('auth-error');

    if (errorBlock) errorBlock.style.display = 'none';

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loginInput = authForm.querySelector('input[name="login"]').value;
        const passwordInput = authForm.querySelector('input[name="password"]').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: loginInput, password: passwordInput })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка авторизации');
            }

            sessionStorage.removeItem('dashboard_data');
            window.location.href = '/';

        } catch (err) {
            if (errorBlock) {
                errorBlock.textContent = err.message;
                errorBlock.style.display = 'block';
            }
        }
    });
});
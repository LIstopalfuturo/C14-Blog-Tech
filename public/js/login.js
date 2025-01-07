// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const loginFormHandler = async (event) => {
    event.preventDefault();

    // Get form elements
    const emailInput = document.querySelector('#email-login');
    const passwordInput = document.querySelector('#password-login');

    if (!emailInput || !passwordInput) {
      console.error('Form elements not found');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      if (email && password) {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
          alert(data.message || 'Failed to log in');
          passwordInput.value = '';
        }
      } else {
        alert('Please fill in both email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const toggleForm = () => {
    const loginSection = document.querySelector('#login-section');
    const signupSection = document.querySelector('#signup-section');
    const toggleBtn = document.querySelector('#toggle-form');

    if (!loginSection || !signupSection || !toggleBtn) {
      console.error('Toggle elements not found');
      return;
    }

    if (loginSection.style.display === 'none') {
      loginSection.style.display = 'block';
      signupSection.style.display = 'none';
      toggleBtn.textContent = 'Switch to Sign Up';
    } else {
      loginSection.style.display = 'none';
      signupSection.style.display = 'block';
      toggleBtn.textContent = 'Switch to Login';
    }
  };

  // Add event listeners
  const loginForm = document.querySelector('.login-form');
  const toggleButton = document.querySelector('#toggle-form');

  if (loginForm) {
    loginForm.addEventListener('submit', loginFormHandler);
  } else {
    console.error('Login form not found');
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleForm);
  } else {
    console.error('Toggle button not found');
  }
});

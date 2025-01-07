const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  console.log('Attempting signup with:', { name, email }); // For debugging

  if (name && email && password) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('Signup response:', data); // For debugging

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(data.message || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('An error occurred during signup. Please try again.');
    }
  } else {
    alert('Please fill out all fields');
  }
};

const toggleForm = () => {
  const loginSection = document.querySelector('#login-section');
  const signupSection = document.querySelector('#signup-section');
  const toggleBtn = document.querySelector('#toggle-form');

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

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);

document
  .querySelector('#toggle-form')
  .addEventListener('click', toggleForm);

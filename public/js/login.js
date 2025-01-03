const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to log in');
    }
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
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);



document
  .querySelector('#toggle-form')
  .addEventListener('click', toggleForm);

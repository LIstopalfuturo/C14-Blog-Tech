const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (name && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/viewPost');
    } else {
      alert('Failed to sign up');
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
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);



document
  .querySelector('#toggle-form')
  .addEventListener('click', toggleForm);

let sessionTimeout;
const INACTIVE_TIMEOUT = 300000; // 5 minutes in milliseconds

function resetSessionTimer() {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(checkSession, INACTIVE_TIMEOUT);
}

async function checkSession() {
  try {
    const response = await fetch('/api/users/check-session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert('Your session has expired. Please log in again.');
      window.location.replace('/login');
    }
  } catch (err) {
    alert('Your session has expired. Please log in again.');
    window.location.replace('/login');
  }
}

// Reset timer on user activity
document.addEventListener('mousemove', resetSessionTimer);
document.addEventListener('keypress', resetSessionTimer);
document.addEventListener('click', resetSessionTimer);
document.addEventListener('scroll', resetSessionTimer);

// Initial timer start
resetSessionTimer();

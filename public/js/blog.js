const newBlogFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#blog-title').value.trim();
  const content = document.querySelector('#blog-content').value.trim();

  if (title && content) {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create blog post');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to create blog post');
    }
  }
};

const editBlogFormHandler = async (event) => {
  event.preventDefault();
  const id = event.target.getAttribute('data-id');
  const title = document.querySelector('#edit-title').value.trim();
  const content = document.querySelector('#edit-content').value.trim();

  if (title && content) {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update blog post');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to update blog post');
    }
  }
};

// Add event listeners
document.querySelector('.new-blog-form')?.addEventListener('submit', newBlogFormHandler);
document.querySelector('.edit-blog-form')?.addEventListener('submit', editBlogFormHandler); 
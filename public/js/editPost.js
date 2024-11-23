const editButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
  const id = event.target.getAttribute('data-id');
  
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
  });

  if (response.ok) {
    document.location.replace('/view-post');
  } else {
      alert('Failed to update project');
    }
  }
};

document.querySelector('.edit-form').addEventListener('click', editButtonHandler);


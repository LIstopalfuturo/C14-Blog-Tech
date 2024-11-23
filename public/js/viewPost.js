const deleteButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
  const id = event.target.getAttribute('data-id');
  
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    document.location.replace('/view-post');
  } else {
      alert('Failed to delete project');
    }
  }
};

document.querySelector('.project-list').addEventListener('click', deleteButtonHandler);


const editButtonHandler = async (event) => {
  event.preventDefault();
  const id = event.target.getAttribute('data-id');
  const name = document.querySelector('#name-edit').value.trim();
  const description = document.querySelector('#description-edit').value.trim();

  if (name && description) {

  const response = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      description,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/view-post');
  } else {
      alert('Failed to update project');
    }
  }
  };                    
  
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

document.querySelector('.edit-form').addEventListener('submit', editButtonHandler);
document.querySelector('.delete-btn').addEventListener('click', deleteButtonHandler);


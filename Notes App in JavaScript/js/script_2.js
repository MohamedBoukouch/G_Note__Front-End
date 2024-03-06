document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");
  const addBox = document.querySelector(".add-box");
  const popupBox = document.getElementById("popupBox");
  const closePopupBtn = document.getElementById("closePopup");
  const noteForm = document.getElementById("noteForm");
  const noteTitleInput = document.getElementById("noteTitle");
  const noteDescriptionInput = document.getElementById("noteDescription");

  // Function to show popup box
  function showPopup() {
      popupBox.classList.add("show");
  }

  // Function to hide popup box
  function hidePopup() {
      popupBox.classList.remove("show");
  }

  // Show popup box when the "Add new note" button is clicked
  addBox.addEventListener("click", showPopup);

  // Close the popup box when the "Close" button is clicked
  closePopupBtn.addEventListener("click", hidePopup);

  // Handle form submission
  noteForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent the default form submission

      // Get the values from the input fields
      const title = noteTitleInput.value.trim();
      const description = noteDescriptionInput.value.trim();

      // Perform validation if needed

      // Create a new note object
      const newNote = {
          title: title,
          description: description
      };

      // Clear the input fields
      noteTitleInput.value = "";
      noteDescriptionInput.value = "";

      // Hide the popup box
      hidePopup();

      // Perform further actions like adding the note to the list or sending it to the server
      // You can implement this part based on your requirements
      console.log("New note:", newNote);
  });

  // Fetch notes for a specific user
  // This part can be added here if needed
});


document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");

  // Function to fetch notes
  function fetchNotes() {
      const formData = new URLSearchParams();
      formData.append('user_id', parameterValue); // Change 5 to the actual user ID

      fetch('http://localhost:9080/gnotes/api/v1/note/select', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          displayNotes(data);
      })
      .catch(error => console.error('Error fetching notes:', error));
  }

  // Function to display notes
  function displayNotes(notes) {
      notesContainer.innerHTML = ""; // Clear existing notes
      notes.forEach(note => {
          const li = document.createElement("li");
          li.className = "note";

          const details = document.createElement("div");
          details.className = "details";
          details.innerHTML = `<p>${note.subject}</p><span>${note.body}</span>`;

          const bottomContent = document.createElement("div");
          bottomContent.className = "bottom-content";
          bottomContent.innerHTML = `<span>${note.date}</span>`;

          const settings = document.createElement("div");
          settings.className = "settings";
          settings.innerHTML = `
              <i class="uil uil-edit" onclick="showPopupWithUpdatedData('${note.id}','${1}','${3}')" style="color: blue;"></i>
              <i class="uil uil-trash-alt" onclick="deleteNoteFromDatabase('${11}','${note.id}')" style="color: red;"></i>
          `;

          bottomContent.appendChild(settings);
          li.appendChild(details);
          li.appendChild(bottomContent);
          notesContainer.appendChild(li);
      });
  }

  // Fetch notes for a specific user
  fetchNotes();
});

function showPopupWithUpdatedData(id, subject, body) {
  showErrorMessage("message")
}

function deleteNoteFromDatabase(userid,noteId) {
  // Encode the noteId as form data
  const formData = new URLSearchParams();
  formData.append('id', noteId);
  formData.append('user_id', userid);

  // Call your API here to delete the note from the database
  fetch(`http://localhost:9080/gnotes/api/v1/note/delet`, {
      method: 'post',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete note.');
      }
      return response.text(); // assuming the API returns 'is deleted'
  })
  .then(data => {
      // Check the response from the API
      if (data === 'is deleted') {
          // Show a container with the success message
          showSuccessMessage("Deleted successfully");
          window.location.href="../Views/UserDashboard.html";
      } else {
          showErrorMessage("Try delet againe");
      }
  })
  .catch(error => {
      console.error('Error deleting note:', error);
      // Handle error here, e.g., display an error message to the user
      showErrorMessage(error.message);
  });
}

function showSuccessMessage(messageContent) {
  // Display a container with the success message
  const successContainer = document.getElementById('success-container');
  successContainer.style.display = 'block';

  // Display the content of the deleted message
  const messageElement = document.createElement('p');
  messageElement.textContent = messageContent;
  successContainer.appendChild(messageElement);
  setTimeout(function() {
      successContainer.style.display = 'none';
      // Remove the message element to avoid it appearing again when the container is shown next time
      successContainer.removeChild(messageElement);
  }, 2000);
}

function showErrorMessage(message) {
  // Display a container with the error message
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerText = message;
  errorContainer.style.display = 'block';

  // Hide the error message container after 2 seconds
  setTimeout(function() {
      errorContainer.style.display = 'none';
  }, 2000);
}

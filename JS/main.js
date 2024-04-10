    //Navjot singh
    
    // Function to refresh the list of saved texts
    function refreshSavedTexts() {
        showSavedTexts();
    }

   // Function to save text to local storage or update if it already exists
   function saveText() {
    const headingInput = document.getElementById('headingInput').value;
    const inputText = document.getElementById('textInput').value;
    const password = document.getElementById('passwordInput').value;
  
    if (inputText.trim() === '') {
      showMessage("Please enter some text before saving.");
      return;
    }
  
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
    const existingIndex = savedTexts.findIndex(textObj => textObj.heading === headingInput);
  
    // Get the current date and time
    const currentDate = new Date();
    const saveDate = currentDate.toLocaleString();
  
    if (existingIndex !== -1) {
      // If heading already exists, update the existing entry
      savedTexts[existingIndex] = { heading: headingInput, text: inputText, password: password, saveDate: saveDate };
    } else {
      // If heading doesn't exist, add a new entry
      savedTexts.push({ heading: headingInput, text: inputText, password: password, saveDate: saveDate });
    }
  
    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
  
    showSavedTexts();
    showMessage("Text has been saved to the browser's local storage.");
    document.getElementById('headingInput').value = '';
    document.getElementById('textInput').value = '';
    document.getElementById('passwordInput').value = '';
  }

    

    // Function to create a list item with "Show More" link and buttons for a saved text
    function createSavedTextListItem(savedText) {
      if (!savedText || typeof savedText !== 'object') {
        return null;
      }

      const { heading, text, password } = savedText;

      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';

      const headingDiv = document.createElement('div');
      headingDiv.className = 'fw-bold';
      headingDiv.textContent = heading;

      const textSpan = document.createElement('span');

      const dateSpan = document.createElement('span');
      dateSpan.className = 'text-muted';
      dateSpan.style.display = 'block';
      dateSpan.textContent = `Saved on ${savedText.saveDate}`; // Display the saved date and time


      if (password) {
        textSpan.textContent = 'XXXXXXXXXXXXXXX'; // Displaying XXXX for password-protected texts
        const eyeIcon = document.createElement('i');
        eyeIcon.className = 'fas fa-eye ml-2 text-primary ms-2';
        eyeIcon.style.cursor = 'pointer';
        eyeIcon.onclick = function () {
          if (prompt('Enter password to view the text:') === password) {
            textSpan.textContent = text;
            document.getElementById('downloadButton').style.display = 'block';
          } else {
            alert('Incorrect password. The text cannot be displayed.');
          }
        };
        headingDiv.appendChild(eyeIcon);
      } else {
        if (text.length > 100) {
          const shortenedText = text.substring(0, 100);
          textSpan.textContent = shortenedText + '... ';
          textSpan.style.display = "block";
    
          const showMoreLink = document.createElement('a');
          showMoreLink.href = '#';
          showMoreLink.textContent = 'Show More';
          showMoreLink.style.float = "right";
          showMoreLink.style.marginBottom  = "10px";
          showMoreLink.onclick = function () {
            textSpan.textContent = text;
            listItem.appendChild(showLessLink);
            listItem.removeChild(showMoreLink);
          };
    
          const showLessLink = document.createElement('a');
          showLessLink.href = '#';
          showLessLink.textContent = 'Show Less';
          showLessLink.onclick = function () {
            textSpan.textContent = shortenedText + '... ';
            showMoreLink.style.float = "left";
            listItem.appendChild(showMoreLink);
            listItem.removeChild(showLessLink);
          };
    
          listItem.appendChild(showMoreLink);
        } else {
          textSpan.textContent = text;
        }
      }

      listItem.appendChild(headingDiv);
      listItem.appendChild(textSpan);
      listItem.appendChild(dateSpan); // Add the date span to the list item

      // Edit button
      if (!password) {
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary btn-sm ms-2 float-end';
        editButton.textContent = 'Edit';
        editButton.onclick = function () {
            document.documentElement.scrollTop = 0;
            editSavedText(heading, text, password);
        };
        listItem.appendChild(editButton);
      }

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger btn-sm ms-2 float-end';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function () {
        deleteSavedText(heading, listItem);
      };

      // Download button
      const downloadButton = document.createElement('button');
      downloadButton.id = 'downloadButton';
      downloadButton.className = 'btn btn-success btn-sm ms-2 float-end';
      downloadButton.textContent = 'Download';
      downloadButton.onclick = function () {
        downloadSingleText(heading, text);
      };

      if (password) {
        downloadButton.style.display = 'none';
      }

      listItem.appendChild(deleteButton);
      listItem.appendChild(downloadButton);

      return listItem;
    }

    // Function to create a "Show Less" link for a saved text
    function createShowLessLink(text) {
      const showLessLink = document.createElement('a');
      showLessLink.href = '#';
      showLessLink.textContent = 'Show Less';
      showLessLink.onclick = function () {
        textSpan.textContent = text.substring(0, 100) + '... ';
        listItem.appendChild(showMoreLink);
        listItem.removeChild(showLessLink);
      };
      return showLessLink;
    }

    // Function to edit a saved text
    function editSavedText(heading, text, password) {
      document.getElementById('headingInput').value = heading;
      document.getElementById('textInput').value = text;
      document.getElementById('passwordInput').value = password || '';
    }

    // Function to delete a saved text
    function deleteSavedText(heading, listItem) {
      if (confirm('Are you sure you want to delete this saved text?')) {
        const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
        const index = savedTexts.findIndex(textObj => textObj.heading === heading);

        if (index !== -1) {
          savedTexts.splice(index, 1);
          localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
          listItem.remove();
        }
      }
    }

    // Function to download a single text as a .txt file
    function downloadSingleText(heading, text) {
      const element = document.createElement('a');
      const fileContent = `${heading}\n${text}`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'saved_text.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    // Function to display saved texts on the side
    function showSavedTexts(pageNumber = 1, itemsPerPage = 5) {
      const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
      const savedTextsList = document.getElementById('savedTexts');
      const pagination = document.getElementById('pagination');
      const messageDiv = document.getElementById('message');
      const recentlist = document.getElementById('recentlist');
      
      savedTextsList.innerHTML = '';
      pagination.innerHTML = '';

      // Check if savedTexts is not an array
      if (!Array.isArray(savedTexts) || savedTexts.length === 0) {
        // Display default message if there are no saved texts
        messageDiv.innerHTML = '<div class="alert alert-info">No saved texts found.</div>';
        recentlist.style.display = "none";
        return;
      }else{
        recentlist.style.display = "block";
      }
    

      const totalPages = Math.ceil(savedTexts.length / itemsPerPage);

      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      for (let i = startIndex; i < endIndex && i < savedTexts.length; i++) {
        const listItem = createSavedTextListItem(savedTexts[i]);
        if (listItem) {
          savedTextsList.appendChild(listItem);
        }
      }

      // Create pagination buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = 'page-item';
        pageButton.innerHTML = `<a class="page-link" href="#" onclick="showSavedTexts(${i}, ${itemsPerPage})">${i}</a>`;
        pagination.appendChild(pageButton);
      }
    }

    // Function to display messages
    function showMessage(message) {
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = `<div class="alert alert-info">${message}</div>`;
    }

    // Show previously saved texts on page load
    showSavedTexts();
    
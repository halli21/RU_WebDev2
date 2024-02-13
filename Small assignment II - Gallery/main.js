const dbname = "imageDB16"


const request = indexedDB.open(dbname, 1);

request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};


request.onupgradeneeded = (event) => {
  const db = request.result;
  const store = db.createObjectStore("images", { autoIncrement: true });
  store.createIndex("imageStrings", ["base64String"], { unique: false })
};

request.onsuccess = (event) => {
  const db = request.result;
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");
};




function dragEnterHandler(event) {
  event.stopPropagation();
  event.preventDefault();
  dropzone.classList.add('pulse');
}

function dragOverHandler(event) {
  event.stopPropagation();
  event.preventDefault();
}

function dragLeaveHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  dropzone.classList.remove('pulse');
}

function dropHandler(event) {
  event.stopPropagation();
  event.preventDefault();
  dropzone.classList.remove('pulse');
  dodrop(event);
}




function getDropzoneInstructions() {
  return `
    <div class="instructions">
      <svg fill="#d2d1d9" height="30px" width="30px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384.97 384.97" xml:space="preserve">
        <g>
          <g id="Upload">
            <path d="M372.939,264.641c-6.641,0-12.03,5.39-12.03,12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03
              S0,270.031,0,276.671v96.242c0,6.641,5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03v-96.242
              C384.97,270.019,379.58,264.641,372.939,264.641z"/>
            <path d="M117.067,103.507l63.46-62.558v235.71c0,6.641,5.438,12.03,12.151,12.03c6.713,0,12.151-5.39,12.151-12.03V40.95
              l63.46,62.558c4.74,4.704,12.439,4.704,17.179,0c4.74-4.704,4.752-12.319,0-17.011l-84.2-82.997
              c-4.692-4.656-12.584-4.608-17.191,0L99.888,86.496c-4.752,4.704-4.74,12.319,0,17.011
              C104.628,108.211,112.327,108.211,117.067,103.507z"/>
          </g>
        </g>
      </svg>
      <span>Drop media to import</span>
    </div>
  `;
}




function getImageOptions(event) {
  const optionsHtml = `
    <div class="image-options">
      <button id="uploadButton" class="uk-button uk-button-primary">Upload</button>
      <button id="cancelButton" class="uk-button uk-button-secondary">Cancel</button>
    </div>
  `;

  dropzone.innerHTML += optionsHtml;

  const cancelButton = document.getElementById('cancelButton');
  cancelButton.addEventListener('click', function() {
    dropzone.innerHTML = getDropzoneInstructions();
  });


  const uploadButton = document.getElementById('uploadButton');
  uploadButton.addEventListener('click', function() {
    uploadImage(event.target.result);
    dropzone.innerHTML = getDropzoneInstructions();
  });
}




function createImage(base64String) {
  const img = document.createElement('img');
  img.src = base64String;
  img.style.height = '200px';
  return img; 
}


function uploadImage(base64String) {
  const request = indexedDB.open(dbname, 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const imageData = { base64String: base64String };
    
    const addRequest = store.add(imageData);
    addRequest.onsuccess = () => {
      displayImages()
      console.log("Image data added successfully")
    };
    addRequest.onerror = (event) => console.error("Error adding image data:", event.target.error);
  };
}




function dodrop(event)
{
  dropzone.innerHTML = '';
  const file = event.dataTransfer.files[0];
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(event) {
      dropzone.appendChild(createImage(event.target.result));
      getImageOptions(event);
    };

    reader.readAsDataURL(file);
  }
  else {
    dropzone.innerHTML = getDropzoneInstructions();
    console.log('needs to be an image')
  }
}




function displayImages() {
  const request = indexedDB.open(dbname, 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    
    store.getAll().onsuccess = (event) => {
      const imagesDiv = document.getElementById('images');
      const images = event.target.result;
      imagesDiv.innerHTML = '';

      if (images.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'The gallery is empty';
        imagesDiv.appendChild(emptyMessage);
      } else {
        images.forEach((imageString) => {
          const img = createImage(imageString.base64String);
          imagesDiv.appendChild(img);
        });
      }
    };
  };
}



function setup() {
  var dropzone = document.getElementById('dropzone');
  dropzone.innerHTML = getDropzoneInstructions();
  displayImages();
}



document.addEventListener('DOMContentLoaded', setup);
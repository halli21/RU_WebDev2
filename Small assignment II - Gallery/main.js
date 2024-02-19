const dbname = "imageDB17"
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
      <span uk-icon="icon: upload; ratio: 2"></span>
     
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

  if (!file.type.match('image.*')) {
    dropzone.innerHTML = getDropzoneInstructions();
    console.log('needs to be an image')
  } else {
    const reader = new FileReader();
    reader.onload = function(event) {
      dropzone.appendChild(createImage(event.target.result));
      getImageOptions(event);
    };

    reader.readAsDataURL(file);
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
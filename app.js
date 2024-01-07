// Replace with your own API key, Client ID, and folder ID
const API_KEY = 'AIzaSyCAQnXoGYo6WDRYO7V5bkC3yToksLUwvEs'; // Replace with your actual API key
const CLIENT_ID = '825832451611-3g3aajjuvih2q56e9h4d3t8b1qscb4l0.apps.googleusercontent.com'; // Replace with your actual Client ID
const FOLDER_ID = '1FYiNcrLy0FLl_x4B2jWpBLtbup-JgnZx'; // Replace with your actual folder ID

function start() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.readonly' // Adjust scope depending on your needs
    }).then(function () {
        listFiles();
    }).catch(function(error) {
        console.error("Error initializing the client: ", error);
    });
}

function listFiles() {
    gapi.client.drive.files.list({
        'q': `'${FOLDER_ID}' in parents`,
        'pageSize': 10, // Adjust pageSize to retrieve more files
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        const files = response.result.files;
        if (files && files.length > 0) {
            // Initialize slideshow with the first file
            displayImage(files, 0);
        } else {
            console.log('No files found in the folder.');
        }
    }).catch(function(error) {
        console.error("Error listing files: ", error);
    });
}

function displayImage(files, index) {
    const slideshowDiv = document.getElementById('slideshow');

    // Clear existing content
    slideshowDiv.innerHTML = '';

    if (files.length > 0) {
        const file = files[index];
        const imgTag = document.createElement('img');
        imgTag.src = "https://www.googleapis.com/drive/v3/files/" + file.id + "?key=" + API_KEY + "&alt=media";
        slideshowDiv.appendChild(imgTag);

        // Cycle to the next image after 3 seconds
        setTimeout(() => {
            displayImage(files, (index + 1) % files.length);
        }, 3000);
    }
}

// Load the Google Client Library and call the start function when it's ready
gapi.load('client', start);

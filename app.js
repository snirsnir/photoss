const API_KEY = 'AIzaSyCAQnXoGYo6WDRYO7V5bkC3yToksLUwvEs';
const CLIENT_ID = '825832451611-3g3aajjuvih2q56e9h4d3t8b1qscb4l0.apps.googleusercontent.com';
const FOLDER_ID = '1FYiNcrLy0FLl_x4B2jWpBLtbup-JgnZx'; // Replace with your folder ID

function start() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.readonly'
    }).then(function () {
        listFiles();
    }, function(error) {
        console.log('Error initializing the client: ', error);
    });
}

function listFiles() {
    gapi.client.drive.files.list({
        'q': `'${FOLDER_ID}' in parents`,
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        const files = response.result.files;
        if (files && files.length > 0) {
            cycleImages(files, 0);
        } else {
            console.log('No files found in the folder.');
        }
    }, function(error) {
        console.log('Error listing files: ', error);
    });
}

function cycleImages(files, index) {
    const slideshowDiv = document.getElementById('slideshow');
    slideshowDiv.innerHTML = '';  // Clear the previous image

    // Create an image element and append it to the slideshow div
    const img = document.createElement('img');
    img.src = "https://www.googleapis.com/drive/v3/files/" + files[index].id + "?key=" + API_KEY + "&alt=media";
    slideshowDiv.appendChild(img);

    // Calculate the next index in a cyclic manner
    const nextIndex = (index + 1) % files.length;

    // Set a timeout to call cycleImages with the next index after 10 seconds (10000 milliseconds)
    setTimeout(() => cycleImages(files, nextIndex), 10000);
}

// Load the Google API and initiate the client
gapi.load('client', start);

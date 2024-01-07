const API_KEY = 'AIzaSyCAQnXoGYo6WDRYO7V5bkC3yToksLUwvEs';
const CLIENT_ID = '825832451611-3g3aajjuvih2q56e9h4d3t8b1qscb4l0.apps.googleusercontent.com';
const FOLDER_ID = '1FYiNcrLy0FLl_x4B2jWpBLtbup-JgnZx'; // Replace with your folder ID

function start() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    }).then(function () {
        listFiles();
    });
}

function listFiles() {
    gapi.client.drive.files.list({
        q: `'${FOLDER_ID}' in parents`,
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
    }).then(function(response) {
        const files = response.result.files;
        if (files.length > 0) {
            cycleImages(files, 0);
        }
    });
}

function cycleImages(files, index) {
    const slideshowDiv = document.getElementById('slideshow');
    slideshowDiv.innerHTML = '';  // Clear the previous image

    const imgTag = document.createElement('img');
    imgTag.src = "https://www.googleapis.com/drive/v3/files/" + files[index].id + "?key=" + API_KEY + "&alt=media";
    slideshowDiv.appendChild(imgTag);

    // Set timeout for the next image
    setTimeout(() => {
        let nextIndex = (index + 1) % files.length;
        cycleImages(files, nextIndex);
    }, 10000);  // Change image every 10000 ms (10 seconds)
}

// Load the Google Client Library and call the start function when it's ready
gapi.load('client', start);

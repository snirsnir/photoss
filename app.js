const API_KEY = 'AIzaSyCAQnXoGYo6WDRYO7V5bkC3yToksLUwvEs';
const CLIENT_ID = '825832451611-3g3aajjuvih2q56e9h4d3t8b1qscb4l0.apps.googleusercontent.com';
const FOLDER_ID = '1FYiNcrLy0FLl_x4B2jWpBLtbup-JgnZx'; // Replace with your folder ID

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.error(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listFiles();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print files.
 */
function listFiles() {
    gapi.client.drive.files.list({
        'q': `'${FOLDER_ID}' in parents`,
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        appendPre('Files:');
        const files = response.result.files;
        if (files && files.length > 0) {
            files.forEach(function(file) {
                appendPre(file.name + ' (' + file.id + ')');
            });
        } else {
            appendPre('No files found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    const pre = document.createElement('pre');
    pre.textContent = message;
    document.getElementById('content').appendChild(pre);
}

// Load the client library and sign in function
handleClientLoad();

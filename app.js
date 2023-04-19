// Load the Google Sheets API client library
gapi.load('client', initClient);

// Client ID and API key from the Google API Console
var CLIENT_ID = 'YOUR_CLIENT_ID';
var API_KEY = 'YOUR_API_KEY';

// ID of the Google Spreadsheet
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// Array to hold the input data
var inputData = [];

// Initialize the Google Sheets API client
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  }).then(function () {
    // Handle the sign-in status
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      // User is already signed in, show input form
      showInputForm();
    } else {
      // User is not signed in, show sign-in button
      showSignInButton();
    }
  });
}

// Show sign-in button
function showSignInButton() {
  var signInButton = document.createElement('button');
  signInButton.textContent = 'Sign In with Google';
  signInButton.addEventListener('click', function () {
    gapi.auth2.getAuthInstance().signIn();
  });
  document.body.appendChild(signInButton);
}

// Show input form
function showInputForm() {
  var form = document.createElement('form');
  var emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  form.appendChild(emailInput);

  var passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';
  form.appendChild(passwordInput);

  var submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    inputData.push([emailInput.value, passwordInput.value]);
    appendDataToSheet(inputData);
    form.reset();
  });

  document.body.appendChild(form);
}

// Append data to Google Spreadsheet
function appendDataToSheet(data) {
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:B',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: data,
    },
  }).then(function (response) {
    console.log('Data appended successfully:', response);
  }).catch(function (error) {
    console.error('Error appending data:', error);
  });
}

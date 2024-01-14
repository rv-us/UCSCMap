/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
// export {eventsToday};
/* exported handleSignoutClick */
// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '648866811-n7744p5pt0dsrn7e7u77q4jf92i35v3t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDiEfJb9DOKfqXfy_Y9xZhQmZ0TXbNO1ro';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let events;
let eventsToday;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    console.log('this works gapi')
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
    let response;
    try {
        const request = {
            'calendarId': 'primary',
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    events = response.result.items;
    console.log(events);
    // Filter events for today ONLY
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    console.log(today);

    console.log(today);
    // for (const event of events) {
    //     if (event.start && event.start.dateTime) {
    //         console.log(event.start.dateTime.substr(0, 10));
    //     } else {
    //         console.log("DateTime not available for this event");
    //     }
    // }    
    eventsToday = events.filter(events => events.start.dateTime.substr(0, 10) == today);
    console.log(eventsToday);
    // Print events
    const output = eventsToday.reduce((str, eventsToday) => `${str}${eventsToday.summary} (${eventsToday.start.dateTime || eventsToday.start.date}) ${eventsToday.location}\n`,'Events:\n');
    document.getElementById('content').innerText = output;
    // for (const event of eventsToday) {
    //     console.log(`Event: ${event.summary}, Date: ${event.start.dateTime || event.start.date}, Location: ${event.location}`);
    // }
    // console.log(events)
}

// Load the Google API and Identity Services scripts
gapiLoaded();
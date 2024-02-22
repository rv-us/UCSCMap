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
let datecount;
let d = new Date();
let year = d.getFullYear();
let month = (d.getMonth() + 1).toString().padStart(2, '0');
let day = d.getDate().toString().padStart(2, '0');
let today;
let counterdays = 0;
let countermonths = 0;
let daysInMonth = {
    '01': 31, // January
    '02': 28, // February (assuming not a leap year)
    '03': 31, // March
    '04': 30, // April
    '05': 31, // May
    '06': 30, // June
    '07': 31, // July
    '08': 31, // August
    '09': 30, // September
    '10': 31, // October
    '11': 30, // November
    '12': 31  // December
};
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
    // const d = new Date();
    // const year = d.getFullYear();
    // const month = (d.getMonth() + 1).toString().padStart(2, '0');
    // const day = d.getDate().toString().padStart(2, '0');
    var today = `${year}-${month}-${day}`;
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
    const output = eventsToday.reduce((str, event) => {
        const startTime = event.start.dateTime ? new Date(event.start.dateTime) : null;
        const formattedTime = startTime ? startTime.toLocaleTimeString() : 'All day';
    
        return `${str}${event.summary} (${formattedTime}) ${event.location}\n`;
    }, 'Events:\n');
    
    document.getElementById('content').innerText = output;
    document.getElementById('currentDate').textContent = today;
    
    printEvents();
    // for (const event of eventsToday) {
    //     console.log(`Event: ${event.summary}, Date: ${event.start.dateTime || event.start.date}, Location: ${event.location}`);
    // }
    // console.log(events)
}
function changedateforward() {
    while(markers.length > 0) {
        markers.pop();
    }
    var intNumber = parseInt(day);
    intNumber = intNumber + 1;
    const monthKeys = Object.keys(daysInMonth);
    for (const month1 in daysInMonth) {
        // Check if the current month is equal to the targetMonth
        console.log(month)
        if (month1 === month) {
            // Access the value for the current month
            const days = daysInMonth[month];
            console.log('The value of int days is'+ intNumber)
            console.log('the value of days is'+days)
            // Compare the value to the comparisonValue
            if (days < intNumber) {
                intNumber = intNumber-days;
                console.log('should have changed?'+intNumber);
                const currentIndex = monthKeys.indexOf(month);
                const nextIndex = (currentIndex + 1) % 12;
                month = monthKeys[nextIndex]; 
            } 
        }
    }
    console.log(intNumber)
    day = intNumber.toString().padStart(2, '0');
    today = `${year}-${month}-${day}`
    console.log(today);
    listUpcomingEvents();
}
function changedatebackward() {
    while(markers.length > 0) {
        markers.pop();
    }
    var intNumber = parseInt(day);
    intNumber = intNumber - 1;
    const monthKeys = Object.keys(daysInMonth);

    for (const month1 in daysInMonth) {
        // Check if the current month is equal to the targetMonth
        console.log(month)
        if (month1 === month) {
            // Access the value for the current month
            const days = daysInMonth[month];
            console.log('The value of int days is ' + intNumber)
            console.log('The value of days is ' + days)
            // Compare the value to the comparisonValue
            if (intNumber < 1) {
                intNumber = intNumber - days;
                console.log('Should have changed? ' + intNumber);
                
                const currentIndex = monthKeys.indexOf(month);
                const previousIndex = (currentIndex - 1 + 12) % 12; // Adding 12 to handle negative modulo
                console.log(previousIndex)
                month = monthKeys[previousIndex];
            }
        }
    }

    if (intNumber < 1) {
        // If intNumber is negative, set day to the last day of the previous month
        const previousMonth = monthKeys[(monthKeys.indexOf(month) - 1 + 12) % 12];
        day = daysInMonth[previousMonth].toString().padStart(2, '0');
    } else {
        // Ensure intNumber is always two digits
        day = intNumber.toString().padStart(2, '0');
    }

    today = `${year}-${month}-${day}`;
    console.log(today);
    listUpcomingEvents();
}


// Load the Google API and Identity Services scripts
gapiLoaded();
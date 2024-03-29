function webDBFetch(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network Not OK')
            }
            return response.json()
        })
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(
                    key,
                    Array.isArray(value) ? JSON.stringify(value) : value
                )
            })
            console.log('WebDB Stored.')
        })
        .catch((error) => {
            JSAlert.alert(
                "Problem with accessing online database<br>This is a critical error, features won't work properly.",
                error,
                JSAlert.Icons.Failed,
                'Continue Anyways...'
            )
        })
}

const jsonURL =
    'https://raw.githubusercontent.com/Vanthanyx/Raptor/master/cdn/database.json'
webDBFetch(jsonURL)

const securityURL = localStorage.getItem('securityURL')
if (securityURL !== null) {
    console.warn('Running Security Script...')
    const fileName = securityURL.split('/').pop() // Extracting the file name
    JSAlert.loader(`Starting A Live Patch...<br>${fileName}`).dismissIn(5000) // Displaying only the file name
    async function runJSFromURL(url) {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch ${url}: ${response.status} ${response.statusText}`
                )
            }

            const scriptText = await response.text()
            eval(scriptText)
        } catch (error) {
            console.error('Error:', error)
        }
    }
    runJSFromURL(securityURL)
    localStorage.removeItem('securityURL')
}

const appStatus = localStorage.getItem('status')
const bypassStatus = localStorage.getItem('bypassOffline')
function checkStatus() {
    if (appStatus === 'offline' && bypassStatus !== 'enabled') {
        window.location.href = './content/offline.html'
    }
}

function setOffline() {
    localStorage.setItem('status', 'offline')
    window.location.href = './content/offline.html'
}

function openTestingWindow() {
    window.location.href = 'content/testing.html'
}

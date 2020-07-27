// File reader
var fs = require('fs');

// Request package
var request = require("request");

// Variable to store all final urls results
var urlResponseObject = [];

// List of urls to be processed
var urlList = [];

console.log('Initializing the file reading request....');
console.log('..................................\n');

//Read the file content and convert to array
var fileData = fs.readFileSync('list_of_urls.txt', 'utf8');
if (fileData.length > 5) {
    console.log('File content...\n' + fileData);
    var urlListTemp = fileData.split("\n");
    for (let ui = 0; ui < urlListTemp.length; ui++) {
        var urlString = urlListTemp[ui];
        urlList[ui] = urlString.replace(/\n|\r/g, "");
    }
    console.info(urlList);
} else {
    console.log('File is empty....');
    return false;
}


// Function to read the url content and return response
function readUrl(url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                resolve(404);
            } else {
                resolve((body));
            }
        })
    })
}

// An object to store the urls properties
var urlObject = function(url) {
    this._url = url;
    this.updateSucess = updateSucess;
    this.updatePending = updatePending;
    this.updateFailure = updateFailure;

}

// Update success status of the url
function updateSucess() {
    this._status = 'Success';
    this._statusCode = 200;
}

// Update pending status of the url
function updatePending() {
    this._status = 'Pending';
}

// Update failure status of the url
function updateFailure() {
    this._status = 'Failed';
    this._error = 'Address not found';
}

// Process all the urls and store response in object
function runApp() {
    console.log('.........Initialing for loop........\n');
    for (let i = 0; i < urlList.length; i++) {
        let curentUrl = urlList[i];
        
        // Create new object of url
        let currentUrlObject = new urlObject(curentUrl);
        currentUrlObject.updatePending();

        // call the promise to return url response
        let initializePromise = readUrl(curentUrl);
        initializePromise.then(function(result) {
                console.log('Processing the url => ' + JSON.stringify(curentUrl));
                if (result === 404) {

                    // console.log(result);
                    currentUrlObject.updateFailure();
                    console.log('Current reading url => ' + JSON.stringify(currentUrlObject));
                    console.log('Reading status => Failed');
                    console.log('Completed reading for url => ' + JSON.stringify(curentUrl));
                    urlResponseObject[i] = currentUrlObject;
                    let finalResult = JSON.stringify(urlResponseObject);
                    console.log('Total reading completed urls : ' + finalResult);
                    console.log('..................................\n');
                } else {
                    // console.log(result);
                    let sourceCode=result;
                    currentUrlObject.updateSucess();
                    console.log('Current reading url : ' + JSON.stringify(currentUrlObject));
                    console.log('Reading status => Success');
                    // console.log('Source code og the url  => ' +sourceCode);
                    console.log('Completed reading for url => ' + JSON.stringify(curentUrl));
                    urlResponseObject[i] = currentUrlObject;
                    let finalResult = JSON.stringify(urlResponseObject);
                    console.log('Total reading completed urls => ' + finalResult);
                    console.log('..................................\n');
                }
            },
            function(err) {
                console.log('Error => ' + error);
            })
    }

}

// Run the main app
runApp();

// Show processed urls for every 2 seconds
var showProcessedUrls = setInterval(function () { 

            console.log('...............Total processed result...................'); 
            console.log(JSON.stringify(urlResponseObject));
            var originalArray = Object.size(urlList);
            var processedArray = Object.size(urlResponseObject);

            // Stope if all urls has been processed
            if(originalArray==processedArray)
            {
                clearInterval(showProcessedUrls);
            }
    }, 2000);

// Get the size of the objects
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

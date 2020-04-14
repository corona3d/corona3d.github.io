function getGlobalData(cb) {
    var confirmedData = null;
    var deathData = null;
    var recoveredData = null;
    var focusedConfirmed = null;


    var newXHR = new XMLHttpRequest();
    newXHR.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv', true);
    newXHR.onreadystatechange = function(e) {
        if (newXHR.readyState === 4) {
            if (newXHR.status === 200) {
                confirmedData = processCSV(newXHR.responseText);

                if (confirmedData && recoveredData && deathData && focusedConfirmed) {
                    var formattedData = structureData(confirmedData, deathData, recoveredData, focusedConfirmed);
                    window.data = formattedData;
                    cb(formattedData);
                }
            }
        }
    };
    newXHR.send(null);

    var newXHR2 = new XMLHttpRequest();
    newXHR2.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv', true);
    newXHR2.onreadystatechange = function(e) {
        if (newXHR2.readyState === 4) {
            if (newXHR2.status === 200) {
                deathData = processCSV(newXHR2.responseText);

                if (confirmedData && recoveredData && deathData && focusedConfirmed) {
                    var formattedData = structureData(confirmedData, deathData, recoveredData, focusedConfirmed);
                    window.data = formattedData;
                    cb(formattedData);
                }
            }
        }
    };
    newXHR2.send(null);

    var newXHR3 = new XMLHttpRequest();
    newXHR3.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv', true);
    newXHR3.onreadystatechange = function(e) {
        if (newXHR3.readyState === 4) {
            if (newXHR3.status === 200) {
                recoveredData = processCSV(newXHR3.responseText);

                if (confirmedData && recoveredData && deathData && focusedConfirmed) {
                    var formattedData = structureData(confirmedData, deathData, recoveredData, focusedConfirmed);
                    window.data = formattedData;
                    cb(formattedData);
                }
            }
        }
    };
    newXHR3.send(null);

    var newXHR4 = new XMLHttpRequest();
    newXHR4.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv', true);
    newXHR4.onreadystatechange = function(e) {
        if (newXHR4.readyState === 4) {
            if (newXHR4.status === 200) {
                focusedConfirmed = processCSV(newXHR4.responseText);

                if (confirmedData && recoveredData && deathData && focusedConfirmed) {
                    var formattedData = structureData(confirmedData, deathData, recoveredData, focusedConfirmed);
                    window.data = formattedData;
                    cb(formattedData);
                }
            }
        }
    };
    newXHR4.send(null);
}

function checkIfNum(str) {
    if (isNaN(str) || str == undefined) {
        return false;
    }
    switch (str[0]) {
        case '0':
            return true;
        case '1':
            return true;
        case '2':
            return true;
        case '3':
            return true;
        case '4':
            return true;
        case '5':
            return true;
        case '6':
            return true;
        case '7':
            return true;
        case '8':
            return true;
        case '9':
            return true;
        default:
            return false;
    }

}

function structureData(confirmed, deaths, recovered, focusedConfirmed) {
    let headers = confirmed[0];
    let focusedHeaders = focusedConfirmed[0];

    focusedConfirmed.shift();
    confirmed.shift();
    deaths.shift();
    recovered.shift();

    let megaData = [];

    // console.log(headers)
    // console.log(focusedHeaders)
    // console.log(focusedConfirmed);


    for (let currentDate = 4; currentDate < headers.length; currentDate++) {
        let tmpDateArr = [];
        tmpDateArr.push(headers[currentDate]);

        let dataArr = [];
        var countryList = [];
        var countryObjectDay = {};

        window.topCountriesPerDate[headers[currentDate]] = {};

        window.totalsPerDate[headers[currentDate]] = {};
        window.totalsPerDate[headers[currentDate]].confirmed = 0;
        window.totalsPerDate[headers[currentDate]].deaths = 0;
        window.totalsPerDate[headers[currentDate]].recovered = 0;
        window.totalsPerDate[headers[currentDate]].active = 0;

        for (let i = 0; i < confirmed.length; i++) {
            let tmpConfirmed = Math.abs(confirmed[i][currentDate]);
            let currentCountry = undefined;
            if (confirmed[i][1] != undefined) {
                currentCountry = confirmed[i][1].replace('*', '').replace('\"', '');
            }
            if (countryList.indexOf(currentCountry) < 0) {
                if (currentCountry != undefined) {
                    countryList.push(currentCountry);
                    countryObjectDay[currentCountry] = {};
                    countryObjectDay[currentCountry].confirmed = tmpConfirmed;

                }
            } else {
                if (isNaN(tmpConfirmed))
                    tmpConfirmed = 0;
                countryObjectDay[currentCountry].confirmed += tmpConfirmed;
            }

            window.totalsPerDate[headers[currentDate]].confirmed += tmpConfirmed ? tmpConfirmed : 0;
            if (!IS_CHART) {
                dataArr.push(confirmed[i][2]); // latitude
                dataArr.push(confirmed[i][3]); // longitude
                dataArr.push(tmpConfirmed);
                dataArr.push(0);
            } else {
                let tmpObject = {"state": confirmed[i][0], "country": currentCountry, "confirmed": tmpConfirmed};
                dataArr.push(tmpObject);
            }   
        }

        var sortableDay = [];
        for (var country in countryObjectDay) {
            sortableDay.push([country, countryObjectDay[country]]);
        }

        sortableDay.sort(function(a, b) {
            return b[1].confirmed - a[1].confirmed;
        });

        // sortableDay.splice(10);

        window.topCountriesPerDate[headers[currentDate]] = sortableDay;

        for (let i = 0; i < deaths.length; i++)
        { 
            let tmpDead = Math.abs(deaths[i][currentDate]);
            dataArr[i].deaths = tmpDead;
            window.totalsPerDate[headers[currentDate]].deaths += tmpDead ? tmpDead : 0;
        }
        for (let i = 0; i < recovered.length; i++) {
            let tmpRecovered = Math.abs(recovered[i][currentDate]);
            dataArr[i].recovered = tmpRecovered;
            dataArr[i].active = dataArr[i].confirmed - dataArr[i].deaths - tmpRecovered;
            window.totalsPerDate[headers[currentDate]].recovered += tmpRecovered ? tmpRecovered : 0;
        }


        window.totalsPerDate[headers[currentDate]].active += window.totalsPerDate[headers[currentDate]].confirmed - window.totalsPerDate[headers[currentDate]].deaths - window.totalsPerDate[headers[currentDate]].recovered;

        tmpDateArr.push(dataArr);
        megaData.push(tmpDateArr);
    }
    if(!IS_CHART)
    {
        if (IS_COUNTY) {
            for (let focusedDate = 11; focusedDate < focusedHeaders.length; focusedDate++) {
                let megaIndex = 0;

                for (let i = 0; i < megaData.length; i++) {
                    if (focusedHeaders[focusedDate] == megaData[i][0]) {
                        megaIndex = i;
                        break;
                    }
                }

                for (let i = 0; i < focusedConfirmed.length; i++) {
                    let tmpConfirmed = checkIfNum(focusedConfirmed[i][focusedDate]) ? Math.abs(focusedConfirmed[i][focusedDate]) : 0;
                    
                    
                    megaData[megaIndex][1].push(focusedConfirmed[i][8]); // latitude
                    megaData[megaIndex][1].push(focusedConfirmed[i][9]); // longitude
                    megaData[megaIndex][1].push(tmpConfirmed);
                    megaData[megaIndex][1].push(1);
                
                }
            }
        } else {
            let stateCoords = {
                "American Samoa": {
                    "latitude": "14.2710",
                    "longitude": "170.1322"
                },
                "Guam": {
                    "latitude": "13.4443",
                    "longitude": "144.7937"
                },
                "Northern Mariana Islands": {
                    "latitude": "15.0979",
                    "longitude": "145.6739"
                },
                "Virgin Islands": {
                    "latitude": "18.3358",
                    "longitude": "64.8963"
                },
                "Alaska": {
                    "latitude": "63.588753",
                    "longitude": "-154.493062"
                },
                "Alabama": {
                    "latitude": "32.318231",
                    "longitude": "-86.902298"
                },
                "Arkansas": {
                    "latitude": "35.20105",
                    "longitude": "-91.831833"
                },
                "Arizona": {
                    "latitude": "34.048928",
                    "longitude": "-111.093731"
                },
                "California": {
                    "latitude": "36.778261",
                    "longitude": "-119.417932"
                },
                "Colorado": {
                    "latitude": "39.550051",
                    "longitude": "-105.782067"
                },
                "Connecticut": {
                    "latitude": "41.603221",
                    "longitude": "-73.087749"
                },
                "District of Columbia": {
                    "latitude": "38.905985",
                    "longitude": "-77.033418"
                },
                "Delaware": {
                    "latitude": "38.910832",
                    "longitude": "-75.52767"
                },
                "Florida": {
                    "latitude": "27.664827",
                    "longitude": "-81.515754"
                },
                "Georgia": {
                    "latitude": "32.157435",
                    "longitude": "-82.907123"
                },
                "Hawaii": {
                    "latitude": "19.898682",
                    "longitude": "-155.665857"
                },
                "Iowa": {
                    "latitude": "41.878003",
                    "longitude": "-93.097702"
                },
                "Idaho": {
                    "latitude": "44.068202",
                    "longitude": "-114.742041"
                },
                "Illinois": {
                    "latitude": "40.633125",
                    "longitude": "-89.398528"
                },
                "Indiana": {
                    "latitude": "40.551217",
                    "longitude": "-85.602364"
                },
                "Kansas": {
                    "latitude": "39.011902",
                    "longitude": "-98.484246"
                },
                "Kentucky": {
                    "latitude": "37.839333",
                    "longitude": "-84.270018"
                },
                "Louisiana": {
                    "latitude": "31.244823",
                    "longitude": "-92.145024"
                },
                "Massachusetts": {
                    "latitude": "42.407211",
                    "longitude": "-71.382437"
                },
                "Maryland": {
                    "latitude": "39.045755",
                    "longitude": "-76.641271"
                },
                "Maine": {
                    "latitude": "45.253783",
                    "longitude": "-69.445469"
                },
                "Michigan": {
                    "latitude": "44.314844",
                    "longitude": "-85.602364"
                },
                "Minnesota": {
                    "latitude": "46.729553",
                    "longitude": "-94.6859"
                },
                "Missouri": {
                    "latitude": "37.964253",
                    "longitude": "-91.831833"
                },
                "Mississippi": {
                    "latitude": "32.354668",
                    "longitude": "-89.398528"
                },
                "Montana": {
                    "latitude": "46.879682",
                    "longitude": "-110.362566"
                },
                "North Carolina": {
                    "latitude": "35.759573",
                    "longitude": "-79.0193"
                },
                "North Dakota": {
                    "latitude": "47.551493",
                    "longitude": "-101.002012"
                },
                "Nebraska": {
                    "latitude": "41.492537",
                    "longitude": "-99.901813"
                },
                "New Hampshire": {
                    "latitude": "43.193852",
                    "longitude": "-71.572395"
                },
                "New Jersey": {
                    "latitude": "40.058324",
                    "longitude": "-74.405661"
                },
                "New Mexico": {
                    "latitude": "34.97273",
                    "longitude": "-105.032363"
                },
                "Nevada": {
                    "latitude": "38.80261",
                    "longitude": "-116.419389"
                },
                "New York": {
                    "latitude": "43.299428",
                    "longitude": "-74.217933"
                },
                "Ohio": {
                    "latitude": "40.417287",
                    "longitude": "-82.907123"
                },
                "Oklahoma": {
                    "latitude": "35.007752",
                    "longitude": "-97.092877"
                },
                "Oregon": {
                    "latitude": "43.804133",
                    "longitude": "-120.554201"
                },
                "Pennsylvania": {
                    "latitude": "41.203322",
                    "longitude": "-77.194525"
                },
                "Puerto Rico": {
                    "latitude": "18.220833",
                    "longitude": "-66.590149"
                },
                "Rhode Island": {
                    "latitude": "41.580095",
                    "longitude": "-71.477429"
                },
                "South Carolina": {
                    "latitude": "33.836081",
                    "longitude": "-81.163725"
                },
                "South Dakota": {
                    "latitude": "43.969515",
                    "longitude": "-99.901813"
                },
                "Tennessee": {
                    "latitude": "35.517491",
                    "longitude": "-86.580447"
                },
                "Texas": {
                    "latitude": "31.968599",
                    "longitude": "-99.901813"
                },
                "Utah": {
                    "latitude": "39.32098",
                    "longitude": "-111.093731"
                },
                "Virginia": {
                    "latitude": "37.431573",
                    "longitude": "-78.656894"
                },
                "Vermont": {
                    "latitude": "44.558803",
                    "longitude": "-72.577841"
                },
                "Washington": {
                    "latitude": "47.751074",
                    "longitude": "-120.740139"
                },
                "Wisconsin": {
                    "latitude": "43.78444",
                    "longitude": "-88.787868"
                },
                "West Virginia": {
                    "latitude": "38.597626",
                    "longitude": "-80.454903"
                },
                "Wyoming": {
                    "latitude": "43.075968",
                    "longitude": "-107.290284"
                }
            };

            for (let focusedDate = 11; focusedDate < focusedHeaders.length; focusedDate++) {
                let megaIndex = 0;

                for (let i = 0; i < megaData.length; i++) {
                    if (focusedHeaders[focusedDate] == megaData[i][0]) {
                        megaIndex = i;
                        break;
                    }
                }

                let stateObjectDay = {};
                let stateList = [];
                for (let i = 0; i < focusedConfirmed.length; i++) {
                    let currentState = focusedConfirmed[i][6];
                    let tmpConfirmed = Math.abs(focusedConfirmed[i][focusedDate]);
                    if (stateList.indexOf(currentState) < 0) {
                        if (currentState != undefined) {
                            stateList.push(currentState);
                            stateObjectDay[currentState] = {};
                            stateObjectDay[currentState].confirmed = tmpConfirmed;
                            stateObjectDay[currentState].coordinates = stateCoords[currentState];

                        }
                    } else {
                        if (isNaN(tmpConfirmed))
                            tmpConfirmed = 0;
                        stateObjectDay[currentState].confirmed += tmpConfirmed;
                    }
                }

                for (let key in stateObjectDay) {
                    megaData[megaIndex][1].push(stateObjectDay[key].coordinates ? stateObjectDay[key].coordinates.latitude : NaN); // latitude
                    megaData[megaIndex][1].push(stateObjectDay[key].coordinates ? stateObjectDay[key].coordinates.longitude : NaN); // longitude
                    megaData[megaIndex][1].push(stateObjectDay[key].confirmed);
                    megaData[megaIndex][1].push(1);
                }
            }
        }
    

        const BAR_SHIFT = 0.005;

        for (let i = 0; i < megaData.length; i++) {
            for (let j = 2; j < megaData[i][1].length; j += 4) // 3 for magniutde, 4 for legend
            {
                let tmpConfirmed = megaData[i][1][j];
                // let tmpBarHeight = ((tmpConfirmed / maxConfirmed) * BAR_SHIFT);
                let tmpBarHeight = Math.sqrt(tmpConfirmed) * BAR_SHIFT;
                megaData[i][1][j] = tmpBarHeight;
            }
        }
    }
    else
    {
        for (let focusedDate = 11; focusedDate < focusedHeaders.length; focusedDate++) {
            let megaIndex = 0;

            for (let i = 0; i < megaData.length; i++) {
                if (focusedHeaders[focusedDate] == megaData[i][0]) {
                    megaIndex = i;
                    break;
                }
            }

            let tmpFocused = [];
            for (let i = 0; i < focusedConfirmed.length; i++) {
                let tmpConfirmed = checkIfNum(focusedConfirmed[i][focusedDate]) ? Math.abs(focusedConfirmed[i][focusedDate]) : 0;
                let tmpCounty = focusedConfirmed[i][5];
                let tmpState = focusedConfirmed[i][6];
                let tmpLatitude = focusedConfirmed[i][8];
                let tmpLongitude = focusedConfirmed[i][9];

                let tmpObject = {state: tmpState, county: tmpCounty, latitude: tmpLatitude, longitude: tmpLongitude, confirmed: tmpConfirmed};
                tmpFocused.push(tmpObject);
            
            }

            megaData[megaIndex].push(tmpFocused);
        }
    }

    return megaData;
}


function processCSV(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
    lines.push(headers);

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    return lines;
}
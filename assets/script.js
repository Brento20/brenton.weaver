//Table Of Contents
//1. STORAGE - Storage for getElements and API Key info.
//2. ONLOAD - onLoad function to set my weather boxes to hidden before I populate them with the weather info.
//3. DATE FILLING - Filling the date information for each of the cards, moment.js really didn't like running in a for loop so I had to do them individually.
//4. LOCAL TEMP - Display local details in the header was just a fun little add on I wanted to include so the user can compare local temps with destination temps.
//5. NESTED FETCH - I nested the fetch request so that I could pick the best data I could for th HTML. This got a little messy but hopefully you can follow.


/////////////////////////////////////////////1. STORAGE 

// Display Forecast
var ElDisplayDay = document.getElementById("displayDay");
var ElDisplayDate = document.getElementById("displayDate");
var ElDisplayWeatherIcon = document.getElementById("displayWeatherIcon");
var ElDisplayTemp = document.getElementById("displayTemp");
var ElDisplayLocation = document.getElementById("displayLocation");
var ElDisplayHumidity = document.getElementById("displayHumidity");
var ElDisplayConditions = document.getElementById("displayConditions");
var ElDisplayUVI = document.getElementById("displayUVI");
var ElDisplayLocationCountry = document.getElementById("displayCountry");

//Open Weather API
var key = "&appid=1c58df78b7cb6f05f16ac0c4a7c36504"
var openWeatherAPIlink = "https://api.openweathermap.org/data/2.5/onecall?" 

//Modifiers 
var kelvin = 273.15;
var lastSearchLS = (localStorage.getItem('city :'));
/////////////////


/////////////////////////////////////////////2. ONLOAD

/////////////////


/////////////////////////////////////////////2. DATE FILLING
function fillDates(){
    document.getElementById("displayDay1").innerHTML= "<h5>" + moment().add(1, 'days').format("dddd")+ "</h5>";
    document.getElementById("displayDate1").innerHTML= moment().add(1, 'days').format("MMM, DD");
}
/////////////////



/////////////////////////////////////////////5. NESTED FETCH
function clickSearch(){
    var city = "Sydney";
    localStorage.setItem("city :", city); 
    var currentDayMJS = moment().format("dddd, MMMM Do YYYY");
    console.log(currentDayMJS)
    fillDates();
    
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + key)
        .then(function(response) {
            
            if (!response.ok){
                alert("Error: The location entered is not valid, please check your spelling and try again.")
            }
            return response.json();
        })
            .then(function(data) {
                console.log(data);
                var tempTemp = (data.list[0].main.temp - kelvin).toFixed(0);
                var lon = data.city.coord.lon;
                var lat = data.city.coord.lat;
                //Current Day
                ElDisplayLocation.innerHTML = "<h5> City: " + data.city.name + "</h5>";
                ElDisplayLocationCountry.innerHTML = "<h5> Country: " + data.city.country + "</h5>";
                ElDisplayConditions.innerHTML = "Conditions: " + data.list[0].weather[0].description;
                ElDisplayHumidity.innerHTML = "Humidity: " + data.list[0].main.humidity + "%";
                ElDisplayTemp.innerHTML = "Temperature: " + tempTemp + "°C";
                // Forecast
                for(i = 1 ; i <= 1 ; i++) {
                    document.getElementById("displayLocation"+[i]).innerHTML= "<h5>" + data.city.name + "</h5>";
                }

                fetch(openWeatherAPIlink + "lat=" + lat + "&lon=" + lon + key)
                    .then(function (response) {
                        console.log(response);
                        return response.json();
                        
                    })
                    .then(function (data) {
                        
                        if(data.current.uvi > 10){
                            ElDisplayUVI.setAttribute("class", "UVIHigh")
                        }else if(data.current.uvi > 5){
                            ElDisplayUVI.setAttribute("class", "UVIMid")
                        }else {
                            ElDisplayUVI.setAttribute("class", "UVILow")
                        }

                        //Current Day
                        ElDisplayDate.innerHTML = moment().format("MMM, DD");
                        ElDisplayDay.innerHTML = "<h5>" + "Current Day: " + moment().format("dddd") + "</h5>";
                        ElDisplayUVI.innerHTML = " Current UV Index: " + data.current.uvi;
                        document.getElementById("displayWeatherIcon").src="./assets/images/weatherIcons/" + data.current.weather[0].icon + ".svg";

                        //5 Day Forecast
                        for(i = 1 ; i <= 1 ; i++) {
                            if(data.daily[i].uvi > 10){ // UVI color warning code
                                document.getElementById("displayUVI"+[i]).setAttribute("class", "UVIHigh")
                            }else if(data.daily[i].uvi > 5){
                                document.getElementById("displayUVI"+[i]).setAttribute("class", "UVIMid")
                            }else {
                                document.getElementById("displayUVI"+[i]).setAttribute("class", "UVILow")
                            }

                            document.getElementById("displayWeatherIcon"+[i]).src="assets/images/weatherIcons/" + data.daily[i].weather[0].icon + ".svg";
                            document.getElementById("displayTemp"+[i]).innerHTML="Temperature: " + (data.daily[i].temp.day - kelvin).toFixed(0) + "°C";
                            document.getElementById("displayHumidity"+[i]).innerHTML="Humidity: " + data.daily[i].humidity + "%";
                            document.getElementById("displayUVI"+[i]).innerHTML=" UV Index: " + data.daily[i].uvi;
                            document.getElementById("displayConditions"+[i]).innerHTML="Conditions: " + data.daily[i].weather[0].description;
                        }
                });
            });
}
clickSearch();

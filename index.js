const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessbtn=document.querySelector("[data-grantAccess]");

//initially vairables need????
console.log("helo");
console.log("start");
let currentTab = userTab;
currentTab.classList.add("current-Tab");
checkcoordinates();
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
//function for tab switching
function switchTab(clickedtab)
{
    if(currentTab!=clickedtab){
        currentTab.classList.remove("current-Tab");
        currentTab=clickedtab;
        clickedtab.classList.add("current-Tab");
    }
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        checkcoordinates();
    }

}
//it will check the saved coordinates in sessionstorage if it is present or not on the basis of that it will show tha container 
function checkcoordinates(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}

async function fetchuserweatherinfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    //api call
    try {
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("some sort of error while fetching the data from weatherapi",error);
    }
}

function renderweatherinfo(weatherInfo){
        //fistly, we have to fethc the elements 

        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");
    
        //fetch values from weatherINfo object and put it UI elements
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = weatherInfo?.main?.temp;
        windspeed.innerText = weatherInfo?.wind?.speed;
        humidity.innerText = weatherInfo?.main?.humidity;
        cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation support is not availaible");
    }
}
function showPosition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates);
}

async function searchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);

    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("some sort of error while feetching the api from city",error);
    }
}







//event listner of the tabs 
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//event listner on grant access button
grantAccessbtn.addEventListener("click",getLocation);

//evemt listener for search input
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchInput.value;
    if(cityname==""){
        return;
    }
    else{
       searchWeatherInfo(cityname); 
    }
});
const cityInput= document.querySelector('.city-input');
const searchBtn= document.querySelector('.search-btn');

const weatherInfoSection= document.querySelector('.weather-info')
const notFoundSection= document.querySelector('.not-found')
const searchCitySelector= document.querySelector('.search-city')

const countryTxt= document.querySelector('.country-txt')
const tempTxt= document.querySelector('.temp-txt')
const conditionTxt= document.querySelector('.condition-txt')
const humidityValueTxt= document.querySelector('.humidity-value-txt')
const windValueTxt= document.querySelector('.wind-value-txt')
const weatherSummaryImg= document.querySelector('.weather-summary')
const currentDateTxt= document.querySelector('.current-date-txt')

const forecastItemsContainer= document.querySelector('.forecast-items-container')


// UPDATE API KEY IF IT IS NOT WORKING
// const apiKey='6e072b2ebfcfe74e1afb83cff6e4982b';
const apiKey = '8c25fc22c0c7bee8fe98229fabcded4f';

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!=''){
        // console.log(cityInput.value);
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
    // console.log(cityInput.value);

})

cityInput.addEventListener('keydown', (event)=>{
    // console.log(event);
    if(event.key=='Enter'&&cityInput.value.trim()!=''){
        // console.log(cityInput.value);
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
})

// async function getFetchData(endPoint, city){
//     const apiUrl= `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
//     const response = await fetch(apiUrl);
//     return response.json();
// }
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching weather:", errorData);
        throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return response.json();
}


function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate= new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherData= await getFetchData('weather', city);
    // console.log(weatherData);
    if(weatherData.cod!=200){
        showDisplaySection(notFoundSection);
        return;
    }
    // console.log(weatherData);
    const {
        name: country,
        main: {temp, humidity},
        weather :[{id, main}],
        wind: speed
    }= weatherData

    countryTxt.textContent= country
    tempTxt.textContent= Math.round(temp)+' °C'
    conditionTxt.textContent= main
    humidityValueTxt.textContent= humidity+'%'
    windValueTxt.textContent= speed+' M/s'

    currentDateTxt.textContent= getCurrentDate(city)
    weatherSummaryImg.src= `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo()
    showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML= ''
    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken)&&
           !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather)
        }
    })
    // console.log(forecastData)
}

function updateForecastsItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    }= weatherData

    const dateTaken = new Date()
    const dateOption ={
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem =`
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
    </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySelector, notFoundSection]
      .forEach(section=> section.style.display ='none');

    section.style.display= 'flex';
}
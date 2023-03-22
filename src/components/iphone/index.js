// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import HourlyForecast from '../hourlyforecast/HourlyForecast';
import Statistics from '../statistics/Statistics';
import SunTimes from '../sunttimes/SunTimes';


import WeatherNow from '../weathernow/WeatherNow';
import BestTimeWalk from '../besttimewalk/BestTimeWalk';
import Ground from '../ground/Ground';
import TopLevel from '../toplevel/TopLevel';
import PetTemperature from '../pettemperature/PetTemperature';
import ImageChange from '../imagechange/ImageChange';

export default class Iphone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            temperature: '',
            sunrise: '',
            sunset: '',
            sunsetDate: '',
            sunriseDate: '',
            windspeed: '',
            humidity: '',
            uvindex: '',
            cloudCoverage: '',
            description: '',
            condition: '',
            main: '',
            bestTime: '',
            groundDryTime: '',
            forecast: [],
        };
        this.findBestWalkingTime = this.findBestWalkingTime.bind(this);
        this.estimateGroundDryTime = this.estimateGroundDryTime.bind(this);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;
                    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;

                    // Fetch current weather
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            this.setState({
                                location: data.name,
                                temperature: data.main.temp,
                                sunrise: data.sys.sunrise,
                                sunriseDate: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                sunset: data.sys.sunset,
                                sunsetDate: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                windspeed: data.wind.speed,
                                humidity: data.main.humidity,
                                uvindex: data.main.uvindex,
                                cloudCoverage: data.clouds.all,
                                description: data.weather[0].description,
                                condition: data.weather[0].main,
                                main: data.weather[0].main
                            });
                        })
                        .catch(error => console.error(error));

                    // Fetch forecast
                    fetch(forecastUrl)
                        .then(response => response.json())
                        .then(data => {
                            const forecast = data.list.slice(0, 5).map(item => ({
                                time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                temp: Math.round(item.main.temp),
                                condition: item.weather[0].description,
                                cloudCoverage: item.clouds.all,
                                windSpeed: item.wind.speed,
                                humidity: item.main.humidity,
                                description: item.weather[0].description,
                                main: item.weather[0].main,
                            }));
                            const bestTime = this.findBestWalkingTime(forecast);
                            this.estimateGroundDryTime(forecast);

                            this.setState({
                                forecast,
                                bestTime
                            });
                        })
                        .catch(error => console.error(error));
                },
                error => console.error(error)
            );
        }
    }


    findBestWalkingTime(forecast) { //find the best time to walk using temperature, cloud coverage, wind speed and the condition based on a score system
        let bestTime = forecast[0];
        let bestScore = 0;
        forecast.forEach(item => {
            console.log(item.time);
            var score = 0;
            console.log(item.temp + " " + item.condition + " " + item.cloudCoverage + " " + item.windSpeed + " " + item.humidity + " " + item.description + " " + item.main);
            switch (item.main) {  // check the condition and add to the score
                case 'Clear': // if the condition is clear
                    score += 5;
                    break;
                case 'Clouds':
                    score += 3;
                    break;
                case 'Rain': // if the condition is rainy
                    score -= 2;
                    break;
                case 'Snow': // if the condition is snowy
                    score -= 3;
                    break;
                case 'Thunderstorm':  // if the condition is thunderstormy
                    score -= 5;
                    break;
                case 'Fog': // if the condition is atmosphere related
                case 'Mist':
                case 'Haze':
                case 'Dust':
                case 'Sand':
                case 'Ash':
                case 'Squall':
                case 'Tornado':
                    score -= 1;
                    break;
                case 'Drizzle': // if the condition is drizzly
                    score -= 1;
                default:
                    score += 0;
            }
            console.log("score after condition: " + score)
            if (item.cloudCoverage > 50) {
                score = score
            } else if (item.cloudCoverage > 75) {
                score -= score
            } else {
                score += 2;
            }
            console.log("score after condition: " + score)
            if (item.windSpeed > 5) {
                score = score
            } else if (item.windSpeed > 10) {
                score -= 2
            } else {
                score += 2;
            }
            console.log("score after condition: " + score)
            if (item.temp > 20 && item.temp < 25) {
                score += 2;
            } else if (item.temp > 25) {
                score += 1;
            } else if (item.temp < 20) {
                score -= 1;
            } else {
                score += 0;
            }
            console.log("score after condition: " + score)
            if (score > bestScore) {
                bestScore = score;
                bestTime = item.time;
            }
            console.log("Best time to walk: " + bestTime + " with a score of " + bestScore)
            console.log("current time: " + item.time + " with a score of " + score)
        });
        console.log("Best time to walk: " + bestTime + " with a score of " + bestScore)
        this.setState({bestTime});
        return bestTime;
    }

    estimateGroundDryTime(forecast) { //estimate the time it will take for the ground to dry
        let groundDryTime = 0;
        forecast.forEach(item => {
            //if it is raining at the time, add 1 hour to the time it will take for the ground to dry
            if (item.main === 'Rain') {
                groundDryTime += 1;
            } else if (item.main === 'Snow') {
                groundDryTime += 2;
            } else if (item.main === 'Thunderstorm') {
                groundDryTime += 3;
            } else {
                groundDryTime += 0;
            }
            if (item.windSpeed > 5 && item.windSpeed < 10) {
                groundDryTime += 1;
            } else if (item.windSpeed > 10) {
                groundDryTime += 2;
            }
            if (item.humidity > 50) {
                groundDryTime += 1;
            }
        });
        this.setState({ groundDryTime });
        return groundDryTime;
    
    }

    //search for location



    searchLocation = (location) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;
        const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;
        // Fetch current weather
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({ //set the state to the data from the api
                    location: data.name,
                    temperature: data.main.temp,
                    sunrise: data.sys.sunrise,
                    sunriseDate: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sunset: data.sys.sunset,
                    sunsetDate: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    windspeed: data.wind.speed,
                    humidity: data.main.humidity,
                    uvindex: data.main.uvindex,
                    cloudCoverage: data.clouds.all,
                    description: data.weather[0].description,
                    condition: data.weather[0].main,
                    main: data.weather[0].main,
                    icon: data.weather[0].icon
                });
            })

            //if location doesnt exist, render location could not be found
            .catch(error => this.setState(
                { //if location isn't found set the state to the following
                    location: 'Location not found',
                    temperature: '',
                    sunrise: '',
                    sunriseDate: '',
                    sunset: '',
                    sunsetDate: '',
                    windspeed: '',
                    humidity: '',
                    cloudCoverage: '',
                    description: '',
                    condition: ''

                }));


        // Fetch forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                const forecast = data.list.slice(0, 5).map(item => ({ //get the forecast for the next 5 hour time slots (every 3 hours)
                    time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), //get the time of the forecast
                    temp: Math.round(item.main.temp), //get the temperature of the forecast
                    condition: item.weather[0].description, //get the condition of the forecast
                    cloudCoverage: item.clouds.all, //get the cloud coverage of the forecast
                    windSpeed: item.wind.speed, //get the wind speed of the forecast
                    humidity: item.main.humidity, //get the humidity of the forecast
                    main: item.weather[0].main, //get the main condition of the forecast
                }));
                this.setState({ forecast }); //set the state to the forecast
                const bestTime = this.findBestWalkingTime(forecast); //find the best time to walk
                this.estimateGroundDryTime(forecast);  //estimate the time the ground will be dry
            })
            .catch(error => console.error(error));
    }

    locationButton = (latitude, longitude) => { //get the location of the user
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;
        const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=dc37c5591be4ed3805a183e79e4e2d43`;
        // Fetch current weather
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({ //set the state to the data from the api
                    location: data.name,
                    temperature: data.main.temp,
                    sunrise: data.sys.sunrise,
                    sunriseDate: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sunset: data.sys.sunset,
                    sunsetDate: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    windspeed: data.wind.speed,
                    humidity: data.main.humidity,
                    uvindex: data.main.uvindex,
                    cloudCoverage: data.clouds.all,
                    description: data.weather[0].description,
                    condition: data.weather[0].main,
                });
            })

            //if location doesnt exist, render location could not be found
            .catch(error => this.setState(
                {
                    location: 'Location not found',
                    temperature: '',
                    sunrise: '',
                    sunriseDate: '',
                    sunset: '',
                    sunsetDate: '',
                    windspeed: '',
                    humidity: '',
                    uvindex: '',
                    cloudCoverage: '',
                    description: '',
                    condition: ''

                }));


        // Fetch forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                const forecast = data.list.slice(0, 5).map(item => ({ //get the forecast for the next 5 hour time slots (every 3 hours)
                    time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].description,
                    cloudCoverage: item.clouds.all,
                    windSpeed: item.wind.speed,
                    humidity: item.main.humidity,
                    main: item.weather[0].main
                }));
                this.setState({ forecast }); //set the state to the forecast
                const bestTime = this.findBestWalkingTime(forecast); //find the best time to walk
                console.log(bestTime); // or set to state or do whatever you want with it
                this.estimateGroundDryTime(forecast); //estimate the time the ground will be dry
            })
            .catch(error => console.error(error));
    }



    // the main render method for the iphone component
    render() {

        const { location, temperature, description, forecast, bestTime, groundDryTime } = this.state;
        const next5HourForecast = forecast.slice(0, 5);
        // check if temperature data is fetched, if so add the sign styling to the page
        const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
        ///////captalizing words
        const capitalizeWords = (str) => { //function to capitalize the first letter of each word
            return str
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // display all weather data
        return (
            <div class={style.container}>
                <div class={style_iphone.container}>
                    <div class={style.backdrop}>
                        <TopLevel //render the top level component
                            location={location} //pass the location as an argument to the TopLevel component
                            searchLocation={this.searchLocation} //pass the searchLocation function as an argument to the TopLevel component
                            locationButton={this.locationButton} //pass the locationButton function as an argument to the TopLevel component
                        />
                        <WeatherNow //render the WeatherNow component
                            capitalizeWords={capitalizeWords} //pass the capitalizeWords function as an argument to the WeatherNow component
                            temperature={this.state.temperature} //pass the temperature as an argument to the WeatherNow component
                            description={this.state.description} //pass the description as an argument to the WeatherNow component
                        />
                        <BestTimeWalk //render the BestTimeWalk component
                            bestTime={bestTime} //pass the bestTime as an argument to the BestTimeWalk component
                        />
                        <Ground //render the Ground component
                            groundDryTime={groundDryTime} //pass the groundDryTime as an argument to the Ground component
                        />
                        <PetTemperature //render the PetTemperature component
                            condition={this.state.condition} //pass the condition as an argument to the PetTemperature component
                            temperature={this.state.temperature} //pass the temperature as an argument to the PetTemperature component
                            currentImage={this.state.currentImage} //pass the currentImage as an argument to the PetTemperature component
                        />
                    </div>
                    <HourlyForecast //render the HourlyForecast component
                        next5HourForecast={next5HourForecast} //pass the next5HourForecast as an argument to the HourlyForecast component
                        forecast={forecast} //pass the forecast as an argument to the HourlyForecast component
                    />


                    <Statistics //render the Statistics component
                        temperature={temperature}  //pass the temperature as an argument to the Statistics component
                        windspeed={this.state.windspeed} //pass the windspeed as an argument to the Statistics component
                        humidity={this.state.humidity} //pass the humidity as an argument to the Statistics component
                        cloudCoverage={this.state.cloudCoverage} //pass the cloudcoverage as an argument to the Statistics component
                    />

                    <SunTimes //render the SunTimes component
                        sunsetDate={this.state.sunsetDate} //pass the sunsetDate as an argument to the SunTimes component
                        sunriseDate={this.state.sunriseDate} //pass the sunriseDate as an argument to the SunTimes component
                    />
                </div>
            </div>
        );
    }
}

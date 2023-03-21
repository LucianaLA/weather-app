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
            cloudcoverage: '',
            description: '',
            condition: '',
            main: '',
            bestTime: '',
            groundDryTime: '',
            forecast: []
        };
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
                                cloudcoverage: data.clouds.all,
                                description: data.weather[0].description,
                                condition: data.weather[0].main,
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
                                cloudCoverage: item.clouds.all
                            }));
                            this.setState({ forecast });
                            const bestTime = this.findBestWalkingTime(forecast);
                            console.log(bestTime); // or set to state or do whatever you want with it
                            this.estimateGroundDryTime(forecast);
                        })
                        .catch(error => console.error(error));
                },
                error => console.error(error)
            );
        }
    }


    findBestWalkingTime(forecast) {
        let bestTime = forecast[0];
        for (let i = 1; i < forecast.length; i++) {
            if (forecast[i].temp > bestTime.temp && forecast[i].cloudCoverage < 50 && forecast[i].condition === "Clear") {
                bestTime = forecast[i];
            }
        }
        this.setState({ bestTime });
        return bestTime;
    }

    estimateGroundDryTime(forecast) {
        const WET_TIME_MINUTES = 60;
        let wetTime = 0;

        // Find the first period when there is rain in the forecast
        const wetPeriod = forecast.find(item => item.condition.includes("Rain")); //if there is rain in the forecast
        if (wetPeriod) { //if there is rain in the forecast
            const wetStartTime = new Date(wetPeriod.time); //get the time of the rain
            const nextPeriod = forecast.slice(forecast.indexOf(wetPeriod) + 1).find(item => !item.condition.includes("Rain")); //get the next period
            const wetEndTime = nextPeriod ? new Date(nextPeriod.time) : new Date(wetPeriod.time.getTime() + WET_TIME_MINUTES * 60 * 1000); //if there is no next period, set the end time to 60 minutes after the start time
            wetTime = (wetEndTime.getTime() - wetStartTime.getTime()) / (60 * 1000); //calculate the wet time in minutes
        }

        if (wetTime > 0) { //if there is rain in the forecast
            const dryTime = new Date(new Date().getTime() + wetTime * 60 * 1000); //calculate the dry time
            const groundDryTime = dryTime.getTime(); //set the dry time
            this.setState({ groundDryTime }); //set the dry time
        } else { //if there is no rain in the forecast
            this.setState({ groundDryTime: 0 }); //set the dry time to 0
        }
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
                    cloudcoverage: data.clouds.all,
                    description: data.weather[0].description,
                    condition: data.weather[0].main,
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
                    uvindex: '',
                    cloudcoverage: '',
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
                    cloudCoverage: item.clouds.all //get the cloud coverage of the forecast
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
                    cloudcoverage: data.clouds.all,
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
                    cloudcoverage: '',
                    description: '',
                    condition: ''

                }));
            

        // Fetch forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                const forecast = data.list.slice(0, 5).map(item => ({
                    time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].description,
                    cloudCoverage: item.clouds.all
                }));
                this.setState({ forecast });
                const bestTime = this.findBestWalkingTime(forecast);
                console.log(bestTime); // or set to state or do whatever you want with it
                this.estimateGroundDryTime(forecast);
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
        const capitalizeWords = (str) => {
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
                        <TopLevel
                            location={location}
                            searchLocation={this.searchLocation}
                            locationButton={this.locationButton}
                        />
                        <WeatherNow
                            capitalizeWords={capitalizeWords}
                            temperature={this.state.temperature}
                            description={this.state.description}
                        />
                        <BestTimeWalk
                            bestTime={bestTime}
                        />
                        <Ground
                            groundDryTime={groundDryTime}
                        />
                            <PetTemperature
                                condition={this.state.condition}
                            />
                    </div>
                    <HourlyForecast
                        next5HourForecast={next5HourForecast}
                        forecast={forecast}
                    />

                    <Statistics
                        temperature={temperature}
                        windspeed={this.state.windspeed}
                        humidity={this.state.humidity}
                        cloudcoverage={this.state.cloudcoverage}
                    />

                    <SunTimes
                        sunsetDate = {this.state.sunsetDate}
                        sunriseDate = {this.state.sunriseDate}
                    />
                </div>
            </div>
        );
    }
}

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
        const wetPeriod = forecast.find(item => item.condition.includes("Rain"));
        if (wetPeriod) {
            const wetStartTime = new Date(wetPeriod.time);
            const nextPeriod = forecast.slice(forecast.indexOf(wetPeriod) + 1).find(item => !item.condition.includes("Rain"));
            const wetEndTime = nextPeriod ? new Date(nextPeriod.time) : new Date(wetPeriod.time.getTime() + WET_TIME_MINUTES * 60 * 1000);
            wetTime = (wetEndTime.getTime() - wetStartTime.getTime()) / (60 * 1000);
        }

        if (wetTime > 0) {
            const dryTime = new Date(new Date().getTime() + wetTime * 60 * 1000);
            const groundDryTime = dryTime.getTime();
            this.setState({ groundDryTime });
        } else {
            this.setState({ groundDryTime: 0 });
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
                                temperature={temperature}
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

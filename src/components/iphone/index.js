// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
//import the Math.round
import { round } from 'lodash';


import Button from '../button';


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
    searchLocation(location) {
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
                <div class={style.header}>
                    {/* <div class={style.city}>{this.state.locate}</div> */}
                    {/* <div class={style.conditions}>{this.state.cond}</div> */}
                    {/* <span class={tempStyles}>{this.state.temp}</span> */}
                </div>
                <div class={style.details}></div>
                <div class={style_iphone.container}>
                    {/* {this.state.display ? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} /> : null} */}
                    {/* Luciana code */}
                    <div class={style.backdrop}>
                        <div class={style.grouphead}>
                            <div class={style.dropdown}>
                                <img
                                    src="../../assets/icons/menuicon.png"
                                    class={style.iconmenu}
                                />
                                <div class={style.dropdowncontent}>
                                    <div class={style.search}>
                                        <input id="locationSearch" class={style.locationsearch} type="text" placeholder="Search locations" onChange={this.handleChange} />
                                        <img src="../../assets/icons/lookup.png"
                                            class={style.lens} onClick={() => this.searchLocation(document.getElementById("locationSearch").value)}
                                        />
                                    </div>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </div>
                            </div>
                            <img
                                src="../../assets/icons/location-icon.png"
                                class={style.iconlocation}
                            />
                            <span
                                class={style.currentlocation}
                            >
                                {this.state.location}
                            </span>
                        </div>
                        <div class={style.currentweather}>
                            <p class={style.temperaturenow}>
                                {Math.round(this.state.temperature)}
                                °</p>
                            <p class={style.weathertype}>
                                {capitalizeWords(this.state.description)}
                            </p>
                        </div>
                        <div class={style.walkrecommendation}>
                            <p class={style.walktext}>Best time for walking:</p>
                            <p class={style.besttime}>
                                {this.state.bestTime.time}
                            </p>
                        </div>
                        <div class={style.weatherlater}>
                            <img
                                src="../../assets/icons/raindrops.png"
                                class={style.iconweatherlater} />
                            <p class={style.groundstate}>
                                {groundDryTime === 0 ? (
                                    <p>The ground is currently dry</p>
                                ) : (
                                    <p class={style.groundstatetxt}>Ground expected to be dry in: {groundDryTime} minutes</p>
                                )}
                            </p>
                        </div>
                        <div class={style.graphicpet} />
                        <img
                            src="../../assets/icons/sun.png"
                            class={style.iconsun} />
                        <img
                            src="../../assets/icons/cloud.png"
                            class={style.iconcloud} />
                        <img
                            src="../../assets/icons/cloud.png"
                            class={style.iconcloud1}
                        />
                        <img
                            src="../../assets/icons/pet.png"
                            class={style.petdrawing} />
                    </div>
                    <div class={style.hourlyweather}>
                        <p class={style.timeweather}
                        >
                            <div>
                                {next5HourForecast.map((item, index) => (
                                    <span>{item.temp}°C{(index < next5HourForecast.length - 1) ? ' ' : ''}</span>
                                ))}
                            </div>
                        </p>


                        <div class={style.hourlyweathericons}>
                            <div class={style.hourlydiv}>
                                {next5HourForecast.map((item, index) => (
                                    <div key={index} class={style.hourdiv2}>
                                        {item.condition.includes('sunny') && (
                                            <img
                                                src="../../assets/icons/sun.png"
                                                class={style.hourweathericons} />
                                        )}
                                        {item.condition.includes('rain') && (
                                            <img
                                                src="../../assets/icons/nightrain.png"
                                                class={style.hourweathericons} />
                                        )}
                                        {item.condition.includes('clouds') && (
                                            <img
                                                src="../../assets/icons/nightclouds.png"
                                                class={style.hourweathericons} />
                                        )}
                                        <span>{(index < next5HourForecast.length - 1) ? ' ' : ''}</span>
                                    </div>
                                ))}
                            </div>


                        </div>
                        <img
                            src="../../assets/icons/line.png"
                            class={style.hourlyline} />
                        <p class={style.hours}
                        >
                            {forecast.map((item, index) => (
                                <span key={index}>{item.time} </span>
                            ))}


                        </p>


                    </div>

                    <div class={style.windhumidcloud}>
                        <div class={style.windhumidcloudicons}>
                            <img
                                src="../../assets/icons/wind.png"
                                class={style.iconswind} />
                            <img
                                src="../../assets/icons/humidity.png"
                                class={style.iconhumidity} />
                            <img
                                src="../../assets/icons/cloudcover.png"
                                class={style.iconhot} />

                        </div>
                        <p class={style.windspeed}>Windspeed</p>
                        <p class={style.humidity}>Humidity</p>

                        <p class={style.cloudcover}>Cloud</p>

                        <div class={style.stats}>

                            <p class={style.windspeedtext}>
                                {this.state.windspeed} km/h
                            </p>

                            <p class={style.humidtext}>
                                {this.state.humidity}%
                            </p>

                            <p class={style.cloudtext}>
                                {this.state.cloudcoverage}%
                            </p>
                        </div>
                    </div>

                    <div class={style.sunrisemoonrise}>
                        <div class={style.iconssunrisemoonrise}>
                            <img
                                src="../../assets/icons/sunrise.png"
                                class={style.iconsunrise}
                            />
                            <img
                                src="../../assets/icons/moonrise.png"
                                class={style.iconmoonrise}
                            />
                        </div>
                        <p class={style.sunrisetext}>Sunrise: {this.state.sunriseDate}</p>
                        <p class={style.sunsettext}>Sunset: {this.state.sunsetDate}</p>
                    </div>
                </div>
            </div>
        );
        {/* end of Luciana code */ }
    }
}

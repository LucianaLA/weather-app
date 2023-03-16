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
                            sunriseDate: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            sunset: data.sys.sunset,
                            sunsetDate: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
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
                            time: new Date(item.dt_txt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
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
                    sunriseDate: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    sunset: data.sys.sunset,
                    sunsetDate: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
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
                    time: new Date(item.dt_txt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
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
		
		const { location, temperature, description, forecast, bestTime, groundDryTime} = this.state;
        const next5HourForecast = forecast.slice(0, 5);
        // check if temperature data is fetched, if so add the sign styling to the page
        const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

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
                    <div class={style_iphone.search}>
                        <input id="locationSearch" type="text" placeholder="Search for location" onChange={this.handleChange} />
                        <button onClick={() => this.searchLocation(document.getElementById("locationSearch").value)}>Search</button>
                    </div>
                    {/* {this.state.display ? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} /> : null} */}
                    {/* Luciana code */}
                    <div className="backdrop"
                        style="width: 414px;
                    height: 736px;">
                        <div className="group-head"
                            style="height: 5%;
                        margin-top: 1%;">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A36?alt=media&token=3f930cc0-d6b5-44f5-8518-ab8e990a466f"
                                id="icon-menu"
                                style=" width: 10%;
                                float: left;
                                padding-left: 5px;"
                            />
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A33?alt=media&token=b3bc6d13-74a4-44c8-98c3-8af245d11c5f"
                                id="icon-location"
                                style="width: 3.6%;
                                position:relative;
                                left:33%;"
                            />
                            <span
                                id="mile-end-location"
                                style="color: white;
                                font-size: 1.5em;
                                position: relative;
                                top: 1%;
                                text-align: right;
                                padding-left: 35%;"
                            >
                                {this.state.location}
                            </span>
                        </div>
                        <div className="current-weather"
                            style="display:block;
                        background-color:#1CA5C2;
                        width:100%;">
                            <p className="_-7"
                                style=" color: rgba(255, 255, 255, 1);
                            font-size: 68px;
                            line-height: 68px;
                            font-family: Inter, sans-serif;
                            font-weight: 400;">
                                {Math.round(this.state.temperature)}
                                °</p>
                            <p className="sunny"
                                style="color: rgba(255, 255, 255, 1);
                                font-size: 36px;
                                line-height: 36px;
                                font-family: Inter, sans-serif;
                                font-weight: 400;
                                top:10px;
                                left:20px;">
                                Sunny</p>
                            <p className="rain-expected-later-tod"
                                style="
                            color: rgba(255, 255, 255, 1);
                            font-size: 16px;
                            line-height: 16px;
                            font-family: Inter, sans-serif;
                            font-weight: 400;
                            opacity: 0.8;
                            display:block;">
                                {this.state.description}
                            </p>
                        </div>
                        <div className="walk-recommendation"
                            style="float: right;
                            background-color: #1CA5C2;
                            width:40%;
                            height: 80px;
                            margin-top:15px;">
                            <p className="best-times-for-walking"
                                style=" display: flex;
                                flex-direction: column;
                                justify-content: center;
                                color: rgba(255, 255, 255, 1);
                                font-size: 16px;
                                line-height: 16px;
                                font-family: Inter, sans-serif;
                                font-weight: 400;
                                text-align: center;
                                margin-top:3%">Best time for walking:</p>
                            <p className="_-1pm-5pm"
                                style=" display: flex;
                                flex-direction: column;
                                justify-content: center;
                                color: rgba(255, 255, 255, 1);
                                font-size: 20px;
                                line-height: 20px;
                                font-family: Inter, sans-serif;
                                font-weight: 400;
                                text-align: center;
                                margin-top:5%">
									{this.state.bestTime.time}
                                </p>
                        </div>
                        <div className="weather-later"
                            style="float: right;
                        background-color: #1CA5C2;
                        width:40%;
                        height:20%;
                        margin-top:5%;
                        margin-left:50%">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A166?alt=media&token=171d43cb-994d-494d-9d14-192738004dbe"
                                className="icon-raindrops"
                                style="width: 25%;
                                padding-top: 20px;
                                padding-left: 5px;
                                float:left;"
                            />
                            <p className="ground-expected-to-be-we"
                                style="margin-left:5%;
                                display: block;
                                margin-top: 20px;
                                color:white;
                                font-size:15px;">
                                {groundDryTime === 0 ? (
								<p>The ground is currently dry</p>
							) : (
								<p>Estimation until ground is dry: {groundDryTime} minutes</p>
							)}
                            </p>
                        </div>
                        <div className="graphic-dog"/>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A88?alt=media&token=295334cf-2623-403b-866b-c88285a48535"
                                className="icon-sun"
                                style="display: inline;
                                bottom: 0%;
                                top: 5%;
                                position: relative;
                                left:15%"
                            />
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A43?alt=media&token=10c7b2d3-f915-4f98-a55f-0d6980834db7"
                                className="icon-cloud"
                                style="display: inline;
                                bottom: 0%;
                                position: relative;"
                            />
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A44?alt=media&token=d66ede89-0eb8-4f83-ba0d-ee515f159055"
                                className="icon-cloud-1"
                                style="display: inline;
                                bottom: 37%;
                                position: relative;"
                            />
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A27?alt=media&token=cb4de56b-46e7-40a6-a85c-471f1442460f"
                                className="dog-logo-illustration-free-vector-1"
                                style="display: inline;
                                bottom: 20%;
                                position: relative;
                                right: 20%;"
                            />
                        </div>
                    <div className="hourly-weather"
                            style="display: block;
                            color: white;
                            position: relative;
                            bottom: 35%;
                            width: 100%;
                            text-align: center;
                            // text-align-last: justify;
                            margin-left: 5%;
                            margin-right: 5%;
                            margin-bottom:5%;">
                        <p className="_-46710101210988"
                            style="display: block;
                            text-align-last: justify;
                            font-size:14px;
                            width:90%;"
                            >
                        <div>
                        {next5HourForecast.map((item, index) => (
                            <span>{item.temp}°C{(index < next5HourForecast.length - 1) ? ' ' : ''}</span>
                        ))}
                        </div>
                            </p>
                            

                            <div className="hourly-weather-icons"
                            style="height:20%;
                            display:block;
                            padding-bottom:10%;">
                            <div style={{ width: '90%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {next5HourForecast.map((item, index) => (
                                <div key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                {item.condition.includes('sunny') && (
                                    <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A94?alt=media&token=bb7e90a0-73ed-4fc4-afe3-5088bbd86caf"
                                    className="icon-sun-1"
                                    style={{ width: '25px', height: '25px', marginRight: '5px' }}
                                    />
                                )}
                                {item.condition.includes('rain') && (
                                    <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A168?alt=media&token=46eabaa4-87c5-4151-aea4-cc84051c75e6"
                                    className="icon-night-alt-rain"
                                    style={{ width: '25px', height: '25px', marginRight: '5px' }}
                                    />
                                )}
                                {item.condition.includes('clouds') && (
                                    <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A172?alt=media&token=44d3d1eb-25a6-44bb-945b-bcea1585f56e"
                                    className="icon-night-alt-partly-cloudy"
                                    style={{ width: '25px', height: '25px', marginRight: '5px' }}
                                    />
                                )}
                                <span>{(index < next5HourForecast.length - 1) ? ' ' : ''}</span>
                                </div>
                            ))}
                            </div>


                            </div>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A48?alt=media&token=2f1d3d24-b8a4-4074-90c2-e7dab0915f21"
                                className="line-1" style="margin-top: 5%;
                                width: 90%;
                                right: 5%;
                                bottom: 3%;
                                position: relative;"
                            />
                            <p className="_-12345678910"
                                style="display: block;
                                text-align-last: justify;
                                font-size:15px;
                                width:90%;"
                                >
                                {forecast.map((item, index) => (
									<span key={index}>{item.time} </span>
									))}


                                </p>


                        </div>

                        <div className="wind-humid-hot"
                            style="display: block;
                            width: 100%;
                            height: 10%;
                            position: relative;
                            bottom: 35%;
                            background-color: #1ca5c2;
                            color:white;"
                            >
                            <div className="wind-humid-hot-icons"
                                style="display:block;
                                width:100%;
                                height: 50px;
                                margin-left:10%;
                                padding-top: 1%;
                                margin-bottom: 2%;">
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-13%3A11?alt=media&token=05527e3f-a85f-4a04-982a-ea2636df350c"
                                    className="icon-strong-wind"
                                    style="width:10%;
                                    position:relative;
                                    display: inline;
                                    "
                                />
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-13%3A14?alt=media&token=36972f3e-4297-49be-a97b-c02cd9893057"
                                    className="icon-humidity"
                                    style="width:10%;
                                    position:relative;
                                    display: inline;
                                    margin-left:25%;
                                    margin-right:25%"
                                />
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-13%3A23?alt=media&token=6aaf4db8-9a52-4518-99b3-3e40f27d3929"
                                    className="icon-hot"
                                    style="width:10%;
                                    position:relative;
                                    display: inline;"
                                />
                                
                            </div>
                            <p className="windspeed" 
                            style="font-size: 15px;
                            color: rgba(255,255,255,0.7);
                            padding-left: 5%;"
                            >Windspeed</p>
                            <p className="humidity"
                            style="font-size: 15px;
                            color: rgba(255,255,255,0.7);
                            padding-left: 20%;"
                            >Humidity</p>

                            <p className="uv-index"
                            style="font-size: 15px;
                            color: rgba(255,255,255,0.7);
                            padding-left: 20%;">Cloud</p>

                            <div className="stats" style="
                            display:block;
                            font-size: 18px;
                            color: rgba(255,255,255,1);">

                                <p className="_-10km-h" style="
                                padding-left: 5%;">
                                    {this.state.windspeed} km/h
                                </p>

                                <p className="_-92"
                                style="padding-left: 24%;">
                                    {this.state.humidity}%
                                </p>
                                                    
                                <p className="_-010" style="padding-left: 25%;">
                                    {this.state.cloudcoverage}% 
                                    </p>
                            </div>
                        </div>

                        <div className="sunrise-moonrise"
                            style="display:block;
                                        width:100%;
                                        height: 50px;
                                        position:relative;
                                        bottom:34%;
                                        color:white;">
                            <div className="icons-sunrise-moonrise"
                            style="display:block;">
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-13%3A17?alt=media&token=37e24a82-4ca7-4ff2-bfd7-5e87e261ac9b"
                                    className="icon-sunrise"
                                />
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-13%3A20?alt=media&token=17cd2bee-a793-4509-8371-298009ba91a9"

                                    className="icon-moonrise"
                                />
                            </div>
                            <p className="sunrise-630am">Sunrise: {this.state.sunriseDate}</p>
                            <p className="sunset-530pm">Sunset: {this.state.sunsetDate}</p>
                        </div>
                    </div>
                </div>
        );
        {/* end of Luciana code */ }
    }
}

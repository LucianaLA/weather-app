// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
	//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=cf17e23b1d108b29a4d738d2084baf5";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: this.parseResponse,
			error: function (req, err) { console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
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
					{/* {this.state.display ? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} /> : null} */}
					{/* Luciana code */}
					<div className="backdrop"
						style="width: 414px;
					height: 736px;">
						<div className="group-head"
							style="height: 5%;
						margin-top: 1%;">
							<img
								src="../../assets/icons/menuicon.png"
								id="icon-menu"
								style="	width: 10%;
								float: left;
								padding-left: 5px;"
							/>
							<img
								src="../../assets/icons/location-icon.png"
								id="icon-location"
								style="width: 3.6%;
								position:relative;
								left:33%;"
							/>
							<span
								id="mile-end-london"
								style="color: white;
								font-size: 1.5em;
								position: relative;
								top: 1%;
								text-align: right;
								padding-left: 35%;"
							>Mile End, London</span>
						</div>
						<div className="current-weather"
							style="display:block;
						background-color:#1CA5C2;
						width:100%;">
							<p className="_-7"
								style="	color: rgba(255, 255, 255, 1);
							font-size: 68px;
							line-height: 68px;
							font-family: Inter, sans-serif;
							font-weight: 400;">
								7°</p>
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
								Rain expected later today
							</p>
						</div>
						<div className="walk-recommendation"
							style="float: right;
							background-color: #1CA5C2;
							width:40%;
							height: 80px;
							margin-top:15px;">
							<p className="best-times-for-walking"
								style="	display: flex;
								flex-direction: column;
								justify-content: center;
								color: rgba(255, 255, 255, 1);
								font-size: 16px;
								line-height: 16px;
								font-family: Inter, sans-serif;
								font-weight: 400;
								text-align: center;
								margin-top:3%">Best times for walking:</p>
							<p className="_-1pm-5pm"
								style="	display: flex;
								flex-direction: column;
								justify-content: center;
								color: rgba(255, 255, 255, 1);
								font-size: 20px;
								line-height: 20px;
								font-family: Inter, sans-serif;
								font-weight: 400;
								text-align: center;
								margin-top:5%">1pm - 5pm</p>
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
							<p className="light-rain-7pm-8pm"
								style="margin-left: 38%;
								display: flex;
								margin-top: 20px;
								color:white;
								font-size:20px;">Light Rain: 7pm-8pm</p>
							<p className="ground-expected-to-be-we"
								style="margin-left:5%;
								display: block;
								margin-top: 20px;
								color:white;
								font-size:15px;">
								Ground expected to be wet until until 9:30pm
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
							>4° 6° 7° 10° 10° 12° 10° 9° 8° 8°</p>
							

							<div className="hourly-weather-icons"
							style="height:20%;
							display:block;
							padding-bottom:10%;">
								<img
								src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A94?alt=media&token=bb7e90a0-73ed-4fc4-afe3-5088bbd86caf"
								className="icon-sun-1"
								style="width: 5%;
								display: inline;
								position: absolute;
								top: 40%;
								right:97%;"
							/>

								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A91?alt=media&token=d73e5719-a416-4469-bda7-3e284810a089"
									className="icon-sun-2" 
									style="width: 5%;
									display: inline;
									position: absolute;
									top: 35%;
									right: 89%;"
								/>
								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A85?alt=media&token=a1a692ec-7766-4774-8edc-8de407f7b6e5"

									className="icon-sun-4"
									style="width: 5%;
									display: inline;
									position: absolute;
									top: 30%;
									right: 78%;"
								/>

								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A97?alt=media&token=2e320faa-5818-48e3-8001-4b61331b214c"

									className="icon-sun-5" 
									style="width: 5%;
									display: inline;
									position: absolute;
									top: 25%;
									right: 68%;"
								/>
								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A100?alt=media&token=5891140b-b25e-48d2-b90d-9c21649c319b"

									className="icon-sun-6" 
									style="width: 5%;
									display: inline;
									position: absolute;
									top: 25%;
									right: 59%;"
								/>


								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A103?alt=media&token=13d6a5c8-6907-4de0-8742-ed266262da6a"

									className="icon-sun-7" 
									style="
									width: 5%;
									display: inline;
									position: absolute;
									top: 20%;
									right: 49%;"
								/>
								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A168?alt=media&token=46eabaa4-87c5-4151-aea4-cc84051c75e6"

									className="icon-night-alt-rain" 
									style="
									width: 5%;
									display: inline;
									position: absolute;
									top: 25%;
									right: 38%;"
								/>


								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A170?alt=media&token=0e4a2569-a28f-457c-8917-ebba0013a712"

									className="icon-night-alt-rain-1" 
									style="
									width: 5%;
									display: inline;
									position: absolute;
									top: 23%;
									right: 29%;"
								/>
								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A172?alt=media&token=44d3d1eb-25a6-44bb-945b-bcea1585f56e"

									className="icon-night-alt-partly-cloudy" style="
									width: 5%;
									display: inline;
									position: absolute;
									top: 20%;
									right: 20%;"
								/>
								<img
									src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/k6fpuppe53f-1%3A174?alt=media&token=df67b92e-8bfc-4fef-a37e-83700b405d0f"

									className="icon-night-alt-partly-cloudy-1"
									style="
									width: 5%;
									display: inline;
									position: absolute;
									top: 20%;
									right: 10%;"
								/>

							</div>
							<p className="pm" style="-webkit-text-stroke-color: #1eb6d8;
								-webkit-text-stroke-width: thin;
								position: absolute;
								width: 100%;
								text-align: center;
								padding-left: 36.5%;
								padding-top: 4%;
								text-align-last: justify;
								font-size: 15px;"
							>PM</p>
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
								>1 2 3 4 5 6 7 8 9 10</p>

							<p className="temperature-is-the-same"
								style="	color: rgba(255, 255, 255, 1);
									font-size: 15px;
									line-height: 15px;
									font-family: Inter, sans-serif;
									font-weight: 400;
									opacity: 0.8;
									display:block;"
									>
								Temperature is the same as yesterday.
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
							padding-left: 20%;">UV Index</p>

							<div className="stats" style="
							display:block;
							font-size: 18px;
							color: rgba(255,255,255,1);">

								<p className="_-10km-h" style="
								padding-left: 5%;">10km/h</p>

								<p className="_-92"
								style="padding-left: 24%;">92%</p>
													
								<p className="_-010" style="padding-left: 25%;">0/10</p>
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
							<p className="sunrise-630am">Sunrise: 6:30am</p>
							<p className="sunset-530pm">Sunset: 5:30pm</p>
						</div>
					</div>
				</div>
		);
		{/* end of Luciana code */ }
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond: conditions
		});
	}
}

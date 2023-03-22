import { h, render, Component } from 'preact';
import style from './style.less';



function HourlyForecast({ next5HourForecast, forecast }) {
  return (
    <div class={style.hourlyweather}>
      <p class={style.timeweather}>
        <div>
          {next5HourForecast.map((item, index) => ( // displays the temperature for the next 5 hours
            <span>
              {item.temp}°C{index < next5HourForecast.length - 1 ? ' ' : ''} {/* displays the temperature for the next 5 hours */}
            </span>
          ))}
        </div>
      </p>

      <div class={style.hourlyweathericons}>
        <div class={style.hourlydiv}>
          {next5HourForecast.map((item, index) => ( // displays the weather icons for the next 5 hours
            <div key={index} class={style.hourdiv2}> 
              {(item.condition.includes('sunny') || item.condition.includes('clear')) // if the weather is sunny, display the sunny icon
              && (
                <img
                  src="../../assets/icons/sun.png"
                  class={style.hourweathericons}
                />
              )}
              {(item.condition.includes('rain') || item.condition.includes('drizzle')) // if the weather is rainy, display the rainy icon
              && (
                <img
                  src="../../assets/icons/nightrain.png"
                  class={style.hourweathericons}
                />
              )}
              {(item.condition.includes('clouds') || item.condition.includes('overcast') || item.condition.includes('Cloudy') || item.condition.includes('cloudy')) // if the weather is cloudy, display the cloudy icon
               && (
                <img
                  src="../../assets/icons/nightclouds.png"
                  class={style.hourweathericons}
                />
              )}
              {(item.condition.includes('snow') || item.condition.includes('flurries')) && ( // if the weather is snowy, display the snowy icon
                <img
                  src="../../assets/icons/snow.png"
                  class={style.hourweathericons}
                />
              )}
              {(item.condition.includes('thunderstorm') || item.condition.includes('tstorm')) && ( // if the weather is thunderstormy, display the thunderstorm icon
                <img
                  src="../../assets/icons/thunderstorm.png"
                  class={style.hourweathericons}
                />
              )}
              {(item.condition.includes('fog') || item.condition.includes('haze') || item.condition.includes('mist')) && ( // if the weather is foggy, display the fog icon
                <img
                  src="../../assets/icons/fog.png"
                  class={style.hourweathericons}
                />
              )}
              <span>{index < next5HourForecast.length - 1 ? ' ' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      <img
        src="../../assets/icons/line.png"
        class={style.hourlyline}
      />
      <p class={style.hours}>
        {forecast.map((item, index) => (
          <span key={index}>{item.time} </span> // displays the time for the next 5 hours
        ))}
      </p>
    </div>
  );
}

export default HourlyForecast;

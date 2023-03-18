import { h, render, Component } from 'preact';
import style from '../iphone/style.less';


function HourlyForecast({ next5HourForecast, forecast }) {
  return (
    <div class={style.hourlyweather}>
      <p class={style.timeweather}>
        <div>
          {next5HourForecast.map((item, index) => (
            <span>
              {item.temp}°C{index < next5HourForecast.length - 1 ? ' ' : ''}
            </span>
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
                  class={style.hourweathericons}
                />
              )}
              {item.condition.includes('rain') && (
                <img
                  src="../../assets/icons/nightrain.png"
                  class={style.hourweathericons}
                />
              )}
              {item.condition.includes('clouds') && (
                <img
                  src="../../assets/icons/nightclouds.png"
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
          <span key={index}>{item.time} </span>
        ))}
      </p>
    </div>
  );
}

export default HourlyForecast;

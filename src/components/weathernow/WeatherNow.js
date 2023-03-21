import { h, render, Component } from 'preact';
import style from '../iphone/style.less';

function WeatherNow({ temperature, description, capitalizeWords }) {
    return (
        <div class={style.currentweather}>
            <p class={style.temperaturenow}> {/* displays current temperature */}
                {Math.round(temperature)} {/* rounds temperature to nearest whole number */}
                °</p>
            <p class={style.weathertype}>
                {capitalizeWords(description)} {/* displays current weather description, capitalised */}
            </p>
        </div>
    )
}

export default WeatherNow;

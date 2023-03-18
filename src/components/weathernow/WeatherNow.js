import {h, render, Component} from 'preact';
import style from '../iphone/style.less';

function WeatherNow({temperature, description, capitalizeWords}) {
    return(
    <div class={style.currentweather}>
                            <p class={style.temperaturenow}>
                                {Math.round(temperature)}
                                °</p>
                            <p class={style.weathertype}>
                                {capitalizeWords(description)}
                            </p>
                        </div>
    )
}

export default WeatherNow;

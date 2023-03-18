import { h, render, Component } from 'preact';
import style from '../iphone/style.less';

function Statistics({ windspeed, humidity, cloudcoverage }) {
    return (
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
                                {windspeed} km/h
                            </p>

                            <p class={style.humidtext}>
                                {humidity}%
                            </p>

                            <p class={style.cloudtext}>
                                {cloudcoverage}%
                            </p>
                        </div>
                    </div>
    )
}

export default Statistics;
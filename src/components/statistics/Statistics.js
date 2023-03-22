import { h, render, Component } from 'preact';
import style from '../iphone/style.less';


function Statistics({ windspeed, humidity, cloudCoverage }) {
    return (
        <div class={style.windhumidcloud}>
            <div class={style.windhumidcloudicons}>
                <img // wind icon
                    src="../../assets/icons/wind.png"
                    class={style.iconswind} /> 
                <img // humidity icon
                    src="../../assets/icons/humidity.png"
                    class={style.iconhumidity} />
                <img // cloud icon
                    src="../../assets/icons/cloudcover.png"
                    class={style.iconhot} />

            </div>
            <p class={style.windspeed}>Windspeed</p>
            <p class={style.humidity}>Humidity</p>

            <p class={style.cloudcover}>Cloud</p>

            <div class={style.stats}>

                <p class={style.windspeedtext}> {/* windspeed */}
                    {windspeed} km/h
                </p>

                <p class={style.humidtext}> {/* humidity */}
                    {humidity}%
                </p>

                <p class={style.cloudtext}> {/* cloud coverage */}
                    {cloudCoverage}%
                </p>
            </div>
        </div>
    )
}

export default Statistics;
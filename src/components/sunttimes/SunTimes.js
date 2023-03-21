import style from '../iphone/style.less';
import { h, render, Component } from 'preact';

function SunTimes({ sunriseDate, sunsetDate }) {
    return (
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
            <p class={style.sunrisetext}>Sunrise: {sunriseDate}</p>
            <p class={style.sunsettext}>Sunset: {sunsetDate}</p>
        </div>
    )
}

export default SunTimes;
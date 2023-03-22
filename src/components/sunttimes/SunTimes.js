import style from './style.less';
 // import style 
import { h, render, Component } from 'preact';

function SunTimes({ sunriseDate, sunsetDate }) { // sunriseDate and sunsetDate are passed from index.js
    return (
        <div class={style.sunrisemoonrise}> 
            <div class={style.iconssunrisemoonrise}>
                <img // sunrise icon
                    src="../../assets/icons/sunrise.png"
                    class={style.iconsunrise}
                />
                <img // moonrise icon
                    src="../../assets/icons/moonrise.png"
                    class={style.iconmoonrise}
                />
            </div> 
            <p class={style.sunrisetext}>Sunrise: {sunriseDate}</p> {/* displays sunrise time */}
            <p class={style.sunsettext}>Sunset: {sunsetDate}</p> {/* displays sunset time */}
        </div>
    )
}

export default SunTimes;
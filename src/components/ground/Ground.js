import {h, render, Component} from 'preact';
import style from '../iphone/style.less';

function Ground({groundDryTime}) {
    return (
        <div class={style.weatherlater}>
        <img
            src="../../assets/icons/raindrops.png"
            class={style.iconweatherlater} />
        <p class={style.groundstate}>
            {groundDryTime === 0 ? (
                <p>The ground is currently dry</p>
            ) : (
                <p class={style.groundstatetxt}>Ground expected to be dry in: {groundDryTime} minutes</p>
            )}
        </p>
    </div>
    )
}

export default Ground;
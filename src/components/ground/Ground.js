import {h, render, Component} from 'preact';
import style from './style.less';


function Ground({groundDryTime}) { // this component displays the time until the ground is dry or if it's dry now
    return (
        <div class={style.weatherlater}>
        <img
            src="../../assets/icons/raindrops.png"
            class={style.iconweatherlater} />
        <p class={style.groundstate}>
            {groundDryTime === 0 ? ( //if the ground is dry, display it is dry
                <p>The ground is currently dry</p>
            ) : ( //if the ground isn't dry, dispaly the time until it is dry
                <p class={style.groundstatetxt}>Ground expected to be dry in: {groundDryTime} minutes</p> 
            )}
        </p>
    </div>
    )
}

export default Ground;
import { h, render, Component } from 'preact';
import style from '../iphone/style.less';

import BurgerMenu from '../burgermenu/BurgerMenu';

function TopLevel({ location, searchLocation, locationButton }) { 
    return (
        <div class={style.grouphead}>
            <div class={style.dropdown}>
                <img
                    src="../../assets/icons/menuicon.png" // menu icon
                    class={style.iconmenu}
                />
                <BurgerMenu // burger menu
                    onLocationSearch={searchLocation} // search location
                    onCurrentLocation={locationButton} // current location
                />
            </div>
            <img
                src="../../assets/icons/location-icon.png" z
                class={style.iconlocation} // location icon
            />
            <span
                class={style.currentlocation} // current location icon
            >
                {location}
            </span>
        </div>
    )
}

export default TopLevel;
import {h, render, Component} from 'preact';
import style from '../iphone/style.less';
import BurgerMenu from '../burgermenu/BurgerMenu';

function TopLevel({location, searchLocation, locationButton}) {
    return (
        <div class={style.grouphead}>
                            <div class={style.dropdown}>
                                <img
                                    src="../../assets/icons/menuicon.png"
                                    class={style.iconmenu}
                                />
                                <BurgerMenu
                                    onLocationSearch={searchLocation}
                                    onCurrentLocation={locationButton}
                                />
                            </div>
                            <img
                                src="../../assets/icons/location-icon.png"
                                class={style.iconlocation}
                            />
                            <span
                                class={style.currentlocation}
                            >
                                {location}
                            </span>
                        </div>
    )
}

export default TopLevel;
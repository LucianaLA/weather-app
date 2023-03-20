import {h, render, Component} from 'preact';
import style from '../iphone/style.less';

function BurgerMenu({onLocationSearch, onCurrentLocation}) {
    return (
        //dropdown menu with two option, one to search, the other to set the location as the current location
        <div class={style.dropdowncontent}>
                                    <div class={style.search}>
                                        <input id="locationSearch" class={style.locationsearch} type="text" placeholder="Search locations" onChange={this.handleChange} />
                                        <img src="../../assets/icons/lookup.png"
                                            class={style.lens} onClick={() => {onLocationSearch(document.getElementById("locationSearch").value); document.getElementById("locationSearch").value = ""; }}
                                        />
                                    </div>
                                    <div class={style.currentlocation}>
                                        
                                        <img src="../../assets/icons/currentlocation.png" class={style.currentlocationicon} onClick={() => { navigator.geolocation.getCurrentPosition((position) => {position.coords.latitude; position.coords.longitude; onCurrentLocation(position.coords.latitude, position.coords.longitude);});}}/>
                                    </div>
                                </div>
    )
}

export default BurgerMenu;
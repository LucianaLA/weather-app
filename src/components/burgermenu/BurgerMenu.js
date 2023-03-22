import { h, render, Component } from 'preact';
import style from '../iphone/style.less';

function BurgerMenu({ onLocationSearch, onCurrentLocation }) {
    return (
        //dropdown menu with two option, one to search, the other to set the location as the current location
        <div class={style.dropdowncontent}>
            <div class={style.search}>
                <input id="locationSearch" class={style.locationsearch} type="text" placeholder="Search Location" onChange={this.handleChange} /> {/* search bar */}
                <img src="../../assets/icons/lookup.png" //search icon
                    class={style.lens} onClick={() => { onLocationSearch(document.getElementById("locationSearch").value); document.getElementById("locationSearch").value = ""; }}
                /> {/* when clicked, the search bar value is sent to the onLocationSearch function which searches the location */}
            </div>
            <button class={style.getcurrentloc} onClick={() => { navigator.geolocation.getCurrentPosition((position) => { position.coords.latitude; position.coords.longitude; onCurrentLocation(position.coords.latitude, position.coords.longitude); }); }}>Current Location</button>
        </div>
    )
}

export default BurgerMenu;
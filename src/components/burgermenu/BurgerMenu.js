import {h, render, Component} from 'preact';
import style from '../iphone/style.less';

function BurgerMenu({onLocationSearch}) {
    return (
        //dropdown menu with two option, one to search, the other to set the location as the current location
        <div class={style.dropdowncontent}>
                                    <div class={style.search}>
                                        <input id="locationSearch" class={style.locationsearch} type="text" placeholder="Search locations" onChange={this.handleChange} />
                                        <img src="../../assets/icons/lookup.png"
                                            class={style.lens} onClick={() => { onLocationSearch(document.getElementById("locationSearch").value); document.getElementById("locationSearch").value = ""; }}
                                        />
                                    </div>
                                    <div class={style.currentlocation}>
                                        <p class={style.currentlocationtext}>Use current location</p>
                                        //make it a button to set the location as the current location
                                        <button class={style.currentlocationbutton} onClick={() => { onLocationSearch("current"); }}></button>
                                        
                                    </div>
                                </div>
    )
}

export default BurgerMenu;
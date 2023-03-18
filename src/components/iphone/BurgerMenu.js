import {h, render, Component} from 'preact';
import style from './style';


function BurgerMenu({onLocationSearch}) {
    return (
        <div class={style.dropdowncontent}>
                                    <div class={style.search}>
                                        <input id="locationSearch" class={style.locationsearch} type="text" placeholder="Search locations" onChange={this.handleChange} />
                                        <img src="../../assets/icons/lookup.png"
                                            //search button and clear after search
                                            
                                            class={style.lens} onClick={() => { onLocationSearch(document.getElementById("locationSearch").value); document.getElementById("locationSearch").value = ""; }}
                                        />
                                    </div>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </div>
    )
}

export default BurgerMenu;

import { h, render, Component, Fragment } from 'preact';
import style from '../iphone/style.less';


function PetTemperature({ condition }) {

      // check the condition and displays the correct image
      let image = null; 
      switch (condition) {  // check the condition and displays the correct image
        case 'Sun': // if the condition is sunny
        case 'Sunny': 
        case 'Clear':
          image =  <img src="../../assets/icons/sun.png" class={style.iconpetgraphic} />;
          break;
        case 'Cloudy': // if the condition is cloudy
        case 'Cloud':
        case 'Clouds':
          image =  <img src="../../assets/icons/cloud.png" class={style.iconpetgraphic} />;
          break;
        case 'Rain': // if the condition is rainy
        case 'Rainy':
        case 'Raindrops':
          image =  <img src="../../assets/icons/raindrops.png" class={style.iconpetgraphic} />;  
          break;
        case 'Snow': // if the condition is snowy
        case 'Snowy':
          image =  <img src="../../assets/icons/snow.png" class={style.iconpetgraphic} />;
          break;
        case 'Thunderstorm':  // if the condition is thunderstormy
          image =  <img src="../../assets/icons/thunderstorm.png" class={style.iconpetgraphic} />;
          break;
        case 'Fog': // if the condition is foggy
        case 'Foggy':
          image =  <img src="../../assets/icons/fog.png" class={style.iconpetgraphic} />;
          break;
        case 'Drizzle': // if the condition is drizzly
        default:
          image =  <img src="../../assets/icons/sun.png" class={style.iconpetgraphic} />;
      }
      
      return(
        <Fragment>
          {image} {/* display the image */}
        <img src="../../assets/icons/pet.png" class={style.petdrawing} />
        </Fragment>
      );

      
}

export default PetTemperature;

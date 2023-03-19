
import { h, render, Component, Fragment } from 'preact';
import style from '../iphone/style.less';

function PetTemperature({ condition }) {

      // check the condition and displays the correct image
      let image = null;
      console.log(condition)
      switch (condition) {
        case 'Sun':
        case 'Sunny':
        case 'Clear':
          image =  <img src="../../assets/icons/sun.png" class={style.iconsun} />;
          break;
        case 'Cloudy':
        case 'Cloud':
        case 'Clouds':
          image =  <img src="../../assets/icons/cloud.png" class={style.iconcloud} />;
          break;
        case 'Rain':
        case 'Rainy':
        case 'Raindrops':
          image =  <img src="../../assets/icons/raindrops.png" class={style.iconraindrops} />;  
          break;
        case 'Snow':
        case 'Snowy':
          image =  <img src="../../assets/icons/snow.png" class={style.iconsnow} />;
          break;
        case 'Thunderstorm':  
          image =  <img src="../../assets/icons/thunderstorm.png" class={style.iconthunderstorm} />;
          break;
        case 'Fog':
        case 'Foggy':
          image =  <img src="../../assets/icons/fog.png" class={style.iconfog} />;
          break;
        case 'Drizzle':
        default:
          image =  <img src="../../assets/icons/sun.png" class={style.iconsun} />;
      }
      
      return(
        <Fragment>
          {image}
        <img src="../../assets/icons/pet.png" class={style.petdrawing} />
        </Fragment>
      );

      
}

export default PetTemperature;

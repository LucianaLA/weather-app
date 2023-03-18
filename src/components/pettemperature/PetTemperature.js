import { h, render, Component, Fragment } from 'preact';
import style from '../iphone/style.less';

function PetTemperature({ temperature }) {
  return (
    <Fragment>
        <div class={style.graphicpet} />
        <img src="../../assets/icons/sun.png" class={style.iconsun} />
        <img src="../../assets/icons/cloud.png" class={style.iconcloud} />
        <img src="../../assets/icons/cloud.png" class={style.iconcloud1} />
        <img src="../../assets/icons/pet.png" class={style.petdrawing} />
    </Fragment>
  );
}

export default PetTemperature;

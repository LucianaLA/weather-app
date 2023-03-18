import {h, render, Component} from 'preact';
import style from '../iphone/style.less';

function BestTimeWalk({bestTime}) {
    return (
        <div class={style.walkrecommendation}>
            <p class={style.walktext}>Best time for walking:</p>
            <p class={style.besttime}>
                {bestTime.time}
            </p>
        </div>
    )


}

export default BestTimeWalk;
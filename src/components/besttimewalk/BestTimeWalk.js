import {h, render, Component} from 'preact';
import style from './style.less';



// this component is to display the best time to take a pet out for a walk
function BestTimeWalk({bestTime}) {
    return (
        <div class={style.walkrecommendation}>
            <p class={style.walktext}>Best time for walking:</p> 
            <p class={style.besttime}> 
                {bestTime.time} {/* displays the best time*/}
            </p>
        </div>
    )


}

export default BestTimeWalk;
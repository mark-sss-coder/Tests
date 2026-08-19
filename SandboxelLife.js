/// <reference path="./sandboxel.d.ts" />
/**
 * Neighbors: [x,y,liveWeight?,deadWeight?]
 */
//@ts-ignore
var lifeRules = {live:{live:[2,3]},dead:{live:[3]},neighbors:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]};
elements.alive = {
    color:'#eeeeee',
    name:'Alive cell',
    category:'land'
}
elements.dead = {
    color:'#888888',
    name:'Dead cell',
    category:'land'
}
runEveryTick(()=>{
    const old = [...pixelMap];
    for(let i = 0; i < old.length; i++)
    for(let j = 0; j < old[i].length; j++) {
        let nCount = 0;
        for(let n of lifeRules.neighbors) {
            //@ts-ignore
            nCount += (outOfBounds(i+n[0],j+n[1])||(old[i+n[0]][j+n[1]]?.element=='alive')?(n[3]??0):(n[2]??1));
        }
        //@ts-ignore
        if(old[i][j]?.element==='alive' && !lifeRules.live.live.includes(nCount)) changePixel(old[i][j],'dead');
        //@ts-ignore
        if(old[i][j]?.element==='dead' && lifeRules.dead.live.includes(nCount))  changePixel(old[i][j],'alive');
    };
});

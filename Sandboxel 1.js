const lifeRules={live:{alive:[2,3]},dead:{birth:[3]},neighbors:[[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[-1,-1],[1,-1]]}; // you can use [x,y,weight,deadWeight] in the neighbors
element['Welcome to conway\'s game of life!']={color:'c8c8c8',category: 'land',density: 1000,tick(block){pixelMap[block.x][block.y]=null;};elements.alive={color:'#cecece',category: 'land',density: 1000,tick({x,y}){
 let neigh=0;
 for(const [xPos,yPos,weight,deadWeight] of lifeRules.neighbors) {

  if(pixelMap[x+xPos][y+yPos]=='alive') neigh+=weight??1; else neigh+=deadWeight??0;
 }
 if(!lifeRules.live.alive.includes(neigh)) pixelMap[x][y]='dead';
}};
elements.dead={color:'989898',category: 'land',density: 1000,tick({x,y}){
 let neigh=0;
 for(const [xPos,yPos,weight,deadWeight] of lifeRules.neighbors) {

  if(pixelMap[x+xPos][y+yPos]=='alive') neigh+=weight??1; else neigh+=deadWeight??0;
 }
 if(lifeRules.dead.birth.includes(neigh)) pixelMap[x][y]='alive';
}};

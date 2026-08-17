const lifeRules={live:{alive:[2,3]},dead:{birth:[3]},neighbors:[[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[-1,-1],[1,-1]]}; // you can use [x,y,weight,deadWeight] in the neighbors
elements={'Welcome to conway\'s game of life!':{color:'c8c8c8',tick(block){pixelMap[block.x][block.y]=null;},alive:{tick({x,y}){
 let neigh=0;
 for(const [xPos,yPos,weight,deadWeight] of lifeRules.neighbors) {

  if(pixelMap[x+xPos][y+yPos]=='alive') neigh+=weight??1; else neigh+=deadWeight??0;
 }
 if(!lifeRules.live.alive.includes(neigh)) pixelMap[x][y]='dead';
}},dead:{color:'989898',tick({x,y}){
 let neigh=0;
 for(const [xPos,yPos,weight,deadWeight] of lifeRules.neighbors) {

  if(pixelMap[x+xPos][y+yPos]=='alive') neigh+=weight??1; else neigh+=deadWeight??0;
 }
 if(lifeRules.dead.birth.includes(neigh)) pixelMap[x][y]='alive';
}}};

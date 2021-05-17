class Vector2 {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  get magnitude(){
    
  }
  add(vec2){
    return new Vector2(this.x+vec2.x, this.y+vec2.y)
  }
  multiplyScalar(scalar){
    return new Vector2(this.x*scalar, this.y*scalar)
  }
  normalize(){

  }
}


class Object{
  constructor(){

  }
}
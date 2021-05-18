class Vector2 {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  get magnitude(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  add(vec2){
    return new Vector2(this.x+vec2.x, this.y+vec2.y);
  }
  multiplyScalar(scalar){
    return new Vector2(this.x*scalar, this.y*scalar);
  }
  divideScalar(scalar){
    return this.multiplyScalar(1/scalar);
  }
  normalize(){
    return this.divideScalar(this.magnitude || 1);
  }
}

class Object{
  constructor(){
    this.position = new Vector2(0,0);
    this.size = new Vector2(1,1);
    this.formFactor = "Rectangle";
    this.velocity = new Vector2(0,0);
    this.rotation = 0;
  }
  update(){
	rect(this.position.x,this.position.y,this.size.x,this.size.y);
  }
}
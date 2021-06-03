class UDIM {
	constructor(scalex, offsetx, scaley, offsety){
		this.scalex = scalex;
		this.scaley = scaley;
		this.offsetx = offsetx;
		this.offsety = offsety;
	}
}

class BaseUI extends BaseObject {
    constructor(){
		super();
        this.rad_tl = 0;
        this.rad_tr = 0;
        this.rad_bl = 0;
        this.rad_br = 0;
		this.position = new UDIM(0,0,0,0);
        this.size = new UDIM(0,0,0,0);
		this.color = new Color(255,255,255,255);
    }
	update(){
		push();
		//rectMode(CENTER)
		fill(this.color.r,this.color.g,this.color.b,this.color.a);
		rect(
			innerWidth * this.position.scalex + this.position.offsetx, 
			innerHeight * this.position.scaley + this.position.offsety,
			innerWidth * this.size.scalex + this.size.offsetx,
			innerHeight * this.size.scaley + this.size.offsety,
			this.rad_tl,
			this.rad_tr,
			this.rad_bl,
			this.rad_br
		)
		pop();
	}
}

class TextLabel extends BaseUI {
	constructor(text){
		super();
		this.text = text;
		this.textSize = 30;
		this.textColor = new Color(0,0,0,255);
	}
	update(){
		super.update();
		push()
		textSize(this.textSize);
		textAlign(CENTER, CENTER);
		fill(this.textColor.r,this.textColor.g,this.textColor.b,this.textColor.a)
		text(
			this.text, 
			innerWidth * this.position.scalex + this.position.offsetx,
			innerHeight * this.position.scaley + this.position.offsety
		)
		pop()
	}
}

class TextButton extends TextLabel {
	constructor(text){
		super(text);
		this.animated = true;
		this.hoverInDuration = .05;
		this.clickInDuration = .05;
		this.returnDuration = .05;

		this.hoverColor = new Color(100,100,100,255);
		this.clickColor = new Color(50,50,50,255);
		this.baseColor = new Color(200,200,200,255);
	}
	getAbsoluteSize(){
		return new Vector2(this.size.scalex * innerWidth + this.size.offsetx, this.size.scaley * innerHeight + this.size.offsety);
	}
	getAbsolutePosition(){
		return new Vector2(this.position.scalex * innerWidth + this.position.offsetx, this.position.scaley * innerHeight + this.position.offsety);
	}
	getMouseHover(){
		let pos = this.getAbsolutePosition();
		let size = this.getAbsoluteSize();
		if( mouseX > pos.x - size.x / 2 && mouseX < pos.x + size.x / 2 ) {
			//x is in line
			if( mouseY > pos.y - size.y / 2 && mouseY < pos.y + size.y / 2 ) {
				return true;
			}
		}
	}
	update(){
		super.update();
		let hover = this.getMouseHover();
		let d = getDelta();
		
		if(hover){
			if(input.getMouseButtonDown(0)){
				this.color = this.color.lerp(this.clickColor, Math.min(d/this.clickInDuration,1))
				return;
			}
			this.color = this.color.lerp(this.hoverColor, Math.min(d/this.hoverInDuration,1));
			return;
		}
		this.color = this.color.lerp(this.baseColor, Math.min(d/this.returnDuration,1));
	}
}
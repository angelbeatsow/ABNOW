const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 384;
canvas.height = 640;

ctx.beginPath();
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.closePath();

let touch = {type:null,x:0,y:0};
let lastTouchStart = {type :"not",x:0,y:0};

const NAGAOSHI_FRAME = 40;

function isClick(obj){
  if(touch.type == "touchend" && obj.isTouched(touch)[1] == true && obj.isTouched(lastTouchStart)[1] == true &&  game.nagaoshiCount[1] == "start" && Math.abs(touch.x - lastTouchStart.x) < 10 && Math.abs(touch.y - lastTouchStart.y) < 10){
    game.nagaoshiCount[1] = "end";
    return true;
  }
  return false;
}


function isNagaoshi(obj){
  if(touch.type == "touchstart" &&  obj.isTouched(touch)[1] == true && game.nagaoshiCount[0] >= NAGAOSHI_FRAME && game.nagaoshiCount[1] == "start"){
    game.nagaoshiCount[1] = "end";
    return true;
  }
  return false;
}

function randomNum(a, b) { //a以上b以下の乱数を返す a,bは整数
  return a + Math.floor(Math.random() * (b - a + 1));
}

class User {
  constructor(){
    this.cards = [];
    this.bukis = [];
    this.lv = 1;
    this.exp = 0;
    this.maxcost = 50;
    this.name = "" ;
    this.sensenName = "";
    this.b = 0;
    this.ticket = 0;
    this.syokken = [0,0,0,0]; //麻婆豆腐食券、肉うどん食券、オムライス食券、カレー食券
    
    this.lastLoginDay = [0,0,0];//年、月、日
    
    this.sensen = [null,null,null,null,null];//charactorNumを設定。[0]はリーダー。
    
    
    this.testCard = new Card(0);
    
    this.clearStage = 0;
    this.clearPlace = 0;
  }
  
  returnCardsByCharactorNum(charanum,isCharactorSettei = false){
    //特定のキャラの所持カードを返す。キャラクター設定されているカードを返すことも可。
    if(charanum >= charactors.length)return false;
    let re = [];
    let re2 = [null,null,null,null,null];//カード4枚と武器
    for (var i = 0; i < this.cards.length; i++) {
      if(this.cards[i].charactor == charactors[charanum]){
        re.push(this.cards[i]);
        if(this.cards[i].charactorSettei != 0){
          re2[this.cards[i].charactorSettei -1] = this.cards[i];
        }
      }
    }
    if(isCharactorSettei == false)return re;
    if(isCharactorSettei == true){
      for (var i = 0; i < user.bukis.length; i++) {
        if(user.bukis[i].soubiCharactor == charanum)re2[4] = user.bukis[i];
      }
      return re2;
      
    }
  }
  
  returnSensenStatus(){
    let re = {hp:0,"赤":0,"緑":0,"青":0,"黄":0,"紫":0,"心":0};
    for (var i = 0; i < this.sensen.length; i++) {
      if(this.sensen[i] != null){
        let _charactorCards = this.returnCardsByCharactorNum(this.sensen[i],true);
        if(_charactorCards[0] == null)continue;
        let _zokusei = _charactorCards[0].zokusei;
        for (var i2 = 0; i2 < _charactorCards.length; i2++) {
          if(_charactorCards[i2] != null){
            let _c = _charactorCards[i2];
            re.hp += _c.hp;
            re[_zokusei] += _c.atk;
            re["心"] += _c.rcv;
          }
        }
      }
    }
    return re;
  }
  
  lvup(){
    let needExp = (_lv)=>{
      return _lv * (_lv -1) /2;
    };
    let up = 0;
    while(needExp(this.lv +1) <= this.exp){
      up++;
      this.lv++;
    }
    return [up,needExp(this.lv +1) - this.exp]; //上がったレベル数、次のレベルまでに必要なexp
  }
}

let user = new User();

class Game{
  constructor(){
    this.flag = 0;
    this.scene ;
    this.wait = 0;
    this.blackout = [0,null,null];
    this.donttouch = true //タッチイベントを発生させない
    this.nagaoshiCount = [0,"end"]; //this.update()で処理を行う
    
    this.message = [];
    this.confirm = [];
    this.confirmFunction = ()=>{};//toucheventのために使う
  }
  
  add(_scene){
    this.scene = _scene;
  }
  
  addMessage(_text){
    this.message.push(_text);
    touch.type = "touchend";
    this.wait = 10;
  }
  
  addConfirm(_text,_yestext = "はい",_notext = "いいえ",_yesfunc = ()=>{},_nofunc = ()=>{}){
    this.confirm.push([_text,_yestext,_notext,_yesfunc,_nofunc]);
    touch.type = "touchend";
    this.wait = 10;
  }
  
  update(){
    //this.nagaoshiCountの処理
    if(touch.type == "touchstart"){
      if(this.nagaoshiCount[1] == "end")this.nagaoshiCount[0] = 0;
      this.nagaoshiCount[0]++;
      this.nagaoshiCount[1] = "start";
    }
    else if(touch.type == "touchend"){this.nagaoshiCount[1] = "end";}
    else if(touch.type == "touchmove" && Math.abs(touch.x - lastTouchStart.x) > 10 && Math.abs(touch.y - lastTouchStart.y) > 10){this.nagaoshiCount[0] = 0; this.nagaoshiCount[1] = "end";}
    
    
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width,canvas.height);
    ctx.closePath();
    
    this.scene.update();
    
    if(this.message.length > 0){
      let _txt = new Text(this.message[0],canvas.width /2,canvas.height/2,16);
       _txt.max = 18;
      let _txtwh = _txt.returnWidthAndHeight();
      _txt.x -= _txtwh[0] /2;
      _txt.y -= _txtwh[1] /2;
      let _rct = new Rect(0,_txt.y - 10,canvas.width ,_txtwh[1] + 10,false,"black");
      let _rct2 = new Rect(-2,_txt.y - 10,canvas.width +4,_txtwh[1] + 10,true,"white");
      _rct.update();
      _rct2.update();
      _txt.update();
    }
    
    if (this.confirm.length > 0) {
      let _txt = new Text(this.confirm[0][0], canvas.width / 2, canvas.height / 2, 16);
      _txt.max = 18;
      let _txtwh = _txt.returnWidthAndHeight();
      _txt.x -= _txtwh[0] /2;
      _txt.y -= (_txtwh[1] + 50)/2;
      let _yesr = new Rect(70,canvas.height/2,100,40,false,"#f33");
      _yesr.y += (_txtwh[1] + 50)/2 -40;
      let _yest = new Text(this.confirm[0][1],70 + 50,canvas.height/2 + 20,16);
      _yest.y += (_txtwh[1] + 50)/2 -40;
      _yest.x -= _yest.returnWidthAndHeight()[0]/2;
      _yest.y -= _yest.returnWidthAndHeight()[1]/2;
      let _nor = new Rect(canvas.width - 170, canvas.height / 2, 100, 40, false, "#33f");
      _nor.y += (_txtwh[1] + 50)/2 -40;
      let _not = new Text(this.confirm[0][2],canvas.width - 170 + 50, canvas.height / 2 + 20, 16);
      _not.y += (_txtwh[1] + 50)/2 -40;
      _not.x -= _not.returnWidthAndHeight()[0]/2;
      _not.y -= _not.returnWidthAndHeight()[1]/2;
      
      let _rct = new Rect(0, _txt.y - 20, canvas.width, _yesr.y + 40 + 20 -(_txt.y - 20) , false, "black");
      let _rct2 = new Rect(-2, _txt.y - 20, canvas.width + 4, _yesr.y + 40 + 20 -(_txt.y - 20), true, "white");
      _rct.update();
      _rct2.update();
      _txt.update();
      _yesr.update();
      _nor.update();
      _yest.update();
      _not.update();
      
      let confunc = ()=>{
        if(isClick(_yesr)){this.confirm[0][3]();this.confirm.splice(0,1);touch.type = "touchend";this.wait = 15;}
        if(isClick(_nor)){this.confirm[0][4]();this.confirm.splice(0,1);touch.type = "touchend";this.wait = 15;}
      }
      this.confirmFunction = confunc;
    }
    
    if(this.blackout[0] > 0 && this.blackout[1] == "up"){
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.globalAlpha = this.blackout[0];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.closePath();
      this.blackout[0] += 0.05;
      if(this.blackout[0] >= 1){
        this.blackout[0] = 1;
        this.blackout[1] = "down";
        if(this.blackout[2] != null){
          this.add(this.blackout[2]);
        }
      }
    }else if (this.blackout[0] > 0 && this.blackout[1] == "down") {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.globalAlpha = this.blackout[0];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.closePath();
      this.blackout[0] -= 0.05;
      if (this.blackout[0] <= 0) {
        this.blackout = [0, null,null];
      }
    }
    
  }
  
  touchevent(){
    if(this.wait > 0)this.wait--;
    if(this.wait < 0)this.wait = 0;
    if(this.blackout[0] != 0 || this.wait != 0 || this.donttouch == true)return;
    if(this.confirm.length > 0){this.confirmFunction();return;}
    if(this.confirm.length == 0)this.confirmFunction = ()=>{};
    if(this.message.length == 0){
      this.scene.touchevent();
    }else{
      if(touch.type == "touchstart"){
        this.message.splice(0,1);
        touch.type = "touchend";
        this.wait = 15;
        if(this.scene instanceof BattleScene && this.message.length == 0){
          this.scene.isSuffleMessageClose = true;
        }
      }
    }
  }
  
  blackoutFunction(_nextScene = null){
    this.blackout = [0.01,"up",_nextScene];
  }
}

let game = new Game();


canvas.addEventListener('touchmove',(event)=>{
  event.preventDefault();
	
  var eventType = event.type;
  var x = 0, y = 0;
  const offset = canvas.getBoundingClientRect();
	x = event.changedTouches[0].pageX;
  y = event.changedTouches[0].pageY;
  x = x - offset.left - window.pageXOffset;
  y = y - offset.top - window.pageYOffset;
  touch.type = eventType;
  touch.x = x;
  touch.y = y;
});
    
canvas.addEventListener('touchstart',(event)=>{
  var eventType = event.type;
  var x = 0, y = 0;
  const offset = canvas.getBoundingClientRect();
	x = event.changedTouches[0].pageX;
  y = event.changedTouches[0].pageY;
  x = x - offset.left - window.pageXOffset;
  y = y - offset.top - window.pageYOffset;
  touch.type = eventType;
  touch.x = x;
  touch.y = y;
  if(lastTouchStart.type == "not"){
    lastTouchStart.x = x;
    lastTouchStart.y = y;
    lastTouchStart.type = "touchstart";
  }
});
    
canvas.addEventListener('touchend',(event)=>{
  var eventType = event.type;
  var x = 0, y = 0;
  const offset = canvas.getBoundingClientRect();
	x = event.changedTouches[0].pageX;
  y = event.changedTouches[0].pageY;
  x = x - offset.left - window.pageXOffset;
  y = y - offset.top - window.pageYOffset;
  touch.type = eventType;
  touch.x = x;
  touch.y = y;
  lastTouchStart.type = "not";
});


class Scene {
  constructor(){
    this.basicItems = [];
    this.sceneItems = [];
    this.timelyItems = [];
    this.bg = null ; //背景
  }
  
  add(_item,itemtypeNum = 1,_name = null){
    let arr = null;
    if(itemtypeNum == 0)arr = this.basicItems;
    if(itemtypeNum == 1)arr = this.sceneItems;
    if(itemtypeNum == 2)arr = this.timelyItems;
    if(arr == null)return;
    if(_name == null)_name = "item" + arr.length;
    arr.push({name:_name,item:_item});
  }
  
  gatItemIndexByName(_name){
    
    for (var i = 0; i < this.basicItems.length; i++) {
      if(this.basicItems[i].name == _name)return ["basicItems",i];
    }
    for (var i = 0; i < this.sceneItems.length; i++) {
      if (this.sceneItems[i].name == _name) return ["sceneItems", i];
    }
    for (var i = 0; i < this.timelyItems.length; i++) {
      if (this.timelyItems[i].name == _name) return ["timelyItems", i];
    }
    return false;
  }
  
  update(){
    if(this.bg != null)this.bg.update();
    
    for (var i = 0; i < this.basicItems.length; i++) {
      this.basicItems[i].item.update();
    }
    for (var i = 0; i < this.sceneItems.length; i++) {
      this.sceneItems[i].item.update();
    }
    for (var i = 0; i < this.timelyItems.length; i++) {
      this.timelyItems[i].item.update();
    }
  }
  
  touchevent() {
    for (var i = 0; i < this.basicItems.length; i++) {
      this.basicItems[i].item.touchevent();
    }
    for (var i = 0; i < this.sceneItems.length; i++) {
      this.sceneItems[i].item.touchevent();
    }
    for (var i = 0; i < this.timelyItems.length; i++) {
      this.timelyItems[i].item.touchevent();
    }
  }
}


class Text{
  constructor(text,x = 0,y = 0,size = 20,maxwidth = null,_color = "white"){
    this.text = text;
    
		this.font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
		//テキストのサイズ
		this.size = size;
		//テキストを表示する位置
		this.x = x;
		this.y = y;
		//数値によってテキストを移動させることができる（移動速度）
		this.vx = this.vy = 0;
		//テキストのベースラインの位置
		this.baseline = 'top';
		//テキストの色
		this.color = _color;
		//テキストの太さ
		this.weight = 'normal';
		
		this._width = 0;
		
		this._height = 0;
		
		this.max= 0; //1行当たりの最大文字数を設定できる。改行される。 
		
		this.maxWidth = maxwidth; //最大の横の長さを設定できる
		
		this.globalAlpha = 1;
		
		this.hidden = false;
		
		this.tenmetu = 0;  //1を入れたら点滅する。
		
		this.rect = null; //四角内に描画可能。[x,y,width,height]を指定する
		
		if (x == "half") {
		  this.x = (canvas.width - this.returnWidthAndHeight()[0]) / 2;
		}
		if (y == "half") {
		  this.y = (canvas.height - this.returnWidthAndHeight()[1]) / 2;
		}
		
		
  }
  
  update(){
    if(this.hidden || this.tenmetu == 4)return;
    if(this.tenmetu == 1){
      this.tenmetu = 2;
      setTimeout( ()=>{
        if(this.tenmetu !=0)this.tenmetu = 3;
      },1000 / (3/2));
    }
    if (this.tenmetu == 3) {
      this.tenmetu = 4;
      setTimeout(() => {
        if(this.tenmetu != 0)this.tenmetu = 1;
      }, 1000 / 5);
      return;
    }
    
    
    
    const _ctx = canvas.getContext('2d');
    _ctx.save();
    _ctx.beginPath();
    
    _ctx.font = this.weight + ' ' + this.size + 'px ' + this.font;
    _ctx.fillStyle = this.color;
    _ctx.textBaseline = this.baseline;
    _ctx.globalAlpha = this.globalAlpha;
    _ctx.lineWidth = 0;
    _ctx.shadowColor = "black";
    if(this.color == "black")_ctx.shadowColor = "white";
    _ctx.shadowOffsetX = 0;
    _ctx.shadowOffsetY = 0;
    _ctx.shadowBlur = 5;
    
    this._width = _ctx.measureText(this.text).width;
    this._height = Math.abs(_ctx.measureText(this.text).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);
    
    if(this.max > 0){
      let howmanylines = Math.ceil( this.text.length / this.max);
      for(let li=0;li<howmanylines;li++){
        let _texts = this.text.substr(li * this.max,this.max);
        if(this.maxWidth == null){
          if(this.rect != null){
            _ctx.rect(this.rect[0],this.rect[1],this.rect[2],this.rect[3]);
            _ctx.clip();
          }
          _ctx.fillText( _texts ,this.x,this.y + (this._height + 4)*li);
          _ctx.strokeStyle = "black";
          if(this.color == "black")_ctx.strokeStyle = "white";
          //_ctx.strokeText( _texts ,this.x,this.y + (this._height + 4)*li);
        }else{
          if (this.rect != null) {
            _ctx.rect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
            _ctx.clip();
          }
          _ctx.fillText( _texts ,this.x,this.y + (this._height + 4)*li,this.maxWidth);
          _ctx.strokeStyle = "black";
          if (this.color == "black") _ctx.strokeStyle = "white";
          //_ctx.strokeText( _texts ,this.x,this.y + (this._height + 4)*li,this.maxWidth);
        }
      }
    }else{
      this.render();
    }
    _ctx.restore();
    _ctx.closePath();
    
    this.onenterframe();
    
    this.x += this.vx;
    this.y += this.vy;
    
  }
  
  render(){
    if (this.x < -1 * this._width || this.x > canvas.width) return;
    if (this.y < -1 * this._height || this.y > canvas.height + this._height) return;
    //テキストを表示
    if(this.maxWidth == null){
      if (this.rect != null) {
        ctx.rect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
        ctx.clip();
      }
      ctx.fillText(this.text,this.x,this.y);
      ctx.strokeStyle = "black";
      if (this.color == "black") ctx.strokeStyle = "white";
      //ctx.strokeText(this.text,this.x,this.y);
      
    }else{
      if (this.rect != null) {
        ctx.rect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
        ctx.clip();
      }
      ctx.fillText(this.text,this.x,this.y,this.maxWidth);
      ctx.strokeStyle = "black";
      if (this.color == "black") ctx.strokeStyle = "white";
      //ctx.strokeText(this.text,this.x,this.y,this.maxWidth);
      
    }
  }
  
  onenterframe(){}
  
  touchevent(){}
  
  gethani(){
    const _ctx = canvas.getContext('2d');
    _ctx.beginPath();
    
    _ctx.font = this.weight + ' ' + this.size + 'px ' + this.font;
    _ctx.textBaseline = this.baseline;
    
    this._width = _ctx.measureText(this.text).width;
    if(this.maxWidth != null){
      if(this._width > this.maxWidth)this._width = this.maxWidth;
    }
    this._height = Math.abs(_ctx.measureText(this.text).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);
    _ctx.closePath();
    
    if(this.max == 0)return [this.x,this.x + this._width,this.y,this.y + this._height];
    
    //this.max>0の場合
    let howmanylines = Math.ceil(this.text.length / this.max);
    let re = [this.x,0,this.y,this.y + (this._height + 4) * howmanylines];

    for (let li = 0; li < howmanylines; li++) {
      let _texts = this.text.substr(li * this.max, this.max);
     // _ctx.fillText(_texts, this.x, this.y + (this._height + 4) * li);
     _ctx.beginPath();
     
     _ctx.font = this.weight + ' ' + this.size + 'px ' + this.font;
     _ctx.textBaseline = this.baseline;
     
     re[1] = Math.max(Number( _ctx.measureText(_texts).width ) ,re[1] );
     if(li == howmanylines -1){
       re[3] += Math.abs(_ctx.measureText(_texts).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(_texts).actualBoundingBoxDescent);
     }
     _ctx.closePath();
    }
    if(this.maxWidth != null){
      if(re[1] > this.maxWidth)re[1] = this.maxWidth;
    }
    re[1] += this.x;
    return re;
  }

  isTouched(_touch){
    let t = false;
    if(_touch.x >= this.gethani()[0] &&
       _touch.x <= this.gethani()[1] &&
       _touch.y >= this.gethani()[2] &&
       _touch.y <= this.gethani()[3])t=true;
    if(this.rect != null){
      if( _touch.x < this.rect[0] ||  _touch.x > this.rect[0] + this.rect[2] || _touch.y < this.rect[1] || _touch.y > this.rect[1] + this.rect[3] )t = false;
    }
    return [_touch.type,t];
    

  }
  
  returnWidthAndHeight(){
        const _ctx = canvas.getContext('2d');
        _ctx.beginPath();
    
        _ctx.font = this.weight + ' ' + this.size + 'px ' + this.font;
        _ctx.textBaseline = this.baseline;
    
        this._width = _ctx.measureText(this.text).width;
        if(this.maxWidth != null){
          if(this._width > this.maxWidth)this._width = this.maxWidth;
        }
        this._height = Math.abs(_ctx.measureText(this.text).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);
        _ctx.closePath();
       if(this.max == 0)  return[this._width,this._height];
       
      //this.max>0の場合
      let hani = this.gethani();
      if(this.rect != null){
        if(hani[0] < this.rect[0])hani[0] = this.rect[0];
        if(hani[2] < this.rect[1])hani[2] = this.rect[1];
        if(hani[1] > this.rect[0] + this.rect[2])hani[1] = this.rect[0] + this.rect[2];
        if(hani[3] > this.rect[1] + this.rect[3])hani[3] = this.rect[1] + this.rect[3];
      }
      return [hani[1] - hani[0],hani[3] - hani[2]];
       
  }
}

class Sprite {
  constructor(imgobj , x = 0, y = 0,width = null,height = null,ix = null,iy = null,iw = null,ih = null) {
    this.img = imgobj
    this.x = x;
    this.y = y;
    this.width = this.img.width;
    if(width != null)this.width = width;
    if(width == null && iw != null)this.width = iw;
    this.height = this.img.height;
    if(height != null)this.height = height;
    if(height == null && ih != null)this.height = ih;
    this.hidden = false;
    this.vx = this.vy = 0; //移動速度
    this.globalAlpha = 1;
    this.rect = null;//[x,y,w,h]を設定。描画範囲
    
    this.ix = null;
    if(ix != null){
      this.ix = ix;
      this.iy = iy;
      this.iw = iw;
      this.ih = ih;
    }
    
    if (x == "half") {
      this.x = (canvas.width - this.width)/2;
    }
    if (y == "half") {
      this.y = (canvas.height - this.height) / 2;
    }
    
    this.fall = 0; //BattleSceneのbrickの落下で使用。→使わなかった
    this.fallpx = 0; //this.fallを設定するとthis.heightを自動的に掛けて算出する
  }

  update() {
    if (this.hidden == false) {
      if (this.fall > 0) {
        this.fallpx = this.fall * this.height;
        this.fall = 0;
      }
      
      this.onenterframe();
      this.render();


      this.x += this.vx;
      this.y += this.vy;
      if(this.fallpx > 0){
        this.y += this.height / 8;
      }
      if(this.fallpx < 0){
        this.fallpx = 0;
      }
    }
  }

  render() {
    ctx.beginPath();
    ctx.save();
    ctx.globalAlpha = this.globalAlpha;
    if(this.rect != null){
      ctx.rect(this.rect[0],this.rect[1],this.rect[2],this.rect[3]);
      ctx.clip();
    }
    
    if(this.ix == null){
      ctx.drawImage(this.img, this.x, this.y,this.width,this.height);
    }else{
      ctx.drawImage(this.img,this.ix,this.iy,this.iw,this.ih, this.x, this.y,this.width,this.height);
    }
    ctx.restore();
    ctx.closePath();

  }
  
  isTouched(_touch) {
    let t = false;
    if (_touch.x >= this.x &&
      _touch.x <= this.x + this.width &&
      _touch.y >= this.y &&
      _touch.y <= this.y + this.height) t = true;
    if (this.rect != null) {
      if (_touch.x < this.rect[0] || _touch.x > this.rect[0] + this.rect[2] || _touch.y < this.rect[1] || _touch.y > this.rect[1] + this.rect[3]) t = false;
    }
    return [_touch.type, t];
  
  
  }
  
  touchevent(){}

  onenterframe() {}

}

class Rect{
  constructor(x,y,width,height,isStroke = true,color = "white"){
  this.x = x;;
  this.y = y;
  this.width = width;
  this.height = height;
  this.hidden = false;
  this.vx = 0;
  this.vy = 0; //移動速度
  this.globalAlpha = 1;
  this.color = color;
  this.isStroke = isStroke;
  this.lineWidth = 2;
  this.rect = null;
  
  }
  
  update() {
    if (this.hidden == false) {
      this.onenterframe();
      this.render();
  
  
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  
  render() {
    ctx.beginPath();
    if(this.isStroke == false){
      ctx.save();
      if(this.rect != null){
        ctx.rect(this.rect[0],this.rect[1],this.rect[2],this.rect[3]);
        ctx.clip();
      }
      ctx.closePath();
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.globalAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }else{
      ctx.save();
      if (this.rect != null) {
        ctx.rect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
        ctx.clip();
      }
      ctx.closePath();
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      ctx.globalAlpha = this.globalAlpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    ctx.closePath();
  
    
  }
  
  isTouched(_touch){
    let t = false;
    if (_touch.x >= this.x &&
      _touch.x <= this.x + this.width &&
      _touch.y >= this.y &&
      _touch.y <= this.y + this.height) t = true;
    if (this.rect != null) {
      if (_touch.x < this.rect[0] || _touch.x > this.rect[0] + this.rect[2] || _touch.y < this.rect[1] || _touch.y > this.rect[1] + this.rect[3]) t = false;
    }
    return [_touch.type, t];
  }
  
  touchevent(){}
  
  onenterframe() {}
  
}

class Line {
  constructor(startx, starty, endx, endy, color = "white", width = 2) {
    this.startx = startx;
    this.starty = starty;
    this.endx = endx;
    this.endy = endy;
    this.color = color;
    this.width = width;
    this.hidden = false;
    this.globalAlpha = 1;
  }

  update() {
    if (this.hidden == true) return;
    this.render();
    this.onenterframe();

  }

  render() {
    var context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(this.startx, this.starty);
    context.lineTo(this.endx , this.endy);
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.lineCap = "round";
    if (this.globalAlpha != 1) context.globalAlpha = this.globalAlpha;
    context.stroke();
  }

  onenterframe() {}
  touchevent(){}
}

class Sankaku {
  constructor(startx, starty,secondx,secondy, endx, endy, color = "white", width = 2) {
    this.startx = startx;
    this.starty = starty;
    this.secondx = secondx;
    this.secondy = secondy;
    this.endx = endx;
    this.endy = endy;
    this.color = color;
    this.width = width;
    this.hidden = false;
    this.globalAlpha = 1;
  }

  update() {
    if (this.hidden == true) return;
    this.render();
    this.onenterframe();

  }

  render() {
    var context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(this.startx, this.starty);
    context.lineTo(this.secondx,this.secondy);
    context.lineTo(this.endx, this.endy);
    context.fillStyle = this.color;
    context.lineWidth = this.width;
    if (this.globalAlpha != 1) context.globalAlpha = this.globalAlpha;
    context.fill();
    context.closePath();
  }

  onenterframe() {}
  touchevent() {}
}

class GachaCardSprite extends Sprite{
  constructor(imgobj , x = "half", y = 180,width = 90,height = 90 * 4/3,mode = 108,nanbanme = 0,_rea = "N"){
    super(imgobj,x,y,width,height);
    this.num = nanbanme;
    this.mode = mode;
    this.frame = 0;
    this.stop = false;
    this.afterimg = imgobj;
    this.img = new Image();
    this.img.src = "./cardimage/back.png";
    if(_rea == "N")this.img.src = "./cardimage/backN.png";
    if(_rea == "SSR")this.img.src = "./cardimage/backSSR.png";
    this.keyFrame = [50,50 + 120,170 + 120];
    this.mekuriWidth = 160; //めくる処理で使う
  }
  render() {
    if(this.stop == false){
      this.frame ++;
      if(this.mode == 108)this.frame += 1;
    }
    if(this.frame > 0 && this.frame < this.keyFrame[0]){
      let needframe = this.keyFrame[0];
      this.rect = [canvas.width/2 - 45* Math.sin(Math.PI /2 * this.frame / needframe ),180, 90 * Math.sin(Math.PI /2 * this.frame / needframe ),160];
    }else if(this.keyFrame.includes(this.frame)){
      this.stop = true;
      setTimeout(()=>{this.stop = false},400);
    }else if(this.frame > this.keyFrame[0] && this.frame < this.keyFrame[1]){
      this.rect = null;
      this.width =90 +  70 * (this.frame -this.keyFrame[0])/(this.keyFrame[1] - this.keyFrame[0]);
      this.height = this.width *4/3;
      this.x = (canvas.width - this.width)/2;
      this.y = 180 + 10/(50-250/3) /(50-250/3) * (this.frame - 250/3) * (this.frame -250/3)-10; //最終的なy座標は180 + 30
    }else if(this.frame > this.keyFrame[1] && this.frame < this.keyFrame[2]){
      if(this.mode == 108){
        //定位置につく
        let _x = this.num % 12;
        let _y = Math.floor(this.num / 12);
        let afterx = 5 + (canvas.width - 10)/12 * _x;
        let afterw = (canvas.width - 10)/12;
        let afterh = afterw * 4/3;
        let aftery = 120 + (afterh + 2) * _y;
        let beforew = 160;
        let beforex = (canvas.width - 160)/2;
        let beforey = 180 + 10/(50-250/3) /(50-250/3) * (this.keyFrame[1] - 250/3) * (this.keyFrame[1] -250/3)-10;
        let beforeh = beforew * 4/3;
        let startframe = 170;
        let endframe = this.keyFrame[2];
        //めくりながら移動する
        //まず移動だけを考えてから、めくるためのwidthとxの変化を付加する
        this.x = beforex + (afterx - beforex) * (this.frame - startframe)/(endframe - startframe);
        this.y = beforey + (aftery - beforey) * (this.frame - startframe)/(endframe - startframe);
        this.width = beforew + (afterw - beforew) * (this.frame - startframe) /(endframe - startframe);
        this.height = beforeh + (afterh - beforeh) * (this.frame - startframe)/(endframe - startframe);
        let keisanWidth =  this.width * ( Math.abs(- (this.frame - startframe) + (endframe - startframe)/2) ) / ((endframe - startframe)/2);
        this.x += (this.width - keisanWidth) /2;
        this.width = keisanWidth;
        if(this.width == 0)this.img = this.afterimg;
      }
    }
    
    ctx.beginPath();
    ctx.save();
    ctx.globalAlpha = this.globalAlpha;
    if (this.rect != null) {
      ctx.rect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
      ctx.clip();
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
    ctx.closePath();
  
  }
}


function viewportSet() {
  var ww = window.innerWidth;
  var wh = window.innerHeight;

  var cw = canvas.width
  var ch = canvas.height

  if (ww / wh >= cw / ch) {
    // windowのwidthが長い
    document.querySelector("meta[name='viewport']").setAttribute("content", "width=" + (ch * ww / wh));
  } else {
    // それ以外
    document.querySelector("meta[name='viewport']").setAttribute("content", "width=" + cw);
  }
}
window.addEventListener("DOMContentLoaded", viewportSet, false);
window.addEventListener("resize", viewportSet, false);
window.addEventListener("orientationchange", viewportSet, false);
window.addEventListener('devtoolschange', event => {

  window.location.replace('https://www.donotusedevtoolplease.com/');

});

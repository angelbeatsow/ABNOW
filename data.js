function copyObj(obj){
  return Object.assign({}, JSON.parse(JSON.stringify( obj )));
}

const titleImage = new Image();
titleImage.src = "./skillImage/title.jpg";

const charactors = [
  "ゆり","かなで","音無","ユイ","日向","直井","岩沢","ひさ子","関根","入江","椎名","遊佐","大山","野田","藤巻","高松","松下","TK","竹山"
];
  
const WEAKBAIRITSU = 3/2;
const RESISTBAIRITSU = 1/2;
const zokusei = ["赤","緑","青","黄","紫","心"];
const brickColor = ["#e33","#3e3","#5af","#dd0","#727","#f9f"];
const brickImages = [];
for (var i = 0; i < 6; i++) {
  let _src = ["./brickImage/red.png","./brickImage/green.png","./brickImage/blue.png","./brickImage/yellow.png","./brickImage/purple.png","./brickImage/heart.png"];
  let _img = new Image();
  _img.src = _src[i];
  brickImages.push(_img);
}
const reality = ["N","R","SR","SSR"];
const bukiSkill = [
    "このターンに与えるダメージ小アップ",
    "このターンに与えるダメージ中アップ",
    "このターンに与えるダメージ大アップ",
    "縦一列のブロックを消すスキル",
    "横一列のブロックを消すスキル",
    "縦横一列のブロックを消すスキル",
    "周囲の4ブロックを消すスキル",
    "周囲の8ブロックを消すスキル",
    "周囲の12ブロックを消すスキル",
    "少しのブロックを自属性の色に変化させる",
    "多くのブロックを自属性の色に変化させる",
    "自属性のブロックを全て消すスキル"
];
let bukiSkillCostNum = 10;
let bukiSkillCost = [bukiSkillCostNum,bukiSkillCostNum *2,bukiSkillCostNum *3,
  bukiSkillCostNum,bukiSkillCostNum,bukiSkillCostNum *2,
  bukiSkillCostNum,bukiSkillCostNum *2,bukiSkillCostNum *3,
  bukiSkillCostNum,bukiSkillCostNum *2,bukiSkillCostNum *3
];
//bukiSkillCost = [1,1,1,1,1,1,1,1,1,1,1,1]; //テスト用
let bukiSkillImage = [];
for (var i = 1; i <= bukiSkill.length; i++) {
  let _img = new Image();
  _img.src = "./skillImage/skill" + i + ".png";
  bukiSkillImage.push(_img);
}

function returnRandomBukiSkillByReality(_reality){
  let _n = [0,3,4,6,9];
  let _r = [1,5,7,10];
  let _sr = [2,8,11];
  let _skill = [_n,_r,_sr];
  let ran = randomNum(0,_skill[reality.indexOf(_reality)].length -1);
  return _skill[reality.indexOf(_reality)][ran];
  
}

const leaderSkill1 = [
  "",
  "自身のメンバーが男性だけのとき",
  "自身のメンバーが女性だけのとき",
  "自身のメンバーが岩沢/ひさ子/関根/入江/ユイのとき",
  "HPが50%以下で",
];
const leaderSkill2 = [
    "",
    "全員の",
    "赤属性の",
    "緑属性の",
    "青属性の",
    "黄属性の",
    "紫属性の",
    "赤属性からの",
    "緑属性からの",
    "青属性からの",
    "黄属性からの",
    "紫属性からの"
];
const leaderSkill3 = [
  "Atk1.8倍",//ssr,全員や属性
  "Rcv1.5倍",//sr,属性
  "全ステータス1.3倍", //ssr
  "Atk,Rcv1.7倍",//ssr,hp50%以下
  "操作時間+2秒",//sr
  "操作時間+3秒",//ssr
  "バトル開始時敵のHPを30%減らす",
  "バトル開始時敵の攻撃ターン数に+2",//sr
  "Atk1.3倍、バトル開始時敵の攻撃ターン数に+1", //ssr,全員
  "ハイテンションゲージの上昇率1.5倍",//ssr
  "敵に与えたダメージの5%をHPに吸収する",//ssr
  "ダメージ-25%",//sr,属性からの
  "即死ダメージ時、一度だけHPが1残る"
];
  
class Card {
  constructor(_cardNum,_lv = 1,_jukurendo = 0,_kakusei = 0){
    let thisCard = cards[getCardIndexByNum(_cardNum)];
    this.no = thisCard.no;
    this.name = thisCard.name;
    this.zokusei = thisCard.zokusei;
    this.charactor = thisCard.charactor;
    this.readerSkill = [].concat(thisCard.readerSkill);
    this.cost = thisCard.cost;
    this.hp = thisCard.hp;
    this.atk = thisCard.atk;
    this.rcv = thisCard.rcv;
    this.jukurendo = _jukurendo;
    this.lv = _lv;
    this.reality = thisCard.reality;
    this.maxlv;
    if(this.reality == "N")this.maxlv = 40;
    if(this.reality == "R")this.maxlv = 60;
    if(this.reality == "SR")this.maxlv = 80;
    if(this.reality == "SSR")this.maxlv = 100;
    this.kakusei = _kakusei;
    this.maxlv += 5 * this.kakusei;
    this.exp = 0;
    this.charactorSetteiSet = 0;//キャラクター設定に設定したら番目の値になる
    this.favorite = false;
    this.illustrator = thisCard.illustrator;
    this.home = [].concat(thisCard.home);
    
    this.img = [new Image(),new Image()];
    this.img[0].src = "./cardimage/" + this.reality + "_" + charactors.indexOf(this.charactor) + "_" + this.no + ".png";
    this.img[1].src = "./cardimage_small/" + this.reality + "_" + charactors.indexOf(this.charactor) + "_" + this.no + "_small.png";
  }
    
}
  
class Buki{
  constructor(_bukiNum,_skill = 0,_reality = "N"){
      let thisBuki = bukis[getBukiIndexByNum(_bukiNum)];
      this.name = thisBuki.name;
      this.hp = thisBuki.hp;
      this.atk = thisBuki.atk;
      this.rcv = thisBuki.rcv;
      this.skill = _skill;
      if("skill" in thisBuki)this.skill = thisBuki.skill;
      this.reality = _reality;
      if ("reality" in thisBuki) this.reality = thisBuki.reality;
      this.kakusei = 0;
      this.soubiCharactor = null;
  }
}
  
function getCardIndexByNum(num){
  for (var i = 0; i < cards.length; i++) {
    if(cards[i].num == num )return i;
  }
}
  
function getBukiIndexByNum(num) {
  for (var i = 0; i < bukis.length; i++) {
    if (bukis[i].num == num) return i;
  }
}

function returnBukiHyouji(bukiobj,_y = 0){
  let _re = [];
  let _rect = new Rect(30,0 + _y,canvas.width - 60,64);
  _re.push(_rect);
  let _skillimg = new Sprite(bukiSkillImage[bukiobj.skill],canvas.width - 30 -20,_y,20,20);
  _re.push(_skillimg);
  let _rect2 = new Rect(30 + 4,_y + 4,56,56);
  _re.push(_rect2);
  let _rea = new Text(bukiobj.reality,30 + 4 + 56 -4,_y + 4 +4,14);
  _rea.x -= _rea.returnWidthAndHeight()[0];
  _re.push(_rea);
  let _name = new Text(bukiobj.name,30 + 4 + 56 + 4,_y + 4,14);
  _re.push(_name);
  let _skill = new Text(bukiSkill[bukiobj.skill],30 + 4 + 56 + 4,_y + 4 + 20,14,_rect.width - 4-56-4-4);
  _re.push(_skill);
  let _ste = ["HP","ATK","RCV"];
  let _ste2 = ["hp","atk","rcv"];
  for (var i = 0; i < 3; i++) {
    let _hp = new Text(_ste[i] + ":+" + bukiobj[_ste2[i]],30 + 4 + 56 + 4 + (_rect.width  - ( 4 + 56 + 4 +4) )/3*i,_y + 4 + 20*2,16,(_rect.width - (4 + 56 + 4 + 4) )/3);
    _re.push(_hp);
  }
  return _re;
  
}

  
const bukis = [
  {
    num:0,
    name:"ギター",
    hp:0,
    atk:0,
    rcv:0,
  }
];
  
const cards = [
  {
    num:0,
    no:"001",
    name:"[ふふふふふふふふふふふふふふふふふっ]ゆり",
    charactor:"ゆり",
    zokusei:"赤",
    reality: "N",
    leaderSkill:[null],
    cost:4,
    hp:100,
    atk:100,
    rcv:10,
    illustrator:"abnow",
    home:[75,100,430,430 * 320/384] //ホーム画面の384*320に表示.ix,iy,iw,ih
    
      
  },
  {
    num: 1,
    no: "002",
    name: "[闇夜の刃]かなで",
    charactor: "かなで",
    zokusei: "紫",
    reality: "SR",
    leaderSkill: [null],
    cost: 8,
    hp: 150,
    atk: 150,
    rcv: 5,
    illustrator: "abnow",
    home: [85, 150, 430, 430 * 320 / 384] //ホーム画面の384*320に表示.ix,iy,iw,ih
  
  
  }
];
let nCards = [];
let rCards = [];
let srCards = [];
let ssrCards = [];
for (var i = 0; i < cards.length; i++) {
  if(cards[i].reality == "N")nCards.push(cards[i]);
  if(cards[i].reality == "R")rCards.push(cards[i]);
  if(cards[i].reality == "SR")srCards.push(cards[i]);
  if(cards[i].reality == "SSR")ssrCards.push(cards[i]);
}
let reabetsuCards = [nCards,rCards,srCards,ssrCards];



const enemies = [
  {},
  
  {
    no:1,
    hp:1000,
    atk:100,
    interval:2,
    imgWH:1/2,//画像の比率。横/縦
    imgsrc:"./enemyImage/e1_"  // + zokusei.indexOf("赤") + ".png"をクラスで行う
  },
  {
    no: 2,
    hp: 100000,
    atk: 100,
    interval: 1,
    imgWH: 1 / 2, //画像の比率。横/縦
    imgsrc: "./enemyImage/e1_" // + zokusei.indexOf("赤") + ".png"をクラスで行う
  }
  
];

class Enemy {
  constructor(num,_zokusei = "赤",_syokiInterval = null){
    let _ene = enemies[num];
    this.hp = _ene.hp;
    this.maxhp = _ene.hp;
    this.zokusei = _zokusei;
    this.atk = _ene.atk;
    this.interval = _ene.interval;
    this.syokiInterval = this.interval;
    if(_syokiInterval != null)this.syokiInterval = _syokiInterval;
    this.nowInterval = this.syokiInterval;
    this.imgWH = _ene.imgWH;
    this.img = new Image();
    this.img.src = _ene.imgsrc + zokusei.indexOf(_zokusei) + ".png";
  }
  
  damebairitsu(atackedZokusei){
    if(this.zokusei == "赤"){
      if(atackedZokusei == "青")return WEAKBAIRITSU;
      if(atackedZokusei == "緑")return RESISTBAIRITSU;
      return 1;
    }else if(this.zokusei == "青"){
      if (atackedZokusei == "緑") return WEAKBAIRITSU;
      if (atackedZokusei == "赤") return RESISTBAIRITSU;
      return 1;
    }else if (this.zokusei == "緑") {
      if (atackedZokusei == "赤") return WEAKBAIRITSU;
      if (atackedZokusei == "青") return RESISTBAIRITSU;
      return 1;
    }else if (this.zokusei == "黄") {
      if (atackedZokusei == "紫") return WEAKBAIRITSU;
      return 1;
    }else if (this.zokusei == "紫") {
      if (atackedZokusei == "黄") return WEAKBAIRITSU;
      return 1;
    }
  }
  
  returnWeakZokusei(){
    if (this.zokusei == "赤") {
      return "青";
    } else if (this.zokusei == "青") {
      return "緑";
    } else if (this.zokusei == "緑") {
      return "赤";
    } else if (this.zokusei == "黄") {
      return "紫";
    } else if (this.zokusei == "紫") {
      return "黄";
    }
  }
  
  returnResistZokusei() {
    if (this.zokusei == "赤") {
      return "緑";
    } else if (this.zokusei == "青") {
      return "赤";
    } else if (this.zokusei == "緑") {
      return "青";
    } else if (this.zokusei == "黄") {
      return null;
    } else if (this.zokusei == "紫") {
      return null;
    }
  }
}

const places = [
  {
    no:1,
    name:"チュートリアル",
    stage:[0,1,2,3,4] //stagesのno
  },
  {
    no:2,
    name:"どっか",
    stage:[5]
  }
];

const stages = [
  {
    place: "チュートリアル",
    name:"ステージ1",
    getBeats:100,
    getExp:10,
    getItems : [1,1,1], //肉、オム、カレー
    getCatds : [0],
    brick:["赤","黄","緑","青","紫","心"],
    bgImgSrc:null,
    kaisou: 2,
    enemy: [
        [[1,"赤"],[1,"緑"],[1,"青"]],
        [[1,"黄"],[1,"紫"]]
      ]
  },
  {
    place: "チュートリアル",
    name: "ステージ2",
    getBeats:1000,
    getExp:10,
    brick: ["赤",  "青", "紫", "心"],
    bgImgSrc:null,
    kaisou: 1,
    enemy: [
        [[1,"赤"],[1,"赤"],[1,"赤"],[1,"赤"],[1,"赤"]]
      ]
  },
  {
    place: "チュートリアル",
    name: "ステージ3",
    getExp:100,
    getCards:[0,0,0],
    getItems : [100,100,100], //肉、オム、カレー,
    useableHeight:5,
    brick: ["赤"],
    bgImgSrc:null,
    kaisou: 1,
    enemy: [
          [[2,"緑"]]
        ]
  },
  {
    place: "チュートリアル",
    name: "ステージ4",
    startHighTensionPoint :100,
    brick: ["赤", "黄", "緑", "青", "紫", "心"],
    bgImgSrc:null,
    kaisou: 1,
    enemy: [
          [ [1, "紫"]]
        ]
  },
  {
    place: "チュートリアル",
    name: "ステージ5",
    getBeats: 100,
    getExp: 200,
    getItems: [200, 200, 200], //肉、オム、カレー
    brick: ["赤",  "緑", "青","心"],
    bgImgSrc:null,
    kaisou: 1,
    enemy: [
         [ [1, "紫"],[1, "黄"],[1, "紫"]]
        ]
  },
  {
    place: "どっか",
    name: "ステージ1",
    getBeats: 100,
    getExp: 200,
    getItems: [20, 20, 20], //肉、オム、カレー
    brick: ["赤",  "紫","心"],
    bgImgSrc:null,
    kaisou: 5,
    enemy: [
         [[1,"赤"]],
         [[1,"青"]],
         [[1,"緑"]],
         [[1,"紫"],[1,"黄"]],
         [ [1, "赤"],[1, "青"],[1, "緑"],[1,"紫"],[1,"黄"]]
        ]
  }
];


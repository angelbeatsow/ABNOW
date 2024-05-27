

class TitleScene extends Scene{
  constructor(){
    super();
    this.add(new Sprite(titleImage,0,0,canvas.width,canvas.height),1);
    this.add(new Text("Ancient Beats!!","half",40,30));
    this.add(new Text("Not Official Wars","half",80,24));
    this.add(new Text("TAP to start!","half",460,25));
    this.add(new Text("ver1.0.0",10,canvas.height - 20,15));
    let hikoushikidesu = new Text("※非公式です",5,5,15);
    let hiWH = hikoushikidesu.returnWidthAndHeight();
    this.add(new Rect(0,0,hiWH[0] +10,hiWH[1] +10,false,"black"));
    this.add(hikoushikidesu,1);
  } 
  touchevent(){
    if(touch.type == "touchstart" && user.name != ""){
      this.flag++;
      game.blackoutFunction(menuScene);
    }
  }
}

class MenuScene extends Scene{
  constructor(){
    super();

    this.isLoginBonusFinished = false;
    
    this.menuNum = 1;
    this.scroll = 0; //スクロール値。y座標のずれ。メニュー画面を遷移すると0になる。
    this.lastY = 0; //scrollの計算用
    this.scroll2 = 0;
    this.lastY2 = 0;
    this.soubiSetteiScroll = 0;
    this.lastY3 = 0;
    
    this.charactorNum = null;//キャラクターを選択した時に使用
    
    this.operationNum = [0,0]; //menuNum1.1オペレーション画面で使用。[places.index,stages.index]
    this.isBackToOperation = false;//オペレーションのチーム編成からキャラクター設定に飛んだかどうか
    
    this.charactorSettei = null//nullならuser.returnCardsByCharactorNum(charaNum,true)でとってくる。カード4枚と武器の配列
    this.charactorCardsForCardIrekae = []; // menuNum2.211用。特定キャラの所持カード一覧。
    this.kouhoForCardIrekae = [null,null,null,null]; //menuNum2.211用。上記のindex番号を入れる。
    this.targetCardForCardIrekae = null;
    this.pageForCardIrekae = 1;
    this.maxpageForCardIrekae = 1;
    
    this.lastMenuNum = null; //戻るページを記録。必要なときだけ使う。
    
    this.cardsForCardsyousai = [];
    this.cardnumForCardsyousai = 0;
    
    this.syokkenMaisuuForSoubikaihatsu = [0,[0,0,0],[0,0,0],[0,0,0]] //選択されている枚数。menuNum == 3.1
    this.syokkenSliderForSoubikaihatsu = [0,[0,0,0],[0,0,0],[0,0,0]] //スワイプされているy座標
    this.getSoubi;
    
    this.senka = []; //バトルから戻った後に使用。this.menuNum == 7
    
    
    game.wait += 100;
    
    this.setBasicItems();
    
    
  }
  
  setBasicItems(){
    let menuName = ["ホーム", "戦線", "装備", "ショップ", "ガチャ", "その他"];
    for (var i = 0; i < menuName.length; i++) {
      this.add(new Rect(canvas.width / menuName.length * i, canvas.height - 50, canvas.width / menuName.length, 50, false, "#c00"), 0);
      let _text = new Text(menuName[i], 0, 0, 15);
      _text.x = canvas.width / menuName.length * i + (canvas.width / menuName.length - _text.returnWidthAndHeight()[0]) / 2;
      _text.y = canvas.height - 20;
      this.add(_text, 0);
      let _rect = new Rect(canvas.width / menuName.length * i, canvas.height - 50, canvas.width / menuName.length, 50);
      _rect.menuNum = i + 1;
      _rect.touchevent = () => {
        if(this.menuNum == 7 || this.menuNum == 7.1)return; //戦果画面なら反応しない
        if (isClick(_rect) == true) {
          this.charactorSettei = null;
          game.wait += 10;
          this.scroll = 0;
          this.isBackToOperation = false;
          this.menuNum = _rect.menuNum;
        }
      }
      this.add(_rect, 0);
    }
    this.add(new Rect(0, 0, canvas.width, 70, false, "#710"), 0);
    this.add(new Rect(0, 0, 60, 70), 0);
    this.add(new Rect(250 - 4, 50 - 4, 125, 20), 0);
    this.add(new Rect(80 - 4, 50 - 4, 110, 20), 0);
    this.add(new Text("Lv", 36, 52, 15), 0);
    this.add(new Text("AP ∞", 230, 10, 15), 0);
    let apRect = new Rect(230, 28, 200, 5, false);
    apRect.color = "orange";
    this.add(apRect, 0);
    this.add(new Text("B!", 250, 50, 14), 0);
  }
  
  update(){
    this.setScene(this.menuNum);
    super.update();
  }
  
  touchevent(){
    if(this.isLoginBonusFinished == false){
      if(touch.type == "touchstart"){
        game.wait += 10;
        user.ticket++;
        let date = new Date();
        let theYear = date.getFullYear();
        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        user.lastLoginDay = [theYear,theMonth,theDate];
        this.isLoginBonusFinished = true;
      }
    }else{
      super.touchevent();
    }
  }
  
  setScene(_menuNum){
    this.sceneItems = [];
    
    this.add(new Text(user.lv, 13, 20, 30, 60), 1);
    let sensenNametext = new Text(user.sensenName + "戦線", 80, 10, 20);
    const sensenNameMaxLength = 120;
    if (sensenNametext.returnWidthAndHeight()[0] > sensenNameMaxLength) {
      sensenNametext = new Text(user.sensenName + "戦線", 80, 10, 20, sensenNameMaxLength);
    } 
    this.add(sensenNametext, 1);
    
    
    let nametext = new Text(user.name, 80, 50, 14);
    const nameMaxLength = 100;
    if (nametext.returnWidthAndHeight()[0] > nameMaxLength) {
      nametext = new Text(user.name, 80, 50, 14, nameMaxLength);
    } 
    this.add(nametext, 1);
    
    let btext = new Text(user.b, canvas.width - 20, 50, 14);
    btext.x = canvas.width - 20 - btext.returnWidthAndHeight()[0];
    this.add(btext, 1);
    
    this.add(new Text(this.menuNum, 0, 570), 1); //メニュー番号の描画。確認用
    
    if(_menuNum == 1){
      //ホーム画面
      if(user.sensen[0] != null){
        let _leader = user.returnCardsByCharactorNum(user.sensen[0],true)[0];
        if(_leader != null){
          this.add(new Sprite(_leader.img[0],0,70,384,320,_leader.home[0],_leader.home[1],_leader.home[2],_leader.home[3]),1);
        }
      }else{
        //テスト用
        let _leader = new Card(1);
        this.add(new Sprite(_leader.img[0],0,70,384,320,_leader.home[0],_leader.home[1],_leader.home[2],_leader.home[3]),1);
        
      }
      
      
      let _syokkenName = ["麻婆","肉う","オム","カレ"];
      for (var i = 0; i < 4; i++) {
        this.add(new Text(_syokkenName[i],canvas.width - 35,80+20*i,14),1);
        let _syokkensuu = user.syokken[i];
        let _syokkensuuTxt = new Text(_syokkensuu,canvas.width - 40,80 +20*i,14);
        _syokkensuuTxt.x -= _syokkensuuTxt.returnWidthAndHeight()[0];
        this.add(_syokkensuuTxt,1);
      }
      this.add(new Rect(-4,390,canvas.width + 8,70,true,"white"),1);
      let opeRect = new Rect(20 +20,400,canvas.width/2-20-20 -40,50,false,"#29c");
      opeRect.touchevent = ()=>{
        if(isClick(opeRect)){
          game.wait += 10;
          this.menuNum = 1.1;
        }
      };
      this.add(opeRect,1);
      this.add(new Sankaku(40,400,40,450,20,425,"#29c"),1);
      this.add(new Sankaku(canvas.width/2 -40,400,canvas.width/2 -40,450,canvas.width/2-40 +20,425,"#29c"),1);
      let opeText = new Text("オペレーション",20 +(canvas.width/2-20-20)/2 ,425 -5,16 );
      let opeWH = opeText.returnWidthAndHeight();
      opeText.x -= opeWH[0] /2;
      opeText.y -= opeWH[1] /2;
      this.add(opeText,1);
      let liveRect = new Rect(20 + canvas.width / 2 +20, 400, canvas.width / 2 - 20 - 20 -40, 50, false, "#c44");
      liveRect.touchevent = () => {
        if (isClick(liveRect)) {
          game.wait += 10;
          this.scroll = 0;
          this.menuNum = 1.2;
        }
      };
      this.add(liveRect, 1);
      this.add(new Sankaku(canvas.width / 2  +40, 400, canvas.width / 2  +40, 450, canvas.width / 2  +20, 425, "#c44"), 1);
      this.add(new Sankaku(canvas.width - 40, 400, canvas.width- 40, 450, canvas.width - 40 + 20, 425, "#c44"), 1);
      let liveText = new Text("ライブ", 20 + canvas.width / 2 + (canvas.width / 2 - 20 - 20) / 2, 425 - 5, 16);
      let liveWH = liveText.returnWidthAndHeight();
      liveText.x -= liveWH[0] / 2;
      liveText.y -= liveWH[1] / 2;
      this.add(liveText, 1);
      let tegamiRect = new Rect(10,86,30,30,false,"#5bf");
      tegamiRect.touchevent = ()=>{
        if(isClick(tegamiRect)){
          game.wait += 10;
          this.menuNum = 1.3;
        }
      };
      this.add(tegamiRect,1);
      let fureRect = new Rect(10, 86 + 40, 30, 30, false, "#f8c");
      fureRect.touchevent = () => {
        if (isClick(fureRect)) {
          game.wait += 10;
          this.menuNum = 1.4;
        }
      };
      this.add(fureRect, 1);
      
      
    }else if(_menuNum == 1.1){
      //オペレーション画面。this.scroll使用。
      this.addModoru(1,[]);
      
      let _placesuu = Math.min(user.clearPlace +1,places.length);
      //_placesuu = 10;  //テスト用
      let maxScroll = -(_placesuu -1) * 80;
      
      
      let nomaltxt = new Text("ノーマルオペレーション","half",90);
      nomaltxt.touchevent = ()=>{
        if(maxScroll == 0)return;
        //スクロールの処理
        if (touch.type == "touchstart") {
          this.lastY = touch.y;
        } else if (touch.type == "touchmove") {
          let _result = this.scroll - (this.lastY - touch.y);
          if (_result > 0) _result = 0;
          if (_result < maxScroll) _result = maxScroll;
          this.scroll = _result;
          this.lastY = touch.y;
        } else if (touch.type == "touchend") {
          this.lastY = 0;
        }
      };
      this.add(nomaltxt,1);
      
      for (var i = _placesuu -1; i >= 0; i--) {
        let _st = new Rect(20,canvas.height /2 - 15,canvas.width -40,70,false,"#888");
        _st.num = i;
        _st.y += this.scroll + 80*(_placesuu -1 - _st.num);
        _st.rect = [0,125,canvas.width,canvas.height - 180];
        _st.touchevent = ()=>{
          if(isClick(_st)){
            this.operationNum[0] = _st.num;
            this.scroll2 = 0;
            this.menuNum = 1.11;
          }
        }
        this.add(_st,1);
        let t = new Text(places[_st.num].name,30,canvas.height /2 +5 + this.scroll + 80*(_placesuu -1 - _st.num),20);
        t.rect = [0,125,canvas.width,canvas.height - 180];
        this.add(t,1);
      }
      
      
    }else if(_menuNum == 1.11){
      //オペレーションステージ選択
      this.addModoru(1.1,[]);
      
      let stnums =  places[this.operationNum[0]].stage;
      let _stagesuu = stnums.length;
      if(user.clearStage <= stnums[stnums.length -1] -1 && user.clearStage >= stnums[0])_stagesuu = stnums.indexOf(user.clearStage) +1;
      if(user.clearStage < stnums[0])_stagesuu = 1;

      
      let maxScroll = -(_stagesuu - 1) * 80;
     
     
      let nomaltxt = new Text(places[this.operationNum[0]].name, "half", 90);
      nomaltxt.touchevent = () => {
        if (maxScroll == 0) return;
        //スクロールの処理
        if (touch.type == "touchstart") {
          this.lastY2 = touch.y;
        } else if (touch.type == "touchmove") {
          let _result = this.scroll2 - (this.lastY2 - touch.y);
          if (_result > 0) _result = 0;
          if (_result < maxScroll) _result = maxScroll;
          this.scroll2 = _result;
          this.lastY2 = touch.y;
        } else if (touch.type == "touchend") {
          this.lastY2 = 0;
        }
      };
      this.add(nomaltxt, 1);
      this.add(new Rect(20,120,canvas.width -40,70,false,"#555"),1);
      this.add(new Text(places[this.operationNum[0]].name, 30, 120 +20 , 20), 1);
      
      
      for (var i = _stagesuu - 1; i >= 0; i--) {
        let hani = [0, 195, canvas.width, canvas.height - 180 -70];
        let _st = new Rect(20, canvas.height / 2 - 15, canvas.width - 40, 70, false, "#888");
        _st.num = i;
        _st.y += this.scroll2 + 80 * (_stagesuu - 1 - _st.num);
        _st.rect = [].concat(hani);
        _st.touchevent = () => {
          if (isClick(_st)) {
            this.operationNum[1] = _st.num;
            this.menuNum = 1.111;
          }
        }
        this.add(_st, 1);
        let t1 = new Text(stages[places[this.operationNum[0]].stage[_st.num]].name, 30, canvas.height / 2 + 5 + this.scroll2 + 80 * (_stagesuu - 1 - _st.num), 20);
        t1.rect = [].concat(hani);
        this.add(t1,1);
        let t2 = new Text("AP:  0 / バトル:  " + stages[places[this.operationNum[0]].stage[_st.num]].kaisou, 240, canvas.height / 2 + 35 + this.scroll2 + 80 * (_stagesuu - 1 - _st.num), 14);
        t2.rect = [].concat(hani);
        this.add(t2,1);
        let stageBrick = [].concat(stages[places[this.operationNum[0]].stage[i]].brick);
        for (var j = 0; j < stageBrick.length; j++) {
          let bsp = new Sprite(brickImages[zokusei.indexOf(stageBrick[j])],30 + 16*j,canvas.height / 2 + 35 + this.scroll2 + 80 * (_stagesuu - 1 - _st.num),16,16);
          bsp.rect = [].concat(hani);
          this.add(bsp,1);
        }
      }
      
      
    }else if(_menuNum == 1.111){
      //オペレーションのチーム編成
      this.addModoru(1.11,["charactorNum"]);
      this.add(new Text("チーム編成","half",90),1);
      
      this.add(new Rect(20,189 +10,canvas.width -40,64),1);
      for (var i = 0; i < 6; i++) {
        let sensenrect = new Rect((canvas.width - (58 + 3) * 6 + 3) / 2 + (58+3)*i,125 +2,58,58);
        sensenrect.sensenTargetNum = i;
        if(i != 5){
          sensenrect.touchevent = ()=>{
            if(isNagaoshi(sensenrect) == true){
              if(user.sensen[sensenrect.sensenTargetNum] != null){
                this.isBackToOperation = true;
                this.charactorNum = user.sensen[sensenrect.sensenTargetNum]
                this.menuNum = 2.21;
              }
            }
            
            if(isClick(sensenrect)==true){
              game.wait += 10;
              if(this.charactorNum != null){
                if(this.charactorNum == "はずす"){
                  user.sensen[sensenrect.sensenTargetNum]= null;
                }else{
                  if(user.sensen.includes(this.charactorNum) == false){
                    user.sensen[sensenrect.sensenTargetNum]= this.charactorNum;
                  }else {
                    //すでに設定されているなら入れ換える
                    let charaIndexAtSensen;
                    for (var ind = 0; ind < user.sensen.length; ind++) {
                      if (user.sensen[ind] == this.charactorNum) charaIndexAtSensen = ind;
                    }
                    if (charaIndexAtSensen != sensenrect.sensenTargetNum) {
                      user.sensen[charaIndexAtSensen] = user.sensen[sensenrect.sensenTargetNum];
                      user.sensen[sensenrect.sensenTargetNum] = this.charactorNum;
                    }
                  }
                }
                this.charactorNum = null;
              }
            }
          };
        }
        this.add(sensenrect,1);
        if(user.sensen[i] != null){
          if(user.returnCardsByCharactorNum(user.sensen[i],true)[0] != null){
            let charagazou = new Sprite(user.returnCardsByCharactorNum(user.sensen[i],true)[0].img[1],(canvas.width - (58 + 3) * 6 + 3) / 2 + (58+3)*i,125 +2,58,58);
            this.add(charagazou,1);
          }
          let _n = new Text(charactors[user.sensen[i]],(canvas.width - (58 + 3) * 6 + 3) / 2 + (58+3)*i,125 +2+44,14);
          _n.x += (58 - _n.returnWidthAndHeight()[0]) / 2;
          this.add(_n,1);
        }
        if(i == 0){
          let leadertxt = new Text("LEADER",(canvas.width - (58 + 3) * 6 + 3) / 2 + (58+3)*i,125 +2,12);
          leadertxt.x += (58 - leadertxt.returnWidthAndHeight()[0])/2;
          this.add(leadertxt,1);
        }
        if(i == 5){
          let leadertxt = new Text("ASSIST", (canvas.width - (58 + 3) * 6 + 3) / 2 + (58 + 3) * i, 125 + 2, 12);
          leadertxt.x += (58 - leadertxt.returnWidthAndHeight()[0]) / 2;
          this.add(leadertxt, 1);
        }
      }
      let sensenStatus = user.returnSensenStatus();
      for (var i = 0; i < 8; i++) {
        if(i == 1)continue;
        if(i == 0){
          this.add(new Text("HP:" + sensenStatus.hp,23,199+8 +5,14),1);
        }
        if(i >= 2){
          let _mark = new Sprite(brickImages[i -2],23 + (canvas.width -40 -6)/4*(i%4),199 + 8+ (64-6)/2*Math.floor(i/4),20,20);
          this.add(_mark,1);
          this.add(new Text(sensenStatus[zokusei[i -2]],23 + (canvas.width -40 -6)/4*(i%4) + 22,199 + 8+ (64-6)/2*Math.floor(i/4) +5,14),1);
        }
        
      }
      this.addCharactorsSelect(268,null,true);
      let kaisi = new Rect(100,545,200,30,false,"#e44");
      kaisi.touchevent = ()=>{
        if(isClick(kaisi)){
          if(sensenStatus.hp == 0){
            game.addMessage("キャラが設定されていません");
          }else if(user.sensen[0] == null){
            game.addMessage("リーダーが設定されていません");
          }else if(user.returnCardsByCharactorNum(user.sensen[0],true)[0] == null){
            game.addMessage("リーダーが設定されていません");
          }else{
            let kaisiFunc = ()=>{
              this.charactorNum = null;
              battleScene = new BattleScene(this.operationNum[1]);
              game.blackoutFunction(battleScene);
            };
            game.addConfirm("作戦を開始します!","開始","キャンセル",kaisiFunc);
          }
        }
      };
      this.add(kaisi,1);
      this.add(new Text("作戦開始",200 - 16*2,560-16/2,16),1);
    
      
      
    }else if(_menuNum == 2){
      //戦線画面
      for (var i = 0; i < 5; i++) {
        let _backrect = new Rect((canvas.width - 120)/2 -20,110 -10 + 60*i,120 +20*2,20 + 10*2,false,"gray");
        let _rect = new Rect((canvas.width - 120)/2 -20,110 -10 + 60*i,120 +20*2,20 + 10*2);
        _rect.menuNum = i +1;
        _rect.touchevent = ()=>{
          if(isClick(_rect) == true){
            game.wait += 10;
            this.menuNum = 2 + 0.1 * _rect.menuNum;
          }
        };
        this.add(_backrect,1);
        this.add(_rect,1);
      }
      this.add(new Text("戦線管理", "half", 110, 20, 120), 1);
      this.add(new Text("キャラクター編集", "half", 110 + 60 * 1, 20, 120), 1);
      this.add(new Text("カード育成", "half", 110 + 60 * 2, 20, 120), 1);
      this.add(new Text("カード売却", "half", 110 + 60 * 3, 20, 120), 1);
      this.add(new Text("カード一覧", "half", 110 + 60 * 4, 20, 120), 1);
    }else if(_menuNum == 2.1){
      //戦線管理
      this.addModoru(2);
      //this.add(new Rect(20,125,canvas.width -40,64+5),1);
      this.add(new Rect(20,189 +10,canvas.width -40,64),1);
      for (var i = 0; i < 5; i++) {
        let sensenrect = new Rect((canvas.width - (64 + 3) * 5 + 3) / 2 + (64+3)*i,125 +2,64,64);
        sensenrect.sensenTargetNum = i;
        sensenrect.touchevent = ()=>{
          if(isClick(sensenrect)==true){
            game.wait += 10;
            if(this.charactorNum != null){
              if(this.charactorNum == "はずす"){
                user.sensen[sensenrect.sensenTargetNum]= null;
              }else{
                if(user.sensen.includes(this.charactorNum) == false){
                  user.sensen[sensenrect.sensenTargetNum]= this.charactorNum;
                }else{
                  //すでに設定されているなら入れ換える
                  let charaIndexAtSensen;
                  for (var ind = 0; ind < user.sensen.length; ind++) {
                    if(user.sensen[ind] == this.charactorNum)charaIndexAtSensen = ind;
                  }
                  if(charaIndexAtSensen !=sensenrect.sensenTargetNum ){
                    user.sensen[charaIndexAtSensen] = user.sensen[sensenrect.sensenTargetNum];
                    user.sensen[sensenrect.sensenTargetNum] = this.charactorNum;
                  }
                }
              }
              this.charactorNum = null;
            }
          }
        };
        this.add(sensenrect,1);
        if(user.sensen[i] != null){
          if(user.returnCardsByCharactorNum(user.sensen[i],true)[0] != null){
            let charagazou = new Sprite(user.returnCardsByCharactorNum(user.sensen[i],true)[0].img[1],(canvas.width - (64 + 3) * 5 + 3) / 2 + (64+3)*i,125 +2,64,64);
            this.add(charagazou,1);
          }
          let _n = new Text(charactors[user.sensen[i]],(canvas.width - (64 + 3) * 5 + 3) / 2 + (64+3)*i,125 +2+50,14);
          _n.x += (64 - _n.returnWidthAndHeight()[0]) / 2;
          this.add(_n,1);
        }
        if(i == 0){
          let leadertxt = new Text("LEADER",(canvas.width - (64 + 3) * 5 + 3) / 2 + (64+3)*i,125 +2,12);
          leadertxt.x += (64 - leadertxt.returnWidthAndHeight()[0])/2;
          this.add(leadertxt,1);
        }
      }
      let sensenStatus = user.returnSensenStatus();
      for (var i = 0; i < 8; i++) {
        if(i == 1)continue;
        if(i == 0){
          this.add(new Text("HP:" + sensenStatus.hp,23,199+8 +5,14),1);
        }
        if(i >= 2){
          let _mark = new Sprite(brickImages[i -2],23 + (canvas.width -40 -6)/4*(i%4),199 + 8+ (64-6)/2*Math.floor(i/4),20,20);
          this.add(_mark,1);
          this.add(new Text(sensenStatus[zokusei[i -2]],23 + (canvas.width -40 -6)/4*(i%4) + 22,199 + 8+ (64-6)/2*Math.floor(i/4) +5,14),1);
        }
        
      }
      this.addCharactorsSelect(268,null,true);
    
    }else if(_menuNum == 2.2){
      //キャラクター編集
      this.addModoru(2);
      this.addCharactorsSelect(125,2.21);
    }else if(_menuNum == 2.21){
      //キャラクター詳細。this.charactorNum使用
      if(this.isBackToOperation == false || this.isBackToOperation == null){
        this.addModoru(2.2,["charactorSettei","charactorNum"]);
      }else{
        this.addModoru(1.111,["charactorSettei","charactorNum","isBackToOperation"]);
      }
      this.add(new Text("キャラクター詳細","half",90),1);
      this.add(new Rect(30,530,canvas.width - 60,30),1);
      this.add(new Rect(130,530-11,canvas.width - 260,16,false),1);
      this.add(new Text("リーダースキル","half",530-9,12,null,"black"),1);
      let soubiRect = new Rect(30,445,canvas.width - 60,64);
      soubiRect.touchevent = ()=>{
        if(isClick(soubiRect)){
          game.wait += 10;
          this.menuNum = 2.212;
        }
      };
      this.add(soubiRect,1);
      
      this.add(new Rect(30,439 -16,canvas.width - 60,16,false),1);
      this.add(new Text("装備","half",439-14,12,null,"black"),1);
      this.add(new Rect(30,canvas.height /2 +5 ,canvas.width - 60,16,false),1);
      this.add(new Text("スロット","half",canvas.height /2 +7,12,null,"black"),1);
      this.add(new Rect(50,130,141,141 *4/3),1);
      this.add(new Rect(50+141,130,141,30,false),1);
      let cname = new Text(charactors[this.charactorNum],191+141/2,133,20,null,"black");
      cname.x -= cname.returnWidthAndHeight()[0]/2;
      this.add(cname,1);
      this.add(new Rect(50+141 +5,165,141 -5,20),1);
      this.add(new Text("ATTRIBUTE",196 +8,165+2,16),1);
      this.add(new Rect(204 +10,185 + 2,312-194,30,false,"#c00"),1);
      this.add(new Text("HP:",200+10 +5 ,185 +5,14),1);
      this.add(new Rect(204 +10,185 + 2 +30*1,312-194,30,false,"#11b"),1);
      this.add(new Text("ATK:",200+10 +5 ,185 +5+30*1,14),1);
      this.add(new Rect(204 +10,185 + 2 +30*2,312-194,30,false,"#0a0"),1);
      this.add(new Text("RCV:",200+10 +5 ,185 +5+30*2,14),1);
      this.add(new Text("+",200 ,185 +2+60+5),1);
      this.add(new Line(200,252+30,334,252+30),1);
      this.add(new Rect(204 +10,185 + 2 +30*3 + 10,312-194,30,false,"#db0"),1);
      this.add(new Text("POW:",200+10 +5 ,185 +5+30*3+10,14),1);
      let _characards = user.returnCardsByCharactorNum(this.charactorNum,true);
      if(_characards[4] != null){
        let soubihyouji = returnBukiHyouji(_characards[4],445);
        for (var i = 0; i < soubihyouji.length; i++) {
          this.add(soubihyouji[i],1);
        }
      }
      let _charactorState = [0,0,0,0];//HP,ATK,RCV,POW
      for (var i = 0; i < 4; i++) {
        if(_characards[i] != null){
          _charactorState[0] += _characards[i].hp;
          _charactorState[1] += _characards[i].atk;
          _charactorState[2] += _characards[i].rcv;
          _charactorState[3] += _characards[i].hp + _characards[i].atk + _characards[i].rcv;
        }
      }
      for (var i = 0; i < 4; i++) {
        let st = new Text(_charactorState[i],310,190 + 30*i,14);
        if(i == 3)st.y += 10;
        st.x -= st.returnWidthAndHeight()[0];
        this.add(st,1);
      }
      if(_characards[0] != null){
        this.add(new Sprite(brickImages[zokusei.indexOf(_characards[0].zokusei)],332 - 16 -5,165+1,18,18),1);
      }
      let migi = new Text("＞",canvas.width - 40,200,40);
      migi.touchevent = ()=>{
        if(migi.isTouched(touch)[0] == "touchstart" && migi.isTouched(touch)[1] == true){
          game.wait += 10;
          let n = this.charactorNum;
          n++;
          if(n >= charactors.length)n = 0;
          this.charactorNum = n;
          this.charactorSettei = null;
        }
      };
      this.add(migi,1);
      let hidari = new Text("＜", 0, 200, 40);
      hidari.touchevent = () => {
        if (hidari.isTouched(touch)[0] == "touchstart" && hidari.isTouched(touch)[1] == true) {
          game.wait += 10;
          let n = this.charactorNum;
          n--;
          if (n <0) n = charactors.length -1;
          this.charactorNum = n;
          this.charactorSettei = null;
        }
      };
      this.add(hidari, 1);
      
      //カード詳細へ移動する関数
      let goTo29 = (_num) => {
        game.wait += 10;
        touch.type = "touchend";
        let arr = [];
        let arr2 = [0,0,0,0];
        let num = 1;
        for (var i = 0; i < 4; i++) {
          if (this.charactorSettei[i] != null) {
            arr.push(this.charactorSettei[i]);
            arr2[i] =num;
            num++;
          }
        }
        this.cardsForCardsyousai = arr;
        this.cardnumForCardsyousai = arr2[_num] -1;
        this.lastMenuNum = _menuNum;
        this.menuNum = 2.9;
      }
      
      //this.charactorSetteiを設定
      if(this.charactorSettei == null){
        this.charactorSettei = user.returnCardsByCharactorNum(this.charactorNum,true);
      }
      if(this.charactorSettei[0] != null){
        //リーダーカード
        let leaderCard = new Sprite(this.charactorSettei[0].img[0],50,130,141,141*4/3);
        leaderCard.touchevent = ()=>{
          if(isNagaoshi(leaderCard) == true){
            goTo29(0);
          }
        };
        this.add(leaderCard,1)
      }
      for (var i = 0; i < 5; i++) {
        if(i != 4){
          let c;
          if(this.charactorSettei[i] == null)c = new Rect(30 + i*(canvas.width-60)/5,canvas.height/2 + 25,(canvas.width-60)/5,(canvas.width-60)/5);
          if(this.charactorSettei[i] != null){
            c = new Sprite(this.charactorSettei[i].img[1], 30 + i*(canvas.width-60)/5, canvas.height/2 + 25, (canvas.width-60)/5, (canvas.width-60)/5);
            c.num = i;
            c.touchevent = ()=>{
              if(isNagaoshi(c)){
                goTo29(c.num);
              }
            };
          }
          this.add(c,1);
        }else if(i == 4){
          //カード入れ替え設定へのボタン
          let c = new Rect(30 + i*(canvas.width-60)/5 +2,canvas.height/2 + 25,(canvas.width-60)/5 -2,(canvas.width-60)/5,false,"red");
          c.touchevent = ()=>{
            if(isClick(c) == true){
              game.wait += 10;
              this.charactorCardsForCardIrekae = user.returnCardsByCharactorNum(this.charactorNum);
              this.targetCardForCardIrekae = null;
              this.pageForCardIrekae = 1;
              this.maxpageForCardIrekae = Math.ceil(this.charactorCardsForCardIrekae.length / 10);
              if(this.charactorCardsForCardIrekae.length == 0)this.maxpageForCardIrekae = 1;
              this.kouhoForCardIrekae = [null,null,null,null];
              for (var i = 0; i < this.charactorCardsForCardIrekae.length; i++) {
                if(this.charactorCardsForCardIrekae[i].charactorSettei != 0){
                  this.kouhoForCardIrekae[this.charactorCardsForCardIrekae[i].charactorSettei -1] = this.charactorCardsForCardIrekae[i];
                }
              }
              this.menuNum = 2.211;
            }
          };
          this.add(c,1);
          this.add(new Text("カード",30 + i*(canvas.width-60)/5 +9,canvas.height/2 + 25 +8,15),1);
          this.add(new Text("入れ替え",30 + i*(canvas.width-60)/5 +2,canvas.height/2 + 25 +30,15),1);
        }
      }
    }else if(_menuNum == 2.211){
      //キャラクター設定のカード入れ換え画面
      this.addModoru(2.21,[]);
      this.add(new Text("キャラクター入れ替え","half",90),1);
      this.add(new Rect(30,140,84,164),1);
      this.add(new Rect(130,140,canvas.width -30 -130,120),1);
      this.add(new Rect(130,270,78,164 - 130),1);
      let _kettei = new Rect(130 + 88,270,canvas.width -30 -130 -88,164 - 130,false,"#f22");
      _kettei.touchevent = ()=>{
        if(isClick(_kettei) == true){
          game.wait += 10;
          if(this.kouhoForCardIrekae[0] == null){
            game.addMessage("リーダーカードを設定してください");
            return;
          }
          
          for (var i = 0; i < this.charactorCardsForCardIrekae.length; i++) {
            this.charactorCardsForCardIrekae[i].charactorSettei = 0;
          }
          for (var i = 0; i < 4; i++) {
            if(this.kouhoForCardIrekae[i] != null){
              this.kouhoForCardIrekae[i].charactorSettei = i+1;
              this.charactorSettei[i] = this.kouhoForCardIrekae[i];
            }
          }
          this.charactorCardsForCardIrekae = [];
          this.kouhoForCardIrekae = [];
          this.menuNum = 2.21;
          
        }
      };
      this.add(_kettei,1);
      this.add(new Text("決定",218 + (canvas.width -30 -130 -88)/2 - 18,270 + 7,18),1);
      this.add(new Rect(30,314,canvas.width -60,50),1);
      this.add(new Rect(30 +4,314 +12,70,30,false,"#db0"),1);
      this.add(new Text("=",104,330),1);
      this.add(new Rect(30 +4 + 82*1,314 +12,70,30,false,"#c00"),1);
      this.add(new Text("+",104 +82,330),1);
      this.add(new Rect(30 +4 + 82*2,314 +12,70,30,false,"#11b"),1);
      this.add(new Text("+",104 +82*2,330),1);
      this.add(new Rect(30 +4 + 82*3,314 +12,70,30,false,"#0a0"),1);
      this.add(new Rect(30,374,canvas.width -60,170),1);
      //デッキ合計ステータス
      this.add(new Text("デッキ合計ステータス","half",315,10),1);
      let totalState = [0,0,0,0]; //pow,hp,atk,rcv
      for (var i = 0; i < this.kouhoForCardIrekae.length; i++) {
        if(this.kouhoForCardIrekae[i] != null){
          totalState[1] += this.kouhoForCardIrekae[i].hp;
          totalState[2] += this.kouhoForCardIrekae[i].atk;
          totalState[3] += this.kouhoForCardIrekae[i].rcv;
          totalState[0] += this.kouhoForCardIrekae[i].hp + this.kouhoForCardIrekae[i].atk + this.kouhoForCardIrekae[i].rcv;
        }
      }
      let statenames = ["POW","HP","ATK","RCV"];
      for (var i = 0; i < 4; i++) {
        let totalPowTxt = new Text(statenames[i] + ":" + totalState[i], 34 + 35 + 82*i, 330, 14, 60);
        totalPowTxt.x -= totalPowTxt.returnWidthAndHeight()[0] / 2;
        this.add(totalPowTxt, 1);
      }
      
      //カードの描画
      for (var i = 0; i < 10; i++) {
        let _index = i + (this.pageForCardIrekae -1) * 10;
        let max = 10;
        if(this.pageForCardIrekae == this.maxpageForCardIrekae){
          max = this.charactorCardsForCardIrekae.length % 10;
          if(max == 0 && this.charactorCardsForCardIrekae.length > 0)max = 10;
          
        }
        if(i > max -1)continue;
        let x = i%5;
        let y = Math.floor(i/5);
        let sp = new Sprite(this.charactorCardsForCardIrekae[_index].img[1],34 + (canvas.width - 68)/5 *x,374+4+56*y,(canvas.width - 68)/5 -4,(canvas.width - 68)/5-10);
        sp.num = _index;
        sp.touchevent=()=>{
          if(isNagaoshi(sp) == true){
            this.cardsForCardsyousai = [this.charactorCardsForCardIrekae[sp.num]];
            this.cardnumForCardsyousai = 0;
            this.lastMenuNum = _menuNum;
            touch.type = "touchend";
            this.menuNum = 2.9;
          }else if(isClick(sp) == true){
            this.targetCardForCardIrekae = this.charactorCardsForCardIrekae[sp.num];
          }
        };
        this.add(sp,1);
        if(this.kouhoForCardIrekae.includes(this.charactorCardsForCardIrekae[_index])){
          //候補として選択済みなら灰色にする
          let haiiro = new Rect(34 + (canvas.width - 68)/5 *x,374+4+56*y,(canvas.width - 68)/5 -4,(canvas.width - 68)/5-10,false,"black");
          haiiro.globalAlpha = 0.5;
          this.add(haiiro,1);
        }
      }
      this.add(new Text(this.pageForCardIrekae + "/" + this.maxpageForCardIrekae,"half",510),1);
      let migi = new Text("→",canvas.width /2 + 40,510);
      migi.touchevent = ()=>{
        if(migi.isTouched(touch)[0]=="touchstart" && migi.isTouched(touch)[1] == true){
          game.wait += 10;
          let p = this.pageForCardIrekae;
          p++;
          if(p > this.maxpageForCardIrekae)p = 1;
          this.pageForCardIrekae = p;
          this.targetNumForCardIrekae = null;
        }
      };
      this.add(migi,1);
      let hidari = new Text("←", canvas.width / 2 - 60, 510);
      hidari.touchevent = () => {
        if (hidari.isTouched(touch)[0] == "touchstart" && hidari.isTouched(touch)[1] == true) {
          game.wait += 10;
          let p = this.pageForCardIrekae;
          p--;
          if (p < 1) p = this.maxpageForCardIrekae;
          this.pageForCardIrekae = p;
          this.targetNumForCardIrekae = null;
        }
      };
      this.add(hidari, 1);
      this.add(new Text("カード所持数",40,500,12),1);
      let syojisuu = new Text(this.charactorCardsForCardIrekae.length,40 + 12*3,520,14);
      syojisuu.x -= syojisuu.returnWidthAndHeight()[0]/2;
      this.add(syojisuu,1);
      
      //カード詳細へ移動する関数
      let goTo29 = (_num) => {
        game.wait += 10;
        touch.type = "touchend";
        let arr = [];
        let arr2 = [0, 0, 0, 0];
        let num = 1;
        for (var i = 0; i < 4; i++) {
          if (this.kouhoForCardIrekae[i] != null){
            arr.push(this.kouhoForCardIrekae[i]);
            arr2[i] = num;
            num++;
          }
        }
        this.cardsForCardsyousai = arr;
        this.cardnumForCardsyousai = arr2[_num] -1;
        this.lastMenuNum = _menuNum;
        this.menuNum = 2.9;
      }
      //リーダーの描画
      let c1 ;
      if(this.kouhoForCardIrekae[0] == null)c1 = new Rect(30+4,140+4,84-8,76*4/3);
      if(this.kouhoForCardIrekae[0] != null)c1 = new Sprite(this.kouhoForCardIrekae[0].img[0],30+4,140+4,84-8,76*4/3);
      c1.touchevent = ()=>{
        if(isNagaoshi(c1) && this.kouhoForCardIrekae[0] != null){
          goTo29(0);
        }else if(isClick(c1) == true){
          if(this.targetCardForCardIrekae != null && this.kouhoForCardIrekae[0] != this.targetCardForCardIrekae && this.kouhoForCardIrekae[1] != this.targetCardForCardIrekae && this.kouhoForCardIrekae[2] != this.targetCardForCardIrekae && this.kouhoForCardIrekae[3] != this.targetCardForCardIrekae){
            game.wait += 10;
            this.kouhoForCardIrekae[0] = this.targetCardForCardIrekae;
            this.targetCardForCardIrekae = null;
          }
        }
      };
      this.add(c1,1);
      let hp = new Text("HP:",64,250,14);
      hp.x -= hp.returnWidthAndHeight()[0];
      this.add(hp,1);
      let atk = new Text("ATK:",64,250 +16,14);
      atk.x -= atk.returnWidthAndHeight()[0];
      this.add(atk, 1);
      let rcv = new Text("RCV:",64,250 +16*2,14);
      rcv.x -= rcv.returnWidthAndHeight()[0];
      this.add(rcv, 1);
      if(this.kouhoForCardIrekae[0] != null){
        let _card = this.kouhoForCardIrekae[0];
        let _hp = new Text(_card.hp, 108, 250, 14);
        _hp.x -= _hp.returnWidthAndHeight()[0];
        this.add(_hp, 1);
        let _atk = new Text(_card.atk, 108, 250 + 16, 14);
        _atk.x -= _atk.returnWidthAndHeight()[0];
        this.add(_atk, 1);
        let _rcv = new Text(_card.rcv, 108, 250 + 16 * 2, 14);
        _rcv.x -= _rcv.returnWidthAndHeight()[0];
        this.add(_rcv, 1);
      }
      //他の三枚のカード
      for (var i = 1; i < 4; i++) {
        let _c;
        if (this.kouhoForCardIrekae[i] == null) _c = new Rect(30 + 4 +108 + 70*(i -1), 140 + 4, 60, 60 * 4 / 3);
        if (this.kouhoForCardIrekae[i] != null) _c = new Sprite(this.kouhoForCardIrekae[i].img[0], 30 + 4 +108 + 70*(i-1), 140 + 4, 60, 60 * 4 / 3);
        _c.num = i;
        _c.touchevent = () => {
          if(isNagaoshi(_c) && this.kouhoForCardIrekae[_c.num] != null){
            goTo29(_c.num);
          }else if (isClick(_c) == true) {
            if (this.targetCardForCardIrekae != null && this.kouhoForCardIrekae[0] != this.targetCardForCardIrekae&& this.kouhoForCardIrekae[1] != this.targetCardForCardIrekae && this.kouhoForCardIrekae[2] != this.targetCardForCardIrekae && this.kouhoForCardIrekae[3] != this.targetCardForCardIrekae ) {
              game.wait += 10;
              this.kouhoForCardIrekae[_c.num] = this.targetCardForCardIrekae;
              this.targetCardForCardIrekae = null;
            }
          }
        };
        this.add(_c, 1);
        
        if (this.kouhoForCardIrekae[i] != null) {
          let _card = this.kouhoForCardIrekae[i];
          let _hp = new Text(_card.hp, 202 + 70*(i-1), 224, 10);
          _hp.x -= _hp.returnWidthAndHeight()[0];
          this.add(_hp, 1);
          let _atk = new Text(_card.atk, 202 + 70*(i-1), 224 + 12, 10);
          _atk.x -= _atk.returnWidthAndHeight()[0];
          this.add(_atk, 1);
          let _rcv = new Text(_card.rcv, 202 + 70*(i-1), 224 + 12 * 2, 10);
          _rcv.x -= _rcv.returnWidthAndHeight()[0];
          this.add(_rcv, 1);
        }
      }
      //デッキコスト
      this.add(new Text("デッキコスト",139,273,10));
      
      
      
      
    }else if(_menuNum == 2.212){
      //キャラクターの装備設定
      this.addModoru(2.21,[]);
      
      let hyoujiRect = [0,120,canvas.width,canvas.height - 120 - 100 +30];
      let hyoujisuuOnOnePage = Math.floor(hyoujiRect[3] / 64);
      let maxScroll = 0;
      if(user.bukis.length > hyoujisuuOnOnePage)maxScroll = -(user.bukis.length - hyoujisuuOnOnePage)*64;
      if(this.soubiSetteiScroll < maxScroll)this.soubiSetteiScroll = maxScroll;
      
      let txt = new Text("装備設定", "half", 90);
      txt.touchevent = () => {
        if (maxScroll == 0) return;
        //スクロールの処理
        if (touch.type == "touchstart") {
          this.lastY3 = touch.y;
        } else if (touch.type == "touchmove") {
          let _result = this.soubiSetteiScroll - (this.lastY3 - touch.y);
          if (_result > 0) _result = 0;
          if (_result < maxScroll) _result = maxScroll;
          this.soubiSetteiScroll = _result;
          this.lastY3 = touch.y;
        } else if (touch.type == "touchend") {
          this.lastY3 = 0;
        }
      };
      this.add(txt, 1);
      
      for (var i = 0; i < user.bukis.length; i++) {
        let _rct = new Rect(30,120 + 64*i + this.soubiSetteiScroll,canvas.width - 60,64);
        _rct.num = i;
        _rct.rect = [].concat(hyoujiRect);
        _rct.touchevent = ()=>{
          if(isClick(_rct)){
            game.wait += 10;
            let soubiFunc = () => {
              for (var k = 0; k < user.bukis.length; k++) {
                if (user.bukis[k].soubiCharactor == this.charactorNum) user.bukis[k].soubiCharactor = null;
                continue;
              }
              user.bukis[_rct.num].soubiCharactor = this.charactorNum;
            };
            
            if(user.bukis[_rct.num].soubiCharactor == null){
              soubiFunc();
            }else if(user.bukis[_rct.num].soubiCharactor == this.charactorNum){
              user.bukis[_rct.num].soubiCharactor = null;
            }else if(user.bukis[_rct.num].soubiCharactor != null){
              game.addConfirm("現在装備しているキャラクターの装備が外れますがよろしいですか?","はい","いいえ",soubiFunc);
            }
          }
        };
        this.add(_rct,1);
        
        let _bukihyouji = returnBukiHyouji(user.bukis[i],120 + 64*i + this.soubiSetteiScroll);
        for (var j = 0; j < _bukihyouji.length; j++) {
          let bukihyouji2 = _bukihyouji[j];
          bukihyouji2.rect = [].concat(hyoujiRect);
          this.add(bukihyouji2,1);
        }
        
        if(user.bukis[i].soubiCharactor != null){
          let _rct2 = new Rect(30-1,120 + 64*i + this.soubiSetteiScroll,canvas.width - 60+2,64+1,false,"black");
          _rct2.rect = [].concat(hyoujiRect);
          _rct2.globalAlpha = 0.6;
          this.add(_rct2,1);
          let _name = new Text(charactors[user.bukis[i].soubiCharactor],34+56/2,120 + 64*i + this.soubiSetteiScroll + 4 + 56/2,14);
          _name.x -= _name.returnWidthAndHeight()[0] /2;
          _name.y -= _name.returnWidthAndHeight()[1] /2;
          _name.rect = [].concat(hyoujiRect);
          this.add(_name,1);
          }
      }
      
      
      
    }else if(_menuNum == 2.9){
      //カード詳細
      this.addModoru(this.lastMenuNum,[]);
      this.add(new Text("カード詳細","half",90),1);
      let _thisCard = this.cardsForCardsyousai[this.cardnumForCardsyousai];
      let _c = new Sprite(_thisCard.img[0],33,130,174,174*4/3);
      _c.touchevent = ()=>{
        if(isClick(_c)){
          this.menuNum = 2.91;
          game.wait += 10;
        }
      };
      this.add(_c,1);
      this.add(new Sprite(_thisCard.img[1],33,130 + 174*4/3 + 8,61,61),1);
      this.add(new Text("No." + _thisCard.no,107,130 + 174*4/3 + 8,16),1);
      this.add(new Rect(107,130 + 174*4/3 + 28,244,40,false,"#b22"),1);
      this.add(new Text(_thisCard.name,119,130 + 174*4/3 + 38,16,14*16),1);
      this.add(new Rect(33,130 + 174*4/3 + 68 + 10,344 -26,36),1);
      let les = new Text("リーダースキル","half",130 + 174*4/3 + 68 + 4,12,null,"black");
      this.add(new Rect(les.x - 10,les.y -1,les.returnWidthAndHeight()[0] + 20,les.returnWidthAndHeight()[1] + 3,false,"white"),1);
      this.add(les,1);
      this.add(new Rect((canvas.width - 100)/2,130 + 174*4/3 + 114 + 8,100,40),1);
      this.add(new Text("育成","half",130 + 174*4/3 + 114 + 14,24,null,"gray"),1);
      this.add(new Rect(33,130 + 174*4/3 + 162 + 10,canvas.width/2 -33 - 5,30),1);
      let bai = new Text("売却する",33 + (canvas.width/2 -33-5)/2,130 + 174*4/3 + 162 + 16,16,null,"gray");
      bai.x -= bai.returnWidthAndHeight()[0]/2;
      this.add(bai,1);
      this.add(new Rect(canvas.width/2 +5,130 + 174*4/3 + 162 + 10,canvas.width/2 -33 - 5,30),1);
      let oki = new Text("お気に入り登録",canvas.width/2 +5 + (canvas.width/2 -33 - 5)/2,130 + 174*4/3 + 162 + 16,16,null,"gray");
      oki.x -= oki.returnWidthAndHeight()[0]/2;
      this.add(oki,1);
      
      
      this.add(new Rect(211,130,140,40,false,"gray"),1);
      this.add(new Text("Lv",215,134,16),1);
      this.add(new Text("/",297,134,16),1);
      let _lv = new Text(_thisCard.lv,290,134,16);
      _lv.x -= _lv.returnWidthAndHeight()[0];
      this.add(_lv,1);
      let _maxlv = new Text(_thisCard.maxlv, 337, 134, 16);
      _maxlv.x -= _maxlv.returnWidthAndHeight()[0];
      this.add(_maxlv, 1);
      let _states = ["HP","ATK","RCV","熟練度","コスト","ATTRIBUTE"];
      let _states2 = ["hp","atk","rcv","jukurendo","cost","zokusei"];
      for (var i = 0; i < _states.length; i++) {
        this.add(new Rect(211,172 + 22*i,140,20,false,"gray"),1);
        let st;
        if(i < 5){
          st = new Text(_states[i],211 + 140*3/7 /2,174 + 22*i,16);
          st.x -= st.returnWidthAndHeight()[0] /2;
          let n = new Text(_thisCard[_states2[i]],345,174 + 22*i,16);
          if(i == 3)n.text += "/100";
          n.x -= n.returnWidthAndHeight()[0];
          this.add(n,1);
          
        }else{//attributeの描画
          st = new Text(_states[i],217,174 + 22*i,16);
          this.add(new Sprite(brickImages[zokusei.indexOf(_thisCard.zokusei)],345 - 16,174+22*i,16,16),1);
        }
        this.add(st,1);
      }
      this.add(new Rect(211,172 + 22*6,140,40,false,"gray"),1);
      let ka = new Text("覚醒数",211 + 70,174 + 22*6,16);
      ka.x -= ka.returnWidthAndHeight()[0] /2;
      this.add(ka,1);
      for (var i = 0; i < _thisCard.kakusei; i++) {
        let im = new Image();
        im.src = "./brickImage/kakusei.png";
        this.add(new Sprite(im,226 + (140-15-33)/3*i,172+22*6+21,18,18),1);
      }
      if(this.cardsForCardsyousai.length > 2){
        let migi = new Text("＞", canvas.width - 40, 200, 40);
        migi.touchevent = () => {
          if (migi.isTouched(touch)[0] == "touchstart" && migi.isTouched(touch)[1] == true) {
            game.wait += 10;
            let n = this.cardnumForCardsyousai;;
            n++;
            if (n >= this.cardsForCardsyousai.length) n = 0;
            this.cardnumForCardsyousai = n;
          }
        };
        this.add(migi, 1);
        let hidari = new Text("＜", 0, 200, 40);
        hidari.touchevent = () => {
          if (hidari.isTouched(touch)[0] == "touchstart" && hidari.isTouched(touch)[1] == true) {
            game.wait += 10;
            let n = this.cardnumForCardsyousai;
            n--;
            if (n < 0) n = this.cardsForCardsyousai.length - 1;
            this.cardnumForCardsyousai = n;
          }
        };
        this.add(hidari, 1);
        this.add(new Text(this.cardnumForCardsyousai,0,550),1);
      }
      
    }else if(_menuNum == 2.91){
      this.addModoru(2.9,[]);
      let _thisCard = this.cardsForCardsyousai[this.cardnumForCardsyousai];
      let _c = new Sprite(_thisCard.img[0],33,130,canvas.width - 66,(canvas.width - 66)*4/3);
      this.add(_c,1);
      this.add(new Text("illustrator:" + _thisCard.illustrator,"half",130 + (canvas.width - 66)*4/3 + 5 ) ,1);
      
      
    }else if(_menuNum == 3){
      //装備
      let sonotaMenu = ["装備開発"];
      for (var i = 0; i < sonotaMenu.length; i++) {
        let _backrect = new Rect((canvas.width - 120) / 2 - 20, 110 - 10 + 60 * i, 120 + 20 * 2, 20 + 10 * 2, false, "gray");
        let _rect = new Rect((canvas.width - 120) / 2 - 20, 110 - 10 + 60 * i, 120 + 20 * 2, 20 + 10 * 2);
        _rect.menuNum = i + 1;
        if (i == 0) {
          _rect.touchevent = () => {
            if (isClick(_rect) == true) {
              this.syokkenMaisuuForSoubikaihatsu = [0, [0,0,0], [0,0,0], [0,0,0]] //選択されている枚数。menuNum == 3.1
              this.syokkenSliderForSoubikaihatsu = [0, [0, 0, 0], [0, 0, 0], [0, 0, 0]] //スワイプされているy座標
              game.wait += 10;
              this.menuNum = 3.1;
            }
          }
        } 
        this.add(_backrect, 1);
        this.add(_rect, 1);
        this.add(new Text(sonotaMenu[i], "half", 110 + 60 * i, 20, 120), 1);
      }
    
      
    }else if(_menuNum == 3.1){
      //装備開発
      this.addModoru(3,[]);
      this.add(new Text("装備開発","half",90),1);
      
      let kaihatsusuruRect = new Rect(50 + ((canvas.width - 100 - 260) + 130) * 1,480,130,40,false,"#f22");
      kaihatsusuruRect.touchevent = ()=>{
        if(isClick(kaihatsusuruRect)){
          game.wait += 10;
          if(this.syokkenMaisuuForSoubikaihatsu[0] == 0 && this.syokkenMaisuuForSoubikaihatsu[1][0] == 0 && this.syokkenMaisuuForSoubikaihatsu[1][1] == 0 && this.syokkenMaisuuForSoubikaihatsu[1][2] == 0 && this.syokkenMaisuuForSoubikaihatsu[2][0] == 0 && this.syokkenMaisuuForSoubikaihatsu[2][1] == 0 && this.syokkenMaisuuForSoubikaihatsu[2][2] == 0 && this.syokkenMaisuuForSoubikaihatsu[3][0] == 0 && this.syokkenMaisuuForSoubikaihatsu[3][1] == 0 && this.syokkenMaisuuForSoubikaihatsu[3][2] == 0){
            game.addMessage("食券が選択されていません");
            return;
          }
          let tf = true;
          for (var i = 0; i < this.syokkenMaisuuForSoubikaihatsu.length; i++) {
            if(i == 0){
              if(this.syokkenMaisuuForSoubikaihatsu[0] > user.syokken[0])tf = false;
            }else{
              if(this.syokkenMaisuuForSoubikaihatsu[i][0] *100 + this.syokkenMaisuuForSoubikaihatsu[i][1] * 10 + this.syokkenMaisuuForSoubikaihatsu[i][2] > user.syokken[i])tf = false;
            }
          }
          if(tf == false){
            game.addMessage("食券が足りません");
            return;
          }else{
            //食券を消費
            let kaihatsuFunc = ()=>{
              if(this.menuNum == 3.1){
                let kakuritsu = [0,60,90];
                let syokkenmaisuu = [0,0,0,0];
                for (var i = 0; i < this.syokkenMaisuuForSoubikaihatsu.length; i++) {
                  if (i == 0) {
                    user.syokken[0] -= this.syokkenMaisuuForSoubikaihatsu[0] ;
                    syokkenmaisuu[0] =this.syokkenMaisuuForSoubikaihatsu[0];
                  } else {
                    user.syokken[i] -= this.syokkenMaisuuForSoubikaihatsu[i][0] * 100 + this.syokkenMaisuuForSoubikaihatsu[i][1] * 10 + this.syokkenMaisuuForSoubikaihatsu[i][2];
                    syokkenmaisuu[i] = this.syokkenMaisuuForSoubikaihatsu[i][0] * 100 + this.syokkenMaisuuForSoubikaihatsu[i][1] * 10 + this.syokkenMaisuuForSoubikaihatsu[i][2];
                  }
                }
                //確率の変化
                kakuritsu[1] -= syokkenmaisuu[0]*20;
                kakuritsu[2] -= syokkenmaisuu[0]*10;
                kakuritsu[1] -= Math.round( (syokkenmaisuu[1] + syokkenmaisuu[2] + syokkenmaisuu[3])/(999*3) * 60 );
                kakuritsu[2] -= Math.round( (syokkenmaisuu[1] + syokkenmaisuu[2] + syokkenmaisuu[3])/(999*3) * 60 );
                if(kakuritsu[1] <0)kakuritsu[1] = 0;
                let ran = randomNum(1,100);
                let rea;
                if(ran > kakuritsu[0] && ran <kakuritsu[1])rea = "N";
                if(ran >= kakuritsu[1] && ran <kakuritsu[2])rea = "R";
                if(ran > kakuritsu[2])rea = "SR";
                let _skill = returnRandomBukiSkillByReality(rea);
                this.getSoubi = new Buki(0,_skill,rea);
                console.log(this.getSoubi);
                user.bukis.push(new Buki(0,_skill,rea));
                this.menuNum = 3.2;
                game.wait += 10;
              }
              
            };
            game.addConfirm("装備を開発します","はい","いいえ",kaihatsuFunc);
          }
        }
      };
      this.add(kaihatsusuruRect,1);
      let kaihatsusurutxt = new Text("開発する",kaihatsusuruRect.x + kaihatsusuruRect.width /2,kaihatsusuruRect.y + kaihatsusuruRect.height/2,20);
      kaihatsusurutxt.x -= kaihatsusurutxt.returnWidthAndHeight()[0]/2;
      kaihatsusurutxt.y -= kaihatsusurutxt.returnWidthAndHeight()[1]/2;
      this.add(kaihatsusurutxt,1);
      
      for (var i = 0; i < 4; i++) {
        let _x = i %2;
        let _y = Math.floor(i /2);
        let _w = 130;
        let _h = 100;
        let _padding1 = 50;
        let _padding2 = 20;
        _x = _padding1 + ( (canvas.width - _padding1*2 - _w*2 ) + _w )*_x;
        _y = 140 + (_h + _padding2) * _y;
        this.add(new Rect(_x,_y,_w,_h),1);
        let _moji = ["麻婆豆腐","肉うどん","オムライス","カレー"];
        let _moji2 = _moji[i] + "食券";
        let _mojitxt = new Text(_moji2,_x + _w/2,_y + 5,16);
        _mojitxt.x -= _mojitxt.returnWidthAndHeight()[0]/2;
        this.add(_mojitxt,1);
        let _syojitxt = new Text("(所持枚数 : " + user.syokken[i] + ")",_x + _w/2,_y + 25,12);
        _syojitxt.x -= _syojitxt.returnWidthAndHeight()[0] / 2;
        this.add(_syojitxt, 1);
        let sliderHani = [_x + 5,_y + 40,_w - 10,_h - 40 - 5];
        let sliderRect = new Rect(_x + 5,_y + 40,_w - 10,_h - 40 - 5);
        sliderRect.num = i;
        sliderRect.touchevent = ()=>{
          if(lastTouchStart.type == "touchstart" && sliderRect.isTouched(lastTouchStart)[1] == true && touch.type != "touchend"){
            //三分割してどこでtouchstartしたか
            let _target = 2;
            if (lastTouchStart.x >= sliderRect.x && lastTouchStart.x < sliderRect.x + sliderRect.width / 3) _target = 0;
            if (lastTouchStart.x >= sliderRect.x + sliderRect.width / 3 && lastTouchStart.x < sliderRect.x + sliderRect.width * 2 / 3) _target = 1;
            
            //スワイプの計算
            if(sliderRect.num == 0){
              //麻婆豆腐食券の場合
              this.syokkenSliderForSoubikaihatsu[0] =- lastTouchStart.y + touch.y;//下にスワイプするとプラス、上ならマイナス
            }else{
              //他の食券の場合
              this.syokkenSliderForSoubikaihatsu[sliderRect.num][_target] =- lastTouchStart.y + touch.y;
            }
          }else if(lastTouchStart.type == "not" && sliderRect.isTouched(lastTouchStart)[1] == true && touch.type == "touchend"){
            //三分割してどこでtouchstartしたか
            let _target = 2;
            if (lastTouchStart.x >= sliderRect.x && lastTouchStart.x < sliderRect.x + sliderRect.width / 3) _target = 0;
            if (lastTouchStart.x >= sliderRect.x + sliderRect.width / 3 && lastTouchStart.x < sliderRect.x + sliderRect.width * 2 / 3) _target = 1;
            
            //スワイプ終了
            if(sliderRect.num == 0){
              let sa =Math.round(this.syokkenSliderForSoubikaihatsu[0] / 40);
              let result = this.syokkenMaisuuForSoubikaihatsu[0] + sa;
              if(result < 0){
                result = 0;
              }
              if(result > 3) {
                result = 3;
              }
              this.syokkenMaisuuForSoubikaihatsu[0] = result;
              this.syokkenSliderForSoubikaihatsu[0] = 0;
            }else{
              let sa = Math.round(this.syokkenSliderForSoubikaihatsu[sliderRect.num][_target] / 40);
              let result = this.syokkenMaisuuForSoubikaihatsu[sliderRect.num][_target] + sa;
              while (result < 0) {
                result += 10;
              }
              while (result > 9) {
                result -= 10;
              }
              this.syokkenMaisuuForSoubikaihatsu[sliderRect.num][_target] = result;
              this.syokkenSliderForSoubikaihatsu[sliderRect.num][_target] = 0;
            }
          }
        };
        this.add(sliderRect,1);
        
        //数字の描画
        //this.syokkenMaisuuForSoubukaihatsu(スワイプ前の選択値)とthis.syokkenSliderForSoubikaihatsu(スワイプされているy座標)から現在の表示中の中央の数字を割り出し、その前後の数とともに表示する
        if (i == 0) {
          //麻婆豆腐
          let sa = this.syokkenSliderForSoubikaihatsu[i] / 40;
          let tyuuouchi = this.syokkenMaisuuForSoubikaihatsu[i] + Math.round(sa);
          for (var k = -1; k < 2; k++) {
            let _num = tyuuouchi + k;
            if(_num > 3 || _num < 0)continue;
            let _beforey = sliderRect.y + 7 + 40 * (this.syokkenMaisuuForSoubikaihatsu[i] - _num) ;//スワイプ前のy
            let hyouji = new Text(_num,sliderRect.x + sliderRect.width /2,_beforey + this.syokkenSliderForSoubikaihatsu[i],40);
            hyouji.x -= hyouji.returnWidthAndHeight()[0] /2;
            hyouji.rect = [].concat(sliderHani);
            
            this.add(hyouji,1);
          }
        }else{
          //他の食券
          for (var j = 0; j < 3; j++) {
            let sa = this.syokkenSliderForSoubikaihatsu[i][j] / 40;
            let tyuuouchi = this.syokkenMaisuuForSoubikaihatsu[i][j] + Math.round(sa);
            for (var k = -1; k < 2; k++) {
              let _num = tyuuouchi + k;
              let _beforey = sliderRect.y + 7 + 40 * (this.syokkenMaisuuForSoubikaihatsu[i][j] - _num); //スワイプ前のy
              while (_num < 0) { _num += 10 };
              while (_num > 9) { _num -= 10 };
              let hyouji = new Text(_num, sliderRect.x + sliderRect.width / 6 + j * (sliderRect.width / 3), _beforey + this.syokkenSliderForSoubikaihatsu[i][j], 40);
              hyouji.x -= hyouji.returnWidthAndHeight()[0] / 2;
              hyouji.rect = [].concat(sliderHani);
              this.add(hyouji,1);
            }
          }
        }
        
        
      }
      
      
      
    }else if(_menuNum == 3.2){
      //装備開発結果
      let thissoubi = this.getSoubi;
      let thishyouji = returnBukiHyouji(thissoubi,200);
      for (var i = 0; i < thishyouji.length; i++) {
        this.add(thishyouji[i],1);
      }
      this.addModoru(3.1,["getSoubi"]);
      
      
    }else if(_menuNum == 5){
      //ガチャ
      let maxScroll = -50;
      
      let _text1 = new Text("108連ガチャ","half",100 + this.scroll);
      _text1.rect = [0,70,canvas.width,canvas.height - 120];
      _text1.touchevent = ()=>{
        if(game.wait != 0)return;
        //スクロールの処理
        if(touch.type == "touchstart"){
          this.lastY = touch.y;
        }else if(touch.type == "touchmove"){
          let _result = this.scroll - ( this.lastY - touch.y);
          if(_result > 0)_result = 0;
          if(_result < maxScroll)_result = maxScroll;
          this.scroll = _result;
          this.lastY = touch.y;
        }else if(touch.type == "touchend"){
          this.lastY = 0;
        }
      };
      this.add(_text1,1);
      let r1 =  new Rect(20,90+this.scroll,canvas.width -40,120);
      r1.rect = [0,70,canvas.width,canvas.height - 120];
      this.add(r1,1);
      let t2 =  new Text("チケットを使ってガチャを引く","half",140+this.scroll);
      t2.rect = [0,70,canvas.width,canvas.height - 120];
      this.add(t2,1);
      let t3 = new Text("【チケット所持数】:　" + user.ticket,"half",180+this.scroll);
      t3.rect = [0,70,canvas.width,canvas.height - 120];
      this.add(t3,1);
      let gacha108rect = new Rect(40,130+this.scroll,canvas.width-80,40);
      gacha108rect.rect = [0,70,canvas.width,canvas.height - 120];
      gacha108rect.touchevent = ()=>{
        if(isClick(gacha108rect) ==true && user.ticket > 0){
          game.addConfirm("ガチャを引きますか?","はい","いいえ",()=>{game.blackoutFunction(new GachaScene(108));});
          
        }
      };
      this.add(gacha108rect,1);
      
    }else if(_menuNum == 6){
      let sonotaMenu = ["セーブ","セーブデータ削除","名前変更"];
      for (var i = 0; i < sonotaMenu.length; i++) {
        let _backrect = new Rect((canvas.width - 120) / 2 - 20, 110 - 10 + 60 * i, 120 + 20 * 2, 20 + 10 * 2, false, "gray");
        let _rect = new Rect((canvas.width - 120) / 2 - 20, 110 - 10 + 60 * i, 120 + 20 * 2, 20 + 10 * 2);
        _rect.menuNum = i + 1;
        if(i == 0){
          _rect.touchevent = () => {
            if (isClick(_rect) == true) {
              game.wait += 10;
              indexedDBAdd();
            }
          }
        }else if(i == 1){
          _rect.touchevent = () => {
            if (isClick(_rect) == true) {
              game.wait += 10;
              indexedDBRemove();
            }
          }
        }else if(i == 2){
          _rect.touchevent = () => {
            if (isClick(_rect) == true) {
              game.wait += 10;
              document.getElementById("nameInput").value = user.name;
              document.getElementById("sensenNameInput").value = user.sensenName;
              document.getElementById("nameInput").classList.remove("none");
              document.getElementById("sensenNameInput").classList.remove("none");
              document.getElementById("sensenSpan").classList.remove("none");
              this.menuNum = 6.1;
            }
          }
        }
        this.add(_backrect, 1);
        this.add(_rect, 1);
        this.add(new Text(sonotaMenu[i], "half", 110 + 60*i, 20, 120), 1);
      }
      
    }else if(_menuNum == 6.1){
      //名前変更。input要素が表示されている
      this.addModoru(6,[]);
      let _interval = setInterval(()=>{
        if(this.menuNum != 6.1){
          document.getElementById("nameInput").classList.add("none");
          document.getElementById("sensenNameInput").classList.add("none");
          document.getElementById("sensenSpan").classList.add("none");
          clearInterval(_interval);
        }
      },10);
      
      let _kettei = new Rect(canvas.width /2 - 50,400,100,40,false,"#f44");
      _kettei.touchevent = ()=>{
        if(isClick(_kettei)){
          let newName = document.getElementById("nameInput").value;
          let sensenNewName = document.getElementById("sensenNameInput").value;
          if (newName == "" || sensenNewName == "") return;
          user.name = newName;
          user.sensenName = sensenNewName;
          game.wait += 10;
          
        }
      };
      this.add(_kettei,1);
      this.add(new Text("決定","half",410,20),1);
      
    }else if(_menuNum == 7 || _menuNum == 7.1){
      //戦果
      let senkaText= new Text("戦果",30,90);
      senkaText.touchevent = ()=>{
        if(touch.type == "touchstart" && touch.y > 70 && touch.y < canvas.height - 50 ){
          if(this.menuNum == 7){
            this.menuNum = 7.1;
            game.wait += 20;
          }else{
            this.menuNum = 1.11;
            game.wait += 20;
          }
        }
      }
      this.add(senkaText,1);
      this.add(new Text("オペレーション",30,120,14),1);
      this.add(new Text("「" + places[this.operationNum[0]].name + "」","half",145,20),1);
      this.add(new Text(stages[this.operationNum[1]].name,"half",170,16),1);
      
      if(_menuNum == 7){
        this.add(new Text("獲得Beats!",60,240,20),1);
        this.add(new Text("獲得EXP",60,240 +35,20),1);
        this.add(new Text("次のレベルまで",60,240 +80,12),1);
        let gb = new Text(this.senka[0],canvas.width -60,240,20);
        gb.x -= gb.returnWidthAndHeight()[0];
        this.add(gb,1);
        let ge = new Text(this.senka[1], canvas.width - 60, 240 +35, 20);
        ge.x -= ge.returnWidthAndHeight()[0];
        this.add(ge, 1);
        let nextexp = new Text(this.senka[4][1],canvas.width - 60,240 + 80,12);
        nextexp.x -= nextexp.returnWidthAndHeight()[0];
        this.add(nextexp,1);
        if(this.senka[4][0] > 0){
          //レベルが上がっている場合
          this.add(new Text("Level UP!","half",240+190 - 50,26),1);
          this.add(new Text("レベルが" + this.senka[4][0] + "あがりました","half",240 + 190,12),1);
        }
      }else if(_menuNum == 7.1){
        this.add(new Rect(60,195,canvas.width -60*2,30),1);
        this.add(new Text("入手アイテム","half",200,20),1);
        this.add(new Text("肉うどん食券",60,200 + 40,16),1);
        this.add(new Text("オムライス食券",60,200 + 40 +25,16),1);
        this.add(new Text("カレー食券",60,200 + 40 +25*2,16),1);
        for (var i = 0; i < 3; i++) {
          let nikuudon = new Text(this.senka[2][i], canvas.width - 60, 200 + 40 + 25*i, 16);
          nikuudon.x -= nikuudon.returnWidthAndHeight()[0];
          this.add(nikuudon, 1);
        }
        this.add(new Rect(60,355,canvas.width -60*2,30),1);
        this.add(new Text("入手カード","half",360,20),1);
        for (var i = 0; i < this.senka[3].length; i++) {
          let _x = i % 5;
          let _y =  Math.floor(i / 5);
          let _w = (canvas.width - 30) / 5 - 10;
          let _card  = new Sprite(this.senka[3][i].img[1],30 + (_w + 10) * _x,400 + (_w + 10) * _y,_w,_w);
          this.add(_card,1);
        }
      }
    
      
    }else{
      
      this.add(new Text("未実装です","half","half"),1);
    }
    
    if(this.isLoginBonusFinished == false){
      this.add(new Rect(30,100,canvas.width - 60,440,false,"#ddf"),1);
      this.add(new Rect(30,100 + 20,canvas.width - 60,50,false,"#f44"),1);
      this.add(new Rect(30,100 + 7,canvas.width - 60,10,false,"#f44"),1);
      this.add(new Rect(30,100 + 73,canvas.width - 60,10,false,"#f44"),1);
      this.add(new Text("ログインボーナス","half",130,30),1);
      this.add(new Rect(30+3,100 + 440 *2/3,canvas.width - 66,540-100-440*2/3 -3,false,"#444"),1);
      this.add(new Rect(30+3 +10,100 + 440 *2/3 +10,50,50,false,"#666"),1);
      this.add(new Rect(30+3,100 + 440*2/3 - 40,90,30,false,"#293"),1);
      this.add(new Text("?周目!!",30+20,100+440*2/3 -40 +6),1);
      let serifuRect = new Rect(30+3,183 + 7,130,100,false,"black");
      serifuRect.globalAlpha = 0.5;
      this.add(serifuRect,1);
      this.add(new Rect(30+3+15,183+7+100-10,130,20,false,"#e55"),1);
    }
  }
  
  addModoru(_beforeMenuNum =2,arrWhichBecomeNull = ["charactorNum","sensenTargetNum"]){
    let modoru = new Rect(26, 90, 50, 25);
    modoru.touchevent = () => {
      if (modoru.isTouched(touch)[0] == "touchstart" && modoru.isTouched(touch)[1] == true) {
        game.wait += 10;
        for (var i = 0; i < arrWhichBecomeNull.length; i++) {
          this[arrWhichBecomeNull[i]] = null;
        }
        this.menuNum = _beforeMenuNum;
      }
    }
    this.add(modoru, 1);
    this.add(new Text("戻る", (canvas.width - (64 + 3) * 5 + 3) / 2 + 7, 90 + 2, 18), 1);
  }
  
  addCharactorsSelect(y = 125,_nextMenuNum = null,needHazusu = false){
    for (var i = 0; i < charactors.length +1; i++) {
      if(needHazusu == false && i == charactors.length)continue;
      let _x = i % 5;
      let _y = Math.floor(i / 5);
      let _rect = new Rect((canvas.width - (64 + 3) * 5 + 3) / 2 + 3 + (64 + 3) * _x, y + 3 + (64 + 3) * _y, 64, 64);
      _rect.charactorNum = i;
      if(i == charactors.length )_rect.charactorNum = "はずす";
      _rect.touchevent = () => {
        if (isClick(_rect) == true) {
          game.wait += 10;
          this.charactorNum = _rect.charactorNum;
          let a = _nextMenuNum;
          if(a != null)this.menuNum = _nextMenuNum;
        }
      };
      this.add(_rect, 1);
      
      if(i < charactors.length){
        let sp = user.returnCardsByCharactorNum(i,true)[0];
        if(sp != null){
        this.add(new Sprite(sp.img[1],(canvas.width - (64 + 3) * 5 + 3) / 2 + 3 + (64 + 3) * _x, y + 3 + (64 + 3) * _y, 64, 64));
        }
      }
      
      let _name = "はずす";
      if(i != charactors.length )_name = charactors[i];
      let charaname = new Text(_name, (canvas.width - (64 + 3) * 5 + 3) / 2 + 3 + (64 + 3) * _x, y + 3 + (64 + 3) * _y + 50, 14);
      charaname.x += (64 - charaname.returnWidthAndHeight()[0]) / 2;
      if(i == charactors.length )charaname.y += -50+64/2-7;
      this.add(charaname, 1);
    }
  }
  
}

class GachaScene extends Scene{
  constructor(_mode){
    super();
    this.kakuritsu = [45,85,97,100];
    this.isTestmode = false;
    this.mode = _mode;//108,
    this.flag = 0;
    this.frame = 0;
    game.donttouch = true;
    setTimeout(()=>{game.donttouch = false;},1500);
    this.cardCount = 1;
    this.cardImgs = [];
    this.cardObjs = []; //user.cardsにconcatする
    
    if(this.mode == 108){
      if(this.isTestmode == true){
        for (var i = 0; i < 108; i++) {
          let img = new Image();
          img.src = "./cardimage/N_0_001.png";
          this.cardImgs.push(new GachaCardSprite(img,"half",180,90,90 * 4/3,this.mode,i));
          this.cardObjs.push(new Card(0));
        }
      }else{
        //カードの選出
        for (var i = 0; i < 108; i++) {
          let _ran = randomNum(0,100);
          let _rea ;
          if(_ran >= 0 && _ran <= this.kakuritsu[0])_rea = 0;
          if(_ran > this.kakuritsu[0] && _ran <= this.kakuritsu[1])_rea = 1;
          if(_ran > this.kakuritsu[1] && _ran <= this.kakuritsu[2])_rea = 2;
          if(_ran > this.kakuritsu[2] && _ran <= this.kakuritsu[3])_rea = 3;
          
          if(reabetsuCards[_rea].length == 0)_rea--;
          if(reabetsuCards[_rea].length == 0)_rea--;
          if(reabetsuCards[_rea].length == 0)_rea--;
          
          let cardsuu = reabetsuCards[_rea].length;
          let _ran2 = randomNum(0,cardsuu -1);
          let targetCard = new Card(reabetsuCards[_rea][_ran2].num);
          
          this.cardImgs.push(new GachaCardSprite(targetCard.img[0], "half", 180, 90, 90 * 4 / 3, this.mode, i,targetCard.reality));
          this.cardObjs.push(targetCard);
        }
        
      }
    }
  }
  
  touchevent(){
    if(this.flag == 0 && touch.type == "touchstart"){
      this.flag = 1;
    }
    if (this.flag == 2 && touch.type == "touchstart") {
      user.ticket --;
      user.cards = user.cards.concat(this.cardObjs);
      game.blackoutFunction(menuScene);
    }
  }
  
  update(){
    this.setScene(this.mode);
    super.update();
  }
  
  setScene(_mode){
    this.sceneItems = [];
    this.add(new Text(this.flag,0,570));//確認用
    
    if(this.flag == 0){
      this.add(new Text("TAP!","half",560,25));
    }else if(this.flag == 1 || this.flag == 2){
      //this.cardImgsを時間差で順番にupdateしていく
      /*オーバーフローしたのでいっぺんにupdateすることにした
      this.frame ++;
      let interval = 1;
      if(this.frame % interval == 0 && this.cardCount < this.cardImgs.length){
        this.cardCount++;
      }
      if(this.frame > interval * (this.cardImgs.length + 1)){
        this.flag = 2;
      }
      for (var i = 0; i < this.cardCount; i++) {
        this.cardImgs[this.cardCount - 1 -i].update();
      }
      */
      if(this.mode == 108){
        for (var i = 0; i < this.cardImgs.length; i++) {
          this.cardImgs[i].update();
        }
        if(this.cardImgs[0].frame > this.cardImgs[0].keyFrame[2] + 50)this.flag = 2;
      }
      
    }
    if(this.flag == 2){
      this.add(new Text("TAP!","half",560,25));
    }
  }
}

class BattleScene extends Scene{
  constructor(_stagenum){
    
    super();
    
    //enemyImageの読み込み
    let stageEnemy = stages[_stagenum].enemy;//階層ごとに[enemynum,zokusei]が入った二次元配列
    this.enemy = [];
    let enemyImageReadPromises = [];
    for (var i = 0; i < stageEnemy.length; i++) {
      let kaisouEnemy = [];
      for (var j = 0; j < stageEnemy[i].length; j++) {
        let _enemy = new Enemy(stageEnemy[i][j][0], stageEnemy[i][j][1]);
        kaisouEnemy.push(_enemy);
        let _promise = new Promise((resolve)=>{
          _enemy.img.onload = ()=>{
            resolve();
          }
        })
        enemyImageReadPromises.push(_promise);
      }
      this.enemy.push(kaisouEnemy);
    }
    this.isEnemyImagesRead = 1;//フェードイン用に真っ黒の透明度を兼ねる
    
    
    
    this.sensenStatus = user.returnSensenStatus();
    this.sensenCharactor = [].concat(user.sensen);
    this.sensenCards = [];
    for (var i = 0; i < this.sensenCharactor.length; i++) {
      if(this.sensenCharactor[i] == null){
        this.sensenCards.push(null);
      }else{
        this.sensenCards.push(user.returnCardsByCharactorNum(this.sensenCharactor[i],true));
      }
    }
    this.sensenBukiSkills = []; //[武器スキルナンバー、属性、必要ポイント、ImageObj]をいれていく
    for (var i = 0; i < this.sensenCharactor.length; i++) {
      if (this.sensenCharactor[i] == null) {
        this.sensenBukiSkills.push([null,null,null,null]);
      } else {
        let thisChara = this.sensenCards[i];
        if(thisChara[0] == null){
          //先頭のカードが未設定
          this.sensenBukiSkills.push([null,null,null,null]);
        }else{
          if(thisChara[4] != null){
            //武器を装備している場合
            let thisBukiSkill = thisChara[4].skill;
            let thisCharaZokusei = thisChara[0].zokusei;
            let thisBukiSkillCost = bukiSkillCost[thisBukiSkill];
            //spiteを取得
              let thisBukiSkillImage = new Image();;
              if(thisBukiSkill <= 8)thisBukiSkillImage.src = "skillImage/skill" + (thisBukiSkill +1) + ".png";
              if(thisBukiSkill > 8){
                let colorInitial = ["r","g","b","y","p"];
                thisBukiSkillImage.src = "skillImage/skill" + (thisBukiSkill +1) + colorInitial[zokusei.indexOf(thisChara[0].zokusei)]  + ".png";
              }
              let _promise = new Promise((resolve) => {
                thisBukiSkillImage.onload = () => {
                  resolve();
                }
              })
              enemyImageReadPromises.push(_promise);
          
            this.sensenBukiSkills.push([thisBukiSkill,thisCharaZokusei,thisBukiSkillCost,thisBukiSkillImage]);
          }else{
            this.sensenBukiSkills.push([null,null,null,null]);
          }
        }
      }
    }
    
    this.isHereBukiSkill = [false,false,false,false,false] //盤面に武器スキルが存在しているか
    this.bukiSkillDameBairitsu = 1;//武器スキルによるダメージ量増加
    
    
    
    this.maxhp = this.sensenStatus.hp;
    this.hp = this.maxhp;
    this.bukiSkillPoint = [0,0,0,0,0];
    this.turnTime = 5;//秒
    this.time = this.turnTime;//実際に減らして使う
    this.isTimerStarted = false;
    this.timerInterval; //setIntervalを入れる
    this.highTensionPoint = 0;
    if("startHighTensionPoint" in stages[_stagenum]){
      this.highTensionPoint = stages[_stagenum].startHighTensionPoint;
    }
    this.faze = 0;
    
    this.stagenum = _stagenum;
    let _stage = stages[_stagenum];
    this.brick = [].concat(_stage.brick);
    this.kaisou = _stage.kaisou;
    this.kai = 1;
    this.bgImg = null;
    if(_stage.bgImgSrc != null){
      this.bgImg = new Image();
      this.bgImg.src = _stage.bgImgSrc;
      enemyImageReadPromises.push(new Promise((resolve) => {
        this.bgImg.onload = () => {
          resolve();
        }
      }));
    }
    this.targetImg = new Image();
    this.targetImg.src = "./brickImage/target.png";
    enemyImageReadPromises.push(new Promise((resolve) => {
      this.targetImg.onload = () => {
        resolve();
      }
    }));
    
    
    Promise.all(enemyImageReadPromises).then(() => {
      this.isEnemyImagesRead = 0.9;
    });
    
    this.enemyTarget = 0; //選択されている攻撃対象。this.enemy[this.kai -1]のindex
    this.battleAtackResult = [];
    this.hidame = 0;//受けるダメージ
    
    this.useableHeight = 6;
    if("useableHeight" in stages[this.stagenum])this.useableHeight = Math.min(stages[this.stagenum].useableHeight,6);
    
    this.flushCount = 0;
    this.fadeCount = 0;
    this.bluckoutCount = 0;
    
    this.startZahyou = [null,null];
    this.lastZahyou = [null,null];
    this.lines = [];
    this.selectedZahyou = [];
    this.dessapieredBricks = {"赤":0,"緑":0,"青":0,"黄":0,"紫":0,"心":0};
    this.fall = [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                   ];
    this.fallSpead = 15;
    this.fallCount = 0;
    this.fallEndCount = 0;
    this.isSuffleMessageClose = false; //game.toucheventから変更される
    this.banmen = [
      [],[],[],[],[],[],[]
    ];
    this.banmenForByouga = [//落下などのために
      [], [], [], [], [], [], []
    ];
    let banmenSet = ()=>{
      this.banmen = [
            [], [], [], [], [], [], []
          ];
      this.banmenForByouga = [ //落下などのために
            [], [], [], [], [], [], []
          ];
      for (var i = 0; i < this.banmen.length; i++) {
        for (var j = 0; j < 12; j++) {
          let br = randomNum(0,this.brick.length -1);
          br = this.brick[br];
          this.banmen[i].push(br);
          this.banmenForByouga[i].push(br);
        }
      }
    }
    
    banmenSet();
    while(this.isTsumiBanmen(this.banmen) == true){
      banmenSet();
    }
    
    
    
    for (var i = 0; i < this.banmen.length; i++) {
      for (var j = 0; j < this.useableHeight; j++) {
        let _x = i;
        let _y = j;
        let _w = (canvas.width - 4) / 7 *2/3;
        let tile = new Rect(2 +_w /6  + _w*3/2 * _x, canvas.height - _w*3/2*5/6 - 2 - _w*3/2 * _y, _w, _w, false, "black");
        tile.zahyou = [i,j];
        tile.touchevent = () => {
          if(this.faze == 1){
            
            //this.selectedZahyouに設定されたブロックを消す関数
            let brickDessapier = (isBukiSkill = false)=>{
              let _num ;
              if(isBukiSkill == false){
                //this.dessapieredBricksの加算
                let _zokusei = this.banmen[this.selectedZahyou[0][0]][this.selectedZahyou[0][1]];
                 _num = this.selectedZahyou.length;
                if (_num > 9) _num += 1;
                if (_num > 7) _num += 1;
                if (_num > 5) _num += 1;
                this.dessapieredBricks[_zokusei] += _num;
              }else{
                _num = this.selectedZahyou.length;
                for (var de = 0; de < this.selectedZahyou.length; de++) {
                  let _zokusei = this.banmen[this.selectedZahyou[de][0]][this.selectedZahyou[de][1]];
                  if(zokusei.includes(_zokusei)==true){
                    this.dessapieredBricks[_zokusei] += 1;
                  }
                }
              }
                
              //回復は即座に行う
              if(this.dessapieredBricks["心"] >0){
                 this.hp = Math.min(this.maxhp, this.hp + this.dessapieredBricks["心"] * this.sensenStatus["心"]);
                 this.dessapieredBricks["心"] = 0;
              }
                
              let newBukiSkill = [];//ここに入れるindexは新たに武器スキルを出現させる必要あり
              //武器スキルポイントの加算
              for (var i = 0; i < this.sensenBukiSkills.length; i++) {
                  if(this.sensenBukiSkills[i][0] != null){
                    this.bukiSkillPoint[i] += _num;
                    if(this.bukiSkillPoint[i] >= this.sensenBukiSkills[i][2]){
                      this.bukiSkillPoint[i] = this.sensenBukiSkills[i][2];
                      if(this.isHereBukiSkill[i] == false){
                        newBukiSkill.push(i);
                      }
                    }
                  }
              }
                
              //消したブロック数に応じてthis.highTensionPointを増やす
              if(this.highTensionPoint < 100){
                this.highTensionPoint = Math.min(this.highTensionPoint +  _num,100);
              }
              
              //消したブロック数に応じてthis.timeを増やす
              let plusTime = _num/50;
              if(isBukiSkill == true)plusTime = _num/100;
              if(this.time > 0){
                this.time =Math.min(this.time +  plusTime,this.turnTime);
              }
              
                //ブロックを消し、落とす。
                let rakkasuu = [
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0],
                 ];
               
               
                for (var k = 0; k < this.selectedZahyou.length; k++) {
                  this.banmen[this.selectedZahyou[k][0]][this.selectedZahyou[k][1]] = "無";
                  this.banmenForByouga[this.selectedZahyou[k][0]][this.selectedZahyou[k][1]] = "無";
                  for (var n = this.selectedZahyou[k][1]; n < 12; n++) {
                    rakkasuu[this.selectedZahyou[k][0]][n] +=1;
                  
                  }
                }
                this.selectedZahyou = [];
                
                for (var m = 0; m < rakkasuu.length; m++) {
                  let copy1 = [].concat(rakkasuu[m]);
                  for (var p = 0; p < copy1.length; p++) {
                    copy1[p] = copy1[p] * (canvas.width - 4) / 7 ;//ピクセル数に変換
                    //this.fallに加算
                    this.fall[m][p] += copy1[p];
                  }
                  ;
                }

                //新たな盤面を算出
                //this.banmenの無を右に寄せる
                for (var t = 0; t < this.banmen.length; t++) {
                  let _x = this.banmen[t].length  -1;
                  while(_x > 0){
                    for (var u = 0; u < _x; u++) {
                      if(this.banmen[t][u] == "無"){
                        this.banmen[t][u] = this.banmen[t][u +1];
                        this.banmen[t][u +1] = "無";
                      }
                    }
                    _x--;
                  }
                }
                //無に代入
                let maxRakkasuu = 0;
                for (var t = 0; t <this.banmen.length; t++) {
                  for (var u = 0; u < this.banmen[t].length; u++) {
                    maxRakkasuu = Math.max(maxRakkasuu,rakkasuu[t][u]);
                    if(this.banmen[t][u] == "無"){
                      let br = randomNum(0, this.brick.length - 1);
                      br = this.brick[br];
                     this. banmen[t][u] = br;
                    }
                  }
                }
                
                //落下にかかる時間が現在の状態より多いならthis.fallCountとthis.fallEndCountを更新
                if(this.fallEndCount - this.fallCount < maxRakkasuu  * (canvas.width - 4) / 7 ){
                  this.fallCount = 0;
                  this.fallEndCount = maxRakkasuu  * (canvas.width - 4) / 7 ;
                }
                
                if(newBukiSkill.length> 0){
                  //武器スキルの出現
                  //新たに盤面に落ちるブロックたちの座標を得る
                  let _newZahyou = [];
                  for (var t = 0; t < rakkasuu.length; t++) {
                    for (var u = this.useableHeight; u < rakkasuu[t].length; u++) {
                      if(u - rakkasuu[t][u] < this.useableHeight ){
                        _newZahyou.push([t,u]);
                      }
                    }
                  }
                  
                  //座標の選択
                  let newBukiSkillZahyou = [];
                  if(_newZahyou.length > newBukiSkill.length){
                    //ランダムに選定
                    for (var v = 0; v < newBukiSkill.length; v++) {
                      let _random = randomNum(0,_newZahyou.length -1);
                      newBukiSkillZahyou.push(_newZahyou[_random]);
                      _newZahyou.splice(_random,1);
                    }
                  }else if(_newZahyou.length == newBukiSkill.length){
                    newBukiSkillZahyou = _newZahyou;
                  }else{
                    let sa =   newBukiSkill.length- _newZahyou.length;
                    newBukiSkill.splice(newBukiSkill.length -1 -sa,sa);
                    newBukiSkillZahyou = _newZahyou;
                  }
                  
                  //当該座標を武器スキルに変化させる
                  for (var o = 0; o < newBukiSkillZahyou.length; o++) {
                    this.banmenForByouga[newBukiSkillZahyou[o][0]][newBukiSkillZahyou[o][1]] = "スキル" + newBukiSkill[o];
                    this.banmen[newBukiSkillZahyou[o][0]][newBukiSkillZahyou[o][1] - rakkasuu[newBukiSkillZahyou[o][0]][newBukiSkillZahyou[o][1]] ] ="スキル" +  newBukiSkill[o];
                    
                    //this.isHereBukiSkillに記録
                    this.isHereBukiSkill[newBukiSkill[o]] = true;
                  }
                }
                
              
                //lineを消す
                this.lines = [];
              }
              
              //タイマーを開始する関数
              let timerSet = ()=>{
                if (this.isTimerStarted == false && this.faze == 1) {
                  this.isTimerStarted = true;
                  this.timerInterval = setInterval(() => {
                    if (this.faze != "シャッフルメッセージ表示中" &&  game.confirm.length == 0) this.time -= 0.05;
                    if (this.time <= 0) {
                      clearInterval(this.timerInterval);
                      if(this.highTensionPoint > 1000)this.highTensionPoint = 0;
                      this.faze = 2;
                      this.time = 0;
                      if (this.selectedZahyou.length > 0) brickDessapier();
                      this.startZahyou = [null, null];
                      this.lastZahyou = [null, null];
                      this.selectedZahyou = [];
                      this.battleAtackResult = this.battleAtack();
                
                
                    }
                  }, 50);
                }
              }
              
              //指定した座標のブロックを変換する関数
              let bricksHenkan= (_afterZokusei,_zahyou = [])=>{
                for (var za = 0; za < _zahyou.length; za++) {
                  this.banmenForByouga[_zahyou[za][0]][_zahyou[za][1]] = _afterZokusei;
                  this.banmen[_zahyou[za][0]][_zahyou[za][1]] = _afterZokusei;
                }
              }
              
            
            if(tile.isTouched(touch)[1] == true && touch.type == "touchstart" && this.startZahyou[0] == null && this.banmen[tile.zahyou[0]][tile.zahyou[1]].includes("スキル") == true){
              //スキルの発動
              let otherBukiSkill =[ [tile.zahyou[0],tile.zahyou[1] ]];//スキルによって他の武器スキルも連鎖するなら、その座標を入れる
              let tyousaMap = [
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0]
              ];//重複してthis.selectedZahyouにいれないために。
              
              let skillHatsudou = (_zahyou)=>{
                let _num = null;
                for (var cha = 0; cha < this.sensenBukiSkills.length; cha++) {
                  if(this.banmen[_zahyou[0]][_zahyou[1]] == "スキル" + cha)_num = cha;
                }
                if(_num == null)return false;
                let thisSkill = [].concat(this.sensenBukiSkills[_num]);
                //武器スキルがあった場所がthis.selectedZahyouにないならthis.selectedZahyouに追加
                if(tyousaMap[_zahyou[0]][_zahyou[1]] == 0){
                  this.selectedZahyou.push([_zahyou[0],_zahyou[1]]);
                  tyousaMap[_zahyou[0]][_zahyou[1]] = "調";
                }
                //スキル別に処理
                if(thisSkill[0] < 3){
                  //このターンに与えるダメージup
                  this.bukiSkillDameBairitsu += (thisSkill[0] +1) /10;
                
                }else if(thisSkill[0] < 6){
                  //縦、横、縦横消し
                  if(thisSkill[0] == 4 || thisSkill[0] == 5){
                    //横を無にする
                    for (var yoko = 0; yoko < this.banmen.length; yoko++) {
                      if(yoko != _zahyou[0] && tyousaMap[yoko][_zahyou[1]] == 0){
                        this.selectedZahyou.push([yoko,_zahyou[1]]);
                        tyousaMap[yoko][_zahyou[1]] = "調";
                        if(this.banmen[yoko][_zahyou[1]].includes("スキル")){
                          otherBukiSkill.push([yoko,_zahyou[1]]);
                        }
                      }
                    }
                  }
                  if (thisSkill[0] == 3 || thisSkill[0] == 5) {
                    //縦を無にする
                    for (var tate = 0; tate < this.useableHeight.length; tate++) {
                      if (tate != _zahyou[1] && tyousaMap[_zahyou[0]][tate] == 0) {
                        this.selectedZahyou.push([ _zahyou[0],tate]);
                        tyousaMap[_zahyou[0]][tate] = "調";
                        if (this.banmen[_zahyou[0]][tate].includes("スキル")) {
                          otherBukiSkill.push([ _zahyou[0],tate]);
                        }
                      }
                    }
                  }
                
                
                }else if(thisSkill[0] < 9){
                  //周囲のブロックを消す4,8,12
                  let kouhoZahyou = [];
                  //4
                  kouhoZahyou.push([_zahyou[0] -1,_zahyou[1]]);
                  kouhoZahyou.push([_zahyou[0] +1,_zahyou[1]]);
                  kouhoZahyou.push([_zahyou[0] ,_zahyou[1] -1]);
                  kouhoZahyou.push([_zahyou[0] ,_zahyou[1] +1]);
                  if(thisSkill[0] >=7){
                    //8
                    kouhoZahyou.push([_zahyou[0] - 1, _zahyou[1] -1]);
                    kouhoZahyou.push([_zahyou[0] + 1, _zahyou[1] -1]);
                    kouhoZahyou.push([_zahyou[0] -1, _zahyou[1] + 1]);
                    kouhoZahyou.push([_zahyou[0] +1, _zahyou[1] + 1]);
                  }
                  if (thisSkill[0] >= 8) {
                    //12
                    kouhoZahyou.push([_zahyou[0] - 2, _zahyou[1]]);
                    kouhoZahyou.push([_zahyou[0] + 2, _zahyou[1]]);
                    kouhoZahyou.push([_zahyou[0] , _zahyou[1] + 2]);
                    kouhoZahyou.push([_zahyou[0] , _zahyou[1] + 2]);
                  }
                  //盤面内の座標のみ抽出
                  let kouhoZahyou2 = [];
                  for (var ko = 0; ko < kouhoZahyou.length; ko++) {
                    if(kouhoZahyou[ko][0] >= 0 &&kouhoZahyou[ko][0] < this.banmen.length &&kouhoZahyou[ko][1] >= 0 &&kouhoZahyou[ko][1] < this.useableHeight  )kouhoZahyou2.push(kouhoZahyou[ko]);
                  }
                  //this.selectedZahyouにpush
                  for (var ko = 0; ko < kouhoZahyou2.length; ko++) {
                    if(tyousaMap[kouhoZahyou2[ko][0]][kouhoZahyou2[ko][1]] == 0){
                      this.selectedZahyou.push([].concat(kouhoZahyou2[ko]));
                      tyousaMap[kouhoZahyou2[ko][0]][kouhoZahyou2[ko][1]] = "調";
                      if(this.banmen[kouhoZahyou2[ko][0]][kouhoZahyou2[ko][1]].includes("スキル")){
                        otherBukiSkill.push([kouhoZahyou2[ko][0],kouhoZahyou2[ko][1]]);
                      }
                    }
                  }
                 
                
                
                
                  }else if(thisSkill[0] < 11){
                  //ブロック変化
                  let afterZokusei = thisSkill[1];
                  let kouhoZahyou = [];
                  //変換候補の座標を取得
                  for (var retsu = 0; retsu < this.banmen.length; retsu++) {
                    for (var gyou = 0; gyou < this.useableHeight; gyou++) {
                      if(this.banmen[retsu][gyou] != afterZokusei && this.banmen[retsu][gyou].includes("スキル") == false &&this.banmen[retsu][gyou] != "無" &&tyousaMap[retsu][gyou] == 0  ){
                        kouhoZahyou.push([retsu,gyou]);
                      }
                    }
                  }
                  //ランダムに抽出
                  let henkanNum = 3;
                  if(thisSkill[0] == 10)henkanNum = 6;
                  let tyuusyutsuZahyou = [];
                  if(kouhoZahyou.length <= henkanNum){
                    tyuusyutsuZahyou = kouhoZahyou;
                  }else{
                    for (var shi = 0; shi < henkanNum; shi++) {
                      let _ran = randomNum(0,kouhoZahyou.length -1);
                      tyuusyutsuZahyou.push([].concat(kouhoZahyou[_ran]));
                      kouhoZahyou.splice(_ran,1);
                    }
                  }
                bricksHenkan(afterZokusei,tyuusyutsuZahyou);
                
                
                
                }else if(thisSkill[0] == 11){
                   //同属性消し
                  for (var retsu = 0; retsu < this.banmen.length; retsu++) {
                    for (var gyou = 0; gyou < this.useableHeight; gyou++) {
                      if (this.banmen[retsu][gyou] == thisSkill[1] && tyousaMap[retsu][gyou] == 0) {
                        this.selectedZahyou.push([retsu, gyou]);
                        tyousaMap[retsu][gyou] = "調";
                      }
                    }
                  }
                 
                }
                //武器スキルを消費
                this.bukiSkillPoint[_num] = 0;
                this.isHereBukiSkill[_num] = false;
              }//skillHatsudou終了
              
              while(otherBukiSkill.length > 0){
                let skillsuu = otherBukiSkill.length;
                for (var sk = 0; sk < skillsuu; sk++) {
                  skillHatsudou([otherBukiSkill[sk][0],otherBukiSkill[sk][1]]);
                }
                otherBukiSkill.splice(0,skillsuu);
              }
              
              brickDessapier(true);
              timerSet();
             
              
            }else if(this.highTensionPoint > 1000){
              //ハイテンションモード
              if(tile.isTouched(touch)[1] == true && touch.type == "touchstart"){
                let _tyousaZahyou = [ { zahyou:[tile.zahyou[0],tile.zahyou[1]], from:null } ]; 
                let _zokusei = this.banmen[tile.zahyou[0]][tile.zahyou[1]];
                let _tyousaMap = [
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,0,0]
                ];
                
                let _tyousa = (_zahyouX,from = null)=>{
                  
                  let _isAlready = (_zahyouY)=>{
                    if( _tyousaMap[_zahyouY[0]][_zahyouY[1]] == "調")return true;
                    return false;
                  };
                  
                  
                  
                  if(from != "上" && _zahyouX[1] +1 < this.useableHeight){
                    let _targetZahyou = [_zahyouX[0],_zahyouX[1] +1];
                    if(this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false){
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({zahyou:[].concat(_targetZahyou),from:"下"})
                      
                      
                    }
                  }
                  if (from != "下" && _zahyouX[1] -1 >= 0) {
                    let _targetZahyou = [_zahyouX[0], _zahyouX[1] - 1];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "上" })
                    }
                  }
                  if (from != "右" && _zahyouX[0] + 1 < this.banmen.length) {
                    let _targetZahyou = [_zahyouX[0] +1, _zahyouX[1]];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "左" })
                    }
                  }
                  if (from != "左" && _zahyouX[0] -1 >=0) {
                    let _targetZahyou = [_zahyouX[0] -1, _zahyouX[1]];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "右" })
                    }
                  }
                  if (from != "右上" && _zahyouX[1] + 1 < this.useableHeight &&_zahyouX[0] + 1 < this.banmen.length ) {
                    let _targetZahyou = [_zahyouX[0] +1, _zahyouX[1] + 1];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "左下" })
                    }
                  }
                  if (from != "左上" && _zahyouX[1] + 1 < this.useableHeight && _zahyouX[0] - 1 >= 0) {
                    let _targetZahyou = [_zahyouX[0] - 1, _zahyouX[1] + 1];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "右下" })
                    }
                  }
                  if (from != "右下" && _zahyouX[1] -1 >= 0 && _zahyouX[0] +1 < this.banmen.length) {
                    let _targetZahyou = [_zahyouX[0] +1, _zahyouX[1] - 1];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "左上" })
                    }
                  }
                  if (from != "左下" && _zahyouX[1] -1 >= 0 && _zahyouX[0] - 1 >= 0) {
                    let _targetZahyou = [_zahyouX[0] - 1, _zahyouX[1] - 1];
                    if (this.banmen[_targetZahyou[0]][_targetZahyou[1]] == _zokusei && _isAlready(_targetZahyou) == false) {
                      this.selectedZahyou.push([].concat(_targetZahyou));
                      _tyousaMap[_targetZahyou[0]][_targetZahyou[1]] = "調"
                      _tyousaZahyou.push({ zahyou: [].concat(_targetZahyou), from: "右上" })
                    }
                  }
                };
                
                while(_tyousaZahyou.length >0){
                  let _tyousasuu = _tyousaZahyou.length;
                  for (var tyo = 0; tyo < _tyousasuu; tyo++) {
                    _tyousa(_tyousaZahyou[tyo].zahyou , _tyousaZahyou[tyo].from);
                  }
                  _tyousaZahyou.splice(0,_tyousasuu);
                }
                
                if(this.selectedZahyou.length >= 1){
                  this.selectedZahyou.push([tile.zahyou[0],tile.zahyou[1]]);
                  brickDessapier();
                  timerSet();
                  game.wait += 15;
                }
                
                
              }
            
            }else if(tile.isTouched(touch)[1] == true && touch.type == "touchstart" && this.startZahyou[0] == null){
              //ブロックをタッチ
              this.startZahyou[0] = tile.zahyou[0];
              this.startZahyou[1] = tile.zahyou[1];
              this.lastZahyou[0] = tile.zahyou[0];
              this.lastZahyou[1] = tile.zahyou[1];
              
            }else if(tile.isTouched(touch)[1] == true && touch.type == "touchmove" && this.isRinsetsu([].concat(tile.zahyou)) == true && this.isSameBrick([].concat(tile.zahyou)) == true){
              //隣接する同ブロックをtouchmove
              //すでに選択されているか判別
              let isAlready = false;
              for (var g = 0; g < this.selectedZahyou.length; g++) {
                if(this.selectedZahyou[g][0] == tile.zahyou[0] && this.selectedZahyou[g][1] == tile.zahyou[1] )isAlready = true;
              }
              if(isAlready == false){
                if(this.startZahyou[0] == this.lastZahyou[0] && this.startZahyou[1] == this.lastZahyou[1]){
                  //最初ならthis.startZahyouをthis.selectedZahyouに登録
                  this.selectedZahyou.push([].concat(this.startZahyou));
                }
                
                //lineをthis.timelyItemsに追加
                let lineWidth = 15;
                let start = this.lastZahyou;
                let startX = 2 +_w /6  + _w*3/2 * start[0] +_w/2;
                let startY = canvas.height - _w*3/2*5/6 - 2 - _w*3/2 * start[1] + _w/2 ;
                let end = tile.zahyou;
                let endX = 2 +_w /6  + _w*3/2 * end[0] +_w/2 ;
                let endY = canvas.height - _w*3/2*5/6 - 2 - _w*3/2 * end[1] + _w/2 ;
                let line = new Line(startX,startY,endX,endY,"white",lineWidth);
                line.globalAlpha = 0.8;
                this.lines.push(line);
                
                //tile.zahyouを記録
                this.lastZahyou = [tile.zahyou[0],tile.zahyou[1]];
                this.selectedZahyou.push([].concat(this.lastZahyou));

              }
            }else if(touch.type == "touchend" && this.selectedZahyou.length > 0){
              if(tile.isTouched(touch)[1] == true && this.isRinsetsu([].concat(tile.zahyou)) && this.isSameBrick([].concat(tile.zahyou))){
                
                let isAlready = false;
                for (var g = 0; g < this.selectedZahyou.length; g++) {
                  if (this.selectedZahyou[g][0] == tile.zahyou[0] && this.selectedZahyou[g][1] == tile.zahyou[1]) isAlready = true;
                }
                if (isAlready == false) {
                  this.selectedZahyou.push([].concat(tile.zahyou));
                }
              }
              
              
              
              brickDessapier();
              timerSet();
              
              
            }
          }
        };
        this.add(tile,0);
      }
    }
    this.setBasicItems();
  }
  
  stageClear(){
    let ste = stages[this.stagenum];
    let gb = 0;
    if("getBeats" in ste)gb = ste.getBeats;
    user.b += gb;
    let ge = 0;
    if ("getExp" in ste) ge = ste.getExp;
    user.exp += ge;
    let gi = [0,0,0];
    if ("getItems" in ste) gi = [].concat(ste.getItems);
    user.syokken[1] += gi[0];
    user.syokken[2] += gi[1];
    user.syokken[3] += gi[2];
    let gc = [];
    if ("getCards" in ste){ 
      for (var i = 0; i < ste.getCards.length; i++) {
        user.cards.push(new Card(ste.getCards[i]));
        gc.push(new Card(ste.getCards[i]));
      }
    }
    return [gb,ge,gi,gc,user.lvup()];
  }
  
  battleAtack(){
    //[this.enemy.index,与えるダメージ]を入れた二次元配列を返す
    
    //制限時間経過後の戦闘の計算
    let _bricks = copyObj(this.dessapieredBricks);
    for (var zo = 0; zo < 4; zo++) {
      _bricks[zokusei[zo]] = Math.round(_bricks[zokusei[zo]]  * this.bukiSkillDameBairitsu);
    }
    
    let _status = this.sensenStatus;
    let _enemies = this.enemy[this.kai - 1];
    let _dame = (zoku,ene = null,_sta = _status)=>{//eneは_enemiesのindex
      if(ene != null){
        return _bricks[zoku] * _sta[zoku] * _enemies[ene].damebairitsu(zoku);
      }
      return _bricks[zoku] * _sta[zoku] ;
    }
    let reArr = [];

    //次のターゲット候補たちの属性を算出
    let _nextTargetWeakZokusei = [[this.enemyTarget,_enemies[this.enemyTarget].hp,_enemies[this.enemyTarget].returnWeakZokusei(),_enemies[this.enemyTarget].returnResistZokusei()]];
    for (var i = 0; i < _enemies.length; i++) {
      if(_enemies.hp <= 0)continue;
      if(this.enemyTarget == i)continue;
      _nextTargetWeakZokusei.push([i,_enemies[i].hp,_enemies[i].returnWeakZokusei(),_enemies[i].returnResistZokusei()]);  //_enemies.index,hp,weakZokusei,ResistZokusei
    }

    //攻撃によって何番目の敵まで倒せるか算出
    //ターゲットを倒せない場合(0体)
    let _targetEnemy = _enemies[this.enemyTarget];
    let dame1 = _dame("赤",this.enemyTarget) + _dame("緑",this.enemyTarget) + _dame("青",this.enemyTarget) + _dame("黄",this.enemyTarget) + _dame("紫",this.enemyTarget);
    if(dame1 < _targetEnemy.hp){
      return [[this.enemyTarget,dame1]];
    }
    //何体か倒せる場合(1 ~ _nextTargetWeakZokusei.length体)
    //x体と仮想で戦闘し、倒しきれるか返す関数。return [truefalse,余ったBrickObj]
    let kasouSentou = (enemysuu)=>{
      var _statusCopy = copyObj(_status);
      var _bricksCopy = copyObj(_bricks);
      var _nextCopy = [];
      for (var i = 0; i < _nextTargetWeakZokusei.length; i++) {
        _nextCopy.push([].concat(_nextTargetWeakZokusei[i]));
      }
      //weakZokuseiで攻撃する
      for (var i = 0; i < enemysuu; i++) {
        let _thisEnemyHp = _nextCopy[i][1];
        var _useBrickPow = Math.min(Math.floor(_thisEnemyHp / (_statusCopy[_nextCopy[i][2]] * WEAKBAIRITSU) ),_bricksCopy[_nextCopy[i][2]]);
        _bricksCopy[_nextCopy[i][2]] -= _useBrickPow;
        _nextCopy[i][1] -= _useBrickPow * _statusCopy[_nextCopy[i][2]] * WEAKBAIRITSU;
      }
      
      //resistZokuseiごとの残hpを算出
      let resistZanHp = {"赤":0,"緑":0,"青":0};
      for (var i = 0; i < enemysuu; i++) {
        if(_nextCopy[i][3] != null){
          resistZanHp[_nextCopy[i][3]] += _nextCopy[i][1];
        }
      }
      //多い順に並べた配列を作成
      let resistZanHpArr = [["赤",resistZanHp["赤"]],["緑",resistZanHp["緑"]],["青",resistZanHp["青"]]];
      if(resistZanHpArr[1][1] < resistZanHpArr[2][1]){
        let o = [].concat(resistZanHpArr[1]);
        resistZanHpArr[1] = [].concat(resistZanHpArr[2]);
        resistZanHpArr[2] = o;
      }
      if (resistZanHpArr[0][1] < resistZanHpArr[1][1]) {
        let o = [].concat(resistZanHpArr[0]);
        resistZanHpArr[0] = [].concat(resistZanHpArr[1]);
        resistZanHpArr[1] = o;
      }
      //残hpが最大のresistZokuseiで残hpが最小のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if(_nextCopy[i][3] == resistZanHpArr[2][0] && resistZanHpArr[2][1] > 0){
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[0][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[0][0]]));
          if(_statusCopy[resistZanHpArr[0][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[0][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[0][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[0][0]];
        }
      }
      //残hpが真ん中のresistZokuseiで残hpが最小のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if (_nextCopy[i][3] == resistZanHpArr[2][0] && resistZanHpArr[2][1] > 0) {
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[1][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[1][0]]));
          if(_statusCopy[resistZanHpArr[1][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[1][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[1][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[1][0]];
        }
      }
      //残hpが最大のresistZokuseiで残hpが真ん中のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if (_nextCopy[i][3] == resistZanHpArr[1][0] && resistZanHpArr[1][1] > 0) {
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[0][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[0][0]]));
          if(_statusCopy[resistZanHpArr[0][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[0][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[0][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[0][0]];
        }
      }
      //残hpが真ん中のresistZokuseiで残hpが最大のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if (_nextCopy[i][3] == resistZanHpArr[0][0] && resistZanHpArr[0][1] > 0) {
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[1][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[1][0]]));
          if(_statusCopy[resistZanHpArr[1][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[1][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[1][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[1][0]];
        }
      }
      //残hpが最小のresistZokuseiで残hpが真ん中のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if (_nextCopy[i][3] == resistZanHpArr[1][0] && resistZanHpArr[1][1] > 0) {
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[2][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[2][0]]));
          if(_statusCopy[resistZanHpArr[2][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[2][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[2][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[2][0]];
        }
      }
      //残hpが最小のresistZokuseiで残hpが最大のresistZokuseiを攻撃
      for (var i = 0; i < enemysuu; i++) {
        if (_nextCopy[i][3] == resistZanHpArr[0][0] && resistZanHpArr[0][1] > 0) {
          var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[2][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[2][0]]));
          if(_statusCopy[resistZanHpArr[2][0]] == 0)_useBrickPow = 0;
          _bricksCopy[resistZanHpArr[2][0]] -= _useBrickPow;
          _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[2][0]];
          resistZanHpArr[2][1] -= _useBrickPow * _statusCopy[resistZanHpArr[2][0]];
        }
      }
      //赤青緑で黄紫を攻撃
      for (var i = 0; i < enemysuu; i++) {
        for (var j = 0; j < 3; j++) {
          if ((_nextCopy[i][2] == "黄" || _nextCopy[i][2] == "紫") && _nextCopy[i][1] > 0) {
            var _useBrickPow = Math.min(_bricksCopy[resistZanHpArr[j][0]], Math.floor(_nextCopy[i][1] / _statusCopy[resistZanHpArr[j][0]]));
            if(_statusCopy[resistZanHpArr[j][0]] == 0)_useBrickPow = 0;
            _bricksCopy[resistZanHpArr[j][0]] -= _useBrickPow;
            _nextCopy[i][1] -= _useBrickPow * _statusCopy[resistZanHpArr[j][0]];
          }
        }
      }
      //残りをresist以外で攻撃。
      for (var i = 0; i < enemysuu; i++) {
        for (var j = 0; j < 5; j++) {
          if( _nextCopy[i][1] > 0 && _nextCopy[i][3] != zokusei[j]) {
            var _useBrickPow = Math.min(_bricksCopy[zokusei[j]], Math.floor(_nextCopy[i][1] / _statusCopy[zokusei[j]]));
            if(_statusCopy[zokusei[j]] == 0)_useBrickPow = 0;
            _bricksCopy[zokusei[j]] -= _useBrickPow;
            _nextCopy[i][1] -= _useBrickPow * _statusCopy[zokusei[j]];
          }
        }
      }
      //余りを攻撃。
      for (var i = 0; i < enemysuu; i++) {
        for (var j = 0; j < 5; j++) {
          if (_nextCopy[i][1] > 0) {
            var _useBrickPow = Math.min(_bricksCopy[zokusei[j]], Math.ceil(_nextCopy[i][1] / _statusCopy[zokusei[j]]));
            if(_statusCopy[zokusei[j]] == 0)_useBrickPow = 0;
            _bricksCopy[zokusei[j]] -= _useBrickPow;
            _nextCopy[i][1] -= _useBrickPow * _statusCopy[zokusei[j]];
          }
        }
      }
      //敵のhpが残ってるか算出
      let tf = true;
      for (var i = 0; i < enemysuu; i++) {
        if(_nextCopy[i][1] >0)tf = false;
      }
      return [tf,_bricksCopy];
    }//kasouSentou終了
    
    //倒しきれる敵の数に応じた処理
    for (var i = _nextTargetWeakZokusei.length; i > 0 ; i--) {
      let kasouResult = kasouSentou(i);
      if(kasouResult[0] == true){
        if(i == _nextTargetWeakZokusei.length){
          //すべて倒しきれる
          let _arr = [];
          for (var j = 0; j < _nextTargetWeakZokusei.length; j++) {
            _arr.push([_nextTargetWeakZokusei[j][0],_nextTargetWeakZokusei[j][1]]);
            if(_arr[_arr.length -1][1] <= 0)_arr.splice(_arr.length -1,1);
          }
          return _arr;
        }else{
          //i体倒す
          let _arr = [];
          for (var j = 0; j < i; j++) {
            _arr.push([_nextTargetWeakZokusei[j][0],_nextTargetWeakZokusei[j][1]]);
            if(_arr[_arr.length -1][1] <= 0)_arr.splice(_arr.length -1,1);
          }
          let nextEne = this.enemy[this.kai -1][_nextTargetWeakZokusei[i][0]];
          let _dame3 = 0;
          for (var k = 0; k < 5; k++) {
            _dame3 += kasouResult[1][zokusei[k]] * this.sensenStatus[zokusei[k]] * nextEne.damebairitsu(zokusei[k]) ;
          }
          
          if(_dame3 > 0)_arr.push([_nextTargetWeakZokusei[i][0],_dame3]);
          return _arr;
        }
      }
    }

    
    /*
    //ターゲットの敵にダメージ有利属性で攻撃
    let _targetEnemy = _enemies[this.enemyTarget];
    let dame1 = _status[_targetEnemy.retunWeakZokusei()] * _bricks[_targetEnemy.returnWeakZokusei()];
    if(dame1<_targetEnemy.hp){
      //hpが余った場合
      _targetEnemy.hp -= dame1;
      _status[_targetEnemy.retunWeakZokusei()] = 0;
      //総攻撃してhpが余るか計算
      let dame2 = _dame("赤",this.enemyTarget) + _dame("青",this.enemyTarget) + _dame("緑",this.enemyTarget) + _dame("黄",this.enemyTarget) + _dame("紫",this.enemyTarget)
      if(dame2 < _targetEnemy.hp){
        //hpが余る場合
        _targetEnemy.hp -= dame2;
        _status = {"赤":0,"緑":0,"青":0,"黄":0,"紫":0,"心":0};
        reArr.push( [this.enemyTarget,dame1 + dame2]);
      }else{
        //hpが余らない場合
        
      }
    }else if(dame1 >= _targetEnemy.hp){
      _status[_targetEnemy.retunWeakZokusei()] -= _targetEnemy.hp;
      _targetEnemy.hp = 0;
    }
    */
  }
  
  isRinsetsu(_zahyou,_zahyou2 = [].concat(this.lastZahyou)){
    if(_zahyou[0] == null || _zahyou2[0] == null)return false;
    if(_zahyou[0] == _zahyou2[0] && _zahyou[1] == _zahyou2[1])return false;
    if(Math.abs(_zahyou[0] - _zahyou2[0]) <=1 && Math.abs(_zahyou[1] - _zahyou2[1]) <=1)return true;
    return false;
  }
  
  isSameBrick(_zahyou,_zahyou2 = [].concat(this.lastZahyou)){
    if(_zahyou[0] == null || _zahyou2[0] == null)return false;
    if(this.banmen[_zahyou[0]][_zahyou[1]] == this.banmen[_zahyou2[0]][_zahyou2[1]])return true;
    return false;
  }
  
  isTsumiBanmen(_banmen){
    for (var i = 0; i < _banmen.length; i++) {
      for (var j = 0; j < this.useableHeight; j++) {
        if(i != 0){//左
          if(_banmen[i][j] == _banmen[i -1][j])return false;
        }
        if(i != 0 && j != 0){//左下
          if(_banmen[i][j] == _banmen[i -1][j -1])return false;
        }
        if (j != 0) { //下
          if (_banmen[i][j] == _banmen[i][j - 1]) return false;
        }
        if (i != _banmen.length -1 && j != 0) { //右下
          if (_banmen[i][j] == _banmen[i + 1][j - 1]) return false;
        }
        if (i != _banmen.length - 1) { //右
          if (_banmen[i][j] == _banmen[i + 1][j]) return false;
        }
        if (i != _banmen.length - 1 && j != this.useableHeight -1) { //右上
          if (_banmen[i][j] == _banmen[i + 1][j + 1]) return false;
        }
        if (j != this.useableHeight - 1) { //上
          if (_banmen[i][j] == _banmen[i][j + 1]) return false;
        }
        if (i != 0 && j != this.useableHeight - 1) { //左上
          if (_banmen[i][j] == _banmen[i - 1][j + 1]) return false;
        }
      }
    }
    return true;
  }
  
  
  
  update() {
    
    if(this.fallEndCount != 0)this.fallCount += this.fallSpead;
    if(this.fallEndCount > 0 && this.fallCount > this.fallEndCount){
      //落ちきったのでthis.banmenForByougaをthis.banmenと同じにする
      for (var i = 0; i < this.banmen.length; i++) {
        this.banmenForByouga[i] = [].concat(this.banmen[i]);
        this.fall[i] = [0,0,0,0,0,0,0,0,0,0,0,0];
      }
      this.fallEndCount = 0;
      if(this.isTsumiBanmen(this.banmen)){
        //シャッフルする
        let newBanmen = [[],[],[],[],[],[],[]];
        function setNewBanmen(){
          newBanmen = [[],[],[],[],[],[],[]];
          for (var i = 0; i < newBanmen.length; i++) {
            for (var j = 0; j < 12; j++) {
              let br = randomNum(0, this.brick.length - 1);
              br = this.brick[br];
              newBanmen[i].push(br);
            }
          }
        }
        setNewBanmen();
        while(this.isTsumiBanmen(newBanmen) == true){
          setNewBanmen();
        }
        this.isSuffleMessageClose = false;
        this.faze = "シャッフルメッセージ表示中";
        game.addMessage("消せるブロックがありません。シャッフルします。");
      }
    }
    
  
    this.setScene(this.faze);
    super.update();
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].update();
    }
    
    
    //最初のフェードイン。enemyImageを読み込んでから。
    if(this.isEnemyImagesRead != 0){
      let _fadeIn = new Rect(0,0,canvas.width,canvas.height,false,"black");
      _fadeIn.globalAlpha = this.isEnemyImagesRead;
      _fadeIn.update();
      if(this.isEnemyImagesRead < 1 && this.isEnemyImagesRead > 0.1){
        this.isEnemyImagesRead -= 0.1;
      }else if(this.isEnemyImagesRead <= 0.1){
        this.isEnemyImagesRead = 0;
      }
      
    }
  }
  
  setBasicItems(){
    //constructorにて実行。
    //タイマーの描画
      this.add(new Rect(0, 290, canvas.width, 20, false, "#bbb"), 0);
      this.add(new Rect(5, 295, 384 - 10, 10, false, "#777"), 0);
    //HPの描画
      this.add(new Rect(0, 270, canvas.width, 20, false, "#bbb"), 0);
      this.add(new Rect(5, 275, 384 - 10, 10, false, "#777"), 0);
    //背景の描画
    if (this.bgImg == null) {
      this.add(new Rect(0, 0, canvas.width, 270, false, "#333"), 0);
    } else {
      this.add(new Sprite(this.bgImg, 0, 0, canvas.width, 270), 0);
    }
    //キャラの描画
    let _charaWidth = (canvas.width - 2) / 6 - 2 ;//左右と間に2px隙間
    let _bukiGageHeight = 5;
    this.add(new Rect(0, 270 - 2 * 2 - _charaWidth - _bukiGageHeight, canvas.width, 2 * 2 + _charaWidth + _bukiGageHeight, false, "black"), 0);
    for (var i = 0; i < this.sensenCards.length; i++) {
      if (this.sensenCards[i] != null) {
        if (this.sensenCards[i][0] != null) {
          this.add(new Sprite(this.sensenCards[i][0].img[1], 2 + (_charaWidth + 2) * i, 270 - 2 - _charaWidth - _bukiGageHeight, _charaWidth, _charaWidth), 0);
        }
      }
    }
    //ハイテンションボタン
    let highButton = new Rect(0,0,60,60,false,"#fda");
    highButton.touchevent = ()=>{
      if(isClick(highButton) && this.faze == 1 && this.isTimerStarted == false){
        if(this.highTensionPoint == 100){
          this.highTensionPoint = 9999;
        }
      }
    };
    this.add(highButton,0);
    
    //中断ボタン
    let tyuudan = new Rect(canvas.width - 30,0,30,30,false,"#a33");
    tyuudan.touchevent = ()=>{
      if(isClick(tyuudan) == true && this.faze == 1){
        let tyuudanFunc = ()=>{
          menuScene.menuNum = 1;
          game.blackoutFunction(menuScene);
        }
        game.addConfirm("中断してメニュー画面に戻りますか?","はい","いいえ",tyuudanFunc);
      }
    };
    this.add(tyuudan,0);
    this.add(new Rect(canvas.width - 20,10,3,10,false,"white"),0);
    this.add(new Rect(canvas.width - 10 - 3,10,3,10,false,"white"),0);
    
  }
  
  setScene(_faze) {
      this.sceneItems = [];
      
      this.add(new Text("faze:" + this.faze,0,60,14),1); //確認用

      //ブロックの描画
      for (var i = 0; i < this.banmenForByouga.length; i++) {
        for (var j = 0; j < this.banmenForByouga[i].length; j++) {
          let _x = i;
          let _y = j;
          let _w = (canvas.width - 4) / 7;
          let brick;
          if(this.banmenForByouga[i][j].includes("スキル") == true){
            let _num;
            for (var n = 0; n < this.sensenBukiSkills.length; n++) {
              if(this.banmenForByouga[i][j] == "スキル" + n)_num = n;
            }
            brick = new Sprite(this.sensenBukiSkills[_num][3], 2 + _w * _x, canvas.height - _w - 2 - _w * _y, _w, _w);
            if (this.fall[i][j] > 0) {
              let sa = Math.min(this.fall[i][j], this.fallCount);
              brick.y += sa;
            }
            brick.rect = [0, canvas.height - 2 - _w * this.useableHeight, canvas.width, canvas.height]; //←を消すと隠れている上部の盤面が見える
            this.add(brick, 1);
            
          }else if(this.banmenForByouga[i][j] != "無"){
            brick = new Sprite(brickImages[zokusei.indexOf(this.banmenForByouga[i][j])],2 + _w * _x,canvas.height - _w -2 - _w * _y,_w,_w);
            if(this.fall[i][j]>0){
              let sa = Math.min(this.fall[i][j],this.fallCount);
              brick.y += sa;
            }
            brick.rect = [0,canvas.height -2 - _w * this.useableHeight,canvas.width,canvas.height];  //←を消すと隠れている上部の盤面が見える
            this.add(brick,1);
          }else{
            //なにもしない
          }
          
        }
      }
      let _w = (canvas.width - 4) / 7;
      let kakushi = new Rect(0,canvas.height - 2 - _w * this.useableHeight,canvas.width,canvas.height,false,"black");
      kakushi.globalAlpha = 0.5;
      if( (_faze >= 2 && _faze <3) || _faze == 0 )this.add(kakushi,1);
      
      
      
      //タイマーの描画
      let timer = new Rect(5,295,384 - 10,10,false,"#a00");
      timer.width = (384-10) * this.time/this.turnTime;
      this.add(timer,1);
      
      //HPの描画
      let hpGage = new Rect(5,275,384 - 10,10,false,"#d4a");
      hpGage.width = 374 * this.hp / this.maxhp;
      this.add(hpGage,1);
      let hpText = new Text(this.hp + "/" + this.maxhp,5 + 374,275,10);
      hpText.x -= hpText.returnWidthAndHeight()[0];
      this.add(hpText,1);
      
      //武器ゲージの描画
      let _charaWidth = (canvas.width - 2) / 6 - 2; //左右と間に2px隙間
      let _bukiGageHeight = 5;
      for (var i = 0; i < this.sensenBukiSkills.length; i++) {
        if (this.sensenBukiSkills[i][0] != null) {
            this.add(new Rect( 2 + (_charaWidth + 2) * i, 270 - 2 - _bukiGageHeight,_charaWidth, _bukiGageHeight,false,"black"), 1);
            this.add(new Rect( 2 + (_charaWidth + 2) * i, 270 - 2 - _bukiGageHeight +1,_charaWidth * ( this.bukiSkillPoint[i] / this.sensenBukiSkills[i][2]) , _bukiGageHeight -2,false,"white"), 1);
            
        }
      }
      
      //ハイテンションポイントの描画
      let highP = new Text(this.highTensionPoint,30,30,30);
      highP.x -= highP.returnWidthAndHeight()[0] /2;
      highP.y -= highP.returnWidthAndHeight()[1] /2;
      this.add(highP,1);
      
      
      //enemyの描画。端から並べて、最後に余白の半分を右に移動させる
      let _enemyImgs = [];
      if(this.enemy.length > 0){
        for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
          let _x = 0;
          if(i != 0)_x = _enemyImgs[i -1].x + _enemyImgs[i -1].width + 15;
          let _enemyImg = new Sprite(this.enemy[this.kai -1][i].img,_x,90,100 * this.enemy[this.kai -1][i].imgWH,100);
          _enemyImg.battlenum = i;
          _enemyImg.touchevent = ()=>{
            if(_enemyImg.isTouched(touch)[1] == true && touch.type == "touchstart" && this.faze == 1){
              game.wait += 10;
              if(this.enemy[this.kai -1][_enemyImg.battlenum].hp > 0){
                this.enemyTarget = _enemyImg.battlenum;
              }
              
            }
          };
          if(this.enemy[this.kai -1][i].hp <= 0)_enemyImg.hidden = true;
          _enemyImgs.push(_enemyImg);
        }
        let _yohaku = canvas.width - (_enemyImgs[_enemyImgs.length -1].x +_enemyImgs[_enemyImgs.length -1].width);
        for (var i = 0; i < _enemyImgs.length; i++) {
          _enemyImgs[i].x += _yohaku/2;
          this.add(_enemyImgs[i],1);
        }
        
        //ターゲットの描画
        let _target = new Sprite(this.targetImg, 0, 90 + 50 - 32, 64, 64);
        _target.x = _enemyImgs[this.enemyTarget].x + _enemyImgs[this.enemyTarget].width / 2 - 32;
        this.add(_target, 1);
        
        //敵HPゲージの描画
        for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
          let gage = new Rect(20 -4, 82-4, 30+8, 4+8, false, "#777");
          let maxhpgage = new Rect(20, 82, 30, 4, false, "#222");
          let hpgage = new Rect(20,82,30,4,false,"#fff");
          hpgage.width = hpgage.width * this.enemy[this.kai -1][i].hp / this.enemy[this.kai -1][i].maxhp;
          gage.x += _enemyImgs[i].x;
          maxhpgage.x += _enemyImgs[i].x;
          hpgage.x += _enemyImgs[i].x;
          this.add(gage,1);
          this.add(maxhpgage,1);
          if(hpgage.width > 0)this.add(hpgage,1);
        }
        //敵の攻撃インターバルの表示
        for (var i = 0; i < this.enemy[this.kai - 1].length; i++) {
          let waku = new Rect(0, 83 - 10, 16, 22, false, "#000");
          let intervaltext = new Text(this.enemy[this.kai - 1][i].nowInterval,8,83-10+11,14,12,"white");
          waku.x += _enemyImgs[i].x;
          intervaltext.x += _enemyImgs[i].x - intervaltext.returnWidthAndHeight()[0]/2;
          intervaltext.y -= intervaltext.returnWidthAndHeight()[1]/2;
          this.add(waku,1);
          this.add(intervaltext,1);
        }
      }
      
      if(_faze == 2){
        this.faze = 2.1;
        setTimeout(()=>{this.faze = 2.2;},1000);
      }
      
      if(_faze == 2.1 || _faze == 2.2 || _faze == 2.3){
        //与えるダメージの描画
        for (var i = 0; i < this.battleAtackResult.length; i++) {
          let _dameText = new Text(this.battleAtackResult[i][1],_enemyImgs[this.battleAtackResult[i][0]].x,100);
          this.add(_dameText,1);
        }
      }
      
      if(_faze == 2.2){
        this.faze = 2.3;
        //敵のhpを減らす
        for (var i = 0; i < this.battleAtackResult.length; i++) {
          this.enemy[this.kai -1][this.battleAtackResult[i][0]].hp -= this.battleAtackResult[i][1];
        }
        //階の敵をすべて倒したか判別
        let kaiSeiha = true;
        for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
          if(this.enemy[this.kai -1][i].hp > 0)kaiSeiha = false;
        }
        if(kaiSeiha == false){
          setTimeout(()=>{
            if (this.enemy[this.kai -1][this.enemyTarget].hp <= 0){
              //ターゲットを変更
              let _returnNextTurget = ()=>{
                for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
                  if(this.enemy[this.kai -1][i].hp > 0)return i;
                }
              }
              this.enemyTarget = _returnNextTurget();
            }
            this.battleAtackResult = [];
            this.faze = 2.4;
            this.dessapieredBricks = { "赤": 0, "緑": 0, "青": 0, "黄": 0, "紫": 0, "心": 0 };
            this.bukiSkillDameBairitsu = 1;

          },500);
        }else if(kaiSeiha == true){
          //今が最後の階ならクリア
          if(this.kai == this.kaisou){
            setTimeout(()=>{
              if (user.clearStage < this.stagenum +1) user.clearStage = this.stagenum +1;
              if(menuScene.menuNum != 7){
                menuScene.senka = this.stageClear();
              }
              menuScene.menuNum = 7;
              touch.type = "touchend";
              game.wait += 100;
              game.blackoutFunction(menuScene);
            },1500);
            
          }else{
            //次の階へ
            setTimeout(()=>{
              this.faze = 4;
            },1500)
          }
        }
      }
      
      if(_faze == 2.4){
        //受けるダメージの計算
        let hidame = 0;
        for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
          let thisEnemy = this.enemy[this.kai -1][i];
          if(thisEnemy.hp <= 0)continue;
          //intervalを減らす
          thisEnemy.nowInterval --;
          if(thisEnemy.nowInterval <= 0){
            hidame += thisEnemy.atk;
          }
        }
        this.hidame = hidame;
        this.hp -= hidame;
        if(this.hp < 0)this.hp = 0;
        this.faze = 2.5;
        setTimeout(()=>{
          if(this.hp > 0){
            //敵のintervalが0なら変える
            for (var i = 0; i < this.enemy[this.kai -1].length; i++) {
              if(this.enemy[this.kai -1][i].hp > 0 && this.enemy[this.kai -1][i].nowInterval <= 0){
                this.enemy[this.kai -1][i].nowInterval = this.enemy[this.kai -1][i].interval;
              }
            }
            this.hidame = 0;
            this.faze = 3;
          }else{
            //負け
            menuScene.menuNum = 1.11;
            game.blackoutFunction(menuScene);
          }
        },1000);
      }
      
      if(_faze == 2.5){
        //受けるダメージの描画
        if(this.hidame > 0){
          let hidameText = new Text(this.hidame,"half",275,26,null,"black");
          hidameText.x += randomNum(0,4) -2;
          hidameText.y += randomNum(0,4) -2;
          this.add(hidameText,1);
          let hidameText2 = new Text(this.hidame,"half",275,23,null,"orange");
          this.add(hidameText2,1);
        }
      }
      
      if(_faze == 0){
        //階層の表示
        let _kaisou ="BATTLE " + this.kai;
        if(this.kai == this.kaisou)_kaisou = "BOSS BATTLE";
        let kaisouText = new Text(_kaisou,"half",90,35);
        let kaisouBg = new Rect(0,60,canvas.width,100,false,"#f36");
        kaisouBg.globalAlpha = 0.5;
        if(this.fadeCount == 0){
          setTimeout(()=>{
            this.fadeCount = 1;
          },200);
          kaisouText.globalAlpha = this.fadeCount /10;
          kaisouBg.globalAlpha = kaisouBg.globalAlpha * this.fadeCount /10;
          this.add(kaisouBg,1);
          this.add(kaisouText,1);
        }else if(this.fadeCount >= 1 && this.fadeCount < 10 + 70){
          this.fadeCount = Math.round(this.fadeCount +1);
          kaisouText.globalAlpha = Math.min(1,this.fadeCount /10);
          kaisouBg.globalAlpha = kaisouBg.globalAlpha * Math.min(1,this.fadeCount /10);
          this.add(kaisouBg, 1);
          this.add(kaisouText, 1);
        }else if(this.fadeCount >= 10 +70){
          if(this.fadeCount >= 20 +70){
            this.faze = 3;
            this.fadeCount = 0;
          }else{
            this.fadeCount = Math.round(this.fadeCount +1);
            kaisouText.globalAlpha = 2 +7 - this.fadeCount/10;
            kaisouBg.globalAlpha = kaisouBg.globalAlpha * (2 +7 - this.fadeCount/10);
            this.add(kaisouBg, 1);
            this.add(kaisouText, 1);
          }
        }
      }
      
      if(_faze == 4 || _faze == 4.1){
        this.bluckoutCount = Math.round(this.bluckoutCount +1);
        if(this.bluckoutCount == 10 && this.faze == 4){
          this.enemyTarget = 0;
          this.kai++;
          this.battleAtackResult = [];
          this.dessapieredBricks = { "赤": 0, "緑": 0, "青": 0, "黄": 0, "紫": 0, "心": 0 };
          this.bukiSkillDameBairitsu = 1;
          this.faze = 4.1;
        }
        let _charaWidth = (canvas.width - 2) / 6 - 2; //左右と間に2px隙間
        let _bukiGageHeight = 5;
        let _y = 270 - 2 * 2 - _charaWidth - _bukiGageHeight;
        let bluck = new Rect(0,0,canvas.width,_y,false,"black");
        let glo = this.bluckoutCount/10;
        if(glo > 1)glo = (20 - this.bluckoutCount)/10;
        if(this.bluckoutCount > 20){
          this.bluckoutCount = 0;
          this.faze = 0;
        }else{
          bluck.globalAlpha = glo;
          this.add(bluck,1);
        }
      }
      

      
      
      if(_faze == 3 || (_faze == "シャッフルメッセージ表示中" && this.isSuffleMessageClose == true)){
        //フラッシュの描画
        this.flushCount ++;
        let fl = 16;
        if(this.flushCount > fl){
          if(_faze == 3){
            //fazeを1に戻す
            this.flushCount = 0;
            this.time = this.turnTime;
            this.isTimerStarted = false;
            this.faze = 1;
          }else{
            this.flushCount = 0;
            this.faze = 1;
          }
        }else{
        
          //光る
          let flush = new Rect(0,canvas.height -(canvas.width - 4) *6/ 7  -2,canvas.width,canvas.height,false,"white");
          if(this.flushCount <=fl/2)flush.globalAlpha = this.flushCount / (fl/2);
          if(this.flushCount >fl/2)flush.globalAlpha = (fl - this.flushCount) / (fl/2);
          this.add(flush,1);
        }
      }
      
  }
  
  touchevent() {
    if(this.isEnemyImagesRead != 0){
      return;
    }
    
    super.touchevent();
    
    if (touch.type == "touchend" && this.startZahyou[0] != null) {
      this.startZahyou = [null, null];
      this.lastZahyou = [null, null];
      this.selectedZahyou = [];
    }
  }
}

let menuScene = new MenuScene();
let battleScene;

function nameAdd(){
  let newName = document.getElementById("nameInput").value;
  let sensenNewName = document.getElementById("sensenNameInput").value;
  if(newName == "" || sensenNewName == "")return;
  user.name = newName;
  user.sensenName = sensenNewName;
  document.getElementById("nameInput").classList.add("none");
  document.getElementById("sensenNameInput").classList.add("none");
  document.getElementById("sensenSpan").classList.add("none");
  document.getElementById("nameButton").classList.add("none");
  game.donttouch = false;
}


  //indexedDBに関する処理
  const dbpromise = new Promise((resolve,reject)=>{
    var dbName = 'abnow_DB';
    var dbVersion = 2;
    var kerValue = 'userData';
    
    var openReq = indexedDB.open(dbName, dbVersion);
    //　DB名を指定して接続。DBがなければ新規作成される。
    
    openReq.onupgradeneeded = function(event) {
      //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
      console.log('db upgrade');
      var db = event.target.result;
      var storeName = 'abnowUser';
      db.createObjectStore(storeName, { keyPath: 'id' })
    }
    
    openReq.onsuccess = function(event) {
      //onupgradeneededの後に実行。更新がない場合はこれだけ実行
      console.log('db open success');
      var storeName = 'abnowUser';
      var db = event.target.result;
      var trans = db.transaction(storeName, 'readonly');
      var store = trans.objectStore(storeName);
      var getReq = store.get('userData');
      
      
    
      getReq.onsuccess = function(event) {
        if(event.target.result != undefined){
          if("data" in event.target.result){
            let _data = event.target.result.data; // {id : 'userData', data : [userObj]}
            if (_data != null) {
              let _user = _data[0];
              for (var i = 0; i < _user.cards.length; i++) {
                _user.cards[i].img = [new Image(), new Image()];
                _user.cards[i].img[0].src = "./cardimage/" + _user.cards[i].reality + "_" + charactors.indexOf(_user.cards[i].charactor) + "_" + _user.cards[i].no + ".png";
                _user.cards[i].img[1].src = "./cardimage_small/" + _user.cards[i].reality + "_" + charactors.indexOf(_user.cards[i].charactor) + "_" + _user.cards[i].no + "_small.png";
              }
              user = Object.assign(new User(), _user);
            }
          }
          
          
        }
        resolve();
      }
      // 接続を解除する
      db.close();
    }
    
    openReq.onerror = function(event) {
      // 接続に失敗
      console.log('db open error');
      resolve();
    }
  });

function indexedDBAdd(){
  var dbName = 'abnow_DB';
  var dbVersion = 2;
  var _user = copyObj(user);
  for (var i = 0; i < _user.cards.length; i++) {
    _user.cards.img = [];
  }
  let  _data = [_user];
  var data = {id:'userData',data:_data};
  
  var storeName = 'abnowUser';
  
  var openReq = indexedDB.open(dbName,dbVersion);
  
  openReq.onsuccess = function(event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readwrite');
    var store = trans.objectStore(storeName);
    var putReq = store.put(data);
  
    putReq.onsuccess = function() {
      console.log('put data success');
    }
  
    trans.oncomplete = function() {
      // トランザクション完了時(putReq.onsuccessの後)に実行
      console.log('transaction complete');
      game.addMessage("セーブしました");
    }
  
  }
  openReq.onerror = function() {
    // 接続に失敗
    console.log('db open error');
    game.addMessage("セーブできませんでした");
  }
}

function indexedDBRemove() {
  var dbName = 'abnow_DB';
  var dbVersion = 2;
  var data = { id: 'userData', data: null };

  var storeName = 'abnowUser';

  var openReq = indexedDB.open(dbName, dbVersion);

  openReq.onsuccess = function(event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readwrite');
    var store = trans.objectStore(storeName);
    var putReq = store.put(data);

    putReq.onsuccess = function() {
      console.log('put data success');
    }

    trans.oncomplete = function() {
      // トランザクション完了時(putReq.onsuccessの後)に実行
      console.log('transaction complete');
      game.addMessage("セーブデータを削除しました");
    }

  }
  openReq.onerror = function() {
    // 接続に失敗
    console.log('db open error');
    game.addMessage("セーブデータを削除できませんでした");
  }

}




function mainLoop(){
  game.touchevent();
  game.update();
  requestAnimationFrame(mainLoop);
}


window.onload = ()=>{
  
  dbpromise.then(()=>{
        //ログインボーナスのため、最後のログイン時から日付が変わってるかチェック
        let _tf = false;
        let date = new Date();
        let theYear = date.getFullYear();
        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        if (user.lastLoginDay[0] == theYear && user.lastLoginDay[1] == theMonth && user.lastLoginDay[2] == theDate) {
          _tf = true;
        }
        menuScene.isLoginBonusFinished = _tf;
    
    if(user.name == ""){
      document.getElementById("nameInput").classList.remove("none");
      document.getElementById("sensenNameInput").classList.remove("none");
      document.getElementById("sensenSpan").classList.remove("none");
      document.getElementById("nameButton").classList.remove("none");
    }else{
    game.donttouch = false;
    }
    game.add(new TitleScene());
    //game.add(new BattleScene(2));//テスト用
    mainLoop();
  })
}

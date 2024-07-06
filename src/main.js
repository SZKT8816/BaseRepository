//ミノ初期位置定義
const mino_define = [
    ["#0-4","#1-4","#2-4","#2-5"], //L字
    ["#0-4","#1-4","#2-4","#2-3"], //逆L字
    ["#0-4","#1-4","#1-5","#2-5"], //S字
    ["#0-5","#1-5","#1-4","#2-4"], //逆S字
    ["#0-4","#1-4","#1-5","#2-4"], //T字
    ["#0-4","#1-4","#0-5","#1-5"], //四角
    ["#0-4","#1-4","#2-4","#3-4"], //棒
]

//ミノ毎の回転定義
const mino_trans_define = [
    [0,1,2,3], //L字
    [0,1,2,3], //逆L字
    [0,1], //S字
    [0,1], //逆S字
    [0,1,2,3], //T字
    [0], //四角
    [0,1], //棒
]

//ミノチェック
var new_mino_chk = true;

//現ミノ
var now_mino = [];

//現ミノのパターンチェック用
var now_mino_patern = 0;

//現ミノの回転状態チェック用
var now_mino_trans = 0;

//落下中操作制御用変数
var ctrl_chk = true;

//キー制御変数
var key_crtl_chk = true;

//ゲームのメインループ
var game_play_ctrl;

//回転キーの制御
var key_prs_ctrl = 0;

//更新チェック用
var upd_chk = 0;

/**
 * テンプレート
 * @param {variable} variable 何か
 * @return {variable} 
 */
function template(variable){
    return ;
}

/**
 * 非同期タイマー処理
 * @param {Number} stoptime
 * @return {object} Promiseオブジェクト
 */
function asyncFunction(stoptime) {

    // Promiseオブジェクトを返却する.処理成功時にはresolveが呼ばれる
    return new Promise(function (resolve, reject) {
        //単純にタイマ用の処理 遅らせて処理をするためのもの
        setTimeout(function(){
            resolve();
        }, stoptime);
    });
}

/**
 * 落下座標更新支援
 * @param {String} NowAdr 現在地
 * @return {String} 次の位置 
 */
function UpdateBlock(NowAdr){
    var AdrNum = [];
    var NewAdr = "";
    AdrNum = NowAdr.replace("#","").split("-");
    NewAdr = "#" + ( Number(AdrNum[0]) + 1 ) + "-" + AdrNum[1];
    return NewAdr;
}

/**
 * 移動座標更新支援
 * @param {String} NowAdr 現在地
 * @param {Number} RorL 左右
 * @return {String} 次の位置 
 */
function MoveUpdateBlock(NowAdr, RorL){
    var AdrNum = [];
    var NewAdr = "";
    var MoveNum = 0;
    if(RorL === 37){
        MoveNum = -1;
    }else{
        MoveNum = 1;
    }
    AdrNum = NowAdr.replace("#","").split("-");
    NewAdr = "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + MoveNum );
    return NewAdr;
}

/**
 * 回転座標更新支援
 * @param {String} NowAdr 現在地
 * @param {Number} BlockCnt ミノの何番目のブロックであるか
 * @return {String} 次の位置 
 */
function TransUpdateBlock(NowAdr, BlockCnt){
    var AdrNum = NowAdr.replace("#","").split("-");

//2パターンブロックゾーン
    //S字状態0時
    if(now_mino_patern === 2 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );;
        }
    }
    //S字状態1時
    if(now_mino_patern === 2 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
    }
    //逆S字状態0時
    if(now_mino_patern === 3 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );;
        }
    }
    //逆S字状態1時
    if(now_mino_patern === 3 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
    }
    //棒状態0時
    if(now_mino_patern === 6 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) + 1 )  + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "1"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + ( Number(AdrNum[1]) + 2 );
        }
    }
    //棒状態1時
    if(now_mino_patern === 6 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) - 1 )  + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "1"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 2 ) + "-" + ( Number(AdrNum[1]) - 2 );
        }
    }
//4パターンブロックゾーン
    //L字状態0
    if(now_mino_patern === 0 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + AdrNum[1];
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
    }
    //L字状態1
    if(now_mino_patern === 0 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) + 2 )   + "-" + AdrNum[1];
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
    }
    //L字状態2
    if(now_mino_patern === 0 && now_mino_trans === 2){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) + 2 )   + "-" + AdrNum[1];
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
    }
    //L字状態3
    if(now_mino_patern === 0 && now_mino_trans === 3){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + AdrNum[1];
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
    }
    //逆L字状態0
    if(now_mino_patern === 1 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) + 2 )   + "-" + AdrNum[1];
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
    }
    //逆L字状態1
    if(now_mino_patern === 1 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) - 2 )   + "-" + AdrNum[1];
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
    }
    //逆L字状態2
    if(now_mino_patern === 1 && now_mino_trans === 2){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + AdrNum[1];
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
    }
    //逆L字状態3
    if(now_mino_patern === 1 && now_mino_trans === 3){
        if(BlockCnt === "0"){
            return "#" + AdrNum[0] + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + ( Number(AdrNum[0]) + 2 ) + "-" + AdrNum[1];
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
    }
    //T字状態0
    if(now_mino_patern === 4 && now_mino_trans === 0){
        if(BlockCnt === "0"){
            return "#" + Number(AdrNum[0])   + "-" + ( Number(AdrNum[1]) + 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + Number(AdrNum[1]);
        }
    }
    //T字状態1
    if(now_mino_patern === 4 && now_mino_trans === 1){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) + 2 ) + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) + 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" +  Number(AdrNum[0]) + "-" + ( Number(AdrNum[1]) + 2 );
        }
    }
    //T字状態2
    if(now_mino_patern === 4 && now_mino_trans === 2){
        if(BlockCnt === "0"){
            return "#" + Number(AdrNum[0]) + "-" + ( Number(AdrNum[1]) - 2 );
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) + 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + ( Number(AdrNum[0]) + 2 ) + "-" +  Number(AdrNum[1]);
        }
    }
    //T字状態3
    if(now_mino_patern === 4 && now_mino_trans === 3){
        if(BlockCnt === "0"){
            return "#" + ( Number(AdrNum[0]) - 2 ) + "-" + AdrNum[1];
        }
        if(BlockCnt === "1"){
            return "#" + ( Number(AdrNum[0]) - 1 ) + "-" + ( Number(AdrNum[1]) - 1 );
        }
        if(BlockCnt === "2"){
            return "#" + AdrNum[0] + "-" + Number(AdrNum[1]);
        }
        if(BlockCnt === "3"){
            return "#" + Number(AdrNum[0]) + "-" + ( Number(AdrNum[1]) - 2 );
        }
    }                    
}

/**
 * 行削除
 * @param {} なし
 * @return {} なし
 */
function LineBreak(){
    var Breakchk = 0;
    var NowScore = Number($("#score_number").text());
    var PlusScore = 0;
    var BLine = 0;
    var rowval = [];
    //行ループ
    for(var row = 19; row > -1; row--){
        //列ループ
        for(var col = 9; col > -1; col--){
            if( $("#" + row + "-" + col).attr("class") === "tetris d" ){
                Breakchk = Breakchk + 1;
            }
            if( Breakchk === 10 ){
                BLine = BLine + 1;
                //消えた時の列下げ処理を別に用意する
                LineDown(row);
                //下からチェックするので1段消えたら前の段からチェックする必要あり
                row = row + 1;
            }
        }
        Breakchk = 0;
    }

    //得点を加えてやる
    if(BLine === 1){
        PlusScore = 100;
        $("#score_number").text(NowScore + PlusScore);
    }else if(BLine === 2){
        PlusScore = 300;
        $("#score_number").text(NowScore + PlusScore);
    }else if(BLine === 3){
        PlusScore = 700;
        $("#score_number").text(NowScore + PlusScore);    
    }else if(BLine === 4){
        PlusScore = 1200;
        $("#score_number").text(NowScore + PlusScore);
    }
    return ;
}

/**
 * 行削除時の行下げ処理
 * @param {Number} LineNum 削除行
 * @return {} なし
 */
function LineDown(LineNum){
    var AdrStatus = "";
    //行ループ
    for(var row = LineNum; row > -1; row--){
        //列ループ
        for(var col = 9; col > -1; col--){
            //最上段以外は上の行の状態をコピーする
            if(row !== 0){
                AdrStatus = $("#" + ( row - 1 ) + "-" + col).attr("class")
                $("#" + row + "-" + col).attr("class", AdrStatus);
            //最上段の場合はすべて消す
            }else{
                $("#" + row + "-" + col).attr("class", "tetris");
            }
        }
    }
    return ;
}

/**
 * ゲーム動作処理
 * @param {} 無し
 * @return {} 
 */
function MainTetris(){
    var gameover_chk = false;//ゲームオーバー判定

    //落下、消去、ゲームオーバー判定に入ったら操作不能にする
    ctrl_chk = false;

    //新しいミノを出現させる場合
    if(new_mino_chk){
        //キー制御系
        upd_chk = 1;
        //ランダムでミノを決定する
        now_mino_patern = Math.floor( Math.random() * 7 );
        //now_mino_patern = 4//ここを直す必要あり

        //操作中のミノ配列に所定のミノ定義を入れる
        for(var mino_num in mino_define[now_mino_patern]){
            now_mino.push(mino_define[now_mino_patern][mino_num]);
        }
        //ミノを画面上に表示させる
        for(var now in now_mino){
            if( $(now_mino[now]).attr("class") === "tetris d" ){
                gameover_chk = true;
            }
            $(now_mino[now]).attr("class", "tetris c");
            //aaa
        }
        if(gameover_chk){
            $("#info").text("GAME OVER");
            $("#info").trigger("change");
        }
        //新ミノ条件を偽にする
        new_mino_chk = false;
    //既存のミノ位置を更新する場合
    }else{
        //
        var not_fall_chk = false;
        //ミノの座標をチェック
        for(var last in now_mino){
            if(now_mino[last].replace("#","").split("-")[0] === "19"
            || $( UpdateBlock(now_mino[last]) ).attr("class") === "tetris d"){
                not_fall_chk = true;
            }
        }
        //もう落下できない場合
        if(not_fall_chk){
            for(var new_num in now_mino){
                $(now_mino[new_num]).attr("class", "tetris d");
            }
            new_mino_chk = true;
            now_mino = [];
            //置き確定で次ミノの回転状態をリセットする
            now_mino_trans = 0;
            //置き確定よって消去できる列があるか判定し消去する
            LineBreak();            
        //まだ落下できる場合                
        }else{
            for(var now in now_mino){
                $(now_mino[now]).attr("class", "tetris");
                now_mino[now] = UpdateBlock(now_mino[now]);
            }
            for(var new_num in now_mino){
                $(now_mino[new_num]).attr("class", "tetris c");
            }
        }
    }
    //キー制御系
    upd_chk = 0;
    //終わったら処理可能にする
    ctrl_chk = true;
    return ;
}

/**
 * ミノ操作
 * @param {Number} KeyNum キー番号
 * @return {} なし
 */
function MinoCtrl(KeyNum){
    var not_move_chk = false;
    //操作条件を満たさない場合かチェックする
    for(var last in now_mino){
        if( (KeyNum === 39 && (now_mino[last].replace("#","").split("-")[1] === "9" || $( MoveUpdateBlock(now_mino[last], KeyNum) ).attr("class") === "tetris d") )
        ||  (KeyNum === 37 && (now_mino[last].replace("#","").split("-")[1] === "0" || $( MoveUpdateBlock(now_mino[last], KeyNum) ).attr("class") === "tetris d") )
        ){
            not_move_chk = true;
        }
    }
    if(!not_move_chk){
        for(var now in now_mino){
            $(now_mino[now]).attr("class", "tetris");
            now_mino[now] = MoveUpdateBlock(now_mino[now], KeyNum);
        }
        for(var new_num in now_mino){
            $(now_mino[new_num]).attr("class", "tetris c");
        }
    }
    return ;
}

/**
 * ミノ回転
 * @param {} なし
 * @return {} なし
 */
function MinoTrans(){
    var not_trans_chk = false;//回転を判断するためのフラグ

    //現在のミノとその回転状態をチェックする
    //mino_trans_define[now_mino_patern][now_mino_trans];

    //四角は何もしない（回転する意味がない）
    if(now_mino_patern === 5){
        return;
    }

    //その他の場合は操作条件を満たさない場合かチェックする
    for(var last in now_mino){
        var chk_adr = TransUpdateBlock(now_mino[last], last);
        var row_chk = Number(chk_adr.replace("#","").split("-")[0]);
        var col_chk = Number(chk_adr.replace("#","").split("-")[1]);

        if( row_chk >= 20 || row_chk <= -1 ||  col_chk >= 10 || col_chk <= -1 || $(chk_adr).attr("class") === "tetris d"){
            not_trans_chk = true;
        }   
    }   
    
    if(!not_trans_chk){
        for(var now in now_mino){
            $(now_mino[now]).attr("class", "tetris");
            now_mino[now] = TransUpdateBlock(now_mino[now], now);
        }
        for(var new_num in now_mino){
            $(now_mino[new_num]).attr("class", "tetris c")
        }
        if(now_mino_patern === 0 || now_mino_patern === 1 || now_mino_patern === 4){
            if(now_mino_trans === 0){
                now_mino_trans = 1;
            }else if(now_mino_trans === 1){
                now_mino_trans = 2;
            }else if(now_mino_trans === 2){
                now_mino_trans = 3;
            }else if(now_mino_trans === 3){
                now_mino_trans = 0;
            }
        }else if(now_mino_patern === 2 || now_mino_patern === 3 || now_mino_patern === 6){
            if(now_mino_trans === 0){
                now_mino_trans = 1;
            }else{
                now_mino_trans = 0;
            }
                
        }
    }
    return ;        

}

//DOM生成後メイン処理
$(function(){

    //test
    $('#start_button').on('click',GameStart);

    $(document).on('change', '#info', function() {
        //ゲーム停止させる処理
        clearInterval(game_play_ctrl);
        $('#start_button').prop("disabled",false);
    });
});


/**
 * ゲーム開始ボタン
 * @param {} なし
 * @return {} なし
 */
function GameStart(){


    var score = Number($("#score_number").text());

    var highscore = Number($("#high_score_number").text());

    if(score > highscore){
        $("#high_score_number").text(score);
    }

    $("#score_number").text("0");
    $("#info").text("");

    $(".tetris").each(function() {
        $(this).attr("class","tetris");
    });

    $('#start_button').prop("disabled",true);

    game_play_ctrl = setInterval("MainTetris()",200);
}

//キーストローク
window.addEventListener("keydown", function(e) {
	var keyName = e.key;//キーストロークをとるやつ

	//キー押下許可セレクタをチェックする
	if(key_crtl_chk === true && ctrl_chk === true){
        key_crtl_chk = false;
        
        asyncFunction(50).then(function (value) {
            // 非同期処理成功
            if(e.keyCode === 37 || e.keyCode === 39){
                MinoCtrl(e.keyCode);
            }else if(e.keyCode === 65 && key_prs_ctrl === 0 && upd_chk === 0){
                key_prs_ctrl = 1;
                MinoTrans(e.keyCode);
            }
            console.log(e.keyCode + "キー押下");
            key_crtl_chk = true;
        }).catch(function (error) {
                // 非同期処理失敗
                console.log(error);
        });
	}
});
//押しっぱなし禁止制御
window.addEventListener("keyup", function(e) {
    if(e.keyCode === 65){
        key_prs_ctrl = 0;
        console.log(e.keyCode + "アップ");
    }
});
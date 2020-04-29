
const CANVAS_CENTER_X = 300
const CANVAS_CENTER_Y = 300
const ARROW_HEIGHT = 30
const ARROW_WIDTH = 20
const ROULETTE_RADIUS = 200

const S = 1.0 //For HSV [0, 1]
const V = 1.0 //For HSV [0, 1]

// 背景を作成
function makeCanvas(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(128,128,128)';

    // 矢印(下三角)の描画
    ctx.beginPath();
    ctx.moveTo(CANVAS_CENTER_X, CANVAS_CENTER_Y-ROULETTE_RADIUS);
    ctx.lineTo(CANVAS_CENTER_X+Math.floor(ARROW_WIDTH/2), CANVAS_CENTER_Y-ARROW_HEIGHT-ROULETTE_RADIUS);
    ctx.lineTo(CANVAS_CENTER_X-Math.floor(ARROW_WIDTH/2), CANVAS_CENTER_Y-ARROW_HEIGHT-ROULETTE_RADIUS);
    ctx.closePath();
    ctx.fill();

    // ルーレット(円)の描画
    ctx.beginPath();
    ctx.arc(CANVAS_CENTER_X, CANVAS_CENTER_Y, ROULETTE_RADIUS, 0, 2*Math.PI, false);    
    ctx.fill();
}

// ルーレットの描画
function drawRoulette(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');    
    var id_num = 5
    var fan_angle = 360 / id_num
    for(let i=0; i<id_num; i++){
        let H = fan_angle * i; // For HSV [0, 360]
        let rgb = makeColorHSV2RGB(H, S, V);
        ctx.beginPath();
        ctx.moveTo(CANVAS_CENTER_X,CANVAS_CENTER_Y)
        ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        ctx.arc(CANVAS_CENTER_X, CANVAS_CENTER_Y, ROULETTE_RADIUS, (i/id_num)*2*Math.PI, ((i+1)/id_num)*2*Math.PI, false);
        ctx.fill();
    }
}

function makeColorHSV2RGB(H, S, V){
    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));
    
    var R, G, B;
    switch(Math.floor(Hp%6)){
        case 0: [R, G, B] = [C, X, 0]; break;
        case 1: [R, G, B] = [X, C, 0]; break;
        case 2: [R, G, B] = [0, C, X]; break;
        case 3: [R, G, B] = [0, X, C]; break;
        case 4: [R, G, B] = [X, 0, C]; break;
        case 5: [R, G, B] = [C, 0, X]; break;
    }
    var m = V - C;
    R = Math.floor((R+m)*255);
    G = Math.floor((G+m)*255);
    B = Math.floor((B+m)*255);    
    return [R, G, B];
}



/*
function OnButtonClick(){

};



function getColor(index, total){

};
*/
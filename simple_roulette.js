jQuery(function(){
    /******** 初期化処理 ********/
    const background_cvs = document.getElementById('background');
    const background_ctx = background_cvs.getContext('2d');
    const roulette_cvs = document.getElementById('roulette');
    const roulette_ctx = roulette_cvs.getContext('2d');
    const text_cvs = document.getElementById('text');
    const text_ctx = text_cvs.getContext('2d');

    const CANVAS_CENTER_X = 300;
    const CANVAS_CENTER_Y = 300;
    const ARROW_HEIGHT = 30;
    const ARROW_WIDTH = 20;
    const ROULETTE_RADIUS = 200;
 
    const S = 1.0; //For HSV [0, 1]
    const V = 1.0; //For HSV [0, 1]
 
    // ルーレット初期化
    var fps = 24;
    var item_num = 0;
    var rgb_array = new Array();
    var items = new Array();
    var text_width = new Array();
    var isRotateRoulette = false;
    var handler;
    var text_stroke_color = 'rgb(0,0,0)';
    var text_fill_color = 'rgb(255,255,255)';
    var use_audio = true;   // SE等を使用する場合はtrue、使用しない場合はfalse
    if(use_audio){
        var roullete_stop_audio = "./se/stop_roulette.mp3"  //example 
        var music = new Audio(roullete_stop_audio);
    }
 
    charactor_size = '17' //pt
    text_ctx.font = 'normal ' + charactor_size + 'pt Gosick';
    text_ctx.textBaseline = "bottom";
    text_ctx.strokeStyle = text_stroke_color;
    text_ctx.fillStyle = text_fill_color;

    // 背景作成
    background_ctx.fillStyle = 'rgb(128,128,128)';
    // 矢印(下三角)の描画
    background_ctx.beginPath();
    background_ctx.moveTo(CANVAS_CENTER_X, CANVAS_CENTER_Y-ROULETTE_RADIUS);
    background_ctx.lineTo(CANVAS_CENTER_X+Math.floor(ARROW_WIDTH/2), CANVAS_CENTER_Y-ARROW_HEIGHT-ROULETTE_RADIUS);
    background_ctx.lineTo(CANVAS_CENTER_X-Math.floor(ARROW_WIDTH/2), CANVAS_CENTER_Y-ARROW_HEIGHT-ROULETTE_RADIUS);
    background_ctx.closePath();
    background_ctx.fill();
    // ルーレット(円)の描画
    background_ctx.arc(CANVAS_CENTER_X, CANVAS_CENTER_Y, ROULETTE_RADIUS, 0, 2*Math.PI, false);    
    background_ctx.fill();
    
    // デフォルト項目欄作成
    updateItems(3);      // ルーレットの項目数 Default:3



    /******** イベント処理 ********/

    // ルーレットの作成ボタンが押されたときの動作
    $("#make_roulette").on('click',function(){
        for (let i=0; i<item_num; i++){
            items[i] = $("#text" + String(i)).val();
            text_width[i] = text_ctx.measureText(items[i]).width;
        }
        fan_angle = 360/item_num;
        for(let i=0; i<item_num; i++){
            let H = fan_angle * i; // For HSV [0, 360]
            rgb_array[i] = makeColorHSV2RGB(H, S, V);
        }
        updateDrawRoulette(fan_angle);
    });

    // キャンバスがクリックされたときの動作
    $("canvas").click(function (event){
        if(isRotateRoulette){
            isRotateRoulette=false;
            clearInterval(handler);
            if(use_audio){
                music.play()
            }
        }
        else{
            isRotateRoulette=true;
            handler = setInterval(repeatFrame, 1000/ fps);
        }
    });


    // 項目数が変更されたときの動作
    $("#item_num").change('change', function(){
        var num = Number($(this).val());
        if(num < 1 || num > 360){
            alert('項目数は 1以上〜360以下の数値を入力してください。');
        }
        updateItems(num)
    });



    /******** メソッド ********/

    function repeatFrame(){
        rotate_angle = 0.5;
        rotateRoulette(rotate_angle);
    }

    function updateItems(num){
        if (item_num > num){
            // 項目数を減らす処理
            for(let i=num; i<item_num; i++){
                $("#text" + String(i)).next().remove() // 改行削除
                $("#text" + String(i)).remove() // 項目削除
            }
        }
        else if(item_num < num){
            // 項目数を増やす処理
            for (let i=item_num; i<num; i++){
                insertTextbox = $('<input type="text" />').attr({id: 'text' + String(i) }).val("ここに入力.");
                $(".edits").append(insertTextbox); // 項目削除
                $(".edits").append("<br>") // 改行追記
            }
        }
        item_num = num;
    }


    function rotateRoulette(rotate_angle){
        roulette_ctx.beginPath();
        text_ctx.beginPath();
        roulette_ctx.translate(CANVAS_CENTER_X, CANVAS_CENTER_Y);
        text_ctx.translate(CANVAS_CENTER_X, CANVAS_CENTER_Y);
        roulette_ctx.rotate(rotate_angle);
        text_ctx.rotate(rotate_angle);
        roulette_ctx.translate(-CANVAS_CENTER_X, -CANVAS_CENTER_Y);
        text_ctx.translate(-CANVAS_CENTER_X, -CANVAS_CENTER_Y);
        updateDrawRoulette()
    }


    function updateDrawRoulette(fan_angle){
        roulette_ctx.clearRect(0, 0, roulette_cvs.width, roulette_cvs.height);
        text_ctx.clearRect(0, 0, text_cvs.width, text_cvs.height);



        for(let i=0; i<item_num; i++){
            roulette_ctx.beginPath();
            roulette_ctx.moveTo(CANVAS_CENTER_X,CANVAS_CENTER_Y)
            roulette_ctx.fillStyle = 'rgb(' + rgb_array[i][0] + ',' + rgb_array[i][1] + ',' + rgb_array[i][2] + ')';
            roulette_ctx.arc(CANVAS_CENTER_X, CANVAS_CENTER_Y, ROULETTE_RADIUS, (i/item_num)*2*Math.PI, ((i+1)/item_num)*2*Math.PI, false);
            roulette_ctx.fill();

            text_ctx.translate(CANVAS_CENTER_X, CANVAS_CENTER_Y);
            text_ctx.rotate((i+1/item_num)*2*Math.PI);
            text_ctx.translate(-CANVAS_CENTER_X, -CANVAS_CENTER_Y);
            text_ctx.fillText(items[i], CANVAS_CENTER_X+(ROULETTE_RADIUS - text_width[i]) /2, CANVAS_CENTER_Y, ROULETTE_RADIUS);
            text_ctx.strokeText(items[i], CANVAS_CENTER_X+(ROULETTE_RADIUS - text_width[i]) /2, CANVAS_CENTER_Y, ROULETTE_RADIUS);

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

});


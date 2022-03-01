// キャンバスを操作するためのオブジェクトを取得
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// キャンバスを黒く塗りつぶす
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 280, 280);

ctx.lineCap = 'square';  // 四角い形の線
ctx.strokeStyle = '#fff';  // 白い線
ctx.lineWidth = 13;  // 線の幅
var draw = false;  // クリック中かのフラグ

// マウスが動いたときに呼び出される
canvas.addEventListener("mousemove",function(e) {
  var rect = e.target.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  if(draw) {
    ctx.beginPath();
    ctx.moveTo(mouseX1,mouseY1);
    ctx.lineTo(mouseX,mouseY);
    ctx.stroke();
    mouseX1 = mouseX;
    mouseY1 = mouseY;
  }
});

// クリックで呼び出される
canvas.addEventListener("mousedown",function(e) {
  draw = true;
  mouseX1 = mouseX;
  mouseY1 = mouseY;
});

// クリックを離されると呼び出される
canvas.addEventListener("mouseup", function(e){
  draw = false;
});

//Resetボタン
$('#reset').on('click', function(e){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 280, 280);
  $('td').text('-');
})


// 送信ボタンで呼び出される
$('#send').on('click',function(e){
    var form = $(this).parents('form');
    var src = canvas.toDataURL('image/png');
    $('#img-src').val(src);
    // form.submit();
    $.ajax({
      url: $(this).parents('form').attr('action'),
      type: 'POST',
      data: src,
      contentType: false,
      processData: false,
      success: function(data, dataType){
        console.log("Success", data);

        const predict = $.parseJSON(data.values)
        $.each(predict, function(index, value){
            console.log(index + ":" + value);
            $('.accuracy' + index).text(value)
        });
        console.log(predict)
      },
      error: function(XHLHttpRequest, textStatus, errorThrown){
        console.log('Error: ', errorThrown);
      }
    });
    
});
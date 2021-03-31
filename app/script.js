import { MnistData } from 'https://storage.googleapis.com/tfjs-tutorials/mnist_data.js';

import { showExamples, getModel, train } from './lib.js'

const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;

// main
async function run() {
    // Signature_Padの初期化
    let signaturePad = initSignaturePad();

    //手書き数字のサンプル表示
    const data = new MnistData();
    await data.load();
    await showExamples(data);

    // 学習モデルの定義と概要を表示
    let model = getModel();

    tfvis.show.modelSummary({ name: 'Model Architecture' }, model);

    //学習モデルの作成とテスト
    await train(model, data);

    //学習モデルの作成が終了すると、ローディングメッセージを非表示にし、手書きパネルを表示
    document.getElementById("loading-message").style.display = "none";
    document.getElementById("main").style.display = "block";

    document.getElementById("predict-button").onclick = function() {
        predict(model);
    };

    document.getElementById("reset-button").onclick = function() {
        reset(signaturePad);
    };
}

document.addEventListener("DOMContentLoaded", run);

// 手書きパネルの初期化
function initSignaturePad() {
    let pad = document.getElementById('pad');
    return new SignaturePad(pad, {
        minWidth: 5,
        maxWidth: 5,
        penColor: 'white',
        backgroundColor: 'black',
    });
}

//　認識ボタンがクリック時の動作 : predict
function predict(model) {
    // canvasを280*280から28*28へ変換
    let ctx = document.createElement('canvas').getContext('2d');
    let pad = document.getElementById('pad');
    ctx.drawImage(pad, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    let imageData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    // 認識結果
    let score = tf.tidy(() => {
        let input = tf.browser.fromPixels(imageData, 1).reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, 1]).div(tf.scalar(255));
        return model.predict(input);
    });

    // 確率が最も高い数字
    let maxConfidence = score.dataSync().indexOf(Math.max.apply(null, score.dataSync()));

    //認識結果を出力させる
    let elements = document.querySelectorAll(".confidence");
    elements.forEach((el, i) => {
        el.parentNode.classList.remove('is-selected');
        if (i === maxConfidence) {
            el.parentNode.classList.add('is-selected');
        }
        el.innerText = score.dataSync()[i];
    })
}

// リセットボタンの動作
function reset(signaturePad) {
    signaturePad.clear();
    let elements = document.querySelectorAll(".confidence");
    elements.forEach(el => {
        el.parentNode.classList.remove('is-selected');
        el.innerText = '-';
    })
}
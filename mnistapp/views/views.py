import base64
from io import BytesIO
import json
from flask import request, render_template, jsonify
import math

import numpy as np
from PIL import Image

from mnistapp import app
from .lib import mlpredict


@app.route("/", methods=["GET"])
def index():
    return render_template('entries/base.html')

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        base_64_string = str(request.get_data()).replace('data:image/png;base64,', '')[2:-1]
        # ファイルを、28*28にリサイズし、グレースケール(モノクロ画像)
        img = Image.open(BytesIO(base64.b64decode(base_64_string))).resize((28, 28)).convert('L')
        # 学習時と同じ形に画像データを変換する
        img_array = np.asarray(img) / 255
        img_array = img_array.reshape(1, 784)
        # 推論した結果を、テンプレートへ渡して表示
        pre = mlpredict(img_array)
        context_json = {}
        for k, v in enumerate(pre[0]):
            context_json[str(k)] = round(v*100, 1)
        print(context_json)
    return jsonify(values=json.dumps(context_json))
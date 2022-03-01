import numpy as np
import tensorflow as tf
from tensorflow import keras
import os

def model_read():
    print(os.getcwd())
    model = keras.models.load_model('mnistapp/static/model/mnist_model.h5')
    return model

model = model_read()

def mlpredict(img_array):
    result = model.predict(img_array)
    return result

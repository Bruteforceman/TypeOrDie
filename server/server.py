from flask import Flask

app = Flask(__name__)

def fun_name(a): 
    a = a*2
    return a

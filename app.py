from flask import *

app = Flask(__name__)

@app.route("/", methods = ['GET'])
def test():
    return render_template("index.html")

@app.route("/auth", methods = ['GET'])
def test():
    return render_template("auth.html")

if (__name__ == '__main__'):
    app.run()
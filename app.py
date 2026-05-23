from flask import *
from dotenv import load_dotenv
from urllib.parse import quote_plus
from database import db, User, Sprint, AI_model, AI_usage, login_manager
from flask_login import login_user, current_user, logout_user, login_required
from werkzeug.security import check_password_hash
import os

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'auth_page'

@app.route("/")
@login_required
def index():
    return render_template("index.html")

@app.route("/auth")
def auth_page():
    return render_template("auth.html")

@app.route("/login", methods = ["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(login=username).first()

    if (user):
        if (check_password_hash(user.password_hash, password)):
            login_user(user)
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False}), 401
    else:
        return jsonify({"success": False}), 404

@app.route("/logout", methods=["POST", "GET"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True}), 200

@app.route("/dashboard", methods=["GET"])
@login_required
def dashboard_data():
    return


if (__name__ == '__main__'):
    with app.app_context():
        db.create_all()

    app.run(debug=True)
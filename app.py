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
app.config["SQLALCHEMY_DATABASE_URI"] = (f'mysql+pymysql://{os.getenv("MYSQL_USER")}:{quote_plus(os.getenv("MYSQL_PASSWORD"))}@{os.getenv("MYSQL_HOST")}/{os.getenv("MYSQL_DB")}')
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
    login = data["login"]
    password = data["password"]

    user = User.query.filter_by(login=login).first()

    if (user):
        if (check_password_hash(user.password_hash, password)):
            login_user(user)
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Неверное имя пользователя или пароль"}), 401
    else:
        return jsonify({"success": False, "error": "Неверное имя пользователя или пароль"}), 401

@app.route("/logout", methods=["POST", "GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth_page"))

@app.route("/dashboard-data", methods=["GET"])
@login_required
def dashboard_data():
    user_sprints = current_user.sprints

    models_from_db = AI_model.query.order_by(AI_model.id.asc()).all()
    ai_models_list = [{"name": m.name} for m in models_from_db]
    
    if not user_sprints:
        return jsonify({
            "username": current_user.username,
            "sprints": [],
            "ai_usage_days": [],
            "ai_models": ai_models_list
        }), 200

    requested_sprint_id = request.args.get('sprint_id', type=int)
    target_sprint = None
    if requested_sprint_id:
        target_sprint = next((s for s in user_sprints if s.id == requested_sprint_id), None)
    else:
        target_sprint = user_sprints[-1]

    if not target_sprint:
        return jsonify({"error": "Спринт не найден"}), 404

    all_sprints_history = []
    for s in user_sprints[-8:]:
        all_sprints_history.append({
            "date": s.date.strftime('%d.%m'),
            "tasks_total": s.tasks_total,
            "tasks_completed": s.tasks_completed,
            "bugs": s.bugs,
            "returned_bugs": s.returned_bugs,
            "releases": s.releases,
            "ai_cost_total": s.ai_cost_total,     
            "ai_cost_per_task": s.ai_cost_per_task
        })

    usage_by_date = {}
    for usage in target_sprint.ai_usage_days:
        date_str = usage.date.strftime('%d.%m')
        
        if date_str not in usage_by_date:
            usage_by_date[date_str] = {
                "date": date_str,
                "per_person": usage.per_person,
                "models_raw": {1: {"tokens": 0, "cost": 0.0}, 2: {"tokens": 0, "cost": 0.0}, 3: {"tokens": 0, "cost": 0.0}}
            }
        
        ai_model = AI_model.query.get(usage.model_id)
        if ai_model and usage.model_id in usage_by_date[date_str]["models_raw"]:
            calculated_cost = (usage.tokens / 1000000.0) * ai_model.cost
            usage_by_date[date_str]["models_raw"][usage.model_id]["tokens"] += usage.tokens
            usage_by_date[date_str]["models_raw"][usage.model_id]["cost"] += round(calculated_cost, 2)

    ai_usage_days_response = []
    for d_val in list(usage_by_date.values())[-8:]:
        ai_usage_days_response.append({
            "date": d_val["date"],
            "per_person": d_val["per_person"],
            "usage": [
                {"tokens": d_val["models_raw"][1]["tokens"], "cost": d_val["models_raw"][1]["cost"]},
                {"tokens": d_val["models_raw"][2]["tokens"], "cost": d_val["models_raw"][2]["cost"]},
                {"tokens": d_val["models_raw"][3]["tokens"], "cost": d_val["models_raw"][3]["cost"]} 
            ]
        })

    ai_models_list = [
        {"name": "GPT-5.3"}, 
        {"name": "Gemini 3 Pro"}, 
        {"name": "Claude Opus 4.7"}
    ]

    return jsonify({
        "username": current_user.username,
        "sprints": all_sprints_history,
        "ai_usage_days": ai_usage_days_response,
        "ai_models": ai_models_list
    }), 200

if (__name__ == '__main__'):
    with app.app_context():
        db.create_all()

    app.run(debug=True)
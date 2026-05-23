from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth_page'

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    sprints = db.relationship('Sprint', backref='user', lazy=True)


class Sprint(db.Model):
    __tablename__ = 'sprints'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    tasks_total = db.Column(db.Integer, nullable=False)
    tasks_completed = db.Column(db.Integer, nullable=False)
    bugs = db.Column(db.Integer, nullable=False)
    returned_bugs = db.Column(db.Integer, nullable=False)
    releases = db.Column(db.Integer, nullable=False)
    ai_cost_total = db.Column(db.Integer, nullable=False)
    ai_cost_per_task = db.Column(db.Integer, nullable=False)

    ai_usage_days = db.relationship('AI_usage', backref='sprint', lazy=True)


class AI_model(db.Model):
    __tablename__ = 'ai_models'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    cost = db.Column(db.Float, nullable=False)


class AI_usage(db.Model):
    __tablename__ = 'ai_usage'

    id = db.Column(db.Integer, primary_key=True)
    sprint_id = db.Column(db.Integer, db.ForeignKey("sprints.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey("ai_models.id"), nullable=False)
    tokens = db.Column(db.Integer, nullable=False)
    per_person = db.Column(db.Float, nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
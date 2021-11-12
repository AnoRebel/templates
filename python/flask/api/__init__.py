from os import urandom, path, getcwd
from flask import Flask
from flask_cors import CORS
from strawberry.flask.views import GraphQLView
from config import db

def create_app():
    app = Flask(__name__,
        template_folder=path.join(getcwd(), "templates"),
        static_folder=path.join(getcwd(), "static")
    )
    app.config['SECRET_KEY'] = urandom(64)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

    CORS(app)
    db.init_app(app)
#    db.create_all()

    from api.schema import schema
    app.add_url_rule(
        '/api/graphql',
        view_func=GraphQLView.as_view(
            "graphql_view",
            schema=schema,
        )
    )
    
    with app.app_context():
        from . import routes

        return app

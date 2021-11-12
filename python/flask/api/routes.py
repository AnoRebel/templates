from flask import current_app as app
from flask import jsonify, render_template, redirect


@app.get('/')
def index():
    return render_template('index.html')


@app.get('/docs')
def api():
    return redirect("https://app.swaggerhub.com/apis/Kalebu/mtaa-api_documentation/1.0")


@app.errorhandler(404)
def handle_404(error_message):
    return jsonify({
        'response': str(error_message)
    }), 404

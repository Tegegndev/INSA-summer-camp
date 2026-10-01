from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html", active_page="home")


@app.route("/gallaries.html")
def galleries():
    return render_template("gallaries.html", active_page="gallery")


@app.route("/about.html")
def about():
    return render_template("about.html", active_page="about")


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=5001)

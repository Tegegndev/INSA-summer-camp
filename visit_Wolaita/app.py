from flask import Flask, Response, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template(
        "index.html",
        active_page="home",
        page_title="Visit Wolaita | Land of 50+ Kings — Official Travel & Cultural Portal",
        page_description="Discover Wolaita, Ethiopia. Explore the Land of 50+ Kings, Ajora Twin Waterfalls, UNESCO-inscribed Gifaata New Year festival, traditional Dunguza AI fitting studio, and highland eco-tours.",
    )


@app.route("/about.html")
def about():
    return render_template(
        "about.html",
        active_page="about",
        page_title="About Wolaita | History, People & Living Heritage · Visit Wolaita",
        page_description="Explore the rich political history of Wolaita, over 50 sovereign Kawo kings, the Wolayttatto Doonaa language, and cultural resilience in southern Ethiopia.",
    )


@app.route("/gallaries.html")
def galleries():
    return render_template(
        "gallaries.html",
        active_page="gallery",
        page_title="Wolaita Photo Gallery | Landscapes, Culture & People · Visit Wolaita",
        page_description="Immerse in high-resolution photography capturing the cascading Ajora Falls, Gifaata festival celebrations, Dunguza handweaving, and daily life in Wolaita.",
    )


@app.route("/guide.html")
@app.route("/guide")
def guide():
    return render_template(
        "guide.html",
        active_page="guide",
        page_title="Wolaita Travel Guide & FAQ | Everything You Need to Know",
        page_description="Authoritative travel guide and FAQ for Wolaita, Ethiopia. Discover Ajora Waterfalls, UNESCO Gifaata Festival, Kawo Kings, Boditi Dunguza weaving, local hotels, and highway routes.",
    )


@app.route("/robots.txt")
def robots():
    content = render_template("robots.txt")
    return Response(content, mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap():
    content = render_template("sitemap.xml")
    return Response(content, mimetype="application/xml")


@app.route("/llms.txt")
def llms():
    content = render_template("llms.txt")
    return Response(content, mimetype="text/markdown")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)

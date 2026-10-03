import json
import os

from flask import Flask, Response, render_template, request, url_for

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Supported languages. "html_lang" is used for <html lang> / hreflang.
LANGUAGES = {
    "en": {"label": "English", "html_lang": "en", "og_locale": "en_US"},
    "am": {"label": "አማርኛ", "html_lang": "am", "og_locale": "am_ET"},
    "wal": {"label": "Wolayttatto", "html_lang": "wal", "og_locale": "wal_ET"},
}
DEFAULT_LANGUAGE = "en"

# Strings that live in client-side JavaScript, exposed to templates as `client_strings`.
CLIENT_KEYS = [
    "news.thanks",
    "studio.uploaded",
    "studio.loading1",
    "studio.loading2",
    "studio.loading3",
    "studio.loading4",
    "studio.loading5",
    "gal.count",
]


def _load_translations():
    with open(os.path.join(BASE_DIR, "translations.json"), encoding="utf-8") as fh:
        return json.load(fh)


TRANSLATIONS = _load_translations()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "visit-wolaita-i18n-dev-secret")


def get_locale():
    """Resolve the active language: ?lang= -> cookie -> Accept-Language -> default."""
    requested = request.args.get("lang")
    if requested in LANGUAGES:
        return requested
    cookie = request.cookies.get("lang")
    if cookie in LANGUAGES:
        return cookie
    best = request.accept_languages.best_match(list(LANGUAGES))
    return best or DEFAULT_LANGUAGE


def translate(key, locale=None):
    """Return the string for `key` in the active locale, falling back to English."""
    locale = locale or get_locale()
    value = TRANSLATIONS.get(locale, {}).get(key)
    if value:
        return value
    return TRANSLATIONS.get(DEFAULT_LANGUAGE, {}).get(key, key)


def _alternate_urls():
    """Current page in every language, preserving other query args (for hreflang)."""
    if not request.endpoint:
        return {code: request.path for code in LANGUAGES}
    view_args = dict(request.view_args or {})
    current = request.args.to_dict()
    urls = {}
    for code in LANGUAGES:
        args = dict(current)
        args["lang"] = code
        urls[code] = url_for(request.endpoint, **view_args, **args)
    return urls


@app.context_processor
def inject_i18n():
    return {
        "t": translate,
        "current_lang": get_locale(),
        "languages": LANGUAGES,
        "alternate_urls": _alternate_urls(),
        "client_strings": {key: translate(key) for key in CLIENT_KEYS},
    }


@app.after_request
def persist_language(response):
    """Remember an explicit ?lang= choice in a cookie so it sticks across pages."""
    requested = request.args.get("lang")
    if requested in LANGUAGES:
        response.set_cookie(
            "lang", requested, max_age=60 * 60 * 24 * 365, samesite="Lax", path="/"
        )
    return response


@app.route("/")
def index():
    return render_template(
        "index.html",
        active_page="home",
        page_title=translate("meta.home.title"),
        page_description=translate("meta.home.desc"),
    )


@app.route("/about.html")
def about():
    return render_template(
        "about.html",
        active_page="about",
        page_title=translate("meta.about.title"),
        page_description=translate("meta.about.desc"),
    )


@app.route("/gallaries.html")
def galleries():
    return render_template(
        "gallaries.html",
        active_page="gallery",
        page_title=translate("meta.gallery.title"),
        page_description=translate("meta.gallery.desc"),
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

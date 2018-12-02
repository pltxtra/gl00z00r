from flask import Flask, send_from_directory, send_file, request
from gtts import gTTS
import tempfile, os

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

@app.route('/app/<path:path>')
def send_js(path):
    return send_from_directory('build', path)

@app.route('/')
def root():
    return("hello there")

@app.route('/app/tts')
def tts():
    text = request.args.get('text', '')
    lang = request.args.get('lang', '')
    print("text={}, lang={}".format(text, lang))
    tts = gTTS(text=text, lang=lang)
    tts_file = tempfile.NamedTemporaryFile(dir="build")
    print("tts_file name: {}".format(tts_file.name))
    tts.save(tts_file.name)
    return send_file(tts_file.name)

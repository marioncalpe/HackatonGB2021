import bottle
from HTMLAnalyser import Test

app = bottle.Bottle()

@app.route('/static/<filename:path>')
def serv_static(filename:str):
    return bottle.static_file(filename, root='static')

@app.route('/')
def index():
    content = Test('https://www.google.com/')
    content = content.get_raw_html()

    with open("temp.html", 'w', encoding="utf-8") as file:
        file.write(content)
        file.close()

    return bottle.template('views/index.tlp')

bottle.run(app, host='localhost', debug=True, reloader=True, port=8000)
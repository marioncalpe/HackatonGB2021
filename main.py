import bottle

app = bottle.Bottle()

@app.route('/static/<filename:path>')
def serv_static(filename:str):
    return bottle.static_file(filename, root='static')

@app.route('/')
def index():
    return bottle.template('views/index.tlp')

bottle.run(app, host='localhost', debug=True, reloader=True, port=8000)
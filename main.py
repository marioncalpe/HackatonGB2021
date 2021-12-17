import bottle
from HTMLAnalyser import Test

app = bottle.Bottle()

@app.route('/static/<filename:path>')
def serv_static(filename:str):
    return bottle.static_file(filename, root='static')

@app.route('/')
def index():
    #Hackathon page : https://actu.universita.corsica/plugins/actu/actu-front.php?id_site=institutionnel&id=7698
    content = Test('https://actu.universita.corsica/plugins/actu/actu-front.php?id_site=institutionnel&id=7698')
    content = content.get_raw_html()

    with open("static/pagePreview/temp.html", 'w', encoding="utf-8") as file:
        file.write(content)
        file.close()

    return bottle.template('views/index.tlp')

bottle.run(app, host='localhost', debug=True, reloader=True, port=8000)
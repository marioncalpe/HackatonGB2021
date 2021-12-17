import bottle
import validators
from HTMLAnalyser import Test

app = bottle.Bottle()

@app.route('/static/<filename:path>')
def serv_static(filename:str):
    return bottle.static_file(filename, root='static')

@app.route('/', method='POST')
def analyse_page():
    #Hackathon page : https://actu.universita.corsica/plugins/actu/actu-front.php?id_site=institutionnel&id=7698
    url = bottle.request.forms.get('url')
    if validators.url(url):
        try:
            content = Test(url) # 'https://www.lequipe.fr/'
            content = content.get_raw_html()

            with open("static/pagePreview/temp.html", 'w', encoding="utf-8") as file:
                file.write(content)
                file.close()
        except:
            print("An error has occured")
        finally:
            return bottle.template('views/index.tlp')

@app.route('/')
def index():
    return bottle.template('views/index.tlp')

bottle.run(app, host='localhost', debug=True, reloader=True, port=8000)
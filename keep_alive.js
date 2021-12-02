const flask = require('flask');
const threading = require('threading');

app = flask.Flask('')
@app.route('/');

function home(){
    return "Server Alive!";
}

function run(){
  app.run(host='0.0.0.0',port=8080);
}

function keep_alive(){
    t = Thread(target=run);
    t.start();
}
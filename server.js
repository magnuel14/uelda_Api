const app = require("./app");

app.handler.caller.call()

app.listen(app.get('port'));
console.log('server on port', app.get('port'));
var express = require('express');
var app = express();

app.use(express.static('views'));
app.use(express.static('public'));

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
});





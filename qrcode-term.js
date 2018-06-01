const PORT = process.env.PORT || 8080

var QrParse = require('qrcode-reader');
var qrTerminal = require('qrcode-terminal');
var restify = require('restify');
var Jimp = require("jimp");

var qrParse = new QrParse();

function respond(req, res, next) {
  Jimp.read(req.body.qrUrl).then(function (image) {
    var qr = new QrParse();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        console.log(value)
        qrTerminal.generate(value.result, function (qrCode) {
          res.sendRaw(qrCode);
          next();
        })
    };
    qr.decode(image.bitmap);    
  }).catch(function (err) {
    // handle an exception
  });
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser())
server.post('/qr', respond);

server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});

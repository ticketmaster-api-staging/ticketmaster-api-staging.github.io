var https = require('https'),
http = require('http'),
path = require('path'),
express = require('express'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
syncrequest = require('sync-request'),
url = require('url'),
router = express.Router(),
fs = require('fs');

var app = express();

var staticSiteOptions = {
portnum: 80,
maxAge: 1000 * 60 * 15
};

var sess;
var apps;

function getRequestURI(userId, path) {
    var res = syncrequest('GET', process.env.DRUPAL_PORTAL_URL + userId + path);
    return res.getBody().toString();
}

function base64Encode(str) {     
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    return Base64.encode(unescape(encodeURIComponent(str)));    
}  

function getRole(req, res) {
    var roles = [];
    var rolesMenu = [];
    if (req.session.user == undefined) {
        if (req.cookies['tk-u'] != undefined) {
            if (typeof Buffer.from === 'function') {
                buf = Buffer.from(req.cookies['tk-u'], 'base64');
            } else {
                buf = new Buffer(req.cookies['tk-u'], 'base64');
            }
            var role = JSON.parse(getRequestURI(buf.toString(), '/roles'));
            
            /* Internal user [START] */
            if (role.roles[10] != undefined) {
                roles.push('internal');
                rolesMenu.push('i');
            }
            /* Internal user [END] */

            /* Open marketplace user [START] */
            if (role.roles[11] != undefined) {
                roles.push('marketplace');
                rolesMenu.push('m');
            }
            /* Open marketplace user [END] */

            /* Commerce user [START] */
            if (role.roles[12] != undefined) {
                roles.push('commerce');
                rolesMenu.push('c');
            }
            /* Commerce user [END] */
  
            req.session.user = roles;
            res.cookie('tk-m', base64Encode(rolesMenu.toString()));
            // console.log("User new in session:" + roles);
        }
    }
    else {
        if (req.cookies['tk-u'] == undefined) {
            req.cookies['connect.sid'] = undefined;
            req.cookies['tk-m'] = undefined;
        }
        else {
            roles = req.session.user;
            // console.log("User stored in session: " + roles);
        }
    }
    return roles;
}

/* Commerce API Access [START] */
router.get('/products-and-docs/apis/commerce/v2/internal.html', function(req, res) {
    var role = getRole(req, res);
    console.log('Auth: internal = ' + role.indexOf('internal') + ' commerce = ' + role.indexOf('commerce'));
    if (role.indexOf('internal') != -1 || role.indexOf('commerce') != -1) {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/'));
    }
    else {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/internal.html'));
    }
});

router.get('/products-and-docs/apis/commerce/v2/', function(req, res) {
    var role = getRole(req, res);
    console.log('Simple: internal = ' + role.indexOf('internal') + ' commerce = ' + role.indexOf('commerce'));
    if (role.indexOf('internal') != -1 || role.indexOf('commerce') != -1) {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/internal.html'));
    }
    else {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/'));
    }
});
/* Commerce API Access [END] */

/* OAuth API Access [START] */
router.get('/products-and-docs/apis/oauth/', function(req, res) {
    var role = getRole(req, res);
    if (role.indexOf('internal') != -1) {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/oauth/'));
    } else {
        res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/getting-started/index.html'));
    }
});
/* OAuth API Access [END] */

/* Marketplace API Access [START] */
router.get('/products-and-docs/apis/marketplace-api/v1/', function(req, res) {
  var role = getRole(req, res);
  if (role.indexOf('marketplace') != -1) {
      res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/marketplace-api/v1/index.html'));
  } else {
      res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/getting-started/index.html'));
  }
});
/* Marketplace API Access [END] */

app.use(cookieParser());

var hour = 3600000;
app.use(session({
    secret: 'kjniY*YiuhJKN',
    cookie: { secure:  false,
              expires: new Date(Date.now() + hour),
              maxAge:  hour },
    saveUninitialized: true,
    resave: true,
}));

app.use(router);

var options = {
    ca: fs.readFileSync('_site/' + process.env.SSL_FOLDER + '/developer-portal.csr'),
    cert: fs.readFileSync('_site/' + process.env.SSL_FOLDER + '/developer-portal.crt'),
    key: fs.readFileSync('_site/' + process.env.SSL_FOLDER + '/developer-portal.key')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

app.use(function(req, res, next) {
    getRole(req, res);
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect(301, 'https://' + req.headers['host'] + req.url);
    }
    else next();
});

app.use(express.static(path.join(__dirname, '_site')));

app.use(function(req, res, next) {
    res.sendFile(path.join(__dirname+'/_site/404.html'));
});

console.log('Listening on port:', staticSiteOptions.portnum);
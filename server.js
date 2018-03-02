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

function getRequestURI(userId) {
	var res = syncrequest('GET', process.env.DRUPAL_PORTAL_URL + userId + '/roles');
	return res.getBody().toString();
}

function getRole(req) {
	var role='public';
	if (req.session.user == undefined) {
		if (req.cookies['tk-u'] != undefined) {
			if (typeof Buffer.from === 'function') {
				buf = Buffer.from(req.cookies['tk-u'], 'base64');
			} else {
				buf = new Buffer(req.cookies['tk-u'], 'base64');
			}
			role = JSON.parse(getRequestURI(buf.toString()));
			/* Internal user [START] */
			if (role.roles[10] != undefined) {
				role = 'internal';
				req.session.user = role;
			}
			/* Internal user [END] */
			console.log("User new in session");
		}
	}
	else {
		if (req.cookies['tk-u'] == undefined) {
			req.cookies['connect.sid'] = undefined;
		}
		else {
			console.log("User stored in session");
			role = req.session.user;
		}
	}
	return role;
}

/* Commerce API Access [START] */
router.get('/products-and-docs/apis/commerce/v2/internal.html', function(req, res) {
	var role = getRole(req);
	if (role != 'internal') {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/'));
	}
	else {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/internal.html'));
	}

});

router.get('/products-and-docs/apis/commerce/v2/', function(req, res) {
	var role = getRole(req);
	if (role == 'internal') {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/internal.html'));
	}
	else {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/commerce/v2/'));
	}
});
/* Commerce API Access [END] */

/* OAuth API Access [START] */
router.get('/products-and-docs/apis/oauth/', function(req, res) {
	var role = getRole(req);
	if (role == 'internal') {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/oauth/'));
	} else {
		res.sendFile(path.join(__dirname+'/_site/products-and-docs/apis/getting-started/index.html'));
	}
});
/* OAuth API Access [END] */
const contactUsController = require(path.resolve('server', 'controllers', 'contact-us.js'));
router.get('/api/contact-us', contactUsController.test);

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
	if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
		res.redirect(301, 'https://' + req.headers['host'] + req.url);
	}
	else
		next();
});

app.use(express.static(path.join(__dirname, '_site')));

console.log('Listening on port:', staticSiteOptions.portnum);

/**
 * Show email if user logged
 */
(function() {
  // get Cookie by name
  function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  let apiKeys = JSON.parse('[' + window.atob(getCookie('tk-api-key')) + ']'); // decode and convert string to array
  let email = window.atob(getCookie('tk-api-email')); // decode string

  if (email) {
    $('.apigee-login').text(email);
  }

  if (apiKeys && apiKeys[0] && apiKeys[0].length) {
    let key = apiKeys[0][apiKeys[0].length-1];
    /* add custom login event for widget*/
    if (key) {
      $(window).trigger('login', [{
        key: key,
        email: email,
      }]);
    }
  }
})();

(function() {
  // get Cookie by name
  function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  function base64Decode(str) {
    let Base64={_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', encode: function(e) {
      let t=''; let n, r, i, s, o, u, a; let f=0; e=Base64._utf8_encode(e); while (f<e.length) {
        n=e.charCodeAt(f++); r=e.charCodeAt(f++); i=e.charCodeAt(f++); s=n>>2; o=(n&3)<<4|r>>4; u=(r&15)<<2|i>>6; a=i&63; if (isNaN(r)) {
          u=a=64;
        } else if (isNaN(i)) {
          a=64;
        }t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);
      } return t;
    }, decode: function(e) {
      let t=''; let n, r, i; let s, o, u, a; let f=0; e=e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); while (f<e.length) {
        s=this._keyStr.indexOf(e.charAt(f++)); o=this._keyStr.indexOf(e.charAt(f++)); u=this._keyStr.indexOf(e.charAt(f++)); a=this._keyStr.indexOf(e.charAt(f++)); n=s<<2|o>>4; r=(o&15)<<4|u>>2; i=(u&3)<<6|a; t=t+String.fromCharCode(n); if (u!=64) {
          t=t+String.fromCharCode(r);
        } if (a!=64) {
          t=t+String.fromCharCode(i);
        }
      }t=Base64._utf8_decode(t); return t;
    }, _utf8_encode: function(e) {
      e=e.replace(/\r\n/g, '\n'); let t=''; for (let n=0; n<e.length; n++) {
        let r=e.charCodeAt(n); if (r<128) {
          t+=String.fromCharCode(r);
        } else if (r>127&&r<2048) {
          t+=String.fromCharCode(r>>6|192); t+=String.fromCharCode(r&63|128);
        } else {
          t+=String.fromCharCode(r>>12|224); t+=String.fromCharCode(r>>6&63|128); t+=String.fromCharCode(r&63|128);
        }
      } return t;
    }, _utf8_decode: function(e) {
      let t=''; let n=0; let r=c1=c2=0; while (n<e.length) {
        r=e.charCodeAt(n); if (r<128) {
          t+=String.fromCharCode(r); n++;
        } else if (r>191&&r<224) {
          c2=e.charCodeAt(n+1); t+=String.fromCharCode((r&31)<<6|c2&63); n+=2;
        } else {
          c2=e.charCodeAt(n+1); c3=e.charCodeAt(n+2); t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63); n+=3;
        }
      } return t;
    }};
    return decodeURIComponent(escape(Base64.decode(str)));
  }

  if (getCookie('tk-u') != '') {
    let points = base64Decode(getCookie('tk-m'));
    if (points.indexOf('i') != -1) {
      if (document.querySelector('.aside-menu li.i.off') != null) document.querySelector('.aside-menu li.i.off').classList.remove('off');
    }
    // if (points.indexOf('c') != -1) document.querySelector('.aside-menu li.c.off').classList.remove('off');

    if (points.indexOf('m') != -1) {
      if (document.querySelector('.aside-menu li.m.off') != null) document.querySelector('.aside-menu li.m.off').classList.remove('off');
      document.querySelector('#expand-menu .expand-column li.m.off').classList.remove('off');
    }
  }
})();

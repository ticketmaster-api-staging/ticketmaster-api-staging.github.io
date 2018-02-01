(function(global) {
  'use strict';

  let prefix = 'tm-code';

  let getExpanderClasses = function(expanded) {
    if (!expanded) {
      return 'expanded collapsed hidden';
    }
    return 'expanded';
  };

  let encode = function(value) {
    return ['<span>', value, '</span>'].join('');
  };

  let createElement = function(key, value, type, expanderClasses) {
    let klass = 'object',
      open = '{',
      close = '}';

    if (Array.isArray(value)) {
      klass = 'array';
      open = '[';
      close = ']';
    }

    if (value === null) {
      return [
        '<li>',
        '<span class="key">"', encode(key), '": </span>',
        '<span class="null">"', encode(value), '"</span>',
        '</li>',
      ].join('');
    }

    if (type == 'object') {
      return [
        '<li>',
        '<span class="', expanderClasses, '"></span>',
        '<span class="key">"', encode(key), '": </span> ',
        '<span class="open">', open, '</span> ',
        '<ul class="', klass, '">',
        json2html(value, expanderClasses),
        '</ul>',
        '<span class="close">', close, '</span>',
        '</li>',
      ].join('');
    }

    if (type == 'number' || type == 'boolean') {
      return [
        '<li>',
        '<span class="key">"', encode(key), '": </span>',
        '<span class="', type, '">', encode(value), '</span>',
        '</li>',
      ].join('');
    }
    return [
      '<li>',
      '<span class="key">"', encode(key), '": </span>',
      '<span class="', type, '">"', encode(value), '"</span>',
      '</li>',
    ].join('');
  };

  let json2html = function(json, expanderClasses) {
    let html = '';
    for (let key in json) {
      if (!json.hasOwnProperty(key)) {
        continue;
      }

      html = [html, createElement(key, json[key], typeof json[key], expanderClasses)].join('');
    }
    return html;
  };

  let getJsonViewer = function(data, options) {
    try {
      return [
        '<ul class="', prefix, '-container">',
        json2html([JSON.parse(data)], getExpanderClasses(options.expanded)),
        '</ul>',
      ].join('');
    } catch (e) {
      return [
        '<div class="', prefix, '-error" >', e.toString(), ' </div>',
      ].join('');
    }
  };

  global.highlightJson = function(data, opt) {
    let json = '';
    let options = opt || {expanded: true};
    if (typeof data == 'string') {
      json = data;
    } else if (typeof data == 'object') {
      json = JSON.stringify(data);
    }
    return getJsonViewer(json, options);
  };
}(this));

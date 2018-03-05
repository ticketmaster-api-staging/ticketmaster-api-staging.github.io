/**
 * Code format web-worker
 * @param event
 */

onmessage = function(event) {
  let code = event.data;
  importScripts('json-parse.js');
  let result = highlightJson(code, {expanded: true});
  postMessage(result);
};

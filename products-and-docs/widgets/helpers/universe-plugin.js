const service = {
  embedUniversePlugin,
};
export default service

function embedUniversePlugin() {
  let id = 'id_universe_widget';
  if( !document.getElementById(id) ){
    let script = document.createElement('script');
    script.setAttribute('src', 'https://www.universe.com/embed.js');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.setAttribute('id', id);
    (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
  }
}

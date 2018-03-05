let disqus_config = function() {
  this.page.url = document.URL || 'http://developer.ticketmaster.com/';
  this.page.identifier = '{{page.title}}';
};

(function() { // DON'T EDIT BELOW THIS LINE
  let d = document,
    s = d.createElement('script');
  s.src = '//ticketmasterapi.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();

/**
 *  Menu highlight
 **/
(function() {
  let topMenu = $('.menu-highlight'),
    // topMenuHeight = topMenu.outerHeight(),
    // All list items
    menuItems = topMenu.find('a'),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function() {
      if ($(this).attr('href')[0] === '#') {
        let item = $($(this).attr('href'));
        if (item.length) {
          return item;
        }
      }
    });

  $(window).scroll(function() {
    // Get container scroll position (100 px of backup)
    let fromTop = $(this).scrollTop()+100/* +topMenuHeight-200*/;

    // Get id of current scroll item
    let cur = scrollItems.map(function() {
      if ($(this).offset().top < fromTop) {
        return this;
      }
    });
    // Get the id of the current element
    cur = cur[cur.length-1];
    let id = cur && cur.length ? cur[0].id : '';
    // Set/remove active class
    menuItems
      .parent().removeClass('active')
      .end().filter('[href=#'+id+']').parent().addClass('active');
  });
})();

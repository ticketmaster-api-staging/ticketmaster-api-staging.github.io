$(document).on( 'finishInit', function( event, flag ) {
  let startDateTime = $('<span class="dt-ico"></span>');
  $('#startDateTime').parent().append(startDateTime);
  startDateTime.on( 'click', function() {
    NewCssCal('startDateTime', 'yyyyMMdd', 'dropdown', true, '24');
  });
  let endDateTime = $('<span class="dt-ico"></span>');
  $('#endDateTime').parent().append(endDateTime);
  endDateTime.on( 'click', function() {
    NewCssCal('endDateTime', 'yyyyMMdd', 'dropdown', true, '24');
  });
  let onsaleStartDateTime = $('<span class="dt-ico"></span>');
  $('#onsaleStartDateTime').parent().append(onsaleStartDateTime);
  onsaleStartDateTime.on( 'click', function() {
    NewCssCal('onsaleStartDateTime', 'yyyyMMdd', 'dropdown', true, '24');
  });
  let onsaleEndDateTime = $('<span class="dt-ico"></span>');
  $('#onsaleEndDateTime').parent().append(onsaleEndDateTime);
  onsaleEndDateTime.on( 'click', function() {
    NewCssCal('onsaleEndDateTime', 'yyyyMMdd', 'dropdown', true, '24');
  });
});

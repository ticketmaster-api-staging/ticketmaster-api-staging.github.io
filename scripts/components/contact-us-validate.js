const $contactForm = $('.js_contact_form');
const $textAreaDescription = $('#message-detail-text');

const $modalAlert = $('#contact-alert-modal');
const $modalAlertError = $('#contact-alert-modal-error');
const $btnAlertOk = $modalAlert.find('#js_contact_btn_alert_ok');
const $btnAlertError = $modalAlertError.find('#js_contact_btn_alert_ok-error');
const errorDescriptionID = 'char-count';

const showMsgSuccess = (modalSelector) => {
  $(modalSelector).modal();
  $contactForm.trigger('reset');
  $('button', $contactForm).prop('disabled', false);
};

const sendContactData = (formData) => {
  $.ajax({
    dataType: 'json',
    url: '/api/contact-us',
    data: formData,
  }).done(function() {
    showMsgSuccess('#contact-alert-modal');
  });
};

const showMsgError = (id, charCount) => {
  $('#nexus-text-overflow-message')
    .append(`<span id="${errorDescriptionID}"> Current count is ${charCount}</span>`);
  $(id).modal();
};

$contactForm.submit(function(e) {
  e.preventDefault();
  const charCount = $textAreaDescription.val().length;
  $('button', $contactForm).prop('disabled', true);

  if (charCount > 3000) {
    showMsgError('#contact-alert-modal-error', charCount);
    return false;
  }
  const formData = $contactForm.serialize();

  sendContactData(formData);

  return false;
});

const initListeners = () => {
  $btnAlertOk.on('click', function() {
    $modalAlert.modal('hide');
  });

  $btnAlertError.on('click', function() {
    $modalAlertError.modal('hide');
    $('#'+errorDescriptionID).remove();
    $('button', $contactForm).attr('disabled', false);
  });
};

initListeners();

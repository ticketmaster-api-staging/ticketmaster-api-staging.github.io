(function($) {
  let $modal = $('#feedback-modal'),
    $modalAlert = $('#feedback-alert-modal'),
    $modalAlertError = $('#feedback-alert-modal-error'),
    $form = $modal.find('#js_feedback_form'),
    $email = $form.find('#email'),
    $btn = $modal.find('#js_feedback_btn'),
    $btnAlertOk = $modalAlert.find('#js_feedback_btn_alert_ok'),
    $btnAlertError = $modalAlertError.find('#js_feedback_btn_alert_ok-error'),
    errorDescriptionID = 'feedback-contact-char-count',
    cssValidationClass = 'feedback_form-validation';

  function resetForm() {
    $btn.removeAttr('disabled');
    $form.find('textarea').val('');
    $form.find('input').each(function() {
      let $self = $(this);
      if ($self.attr('name')) {
        $self.val('');
      }
    });

    $form.removeClass(cssValidationClass);
  }
  function showMsgError(id, charCount) {
    $modal.modal('hide');

    $('#text-overflow-message').append('<span id="feedback-contact-char-count"> Current count is '+charCount+'</span>');
    $(id).modal();
  }

  function submitForm() {
    let $textAreaDescription = $('#description'),
      charCount = $textAreaDescription.val().length,
      formData = $form.serialize();
    sendRequest = function(formData) {
      $.ajax({
        dataType: 'json',
        url: '/api/contact-us',
        data: formData,
      }).done(function() {
        // Close dialog
        $modal.modal('hide');

        // Show message
        $modalAlert.modal('show');
      });
    };
    if (charCount > 3000) {
      showMsgError('#feedback-alert-modal-error', charCount);
      return false;
    }

    $email.val($email.val().toLocaleLowerCase());

    sendRequest(formData);
  }

  // EVENTS
  $btn.on('click', function() {
    let form = $form.get(0);
    if (!$btn.is(':disabled')) {
      if (form.checkValidity()) {
        $btn.attr('disabled', true);
        submitForm();
      } else {
        // Highlight errors
        if (form.reportValidity) form.reportValidity();
        $form.addClass(cssValidationClass);
      }
    }
  });

  function clearBody(delay) {
    setTimeout(function() {
      $('body').removeAttr('style');
      $('#'+errorDescriptionID).remove();
    }, delay);
  }

  $btnAlertOk.on('click', function() {
    $modalAlert.modal('hide');
    clearBody(310); // 310 - time of fading bootstrap modal
    resetForm(); // clear on success
  });

  $btnAlertError.on('click', function() {
    $modalAlertError.modal('hide');
    clearBody(310);
    $modal.modal('show');
    $btn.attr('disabled', false);
  });

  // $modal.on('hidden.bs.modal', resetForm);
})(jQuery);

'use strict';

/* eslint-disable */
var showModal = function showModal() {
  $('.modal').css({ display: 'block' });
};

var submitForm = function submitForm(formClass) {
  $('.' + formClass).submit();
};

var updateFormValue = function updateFormValue(attrClass, value) {
  var openModal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (openModal) showModal();
  $('.' + attrClass).attr('value', value);
};

(function ($) {
  $(document).ready(function () {
    $('.toast-close').click(function () {
      return $('.toast').remove();
    });

    $('.modal-close').click(function () {
      return $('.modal').css({ display: 'none' });
    });

    $('.random-order-switch').change(function () {
      return submitForm('randomise-media-form');
    });
  });
})(jQuery);

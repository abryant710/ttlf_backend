'use strict';

/* eslint-disable */
var showModal = function showModal() {
  $('.faded-background').removeClass('invisible');
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
      $('.faded-background').addClass('invisible');
      $('.modal').css({ display: 'none' });
    });

    $('.random-order-switch').change(function () {
      return submitForm('randomise-media-form');
    });

    $('.live-now-switch').change(function () {
      return submitForm('live-now-form');
    });

    $('.bio-select').change(function (e) {
      return window.location.assign('/config/manage-bios?chosenProfile=' + e.target.value);
    });

    $('.live-dj-select').change(function (e) {
      return updateFormValue('dj-name', e.target.value);
    });
  });
})(jQuery);

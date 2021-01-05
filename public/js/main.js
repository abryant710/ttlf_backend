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

    $('.live-now-switch').change(function () {
      return submitForm('randomise-media-form');
    });

    $('.bio-select').change(function (e) {
      var newName = e.target.value;
      window.location.assign('/config/manage-bios?chosenProfile=' + newName);
    });

    $('.live-dj').change(function (e) {
      var newName = e.target.value;
      window.location.assign('/config/manage-bios?chosenProfile=' + newName);
    });
  });
})(jQuery);

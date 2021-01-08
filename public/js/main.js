'use strict';

/* eslint-disable */
var showModal = function showModal() {
  $('.faded-background').removeClass('invisible');
  $('.modal').css({ display: 'block' });
};

var submitForm = function submitForm(formClass) {
  $('.' + formClass).submit();
};

var updateIdAttr = function updateIdAttr(_id) {
  var openModal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (openModal) {
    showModal();
  }
  $('.modal-action').attr('value', _id);
};

var createStaticToast = function createStaticToast(status, message) {
  var toastStatus = 'info';
  switch (status) {
    case 'Success':
      toastStatus = 'success';
      break;
    case 'Error':
      toastStatus = 'danger';
      break;
    default:
      toastStatus = 'info';
  }
  var $toast = $('.static-toast').clone();
  $toast.addClass(toastStatus + '-background static-toast-clone');
  $toast.find('.toast-header').addClass(toastStatus + '-background');
  $toast.find('.toast-header-message').text(status);
  $toast.find('.toast-body-message').text(message);
  $toast.find('.static-toast-close').click(function () {
    return $('.static-toast-clone').remove();
  });
  $('body').append($toast);
};

var sendAction = async function sendAction(btn, deleteType, action, csrfToken) {
  if (action === 'delete') {
    var id = $(btn).attr('value');
    var result = await fetch('/config/delete-' + deleteType + '/' + id, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrfToken
      }
    });

    var _ref = await result.json(),
        status = _ref.status,
        message = _ref.message,
        reload = _ref.reload;

    createStaticToast(status, message);
    $('#' + id).remove();
    if (reload) {
      window.location.reload();
    }
  }
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

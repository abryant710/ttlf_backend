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
  $('.' + attrClass).attr('value', value);
};

var updateIdAttr = function updateIdAttr(_id) {
  var openModal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (openModal) {
    showModal();
  }
  $('.modal-action').attr('value', _id);
};

var createStaticToast = function createStaticToast(status, message) {
  $('.dynamic-toast').remove();
  $('.static-toast-clone').remove();
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

var sendAction = async function sendAction(btn, actionType, action, csrfToken) {
  if (action === 'delete') {
    var id = $(btn).attr('value');
    var result = await fetch('/config/delete-' + actionType + '/' + id, {
      method: 'DELETE',
      headers: { 'csrf-token': csrfToken }
    });

    var _ref = await result.json(),
        status = _ref.status,
        message = _ref.message,
        redirect = _ref.redirect;

    createStaticToast(status, message);
    $('#' + id).remove();
    if (redirect) {
      window.location.assign(redirect);
    }
  } else if (action === 'patch') {
    var _result = await fetch('/config/patch-boolean', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken
      },
      body: JSON.stringify({ actionType: actionType })
    });

    var _ref2 = await _result.json(),
        _status = _ref2.status,
        _message = _ref2.message;

    createStaticToast(_status, _message);
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

    $('.bio-select').change(function (e) {
      return window.location.assign('/config/manage-bios?chosenProfile=' + e.target.value);
    });

    $('.live-dj-select').change(function (e) {
      return updateFormValue('dj-name', e.target.value);
    });
  });
})(jQuery);

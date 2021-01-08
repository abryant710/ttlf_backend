/* eslint-disable */
const showModal = () => {
  $('.faded-background').removeClass('invisible');
  $('.modal').css({ display: 'block' });
}

const submitForm = (formClass) => {
  $(`.${formClass}`).submit();
}

const updateIdAttr = (_id, openModal = true) => {
  if (openModal) {
    showModal();
  }
  $('.modal-action').attr('value', _id);
}

const createStaticToast = (status, message) => {
  let toastStatus = 'info';
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
  const $toast = $('.static-toast').clone();
  $toast.addClass(`${toastStatus}-background static-toast-clone`);
  $toast.find('.toast-header').addClass(`${toastStatus}-background`);
  $toast.find('.toast-header-message').text(status);
  $toast.find('.toast-body-message').text(message);
  $toast.find('.static-toast-close').click(() => $('.static-toast-clone').remove());
  $('body').append($toast);
}

const sendAction = async (btn, deleteType, action, csrfToken) => {
  if (action === 'delete') {
    const id = $(btn).attr('value');
    const result = await fetch(`/config/delete-${deleteType}/${id}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrfToken,
      }
    });
    const { status, message, redirect } = await result.json();
    createStaticToast(status, message);
    $(`#${id}`).remove();
    if (redirect) {
      window.location.assign(redirect);
    }
  }
};

(function ($) {
  $(document).ready(function () {
    $('.toast-close').click(() => $('.toast').remove());

    $('.modal-close').click(() => {
      $('.faded-background').addClass('invisible');
      $('.modal').css({ display: 'none' })
    });

    $('.random-order-switch').change(() => submitForm('randomise-media-form'));

    $('.live-now-switch').change(() => submitForm('live-now-form'));

    $('.bio-select').change((e) => window.location.assign(`/config/manage-bios?chosenProfile=${e.target.value}`));

    $('.live-dj-select').change((e) => updateFormValue('dj-name', e.target.value));
  });
})(jQuery);


/* eslint-disable */
const showModal = () => {
  $('.modal').css({ display: 'block' });
}

const submitForm = (formClass) => {
  $(`.${formClass}`).submit();
}

const updateFormValue = (attrClass, value, openModal = true) => {
  if (openModal) showModal();
  $(`.${attrClass}`).attr('value', value);
}

(function ($) {
  $(document).ready(function () {
    $('.toast-close').click(() => $('.toast').remove());

    $('.modal-close').click(() => $('.modal').css({ display: 'none' }));
  });
})(jQuery);


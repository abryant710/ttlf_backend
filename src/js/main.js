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

    $('.random-order-switch').change(() => submitForm('randomise-media-form'));

    $('.bio-select').change((e) => {
      const newName = e.target.value;
      window.location.assign(`/config/manage-bios?chosenProfile=${newName}`);
    });
  });
})(jQuery);


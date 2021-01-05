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

    $('.live-now-switch').change(() => submitForm('live-now-form'));

    $('.bio-select').change((e) => window.location.assign(`/config/manage-bios?chosenProfile=${e.target.value}`));

    $('.live-dj-select').change((e) => updateFormValue('dj-name', e.target.value));
  });
})(jQuery);


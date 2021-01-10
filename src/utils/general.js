/* eslint-disable no-underscore-dangle */
const path = require('path');

module.exports.getOrigin = (req) => {
  const host = req.get('host');
  const httpPart = host.includes('localhost') ? 'http' : 'https';
  return `${httpPart}://${host}`;
};

module.exports.sortSchedules = (bios, schedules) => {
  // Ensure the table sorts the sets in chronological order
  const biosmap = {};
  // creating lookup table
  bios.forEach((bio) => { biosmap[bio._id] = bio.nickname || bio.name; });
  const modifiedSchedules = schedules.map((sched) => {
    const newSched = { ...sched._doc };
    newSched.name = biosmap[sched.dj];
    newSched.datetime = new Date(`${sched.date}T${sched.time}`);
    return newSched;
  });
  return modifiedSchedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
};

const getFlashMessage = (req) => {
  let messageType = null;
  let messageText = '';
  const flashError = req.flash('error');
  const flashSuccess = req.flash('success');
  if (flashError.length) {
    messageType = 'error';
    [messageText] = flashError;
  } else if (flashSuccess.length) {
    messageType = 'success';
    [messageText] = flashSuccess;
  }
  return [messageType, messageText];
};

module.exports.sendResponse = (
  req,
  res,
  status,
  page,
  additionalAttrs = [],
) => {
  const [messageType, messageText] = getFlashMessage(req);
  const sendMessage = messageType ? {
    [messageType]: messageText,
  } : {};
  const extraAttrs = {};
  additionalAttrs.forEach(([key, val]) => {
    extraAttrs[key] = val;
  });
  return res
    .status(status)
    .render(page, {
      sendMessage,
      ...extraAttrs,
    });
};

module.exports.rootPath = path.dirname(require.main.filename);

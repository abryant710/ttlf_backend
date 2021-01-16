/* eslint-disable no-underscore-dangle */
import main from 'require-main-filename';

export const getOrigin = (req) => {
  const host = req.get('host');
  const httpPart = host.includes('localhost') ? 'http' : 'https';
  return `${httpPart}://${host}`;
};

// Ensure the table sorts the sets in chronological order
export const sortSchedules = (bios, schedules) => {
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

export const sendResponse = (
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

export const rootPath = main();

'use strict';

const undici = require('undici');
const cheerio = require('cheerio');
const emailNotify = require('./email').email;

module.exports.run = async (event, context) => {
  // SETUP / UTILS ------------------------------------

  const __TARGET__ = process.env.TARGET_URL;
  let logOutput = "";
  
  const formatPart = str => `${logOutput.length ? "\r\n    └──" : ""} ${str}`;
  const appendLogOutput = str => { logOutput += `${formatPart(str)}` };
  
  const getResultOutput = (isSuccess = false) => isSuccess ? "✅ In Stock! ✅" : "❌ Out of stock ❌"
  
  // INVOCATION --------------------------------

  appendLogOutput(`@ ${new Date().toJSON()}`);
  
  const response = await undici.request(__TARGET__);
  const rawText = await response.body.text();
  const $ = cheerio.load(rawText);

  const isInStock = $('#outOfStock').length === 0;
  
  appendLogOutput(getResultOutput(isInStock));

  if (isInStock) {
    appendLogOutput(__TARGET__);
    await emailNotify(__TARGET__)
  }
  
  return console.log(logOutput);
};

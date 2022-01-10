"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlightElasticTags = highlightElasticTags;
exports.removeElasticTags = removeElasticTags;

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.replace.js");

function highlightElasticTags(text) {
  const regex = new RegExp(/<em>(.*?)<\/em>/); // Match text inside two square brackets

  return /*#__PURE__*/React.createElement("div", null, text.split(regex).reduce((prev, tagged, i) => {
    if (i % 2 === 0) {
      prev.push(tagged);
    } else {
      prev.push( /*#__PURE__*/React.createElement("highlight", {
        key: i + tagged
      }, tagged));
    }

    return prev;
  }, []));
}

function removeElasticTags(text) {
  return text.replace("<em>", "").replace("</em>", "");
}
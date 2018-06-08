
///////////////////////////////////////////////
////////      utility function         ///////
//////// c xio - all rights reserved  ///////
/////////////////////////////////////////////
const validUrl =             require("valid-url");

// capitalize a string of characters
exports.capitalize = (str = '') => {
  return typeof str !== 'string'
    ? ''
    : str[0].toUpperCase() + str.slice(1)
}

// extract and return an array of names prefixed with #
exports.isHashTag = (text) => {
  //^ anything not in array list, + one or more, /gi replace all not case sensitive
  text = text.replace(/[^a-z0-9@#]+/gi, ' ');

  if (typeof text !== 'string') return false
  let tags = text.split(/[ ,]+/);  // tokenize a string, breaking on blanks and commas

  let tagfilter = tags.filter((tag) => { return (tag.charAt(0) === '#') })
                          .map((tag) => { return tag.substring(1) })

  return tagfilter

}

// test if an item is null or undefined
exports.isNull = (item) => {
  return typeof typeof item == 'undefined' || item === null;
}
// test for valid urls according to RFC spec -- including shortened urls
exports.isValidUrl = (text) => {
  if (validUrl.isUri(text)) return true
}

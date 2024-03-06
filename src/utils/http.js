const { XMLHttpRequest } = require("xmlhttprequest");

const get = (request,  synchronous = false) => {
  const r = new XMLHttpRequest();
  r.open('GET', request.url, synchronous);  // `false` makes the request synchronous
  r.send(null);

  if (r.status === 200) {
    return r.responseText
  }
}


module.exports = {
  get
}

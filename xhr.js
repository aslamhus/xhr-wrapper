/**
 * Changelog
 * - updated documentation for better vscode intellisense
 * - added headers property to JSDoc
 * - fixed bug with getting headers
 * - changed default of contenType to 'application/json'
 */

/**
 * XMLHttpRequest Function v 1.0.0
 *
 * @param {*} request - the request object
 * @param {string} request.url - request url
 * @param {string} request.method - default is 'POST'
 * @param {Object} request.headers - additional headers (i.e. authorization)
 * @param {string|Object|Array} request.data - the data to send
 * @param {Function} request.onProgress - callback on xhr.upload.onprogress (params: {string} percentLoaded, {object} event data)
 * @param {Function} request.onComplete - callback on request/upload complete
 * @param {Function} request.onError - callback on xhr error
 * @param {Object} request.abort - aborts xhr request and rejects promise.
 *
 * Using an abort token example:
 *
 * @example
 * const cancelToken = {};
 * const xhr = xhr({ ... abort : cancelToken })
 * cancelToken.abort();
 *
 * @returns Promise - resolves to response from request
 *
 * */
const xhr = ({
  url = '',
  method = 'POST',
  headers = {},
  data = null,
  onProgress = null,
  onComplete = null,
  onError = null,
  abort = {},
}) => {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open(method, url);
    // set headers
    if (headers) {
      Object.entries(headers).forEach((header) => {
        const [key, value] = header;
        xhr.setRequestHeader(key, value);
      });
    }
    abort.cancel = () => {
      xhr.abort();
      reject(new Error('aborted xhr request to ' + url));
    };
    xhr.onload = () => {
      if (xhr.status != 200) {
        // handle request error
        if (onError instanceof Function) {
          onError({ status: xhr.status, response: xhr.responseText });
        }
        reject(new Error(xhr.status));
      }
      let response;
      try {
        response = JSON.parse(xhr.responseText);
      } catch (JSONerror) {
        // handle response parse error
        reject(JSONerror);
      }
      // successful request
      resolve(response);
    };
    xhr.onerror = (e) => {
      if (onError instanceof Function) {
        onError(e);
      }
    };
    xhr.upload.onprogress = (e) => {
      console.log('onprogress', e);
      if (onProgress instanceof Function) {
        var percentLoaded = Math.ceil((e.loaded / e.total) * 100);
        onProgress(percentLoaded, e);
        if (percentLoaded >= 100) {
          if (onComplete instanceof Function) {
            onComplete();
          }
        }
      }
    };
    xhr.send(data);
  });
};

export default xhr;

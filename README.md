# XHR Wrapper

A wrapper for an XMLHttpRequest with progress handling, abort token.

## Returns

XHR returns a `Promise` that resolves to the response of the request.

## Parameters

XHR Wrapper takes an object as paraemter with the following properties

| Property    | Type     | Description                                    | Required | Default          |
| ----------- | -------- | ---------------------------------------------- | -------- | ---------------- |
| url         | string   | the request url                                | ✅       |                  |
| method      | string   | the http request method                        |          | POST             |
| contentType | string   | the content type                               |          | application/json |
| headers     | object   | additional headers for the http request        |          |                  |
| data        | string   | the request body                               | ✅       |                  |
| onProgress  | function | called whenever for every progress event       |          |                  |
| onComplete  | function | called when request is complete                |          |                  |
| onError     | function | called when there is an error with the request |          |                  |
| abort       | Object   | the abort token (see below more info)          |          |                  |

## Examples

```js
xhr({
  url: '/request/some-end-point',
  method: 'POST',
  headers: { 'X-REQUESTED-WITH': 'XMLHttpRequest' },
  data: JSON.stringify({ data }),
  onProgress: (progress) => {
    console.log('progress', progress);
  },
  onError: (error) => {
    console.error('error!', error);
  },
  onComplete: () => {
    console.log('xhr complete');
  },
}).then((response) => {
  // do something with the response from some-end-point
});
```

### Abort token

To abort the `XMLHttpRequest`, first pass an object into xhr's `abort` property. Then invoke the `cancel` method.

```js
const abortToken = {};
xhr({
  url: '/my-end-point',
  data: JSON.stringify(myData),
  abort: abortToken,
});
// then to cancel the request use the cancel method
abortToken.cancel();
```

Aborting the request will `reject` xhr's `promise`, as well as abort the actual `XMLHttpRequest`.
For more info see MDN on [xhr.abort()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort)

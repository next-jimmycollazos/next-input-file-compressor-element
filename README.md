# Next Input-File Compressor Element

Compress your files atached by <input type="file" /> and upload to your server.

This is a WebComponent is extension of HTMLInputElement.

## How to use

Configure input element:

```html
<input type="file" is="" quality="50" id="my-input" />
```

Before added files selected and use value in you javascript:

```javascript
document.getElementById('my-input').getFiles().then(files => {
  let formData = new FormData();
  formData.append('fileCompressed', formData[0])
  return fetch('https://example.com/my-files', {
    method: 'PUT',
    body: formData
  });
})
```

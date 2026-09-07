const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=windows+7+ultimate+box', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // console.log(data)
    const regex = /src="\/\/external-content\.duckduckgo\.com\/iu\/\?u=([^&"]+)/g;
    let match;
    let count = 0;
    while ((match = regex.exec(data)) !== null && count < 5) {
      console.log(decodeURIComponent(match[1]));
      count++;
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

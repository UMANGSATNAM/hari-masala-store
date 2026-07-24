const https = require('https');
https.get('https://slategray-fox-936985.hostingersite.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    const cssMatches = data.match(/href="([^"]+\.css[^"]*)"/g);
    const jsMatches = data.match(/src="([^"]+\.js[^"]*)"/g);
    console.log('CSS:', cssMatches);
    console.log('JS:', jsMatches);
    
    if (cssMatches && cssMatches.length > 0) {
      const cssUrl = cssMatches[0].replace('href="', '').replace('"', '');
      const fullCssUrl = cssUrl.startsWith('http') ? cssUrl : 'https://slategray-fox-936985.hostingersite.com' + (cssUrl.startsWith('/') ? '' : '/') + cssUrl;
      console.log('Fetching CSS:', fullCssUrl);
      https.get(fullCssUrl, (cssRes) => {
         console.log('CSS STATUS:', cssRes.statusCode);
      });
    }
  });
}).on('error', err => console.log('ERROR:', err));

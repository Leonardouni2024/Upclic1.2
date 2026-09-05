const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

// Office Standard 2021
content = content.replace(
  'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img',
  'https://archive.org/download/microsoft-office-ltsc-2021-professional-plus-standard-visio-project-16.0.14332.20416/Microsoft%20Office%20LTSC%202021%20Professional%20Plus%20_%20Standard%20%2B%20Visio%20%2B%20Project%2016.0.14332.20416.iso'
);

// Project 2016
// It currently has ProjectPro2019Retail.img for project 2016
content = content.replace(
  /id: "prod-project-2016"[\s\S]*?downloadUrl: "[^"]*"/,
  match => match.replace(/downloadUrl: "[^"]*"/, 'downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectProRetail.img"')
);

// Visio 2016
content = content.replace(
  /id: "prod-visio-2016"[\s\S]*?downloadUrl: "[^"]*"/,
  match => match.replace(/downloadUrl: "[^"]*"/, 'downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioProRetail.img"')
);

// Office 2016 Pro Plus (the 400 link)
content = content.replace(
  /id: "prod-office-2016"[\s\S]*?downloadUrl: "[^"]*"/,
  match => match.replace(/downloadUrl: "[^"]*"/, 'downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlusRetail.img"')
);

fs.writeFileSync('src/products.ts', content);
console.log("Products updated");

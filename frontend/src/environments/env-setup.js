const fs = require('fs');

const setupEnvironmentVariables = () => {
  const envFile = './src/environments/environment.prod.ts';
  let content = fs.readFileSync(envFile, 'utf8');

  const keysToReplace = {
    'GOOGLE_MAPS_KEY': process.env.GOOGLE_MAPS_KEY,
    'MAP_ID': process.env.MAP_ID,
    'AUTH_KEY': process.env.AUTH_KEY
  };

  Object.keys(keysToReplace).forEach(key => {
    content = content.replace(new RegExp(`'${key}'`, 'g'), `'${keysToReplace[key] || ''}'`);
  });

  fs.writeFileSync(envFile, content);
};

setupEnvironmentVariables();

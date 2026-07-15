const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function checkUrl(urlString) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(urlString, {
        method: 'HEAD',
        timeout: 8000
      }, (res) => {
        if (res.statusCode !== 404 && res.statusCode < 500) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch (err) {
      resolve(false);
    }
  });
}

async function auditFolder(folderName, typeKey) {
  const dirPath = path.join(__dirname, '..', folderName);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  console.log('Auditing ' + files.length + ' records in /' + folderName + '...');

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      let changed = false;

      const detailObj = data[typeKey];
      if (!detailObj) continue;

      const subtitles = data.subtitles || [];
      const validSubtitles = [];
      for (const sub of subtitles) {
        try {
          const urlObj = new URL(sub.url);
          const parts = urlObj.pathname.split('/');
          const subType = parts[5];
          const tmdbId = parts[6];
          const langFile = parts[7];
          
          const localSubPath = path.join(__dirname, '..', 'subtitles', subType, tmdbId, langFile);
          if (fs.existsSync(localSubPath)) {
            validSubtitles.push(sub);
          } else {
            console.log('[Subtitle Dead] Removed subtitle path in ' + file + ': ' + localSubPath);
            changed = true;
          }
        } catch (e) {
          validSubtitles.push(sub);
        }
      }
      if (changed) {
        data.subtitles = validSubtitles;
      }

      const streamingLinks = data.streamingLinks || [];
      const validLinks = [];
      for (const link of streamingLinks) {
        if (link.url.startsWith('http')) {
          const isAlive = await checkUrl(link.url);
          if (isAlive) {
            validLinks.push(link);
          } else {
            console.log('[Stream Link Dead] Removed dead URL in ' + file + ': ' + link.url);
            changed = true;
          }
        } else {
          validLinks.push(link);
        }
      }
      if (changed) {
        data.streamingLinks = validLinks;
      }

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('[Cleaned] Updated ' + file);
      }
    } catch (err) {
      console.error('Error auditing file ' + file + ':', err.message);
    }
  }
}

async function run() {
  console.log('Starting automated database audit...');
  await auditFolder('movies', 'movie');
  await auditFolder('tv', 'tvShow');
  console.log('Audit completed.');
}

run();

const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\gabri\\.gemini\\antigravity-ide\\brain\\3fcd1b57-4089-499b-ae13-b41f0ffacd86\\media__1785536670928.png';
const destDir = 'c:\\Users\\gabri\\Desktop\\Bioapp\\public';
const destMockup = path.join(destDir, 'mockup.png');
const destScreenshot = path.join(destDir, 'screenshot.png');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, destMockup);
fs.copyFileSync(src, destScreenshot);
console.log('Real app screenshot saved to public/mockup.png and public/screenshot.png');

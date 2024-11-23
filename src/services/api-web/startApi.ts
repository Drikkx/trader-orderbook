import { bootstrapApp } from './app';
import http2 from 'http2';
import fs from 'fs';

// SSL/TLS configuration
const options = {
  key: fs.readFileSync('path/to/your/private/key.pem'),
  cert: fs.readFileSync('path/to/your/certificate.crt')
};

export async function startApi() {
  const app = await bootstrapApp();
  
  const server = http2.createSecureServer(options);

  const port = process.env.PORT || 5000;

  server.on('session', (session) => {
    let settingsFrameCount = 0;
    const MAX_SETTINGS_FRAMES = 10;

    session.on('frameError', (type, code) => {
      if (type === 4) {
        settingsFrameCount++;
        if (settingsFrameCount > MAX_SETTINGS_FRAMES) {
          console.log('A session has exceeded the SETTINGS frame limit.');
          session.goaway(http2.constants.NGHTTP2_FRAME_SIZE_ERROR);
        }
      }
    });

    session.on('request', (req, res) => {
      app(req, res);
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
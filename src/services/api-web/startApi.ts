import express from 'express';
import http2 from 'http2';
import fs from 'fs';
import http2Express from 'http2-express-bridge';
import { bootstrapApp } from './app';

// SSL/TLS configuration
const options = {
  key: fs.readFileSync('path/to/your/private/key.pem'),
  cert: fs.readFileSync('path/to/your/certificate.crt')
};

export async function startApi() {
  const expressApp = await bootstrapApp();
  const app = http2Express(express);
  
  const server = http2.createSecureServer(options);

  const port = process.env.PORT || 5000;

  // Keep track of SETTINGS frames for each session
  let settingsFrameCounter = new Map<http2.ServerHttp2Session, number>();

  server.on('session', (session) => {
    // Initialize counter for this session
    settingsFrameCounter.set(session, 0);
    const MAX_SETTINGS_FRAMES = 10; // Example limit

    session.on('frameError', (type, code, id) => {
      if (type === 4) { // NGHTTP2_SETTINGS frame type
        const frameCount = settingsFrameCounter.get(session) || 0;
        settingsFrameCounter.set(session, frameCount + 1);
        
        if (frameCount + 1 > MAX_SETTINGS_FRAMES) {
          console.log('A session has exceeded the SETTINGS frame limit.');
          session.goaway(http2.constants.NGHTTP2_FRAME_SIZE_ERROR);
        }
      }
    });

    // Use 'request' event instead, and pass it to the Express app directly
    session.on('request', (req, res) => {
      app(req, res);
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
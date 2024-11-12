import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import im from '@thetrg/istanbul-middleware';
import minimist from 'minimist';
import morgan from 'morgan';
import serveStatic from 'serve-static';

import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const shared = {
  sockets: {},
}

export async function start (details = {}) {
  let app, args, base, config, io, server;

  base = {
    api: '/api/v0.1.0',
    api: '',
  }

  args = minimist (process.argv.slice (2));
  config = {
    port: 3100,
    base: {
      api: '',
    },
  }

  app = express ();
  server = createServer(app);
  io = new Server (server, {
    cors: {
      origin: '*',
    },
  });
  io.on ('connection', connnectSocket);
  app.io = io;

  app.use (morgan ('tiny'));
  app.use (cors ());
  app.use (bodyParser.json ());

  app.use (
    serveStatic ('./public'),
    // serveStatic (
    //   fileURLToPath (
    //     new URL ('./public', import.meta.url)
    //   )
    // )
  );

  // HACK: This is temporary while we rebuild the reports
  app.use (`${base.api}/coverage`, im.createHandler ());
  app.post (`${base.api}/coverage`, async (req, res, next) => { await forwardCoverageData ({ app, req, res, next}) })

  server.listen (config.port, () => {
    console.log ('');
    console.log (`- args:`, args);
    console.log (`- starting server on port:`, config.port);
    console.log (`- server running...`);
    console.log ('');
  });
}

export async function connnectSocket (socket) {
  if (!shared.sockets [socket.id]) {
    shared.sockets [socket.id] = socket;
    console.log ('- connected socket:', socket.id);

    socket.on ('disconnect', (arg) => {
      delete shared.sockets [socket.id];
      console.log ('- disconnecting socket:', socket.id);
    });
  }
}

export async function forwardCoverageData (details = {}) {
  let { app, req, res } = details;
  let base, coverage, reply, url;

  try {
    base = 'http://localhost:3100';
    // url = base + '/api/v0.1.0/coverage/client';
    url = base + '/coverage/client';

    coverage = {};
    Object.keys (req.body.coverage).forEach ((key) => {
      let data, index, project;
      data = req.body.coverage [key];

      project = req.body.project;
      index = key.indexOf (project);
      if (index > -1) {
        key = key.substring ((index + project.length));
      }
      key = key.replace (req.body.project, '');
      coverage [key] = data;
    });

    reply = await axios ({
      url,
      method: 'POST',
      data: coverage,
      headers: {
        'Content-type': 'application/json',
      }
    });

    Object.keys (shared.sockets).forEach ((id) => {
      let socket;
      socket = shared.sockets [id];
      if (socket) {
        console.log ('- refresh socket:', id);
        socket.emit ('refresh');
      }
    });

    console.log ('DONE: with coverage update', reply.status, ' ------------- *** COVERAGE POSTED ***');
    res.json ({ status: 'ok' });
  }
  catch (err) {
    console.error (err.message);
    console.error (err.stack);
    res.json ({ status: 'fail' });
  }
}
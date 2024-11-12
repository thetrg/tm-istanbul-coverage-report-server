
import { io } from 'socket.io-client';

const shared = {
  domain: 'localhost',
  port: 3100,
  secure: false,
  socket: null,
  url: '',
}

export async function startSocketClient (details = {}) {
  let { onRefresh = () => {} } = details;
  let socket, url;

  url = [
    (shared.secure ? 'wss:\/\/' : 'ws:\/\/'),
    shared.domain,
    (shared.port ? ('\:' + shared.port) : ''),
  ].join ('');

  socket = io (url);
  shared.url = url;

  socket.on ('refresh', onRefresh);

  // socket.on ('hello', (arg) => {
  //   console.log (arg);
  // });
  // socket.emit ('howdy', 'stranger');

  shared.socket = socket;
}

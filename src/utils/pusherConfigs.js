import Pusher from 'pusher-js';

const pusher = new Pusher('3a3e5868eef51df8d822', {
  cluster: 'ap1',
  encrypted: true,
});

export default pusher;

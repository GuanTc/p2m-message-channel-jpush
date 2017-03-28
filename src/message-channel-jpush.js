/**
 * Created by colinhan on 17/02/2017.
 */

import JPush from 'jpush-sdk';
const logger = require('p2m-common-logger')('jpush');

const channelId = 'jpush';

export default function channel(options) {
  const client = JPush.buildClient(options.appKey, options.masterSecret);

  function start(app, server) {
    logger.log('Starting service...');
  }

  function stop() {
    logger.log('Stopping service...');
  }

  function send(device, message) {
    logger.log('Sending message {pushId: %s}...', message.pushId);
    return new Promise((accept, reject) =>
        client.push().setPlatform(JPush.ALL)
            .setAudience({registration_id: [device.deviceId]})
            .setNotification(message.description,
                JPush.android(message.description, message.title, null, message),
                JPush.ios(message.description, null, null, null, message))
            .send((err, res) => {
              if (err) {
                logger.log('Send message {pushId: %s} failed with error "%j"',
                    message.pushId, err);
                reject(err);
              } else {
                logger.log('Send message {pushId: %s} success.', message.pushId);
                accept();
              }
            }));
  }

  return {
    channelId,
    start,
    stop,
    send,
  };
}
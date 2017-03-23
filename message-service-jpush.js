/**
 * Created by colinhan on 17/02/2017.
 */

const co = require('co');
const logger = require('p2m-common-logger')('jpush');
const config = require('config');
const JPush = require('jpush-sdk');
const client = JPush.buildClient(config.jpush.appKey, config.jpush.masterSecret);

const channelId = 'jpush';

function start(app, server, s) {
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

module.exports = {
  channelId,
  start,
  stop,
  send,
};
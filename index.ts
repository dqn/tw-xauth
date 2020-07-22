import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import queryString from 'query-string';
import rp from 'request-promise';

const SIGNATURE_METHOD = 'HMAC-SHA1';
const OAUTH_VERSION = '1.0a';

type XauthConfig = {
  consumerKey: string;
  consumerSecret: string;
  screenName: string;
  password: string;
};

async function xauth(config: XauthConfig) {
  const oauth = new OAuth({
    consumer: {
      key: config.consumerKey,
      secret: config.consumerSecret,
    },
    signature_method: SIGNATURE_METHOD,
    hash_function: (baseString) =>
      crypto
        .createHmac('sha1', `${encodeURIComponent(config.consumerSecret)}&`)
        .update(baseString)
        .digest('base64'),
  });

  const timestamp = Math.floor(Date.now() / 1000);

  const options = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: {
      x_auth_mode: 'client_auth',
      x_auth_password: config.password,
      x_auth_username: config.screenName,
    },
  };

  const data = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: timestamp.toString(),
    oauth_signature_method: SIGNATURE_METHOD,
    oauth_timestamp: timestamp,
    oauth_version: OAUTH_VERSION,
  };

  return rp({
    url: options.url,
    method: options.method,
    headers: oauth.toHeader({
      ...data,
      oauth_signature: oauth.getSignature(options, config.consumerSecret, data),
    }),
    form: options.data,
  }).then(queryString.parse);
}

module.exports = {
  xauth,
};

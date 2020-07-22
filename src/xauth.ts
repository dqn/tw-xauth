import crypto from 'crypto';
import https from 'https';
import OAuth from 'oauth-1.0a';
import queryString from 'query-string';

const SIGNATURE_METHOD = 'HMAC-SHA1';
const OAUTH_VERSION = '1.0a';

export type XauthConfig = {
  consumerKey: string;
  consumerSecret: string;
  screenName: string;
  password: string;
};

export type XauthResult = {
  oauth_token: string;
  oauth_token_secret: string;
  screen_name: string;
  user_id: string;
  x_auth_expires: string;
};

export class XauthError extends Error {}

export function xauth(config: XauthConfig): Promise<XauthResult> {
  const oauth = new OAuth({
    consumer: {
      key: config.consumerKey,
      secret: config.consumerSecret,
    },
    signature_method: SIGNATURE_METHOD,
    hash_function(baseString) {
      return crypto
        .createHmac('sha1', `${encodeURIComponent(config.consumerSecret)}&`)
        .update(baseString)
        .digest('base64');
    },
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

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: 'POST',
        host: 'api.twitter.com',
        path: '/oauth/access_token',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          ...oauth.toHeader({
            ...data,
            oauth_signature: oauth.getSignature(options, config.consumerSecret, data),
          }),
        },
      },
      (res) => {
        res.on('data', (data: Buffer) => {
          if (res.statusCode !== 200) {
            const err = data.toString().replace(/<.+?>/g, '');
            reject(new XauthError(`${res.statusCode}: ${err}`));
            return;
          }

          const result: XauthResult = queryString.parse(data.toString()) as any;
          resolve(result);
        });
      },
    );

    req.write(queryString.stringify(data));
    req.end();
  });
}

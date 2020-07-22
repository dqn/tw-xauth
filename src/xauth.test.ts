import { xauth, XauthConfig } from './xauth';

function getDefaultConfig(): XauthConfig {
  return {
    // Twitter for iPad
    consumerKey: 'CjulERsDeqhhjSme66ECg',
    consumerSecret: 'IQWdVyqFxghAtURHGeGiWAsmCAGmdW3WmbEx6Hck',
    screenName: process.env.SCREEN_NAME!,
    password: process.env.PASSWORD!,
  };
}

describe('xauth', () => {
  test('Should success', async () => {
    const res = await xauth(getDefaultConfig());
    expect(res.screen_name).toEqual(process.env.SCREEN_NAME);
  });

  test('Non-existent user', async () => {
    const config = getDefaultConfig();
    config.screenName = 'NON_EXISTENT_USER';
    await expect(xauth(config)).rejects.toThrow('401');
  });

  test('Incorrect password', async () => {
    const config = getDefaultConfig();
    config.password = 'INCORRECT_PASSWORD';
    await expect(xauth(config)).rejects.toThrow('401');
  });

  test('Incorrect consumerkey', async () => {
    const config = getDefaultConfig();
    config.consumerKey = 'INCORRECT_CONSUMER_KEY';
    await expect(xauth(config)).rejects.toThrow(
      '403: Client is not permitted to perform this action',
    );
  });
});

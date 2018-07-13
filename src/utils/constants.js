export default {
  AUTH_SCOPE: ['gist'],

  AUTH_OPTIONS: {
    hostname: 'github.com',
    clientId: process.env.CLIENT_ID || 'YourClientID',
    clientSecret: process.env.CLIENT_SECRET || 'YourClientSecret'
  }
};
export default {
  env: process.env.REPUX_WEBPUSH_ENV || 'dev',
  protocol: process.env.REPUX_WEBPUSH_PROTOCOL || 'https',
  port: process.env.REPUX_WEBPUSH_PORT || '3000',
  host: process.env.REPUX_WEBPUSH_HOST || 'localhost',
  mongodbUri: process.env.REPUX_WEBPUSH_MONGODB_URI || 'mongodb://localhost:27017/repux_webpush',
  accessControlAllowOrigin: process.env.REPUX_WEBPUSH_ALLOW_ORIGIN || '*',
  webpush: {
    mailto: 'mailto:info@repux.io',
    publicKey: process.env.REPUX_WEBPUSH_PUBLIC_KEY || 'BHG0pFCWLmtfofYay5cGDhVkIDH-rJR6ntTH0EK8Kvj0LEh91O0LkufHxKA29ap7lDA-FH11KfEMyP39V8550cM',
    privateKey: process.env.REPUX_WEBPUSH_PRIVATE_KEY || 'blVtcu7tvwfIE8fsmvK9SIE1QZtLgvDLJU3t83lKaNc',
  },
  ethereum: {
    host: process.env.REPUX_WEBPUSH_ETHEREUM_HOST || 'http://localhost:8545',
    tokenAddress: process.env.REPUX_WEBPUSH_TOKEN_ADDRESS || '0xbd83c21e6f0a9547abe908c6faa02a55512d57b4',
    registryAddress: process.env.REPUX_WEBPUSH_REGISTRY_ADDRESS || '0x0fe6a11f60c62e8f2a1b2d6b0c12133e4616fe7a'
  },
  ssl: {
    keyPath: process.env.REPUX_WEBPUSH_SSL_KEY_PATH || './ssl/key.pem',
    certPath: process.env.REPUX_WEBPUSH_SSL_CERT_PATH || './ssl/csr.pem'
  }
}

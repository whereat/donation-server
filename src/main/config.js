const env = process.env.NODE_ENV; // may be `test`, `dev`, or `prod`

export const dbUri = `mongodb://localhost/whereat-donations-${env}`;
export const stripeKey =  env === 'prod' ?
  process.env.WHEREAT_STRIPE_SECRET_KEY_PROD :
  process.env.WHEREAT_STRIPE_SECRET_KEY_TEST;


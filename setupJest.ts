import 'reflect-metadata';

// this will silence all winston logs during testing,
// if you need to test logging, you can disable this in your test by setting the value to 'false'
process.env.SILENCE_WINSTON_FOR_TESTING = 'true';

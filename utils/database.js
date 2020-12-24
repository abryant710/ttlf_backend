/* eslint-disable no-underscore-dangle */
const mongodb = require('mongodb');

const { MongoClient } = mongodb;
const {
  TTLF_MONGO_USER, TTLF_MONGO_PW, TTLF_MONGO_URI, TTLF_MONGO_DB,
} = process.env;

let _db;

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(`mongodb+srv://${TTLF_MONGO_USER}:${TTLF_MONGO_PW}@${TTLF_MONGO_URI}/${TTLF_MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    console.info('Connected!');
    _db = client.db();
    callback();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database defined');
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;

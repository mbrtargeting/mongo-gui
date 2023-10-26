const mongoClient = require('mongodb').MongoClient;
const argv = require('minimist')(process.argv.slice(2));

class DataBase {
  constructor() {}

  static GetDB() {
    if (typeof DataBase.mongo === 'undefined') {
      DataBase.InitDB();
    }
    return DataBase.mongo;
  }

  static InitDB(app) {
    const user = argv.u || process.env.MONGODB_USER || 'developer';
    const password = process.env.MONGODB_PASSWORD || 'xxx';
    const connectionString = argv.c || process.env.MONGODB_CONNECTION_STRING || 'localhost:27017/admin';
    const url = 'mongodb://' + user + ':' + password + '@' + connectionString;
    const safeUrlForOutput = 'mongodb://' + user + ':' + '*****' + '@' + connectionString;

    console.log(`> Connecting to mongoDB @ ${safeUrlForOutput}`);
    mongoClient.connect(url, { useUnifiedTopology: true })
      .then(client => {
        if (!client) {
          console.log('> Failed to connect mongoDB -  no client');
          process.exit();
        }
        else {
          console.log('> Connected');
          DataBase.mongo = client;
          if (app) app.emit('connectedToDB');
        }
      }).catch(err => {
        console.log(`> Failed to connect mongoDB - ${err}`);
        process.exit();
      });
  }

  static ConnectToDb(dbName) {
    return this.GetDB().db(dbName);
  }

  static ConnectToCollection(dbName, collectionName) {
    return this.GetDB().db(dbName).collection(collectionName);
  }

  static Disconnect () {
    return this.GetDB().close();
  }
}

module.exports = DataBase;
const mongodb = require('mongodb');
const assert = require('assert');
const MongoClient = mongodb.MongoClient;

module.exports.ObjectID = mongodb.ObjectID;

const configDb = {
    hostname: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017,
    user: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME
}

module.exports.default = new class {

    constructor() {
        this.mongoClient = undefined;
        this.mongoCollections = {};
    }

    async getCollection(name) {
        if (this.mongoCollections[name]) {
            return this.mongoCollections[name];
        }
        const db = (await this._getClient()).db();
        this.mongoCollections[name] = db.collection(name);
        return this.mongoCollections[name];
    }

    close() {
        if (!this.mongoClient) {
            return;
        }
        this.mongoClient.close();
        this.mongoClient = undefined;
    }

    async _getClient() {
        if (this.mongoClient) {
            return this.mongoClient;
        }

        const client = await MongoClient.connect(`mongodb://${configDb.user}:${configDb.password}@${configDb.hostname}:${configDb.port}/${configDb.dbName}?authSource=admin`, {
            useNewUrlParser: true
        }).catch((err) => {
            assert.equal(null, err);
        });
        assert.notEqual(null, client);
        this.mongoClient = client;
        return this.mongoClient;
    }

}();

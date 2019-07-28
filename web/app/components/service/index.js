const mongo = require('../mongodb').default;
const ObjectID = require('../mongodb').ObjectID;

module.exports = new class {

    async add(customer) {
        const customers = await mongo.getCollection('customers');
        await customers.insert(customer);
    }

    async gets() {
        const customers = await mongo.getCollection('customers');
        return await customers.find({}).toArray();
    }

    async delete(id) {
        const customers = await mongo.getCollection('customers');
        await customers.deleteOne({ _id: new ObjectID(id) });
    }

}();
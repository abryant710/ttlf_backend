const { getDb } = require('../utils/database');

module.exports = class User {
  constructor(firstName, lastName, email, password, isAdmin) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  async save() {
    const db = getDb();
    try {
      const user = await db.collection('users').insertOne(this);
      console.info('New user', user);
    } catch (err) {
      console.error(err);
    }
  }
};

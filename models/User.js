module.exports = class User {
  constructor(firstName, lastName, email, isAdmin) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isAdmin = isAdmin;
  }

  save() {
    console.info(this, 'Save method called');
  }
};

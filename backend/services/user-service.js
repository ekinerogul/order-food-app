const BaseService = require("./base-service");
const User = require("../models/user");

class UserService extends BaseService {
  async findByName(name) {
    return this.findBy("name", name);
  }

  async findYoungUsers() {
    return this.query({
      age: {
        $lt: 30,
        $gt: 18,
      },
    });
  }

  async register(email, password, name, age) {
    console.log("Register called with:", { email, name, age });

    const existingUser = await this.findBy("email", email);
    console.log("Existing users:", existingUser);

    if (existingUser.length > 0) {
      throw new Error("Email already exists");
    }

    const user = await this.insert({
      email,
      password,
      name,
      age,
      addresses: [],
    });

    console.log("User created:", user);

    return user;
  }

  async login(email, password) {
    const users = await this.findBy("email", email);
    const user = users[0];

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Wrong password");
    }

    return user;
  }

  async addAddress(userId, address) {
    console.log("addAddress called with:, userId, address");
    const user = await this.find(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.addresses.push(address);
    await user.save();

    console.log("Address added, user:", user);

    return user;
  }
}

module.exports = new UserService(User);

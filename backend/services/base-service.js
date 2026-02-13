class BaseService {
  constructor(model) {
    this.model = model;
  }

  load() {
    return this.model.find();
  }

  async insert(object) {
    return this.model.create(object);
  }

  async removeBy(property, value) {
    return this.model.deleteOne({ [property]: value });
  }

  async update(id, object) {
    return this.model.findByIdAndUpdate(id, object, { new: true });
  }

  async find(id) {
    return this.model.findById(id);
  }

  async findOrFail(id, errorMessage = "NOT_FOUND") {
    const doc = await this.model.findById(id);
    if (!doc) throw new Error(errorMessage);
    return doc;
  }

  async findBy(property, value) {
    return this.model.find({ [property]: value });
  }

  async query(obj) {
    return this.model.find(obj);
  }
}

module.exports = BaseService;

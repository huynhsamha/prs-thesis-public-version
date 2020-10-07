const _basicOperation = function (Model, validateFunc) {
  const addDB = function (raw) {
    const data = validateFunc(raw);

    if (!data) {
      return null;
    }

    return new Model(data).save();
  };

  const queryDB = function (query) {
    return Model.find(query);
  };

  const queryDBOne = function (query) {
    return Model.findOne(query);
  };

  const queryDBById = function (id) {
    return Model.findById(id);
  };

  const countDocumentsDB = function (query) {
    return Model.countDocuments(query);
  };

  const updateDB = function (id, updateData) {
    return Model.findByIdAndUpdate(id, updateData, { new: true });
  };

  const updateDBByConditions = (conditions, updateData) => Model.findOneAndUpdate(conditions, updateData);

  const updateOne = (filters, update) => Model.updateOne(filters, update);

  const updateRawDB = function (raw) {
    const data = validateFunc(raw);

    if (!data) {
      return null;
    }

    return updateDB(raw.id, data);
  };

  const updateOrder = function (id, i) {
    return Model.findByIdAndUpdate(id, { order: i }, { new: true });
  };

  const deleteOneDB = function (query) {
    return Model.deleteOne(query);
  };

  const removeDB = function (id) {
    return Model.findOneAndRemove({ _id: id });
  };

  const findAndSortByFields = function (query, fields) {
    return Model.find(query).sort(fields);
  };

  const Instance = Model;

  return {
    addDB,
    queryDB,
    queryDBOne,
    queryDBById,
    updateDB,
    updateDBByConditions,
    updateRawDB,
    updateOrder,
    deleteOneDB,
    removeDB,
    countDocumentsDB,
    findAndSortByFields,
    updateOne,
    Instance
  };
};

module.exports = _basicOperation;

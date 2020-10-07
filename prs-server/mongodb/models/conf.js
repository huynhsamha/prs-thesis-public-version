module.exports = {

  /**
   * Quy định các collections được dùng
   */
  collections: {
    Editor: 'Editor',
    Audience: 'Audience',
    Poll: 'Poll',
    PollStorage: 'PollStorage',
    Session: 'Session',
    Result: 'Result',
    Feedback: 'Feedback',
    Transaction: 'Transaction'
  },

  /**
   * Lấy tên collection trong Mongo từ collection
   * @param {*} collection tên collection
   */
  toCollectionName(collection) {
    const name = collection;
    return name;
  },

  /**
   * Default về các trường `createdAt` và `updatedAt` của mongoose
   */
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

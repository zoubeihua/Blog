var mongoose = require('mongoose');
var CategorySchema = require('../schemas/Category');
module.exports = mongoose.model('Category',CategorySchema);
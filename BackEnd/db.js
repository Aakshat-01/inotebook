const mongoose = require('mongoose');

module.exports = () => mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inotebook')
    .then(() => console.log('MongoDB Connected'))

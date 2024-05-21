const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId},
    status: {type:String}
});
attendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

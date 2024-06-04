const Timesheet = require('../model/timesheetModel');
const {MongoClient, ObjectId} = require('mongodb');

const myTimesheetData = async(req, res)=>{
    try{
        const data = await Timesheet.find({user_id:req.user.id}).sort({date: -1}).limit(10);
        return res.status(200).json(data);
    }catch(error){
        return res.status(500).json({error:'Internal server error'});
    }
}

const teamTimesheetData = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const localId = ObjectId.createFromHexString(req.user.id);
        const checkedInData = [
            {
              '$lookup': {
                'from': 'timesheets', 
                'localField': '_id', 
                'foreignField': 'user_id', 
                'as': 'result'
              }
            }, {
              '$unwind': {
                'path': '$result'
              }
            }, {
              '$match': {
                'result.date': currentDate
              }
            }, {
              '$match': {
                'reporting_person': localId
              }
            }, {
              '$unset': [
                'password', 'email', 'role', 'createdAt', 'updatedAt', '__v', 'casual_leave', 'sick_leave', 'permission', 'reporting_person', 'result'
              ]
            }
        ]
        const notCheckedInData = [
            {
                '$lookup': {
                    'from': 'timesheets',
                    'localField': '_id',
                    'foreignField': 'user_id',
                    'as': 'timesheets'
                }
            },
            {
                '$match': {
                    'timesheets.date': { '$ne': currentDate },
                    'reporting_person': localId
                }
            },
            {
                '$unset': [
                    'password', 'email', 'role', 'createdAt', 'updatedAt', '__v', 'casual_leave', 'sick_leave', 'permission', 'reporting_person', 'timesheets'
                ]
            }
        ];
        const client = await MongoClient.connect('mongodb://localhost:27017/');

        const userCollection = client.db('CRM').collection('users');

        const checkedInCursor = userCollection.aggregate(checkedInData);
        const yetToCheckInCursor = userCollection.aggregate(notCheckedInData);

        const checkedIn = await checkedInCursor.toArray();
        const yetToCheckIn = await yetToCheckInCursor.toArray();

        await client.close();

        return res.status(200).json({checkedIn:checkedIn, yetToCheckIn:yetToCheckIn});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}





module.exports={
    myTimesheetData,
    teamTimesheetData
}
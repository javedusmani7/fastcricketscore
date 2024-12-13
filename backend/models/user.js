const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    mobileNumber:{type:String,required:true},
    role:{type:String,required:true}, // ["superAdmin","admin", "subAdmin"]
    password:{type:String,required:true},
    // subAdmin:{type:Number,required:false},
    // currentSubAdmin:{type:Number,required:false},
    // employee:{type:Number,required:false},
    // currentEmployee:{type:Number,required:false},
    // location:{type:String,required:false,default:''},                                                                                         
    isVerify:{type:Boolean, required: true, default: false},
    // verifyEmailToken:{type: String, required: false},
    // changePasswordToken:{type: String, required: false},
    unique_id:{type:String,required:true},
    under_role:{type:String,require:true},
    // sub_role:{type:String,required:true},
    active:{type:Boolean,required:true,default:false},
    permissions:{type:Array, required:true,default:['change_password']},
    createdDate:{type: Date, default: Date.now},
    modifiedDate:{type: Date, default: Date.now}  
  }) 

  userSchema.index({unique_id:1})

  userSchema.methods.filterRecord = async (condition,projection ={}) => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await user.find(condition,projection);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  userSchema.methods.updateRecord = async (condition, newData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await user.findOneAndUpdate(condition, newData, { new: true });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };


  userSchema.methods.updateManyRecord = async (condition, newData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await user.updateMany(condition, newData, { new: true });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  const user = mongoose.model('user',userSchema,'user');

  module.exports =user;
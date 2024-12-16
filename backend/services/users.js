require('dotenv').config();
const userModel = require('../models/user');
const user = new userModel();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/error_constants");
const uuid = require('uuid');
const client = require('../config/redisClient');


const signup = async function (reqBody) {
	try {
		return new Promise(async (resolve, reject) => {
			if (!reqBody.under_role) {
				let errMeassge = { "status": 400, "message": `Please provide valid Fields for Signup ` }
				reject(errMeassge);
			}
			let userExist = await user.filterRecord({ email: reqBody.email });
			let underUserExit = await user.filterRecord({ unique_id: reqBody.under_role });
			if (underUserExit.length == 0 || underUserExit && underUserExit.length && underUserExit[0].role == 'subAdmin') {
				let errMeassge = { "status": 400, "message": `You are not authorized for create roles` }
				reject(errMeassge);
			} else if (userExist && userExist.length) {
				let errMeassge = { "status": 400, "message": `User with email - ${reqBody.email} already exists. Please choose another one` }
				reject(errMeassge);
			} else {
				let role = '';
				if (underUserExit[0].role == 'superAdmin') {
					role = 'admin';
				} else if (underUserExit[0].role == 'admin') {
					role = 'subAdmin';
				}

				let newUser = new userModel();
				newUser.name = reqBody.name;
				newUser.email = reqBody.email;
				newUser.mobileNumber = reqBody.mobileNumber;
				newUser.password = await bcrypt.hashSync(reqBody.password, 8);
				newUser.unique_id = uuid.v1()
				newUser.role = role;
				newUser.under_role = reqBody.under_role || '';
				let verifyEmailToken = jwt.sign({ email: reqBody.email }, 'AUTH_KEY');
				newUser.verifyEmailToken = verifyEmailToken;
				newUser.active = reqBody.active || false;
				newUser.permissions = reqBody.permissions || ['change_password']

				newUser.location = reqBody.location || '';
				let newRecord = await newUser.save();

				if (newRecord && Object.keys(newRecord).length) {
					let response = {
						status: 200,
						data: newRecord,
						message: `${role} create Successfully`
					};
					resolve(response);
				} else {
					reject(errorMessage.SAVE_FAILED);
				}
			}
		})
	} catch (e) {
		throw e;
	}
}


const login = async function (reqBody) {
	try {
		return new Promise(async (resolve, reject) => {
			let userRecord = await user.filterRecord({ email: reqBody.email },				
				{_id:0,email:1,password:1,role:1,mobileNumber:1,unique_id:1,under_role:1,active:1,permissions:1,isVerify:1});
			
			if (userRecord && userRecord.length) {
				if (!userRecord[0].active) {
					let errMeassge = { "status": 400, "message": `User with email - ${reqBody.email} was Inactive .Please talk to your Reporter ` }
					reject(errMeassge);
				}
				let passwordIsValid = bcrypt.compareSync(reqBody.password, userRecord[0].password);
				if (passwordIsValid) {
					let token = jwt.sign({ email: userRecord[0].email, userId: userRecord[0]._id }, "AUTH_KEY");
					let response = {
						status: 200,
						message: "User logged in Successfully",
						token: token,
						data: userRecord[0]
					};
					resolve(response);
				} else {
					reject(errorMessage.WRONG_PASS);
				}
			} else {
				reject(errorMessage.EMAIL_NOT_FOUND);
			}
		})
	} catch (e) {
		throw e;
	}
}


const getUsersData = async (id) => {
	try {
		return new Promise(async (resolve, reject) => {
			let userExist = await user.filterRecord({ unique_id: id });
			if (userExist && userExist.length) {
				let userData = await user.filterRecord({ $or:[{ under_role: userExist[0].unique_id }]}, { _id: 0, email: 1, name: 1, unique_id: 1, role: 1 })
				if (userData && userData.length) {
					let response = {
						status: 200,
						message: "Record Fetched successfully",
						data: userData
					};
					resolve(response);
				} else {
					reject(errorMessage.USER_NOT_FOUND);
				}
			} else {
				reject(errorMessage.USER_NOT_FOUND);
			}
		})
	} catch (e) {
		throw e;
	}
}

const getUserDetails = async (id) => {
	try {
		return new Promise(async (resolve, reject) => {
			let userExist = await user.filterRecord({ unique_id: id });
			if (userExist && userExist.length) {
				let response = {
					status: 200,
					message: "Record Fetched successfully",
					data: userExist
				};
				resolve(response);

			} else {
				reject(errorMessage.USER_NOT_FOUND);
			}
		})
	} catch (e) {
		throw e;
	}
}


const updateUser = async (id, data) => {
	try {
		return new Promise(async (resolve, reject) => {
			let userData = await user.filterRecord({ unique_id: id });
			if (userData && userData.length) {
				var updatedRecord = await user.updateRecord({ unique_id: id }, { 'name': data.name, 'permissions': data.permissions, 'active': data.active });
				if(!data.active  && (userData[0].role =='admin' || userData[0].role =='subAdmin')){
				 await user.updateManyRecord( { $or: [{ under_role: id }, { unique_id: id } ] }, {'active': data.active  });
				}
				// console.log("updatedRecord", updatedRecord)
				if (updatedRecord && Object.keys(updatedRecord).length) {
					let response = {
						status: 200,
						message: "User updated successfully"
					};
					resolve(response);
				} else {
					reject(errorMessage.USER_NOT_UPDATE)
				}

			} else {
				reject(errorMessage.EMAIL_NOT_FOUND);
			}
		})
	} catch (e) {
		throw e;
	}
}






//  const generateOTP = () => {
// 	return Math.floor(1000 + Math.random() * 9000).toString();
//   };

// const sendOtp = async (userId, email) => {
// 	try {

// 		const otp = generateOTP();
// 		const obj = {
// 		  subject: "OTP Verification Code",
// 		  html: `<p>Your OTP for login is ${otp}. It is valid for 10 minutes.</p>`,
// 		};
// 		mail_helper.sendOtpMail(email, obj);  
// 		await client.setEx(`user_otp:${userId}`, 600, otp);
	  
  
// 	  return true;
// 	} catch (error) {
// 	  return false;
// 	}
//   };


module.exports ={
    signup:signup,
    login:login,
	getUsersData:getUsersData,
	getUserDetails:getUserDetails,
	updateUser: updateUser,
}
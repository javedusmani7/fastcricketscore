const userService = require('../services/users');

const signup = async (req, res)=>{
	try{
		let user = await userService.signup(req.body);
		res.json(user)
	} catch(e){
		res.json(e);
	}
}

const login = async (req, res) =>{
	try {
		let userRecord = await userService.login(req.body);
		res.json(userRecord)
	} catch(e){
		res.json(e);
	}
}


const getUserDetails = async (req, res) =>{
	try {
		const unique_id = req.header('unique_id');
		let userRecord = await userService.getUserDetails(unique_id);
		res.json(userRecord)
	} catch(e){
		res.json(e);
	}
}

const getUsersData = async (req, res) =>{
	try {
		const unique_id = req.header('unique_id');
		// console.log("unique_id",unique_id)
		let userRecord = await userService.getUsersData(unique_id);
		res.json(userRecord)
	} catch(e){
		res.json(e);
	}
}

module.exports={
    signup:signup,
    login:login,
	getUserDetails:getUserDetails,
	getUsersData:getUsersData
}
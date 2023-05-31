import React from 'react'
import {getItem,KEY_ACCESS_TOKEN} from "../utils/localStorageManager"
import {Outlet,Navigate} from "react-router"
import Login from "../pages/login/Login"
import Signup from "../pages/signup/Signup"

function RequireUser(){
	const user=getItem(KEY_ACCESS_TOKEN)
	return (
		user?<Outlet/>:<Navigate to="/login"/>

	)
}

export default RequireUser
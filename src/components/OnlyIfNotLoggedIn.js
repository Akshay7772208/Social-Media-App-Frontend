import React from 'react'
import {getItem,KEY_ACCESS_TOKEN} from "../utils/localStorageManager"
import {Outlet,Navigate} from "react-router"


function OnlyIfNotLoggedIn(){
	const user= getItem(KEY_ACCESS_TOKEN)
	return (   
		user? <Navigate to="/"/> : <Outlet/>
	)
}

export default OnlyIfNotLoggedIn
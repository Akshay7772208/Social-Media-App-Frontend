import axios from 'axios'
import {getItem} from './localStorageManager'
import {setItem} from './localStorageManager'
import {KEY_ACCESS_TOKEN,removeItem} from './localStorageManager'
import {showToast} from '../redux/slices/appConfigSlice'
import {TOAST_SUCCESS,TOAST_FAILURE} from "../App"
import store from "../redux/store"
import {setLoading} from '../redux/slices/appConfigSlice'

export const axiosClient=axios.create({
	//baseURL: 'http://localhost:4000',
	//baseURL: process.env.REACT_APP_SERVER_BASE_URL,
	baseURL: 'https://social-media-two-app.onrender.com',
	withCredentials: true 
})

axiosClient.interceptors.request.use(
	 (request)=>{
		const accessToken=getItem(KEY_ACCESS_TOKEN)
		request.headers["Authorization"]=`Bearer ${accessToken}`
		store.dispatch(setLoading(true))
		return request
	}
)

axiosClient.interceptors.response.use(
	async (response)=>{
		store.dispatch(setLoading(false))
		const data=response.data;
		if(data.status==="ok") {
			return data;
		}

		const originalRequest=response.config;
		const statusCode=data.statusCode;
		const error=data.message;

		///when refresh code expirse send user to login page
		// if( statusCode===401 && originalRequest.url===`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`){
		// 	removeItem(KEY_ACCESS_TOKEN)
		// 	window.location.replace('/login','_self')
		// 	return Promise.reject(error+ "  is this")
		// }
		store.dispatch(showToast({
			type: TOAST_FAILURE,
			message: error
		}))
		if(statusCode===401 && !originalRequest._retry){
			originalRequest._retry=true;
			const response=await axios.create({withCredentials:true,}).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`)
			
			//console.log('response from backend: ', response)
			if(response.data.status==="ok"){
				setItem(KEY_ACCESS_TOKEN,response.data.result.accessToken)
				//console.log(response.data.result.accessToken)
				originalRequest.headers["Authorization"]=`Bearer ${response.data.result.accessToken}`
				return axios(originalRequest)
			}else{
				removeItem(KEY_ACCESS_TOKEN)
				window.location.replace('/login','_self')
				return Promise.reject(error+ "  is this")
		
			}
		}
		//console.log('axios error',error)
	    return Promise.reject(error)
	
	}, async(error)=>{
		store.dispatch(setLoading(false))
		store.dispatch(showToast({
			type: TOAST_FAILURE,
			message: error.message
		}))
		//console.log("error here in axios")
		return Promise.reject(error)
	}
)



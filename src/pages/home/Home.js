import React from 'react';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {axiosClient} from '../../utils/axiosClient'
import './Home.scss'
import Navbar from '../../components/navbar/Navbar'
import {Outlet,Navigate} from "react-router"
import {getMyInfo} from "../../redux/slices/appConfigSlice"

function Home() {

   const dispatch=useDispatch()

   useEffect(()=>{
      dispatch(getMyInfo())
   },[])
  
   return <>
      <Navbar/>
      <div className="Outlet" style={{marginTop: '60px'}}>
         <Outlet/>
      </div>
      
   </>
  
}

export default Home;


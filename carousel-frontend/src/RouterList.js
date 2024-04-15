import React from 'react'
import { Routes, Route } from "react-router-dom";
import Sign from './Auth/Sign';
import Login from './Auth/Login';

const RouterList = () => {
  return (
    <>
     <Routes>
           <Route>
            <Route path="/" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
    </>
  )
}

export default RouterList

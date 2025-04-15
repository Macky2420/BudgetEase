import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Hero from '../pages/Hero';
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Budget from "../pages/Budget";
import UserInfo from "../pages/UserInfo";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Hero/>
    },
    {
        path: '/home/:userId',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Home/>
            }
        ]
    },
    {
        path: '/home/:userId/:budgetId',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Budget/>
            },
        ]
    },
    {
        path: '/userInfo/:userId',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <UserInfo/>
            }
        ]
    }
   
])
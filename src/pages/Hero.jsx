import React, { useState } from 'react'
import Login from "../components/Login"
import Register from "../components/Register"
import budgetImg from "../assets/budget-img.jpg"

const Hero = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    const handleShowLogin = () => {
        setShowLogin(true);
    }

    const handleShowRegister = () => {
        setShowRegister(true);
    }
    return (
        <>
            <div className="min-h-screen relative bg-gray-100">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${budgetImg})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
        
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 px-2">
                        BudgetEase
                    </h1>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-4">
                        Take control of your finances with our intuitive budgeting tool. Track expenses, manage income, and achieve your financial goals.
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto px-4">
                        <button 
                            onClick={handleShowRegister}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold transition-colors"
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={handleShowLogin}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Login
                showLogin={showLogin}
                setShowLogin={setShowLogin}
            />
            <Register
                showRegister={showRegister}
                setShowRegister={setShowRegister}
            />
        </>
    )
}

export default Hero;
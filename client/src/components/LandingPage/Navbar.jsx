import React from 'react';
import { Link } from 'react-router-dom';
import Logoim from '../Assets/293 x 267-01 1.png';

const AppBar = () => {
  return (
    <nav className="bg-[#348ABA] w-full h-24 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={Logoim} 
            alt="Logo" 
            className="h-20 w-20 object-contain"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white focus:outline-none"
          type="button"
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-2xl">
          <ul className="flex space-x-8">
            {[
              { name: 'Home', href: '#landing' },
              { name: 'About', href: '#procedure' },
              { name: 'Story', href: '#our' },
              { name: 'Evolution', href: '#concept' },
              { name: 'Community', href: '#community' }
            ].map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href} 
                  className="text-white font-bold hover:text-gray-200 transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Login Button */}
          <Link 
            to="/login" 
            className="bg-white text-[#348ABA] px-6 py-2 rounded font-bold hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      <div className="lg:hidden collapse" id="navbarSupportedContent">
        <ul className="bg-[#348ABA] py-4 px-6 space-y-4">
          {[
            { name: 'Home', href: '#landing' },
            { name: 'About', href: '#procedure' },
            { name: 'Story', href: '#our' },
            { name: 'Evolution', href: '#concept' },
            { name: 'Community', href: '#community' }
          ].map((item) => (
            <li key={item.name}>
              <a 
                href={item.href} 
                className="block text-white font-bold py-2 hover:text-gray-200"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <Link 
              to="/login" 
              className="block bg-white text-[#348ABA] px-6 py-2 rounded font-bold text-center mt-4"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AppBar;
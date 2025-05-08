"use client"

import { useState, useEffect } from 'react';
import { ThemeToggle } from './themetoggle';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData } from '@/store/slice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const state = useSelector((state: any) => state);
  const { user, token } = state.auth || {};
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(clearUserData());
    window.location.href = '/';
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage
      ? 'bg-white dark:bg-gray-900 shadow-lg'
      : 'bg-transparent dark:bg-transparent'
      }`}>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a
          href="/"
          className={`transition-colors duration-300 ${isScrolled || !isHomePage
            ? 'text-indigo-800 dark:text-white'
            : 'text-white dark:text-white'
            } hover:text-indigo-600 dark:hover:text-indigo-300`}
        >
          SALON CAPTA
        </a>

        <ThemeToggle />

        <div className="hidden md:flex space-x-6">
          {['Home', 'About', 'Services', 'Pricing', 'Team', 'Gallery', 'Contact'].map((item, index) => (
            <a
              key={item}
              href={isHomePage ? "#" + item : "/#" + item}
              className={`relative transition-colors duration-300 group ${isScrolled || !isHomePage
                ? 'text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white'
                : 'text-white dark:text-white hover:text-indigo-200 dark:hover:text-indigo-300'
                }`}
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              {item}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left ${isScrolled || !isHomePage ? 'bg-indigo-800 dark:bg-white' : 'bg-white dark:bg-indigo-300'
                }`} />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">

          {user?.userType == "SALON_OWNER" ? (
            <a
              href="/dashboard"
              className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-white text-indigo-800 hover:bg-gray-100 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700'
                }`}
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/booking"
              className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-white text-indigo-800 hover:bg-gray-100 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700'
                }`}
            >
              Booking
            </a>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-white text-indigo-800 hover:bg-gray-100 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700'
                }`}
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-white text-indigo-800 hover:bg-gray-100 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700'
                }`}
            >
              Login
            </a>
          )}
        </div>

        <button
          id="mobileMenuButton"
          onClick={toggleMobileMenu}
          className={`md:hidden focus:outline-none transition-colors duration-300 ${isScrolled || !isHomePage
            ? 'text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white'
            : 'text-white dark:text-white hover:text-indigo-200 dark:hover:text-indigo-300'
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      <div
        id="mobileMenu"
        className={`md:hidden shadow-lg absolute w-full left-0 transition-all duration-300 ease-out ${isMobileMenuOpen
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
          } ${isScrolled || !isHomePage
            ? 'bg-white dark:bg-gray-900'
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
          }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {['Home', 'About', 'Services', 'Pricing', 'Team', 'Gallery', 'Contact'].map((item) => (
            <a
              key={item}
              href={isHomePage ? "#" + item : "/#" + item}
              className={`block transition-colors duration-300 py-2 border-b ${isScrolled || !isHomePage
                ? 'border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white'
                : 'border-white/20 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white'
                } last:border-0`}
            >
              {item}
            </a>
          ))}
          {user?.userType == "SALON_OWNER" ? (
            <a
              href="/dashboard"
              className={`inline-block px-4 py-2 rounded-lg transition-colors duration-300 mt-2 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-indigo-800 text-white hover:bg-blue-900'
                }`}
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/booking"
              className={`inline-block px-4 py-2 rounded-lg transition-colors duration-300 mt-2 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-indigo-800 text-white hover:bg-blue-900'
                }`}
            >
              Booking
            </a>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className={`inline-block px-4 py-2 rounded-lg transition-colors duration-300 mt-2 ml-2 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-indigo-800 text-white hover:bg-blue-900'
                }`}
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className={`inline-block px-4 py-2 rounded-lg transition-colors duration-300 mt-2 ml-2 ${isScrolled || !isHomePage
                ? 'bg-indigo-800 text-white hover:bg-blue-900'
                : 'bg-indigo-800 text-white hover:bg-blue-900'
                }`}
            >
              Login
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

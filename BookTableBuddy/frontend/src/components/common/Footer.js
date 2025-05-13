import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-white font-display font-bold text-2xl">
              DineDesk
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              The easiest way to discover and book restaurants. Join thousands of happy diners who book their tables with us.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/search" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              For Restaurants
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/restaurant/signup" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  List Your Restaurant
                </Link>
              </li>
              <li>
                <Link to="/restaurant/login" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Restaurant Login
                </Link>
              </li>
              <li>
                <Link to="/restaurant/help" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Restaurant Help
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} DineDesk, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
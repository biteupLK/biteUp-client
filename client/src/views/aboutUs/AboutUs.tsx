import React from 'react';
import { useState } from 'react';
import { 
  Clock, 
  Star, 
  Heart, 
  MapPin, 
  Bike, 
  Users, 
  ChefHat, 
  Smile, 
  ArrowRight
} from 'lucide-react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section - Keeping the original */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          About BiteUp
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Delivering happiness, one meal at a time.
        </p>
      </header>

      {/* Our Story Section - Keeping the original */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <article>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-4">
            Founded in {new Date().getFullYear() - 2}, BiteUp began as a small team of food enthusiasts who wanted to
            revolutionize the way people experience food delivery. What started as a local service in one city has now
            grown into a nationwide platform connecting thousands of restaurants with hungry customers.
          </p>
          <p className="text-lg text-gray-600">
            We're more than just a delivery service — we're a community of food lovers committed to bringing you the best
            dining experiences without you having to leave your home.
          </p>
        </article>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src="/api/placeholder/600/400"
            alt="BiteUp delivery rider on the road"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Redesigned Mission Stats Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            To connect people with the food they love, faster than ever before, while supporting local restaurants and
            creating economic opportunities for our delivery partners.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-orange-500 text-white rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bike size={28} />
            </div>
            <p className="font-bold text-3xl text-gray-800">10,000+</p>
            <p className="text-gray-600 font-medium">Delivery Partners</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-orange-500 text-white rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ChefHat size={28} />
            </div>
            <p className="font-bold text-3xl text-gray-800">5,000+</p>
            <p className="text-gray-600 font-medium">Restaurant Partners</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-orange-500 text-white rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} />
            </div>
            <p className="font-bold text-3xl text-gray-800">50+</p>
            <p className="text-gray-600 font-medium">Cities Served</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-orange-500 text-white rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Smile size={28} />
            </div>
            <p className="font-bold text-3xl text-gray-800">1M+</p>
            <p className="text-gray-600 font-medium">Happy Customers</p>
          </div>
        </div>
      </section>

      {/* Redesigned Why Choose Us Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose BiteUp?</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <div className="bg-orange-100 text-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Lightning Fast Delivery</h3>
              <p className="text-gray-600">
                Our optimized delivery network ensures your food arrives hot and fresh, typically in under 30 minutes.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <div className="bg-orange-100 text-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Curated Selection</h3>
              <p className="text-gray-600">
                We partner with the best local restaurants and only feature establishments that meet our quality standards.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <div className="bg-orange-100 text-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Customer First</h3>
              <p className="text-gray-600">
                24/7 customer support and satisfaction guarantees mean you're always taken care of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Join Us Section with Tabs */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Join the BiteUp Family</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 mb-8 rounded-full"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-8 border-b">
            <button 
              onClick={() => setActiveTab('customers')} 
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'customers' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              For Customers
            </button>
            <button 
              onClick={() => setActiveTab('restaurants')} 
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'restaurants' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              For Restaurants
            </button>
            <button 
              onClick={() => setActiveTab('drivers')} 
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'drivers' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              For Drivers
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="transition-all duration-300">
            {activeTab === 'customers' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Delicious Food, Delivered to You</h3>
                  <p className="text-gray-600 mb-6">
                    Join millions of satisfied customers who enjoy their favorite meals from local restaurants delivered right to their doorstep.
                  </p>
                  <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                    Download Our App <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src="/api/placeholder/500/300" alt="Customer enjoying food delivery" className="w-full" />
                </div>
              </div>
            )}
            
            {activeTab === 'restaurants' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Grow Your Restaurant Business</h3>
                  <p className="text-gray-600 mb-6">
                    Partner with BiteUp to reach new customers, increase your revenue, and grow your business with our seamless delivery solution.
                  </p>
                  <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                    Become a Partner <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src="/api/placeholder/500/300" alt="Restaurant owner" className="w-full" />
                </div>
              </div>
            )}
            
            {activeTab === 'drivers' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Flexible Work, Competitive Pay</h3>
                  <p className="text-gray-600 mb-6">
                    Join our team of delivery partners and enjoy the freedom to work on your own schedule while earning competitive pay.
                  </p>
                  <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                    Apply Today <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src="/api/placeholder/500/300" alt="Delivery driver" className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Stay Updated</h3>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for exclusive deals, food trends, and updates from BiteUp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
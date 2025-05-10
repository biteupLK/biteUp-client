import React from 'react';
import { FaMotorcycle, FaClock, FaStar, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          About BiteUp
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Delivering happiness, one meal at a time.
        </p>
      </header>

      {/* Our Story Section */}
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
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="BiteUp delivery rider on the road"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Mission Stats Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-20">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl mb-6">
          To connect people with the food they love, faster than ever before, while supporting local restaurants and
          creating economic opportunities for our delivery partners.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center">
            <FaMotorcycle className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-xl">10,000+</p>
            <p className="text-sm">Delivery Partners</p>
          </div>
          <div className="text-center">
            <FaStar className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-xl">5,000+</p>
            <p className="text-sm">Restaurant Partners</p>
          </div>
          <div className="text-center">
            <FaMapMarkerAlt className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-xl">50+</p>
            <p className="text-sm">Cities Served</p>
          </div>
          <div className="text-center">
            <FaHeart className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-xl">1M+</p>
            <p className="text-sm">Happy Customers</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose BiteUp?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-orange-500 text-4xl mb-4">
              <FaClock />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast Delivery</h3>
            <p className="text-gray-600">
              Our optimized delivery network ensures your food arrives hot and fresh, typically in under 30 minutes.
            </p>
          </article>
          <article className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-orange-500 text-4xl mb-4">
              <FaStar />
            </div>
            <h3 className="text-xl font-bold mb-3">Curated Selection</h3>
            <p className="text-gray-600">
              We partner with the best local restaurants and only feature establishments that meet our quality standards.
            </p>
          </article>
          <article className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-orange-500 text-4xl mb-4">
              <FaHeart />
            </div>
            <h3 className="text-xl font-bold mb-3">Customer First</h3>
            <p className="text-gray-600">
              24/7 customer support and satisfaction guarantees mean you're always taken care of.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gray-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the BiteUp Family</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Whether you're a hungry customer, restaurant partner, or potential delivery rider, we'd love to have you be
          part of our journey.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
            Order Now
          </button>
          <button className="px-6 py-3 bg-white text-orange-500 font-medium border border-orange-500 rounded-lg hover:bg-orange-50 transition">
            Partner With Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

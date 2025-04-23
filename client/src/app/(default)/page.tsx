"use client"

import Image from 'next/image';
import { useState } from "react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutUs />
      <Services />
      <Pricing />
      <Team />
      <Gallery />
      <ContactUs />
    </div>
  );
}

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden" id="Home">
      <div className="absolute inset-0">
        <img src="/home/hero.jpeg" alt="Background Image" className="object-cover object-center w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
        <h1 className="text-5xl font-bold leading-tight mb-4">Experience Luxury Hair Care at Salon Capta</h1>
        <p className="text-lg text-gray-300 mb-8">Where beauty meets perfection - your transformation begins here with our expert stylists</p>
        <a href="/booking" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Create Booking</a>
      </div>
    </div>

  );
}

const AboutUs = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" id="About">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/home/about.webp"
                alt="Our Salon Interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              About Our Salon
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Salon Capta</span>, where beauty meets expertise. Our team of certified professionals is dedicated to providing you with exceptional service in a relaxing environment.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">15+ Years Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our stylists have over a decade of experience in the latest techniques.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Premium Products</h3>
                  <p className="text-gray-600 dark:text-gray-300">We use only the highest quality, professional-grade products.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Modern Techniques</h3>
                  <p className="text-gray-600 dark:text-gray-300">Stay ahead with the latest trends and innovative styling methods.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Services = () => {
  const services = [
    {
      title: "Haircuts & Styling",
      description: "Expert cuts and styling tailored to your face shape and personality. From classic bobs to trendy layers, our stylists create looks that enhance your natural beauty.",
      image: "/home/hair_cut.jpg"
    },
    {
      title: "Hair Color Services",
      description: "Transform your look with our professional coloring services. Balayage, ombre, full color, or highlights - we use premium products for vibrant, long-lasting results.",
      image: "/home/hair_color.webp"
    },
    {
      title: "Hair Chemical Services",
      description: "Safe and effective chemical treatments including perms, straightening, and keratin treatments. We prioritize hair health while achieving your desired texture.",
      image: "/home/hair_chemical.avif"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300" id="Services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Premium Services
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            At Salon Capta, we blend artistry with expertise to deliver exceptional hair services that leave you looking and feeling fabulous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-200 group-hover:text-white transition-colors duration-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Pricing = () => {
  const pricingData = {
    "Haircuts & Styling": [
      { "service": "Ladies' Long Haircuts", "price": "8000.00 LKR" },
      { "service": "Bob Cuts & Pixie Cuts", "price": "9500.00 LKR" },
      { "service": "Ladies' Hair Trim", "price": "3000.00 LKR" },
      { "service": "Gents' Haircuts", "price": "1900.00 LKR" },
      { "service": "Beard Trimming", "price": "1000.00 LKR" },
      { "service": "Beard Shaving", "price": "1200.00 LKR" },
      { "service": "Ladies' Temporary Hair Settings", "price": "3500.00 LKR" },
      { "service": "Gents' Temporary Hair Settings", "price": "1500.00 LKR" },
      { "service": "Beard Color", "price": "1000.00 LKR" }
    ],
    "Hair Color Services": [
      { "service": "Gents' Hair Coloring Services", "price": "5000.00 LKR" },
      { "service": "Ladies' Full Hair Root Touch-Ups", "price": "7000.00 LKR" },
      { "service": "Gents' Root Touch-Up", "price": "3500.00 LKR" },
      { "service": "Ladies Crown Hair Root Touch-Up", "price": "5000.00 LKR" },
      { "service": "Ladies' Hair Fringe Touch-Up", "price": "3000.00 LKR" },
      { "service": "Fashion Hair Color Lines", "price": "3000.00 LKR" }
    ],
    "Hair Chemical Services": [
      { "service": "Ladies' Hair Rebonding", "price": "14000.00 LKR" },
      { "service": "Ladies' Crown Rebonding", "price": "9500.00 LKR" },
      { "service": "Ladies Hair Fringe Rebonding", "price": "8000.00 LKR" },
      { "service": "Ladies Hair Straightening", "price": "12000.00 LKR+" },
      { "service": "Ladies' Hair Crown Straightening", "price": "9000.00 LKR" },
      { "service": "Ladies' Hair Fringe Straightening", "price": "7500.00 LKR" },
      { "service": "Ladies' Hair Relaxing", "price": "10000.00 LKR" },
      { "service": "Ladies' Hair Crown Relaxing", "price": "8000.00 LKR" },
      { "service": "Fringe Relaxing", "price": "7000.00 LKR" },
      { "service": "Gents' Hair Perming", "price": "15000.00 LKR" }
    ]
  } as const;

  type PricingCategory = keyof typeof pricingData;

  const [activeTab, setActiveTab] = useState<PricingCategory>("Haircuts & Styling");

  // Split the services into two arrays for two tables
  const splitServices = (services: typeof pricingData[PricingCategory]) => {
    const half = Math.ceil(services.length / 2);
    return {
      leftTable: services.slice(0, half),
      rightTable: services.slice(half)
    };
  };

  const { leftTable, rightTable } = splitServices(pricingData[activeTab]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" id="Pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Pricing
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transparent pricing for all our premium services. Prices may vary based on hair length and complexity.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            {Object.keys(pricingData).map((category) => (
              <button
                key={category}
                className={`py-3 px-6 font-medium text-lg focus:outline-none ${activeTab === category
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                onClick={() => setActiveTab(category as PricingCategory)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">Service</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700 dark:text-gray-200">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leftTable.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{item.service}</td>
                      <td className="py-4 px-4 text-right font-medium text-indigo-600 dark:text-indigo-400">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">Service</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700 dark:text-gray-200">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {rightTable.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{item.service}</td>
                      <td className="py-4 px-4 text-right font-medium text-indigo-600 dark:text-indigo-400">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Alex Morgan",
      position: "Master Stylist",
      image: "/home/team1.jpeg"
    },
    {
      name: "Sarah Johnson",
      position: "Color Specialist",
      image: "/home/team2.webp"
    },
    {
      name: "David Chen",
      position: "Cutting Expert",
      image: "/home/team3.webp"
    },
    {
      name: "Priya Patel",
      position: "Chemical Treatment Specialist",
      image: "/home/team4.webp"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300" id="Team">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Experts
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet our talented team of professionals dedicated to making you look your best.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative h-80 w-full mb-4 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{member.position}</p>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const galleryImages = [
    {
      src: "/home/hair_cut.jpg",
      alt: "Haircuts"
    },
    {
      src: "/home/gallery_haircut1.jpg",
      alt: "Haircuts"
    },
    {
      src: "/home/gallery_treatment.jpg",
      alt: "Treatments"
    },
    {
      src: "/home/gallery_treatment2.jpg",
      alt: "Treatments"
    },
    {
      src: "/home/hair_chemical.avif",
      alt: "Treatments"
    },
    {
      src: "/home/gallery_coloring1.jpg",
      alt: "Coloring"
    },
    {
      src: "/home/hair_color.webp",
      alt: "Coloring"
    },
    {
      src: "/home/gallery_work.webp",
      alt: "Salon Work"
    },
    {
      src: "/home/galley_mensService.jpg",
      alt: "Men's Services"
    },
    {
      src: "/home/gallery_special.jpg",
      alt: "Special Occasions"
    },
    {
      src: "/home/hero.jpeg",
      alt: "Salon"
    },
    {
      src: "/home/about.webp",
      alt: "Salon"
    },
    {
      src: "/home/gallery_salon1.jpg",
      alt: "Salon"
    },
    {
      src: "/home/gallery_salon2.jpg",
      alt: "Salon"
    },
    {
      src: "/home/gallery_salon3.jpg",
      alt: "Salon"
    },
  ];
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300" id="Gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Work Gallery
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our transformations and get inspired for your next look
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {galleryImages.map((gallery, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={gallery.src}
                  alt={gallery.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const ContactUs = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" id="Contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions or ready to book your appointment? Reach out to us today.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your Message"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="flex flex-col justify-between">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Location</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">123 Galle Road<br />Colombo 03, Sri Lanka</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">+94 112 345 678</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">info@saloncapta.lk</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Business Hours</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
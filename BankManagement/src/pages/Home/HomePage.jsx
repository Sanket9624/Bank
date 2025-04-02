import React, { useContext } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DownloadOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { ThemeContext } from "../../context/ThemeContext";

const HomePage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="relative w-full h-screen overflow-auto dark:bg-gray-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/bank-8458533_1280.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* Dark Overlay */}
      </div>

      {/* Navbar */}
      <nav className="relative flex justify-between items-center p-5 bg-black/70 text-white z-20 shadow-md">
        <h1 className="text-2xl font-bold drop-shadow-lg">
          Bank Management System
        </h1>
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            {darkMode ? <SunOutlined /> : <MoonOutlined />}
          </button>
          <Link to="/login">
            <Button type="default" className="mr-3">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button type="primary">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-white text-center px-6 z-10">
        <motion.h1
          className="text-5xl font-bold mb-5 drop-shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Your Secure Banking Solution
        </motion.h1>
        <motion.p
          className="text-lg max-w-3xl drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Manage transactions, approve requests, download statements, and track
          financial activities with ease.
        </motion.p>
        <motion.div
          className="mt-5 flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Link to="/signup">
            <Button type="primary" size="large">
              Get Started
            </Button>
          </Link>
          <Link to="/features">
            <Button type="default" size="large">
              Explore Features 
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 text-black dark:text-white py-20 px-10">
        <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Transfer Money",
              description: "Send money securely with instant transactions.",
            },
            {
              title: "Withdraw Funds",
              description: "Easily withdraw money to your bank account.",
            },
            {
              title: "Deposit Money",
              description: "Deposit funds into your account with one click.",
            },
            {
              title: "Transaction History",
              description: "View and track transactions with custom filters.",
            },
            {
              title: "Download Statements",
              description: "Export transaction data in PDF, CSV, or Excel format.",
            },
            {
              title: "Secure Banking",
              description: "Bank with end-to-end encryption and multi-layer security.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 border rounded-lg shadow-md hover:shadow-lg transition dark:bg-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white text-center py-20">
        <h2 className="text-4xl font-bold">Start Managing Your Finances Today</h2>
        <p className="mt-3 text-lg">
          Experience seamless banking with top-notch security and efficiency.
        </p>
        <div className="mt-6">
          <Link to="/signup">
            <Button type="primary" size="large" icon={<DownloadOutlined />}>
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


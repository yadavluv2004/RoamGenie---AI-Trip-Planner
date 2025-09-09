// app/contact-us/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:your-email@example.com?subject=Contact%20Us%20Message%20from%20${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="text-center pt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-lg md:text-xl">We'd love to hear from you! Send us a message.</p>
      </div>

      {/* Contact Form Section */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              className="border border-gray-300 p-3 rounded-lg h-40 focus:ring-2 focus:ring-primary focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90 py-3 rounded-lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RoamGenie. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/contact-us" className="hover:text-primary transition-colors">Contact Us</a>
          </div>

          <div className="flex gap-4">
            <a href="yadav.luv2004@gmail.com" className="hover:text-primary transition-colors">
              <Mail size={20} />
            </a>
            <a href="https://www.linkedin.com/in/luvyadav/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/yadav_luv2004?t=U3j9xQyP0YUOFmz2HMMlxg&s=09" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://github.com/yadavluv2004" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


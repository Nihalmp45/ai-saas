"use client";
import "./globals.css";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-blue-600 text-white">
      {/* Hero Section */}
      <div className="hero py-20">
        <div className="hero-content flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            Social Blender
          </h1>
          <p className="mb-8 text-lg font-medium max-w-lg">
            Compress, store, and manage your videos effortlessly. Design perfect
            display pictures optimized for all social media platforms.
          </p>
          <div className="flex gap-6">
            {isSignedIn ? (
              <>
                {" "}
                <Link href="/home">
                  <button className="btn btn-outline btn-lg px-8">
                    Go to Home
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <button className="btn btn-primary btn-lg px-8">
                    Sign Up
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="btn btn-outline btn-lg px-8">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white text-gray-900 py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Video Storage Made Easy
            </h3>
            <p className="text-gray-700">
              Upload, compress, and store your videos with secure, cloud-like
              functionality.
            </p>
          </div>

          <div className="card shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Social Media Optimized Photos
            </h3>
            <p className="text-gray-700">
              Create perfectly resized display pictures for all your favorite
              social platforms.
            </p>
          </div>

          <div className="card shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Seamless User Experience
            </h3>
            <p className="text-gray-700">
              Intuitive design for everyone—from casual users to professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Start Your Journey with Us</h2>
        <p className="text-lg font-medium max-w-2xl mx-auto mb-8">
          Whether you’re storing videos or creating display pictures, our tools
          make it easy to stand out on social media.
        </p>
        {isSignedIn ? (
          <>
            {" "}
            <Link href="/home">
              <button className="btn btn-outline btn-lg px-8">
                Go to Home
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex gap-6 justify-center">
            <Link href="/sign-up">
              <button className="btn btn-primary btn-lg px-8">Sign Up</button>
            </Link>
            <Link href="/sign-in">
              <button className="btn btn-outline btn-lg px-8">Sign In</button>
            </Link>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer items-center p-8 bg-gray-800 text-gray-400">
        <div className="flex flex-col items-center md:flex-row md:justify-between w-full">
          <p>&copy; 2024 Your App Name. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="mailto:nihalmp45@gmail.com" className="link link-hover">
              nihalmp45@gmail.com
            </a>
            <a href="mailto:ajayvnair61@gmail.com" className="link link-hover">
              ajayvnair61@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

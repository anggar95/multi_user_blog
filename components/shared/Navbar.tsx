'use client';

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Blog Platform
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/posts" className="text-gray-600 hover:text-gray-900">
              Posts
            </Link>
            {isSignedIn ? (
              <>
                <Link href="/dashboard/new" className="btn btn-primary">
                  Write Post
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="btn btn-primary">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
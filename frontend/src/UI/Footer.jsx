// components/Footer.jsx
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full   dark:bg-zinc-900  bg-black/30 backdrop-blur-xl py-4 text-sm text-zinc-600 dark:text-zinc-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left - App Name or Brand */}
        <div className="font-semibold text-gray-400">© 2025 Golpo Gujob</div>

        {/* Right - Links */}
        <div className="flex gap-4">
          <a href="#" className="hover:underline  text-gray-400">Privacy</a>
          <a href="#" className="hover:underline text-gray-400">Terms</a>
          <a href="#" className="hover:underline text-gray-400">Support</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

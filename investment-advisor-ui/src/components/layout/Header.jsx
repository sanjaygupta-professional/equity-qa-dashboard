import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-vibrant to-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-deep">
                Smart Investment Advisor
              </h1>
              <p className="text-xs text-neutral-medium-gray">
                Find Your Perfect Stocks
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-sm font-medium text-neutral-medium-gray hover:text-primary-vibrant transition-colors focus-visible-ring"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-neutral-medium-gray hover:text-primary-vibrant transition-colors focus-visible-ring"
            >
              Learn
            </a>
            <a
              href="#"
              className="text-sm font-medium text-neutral-medium-gray hover:text-primary-vibrant transition-colors focus-visible-ring"
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

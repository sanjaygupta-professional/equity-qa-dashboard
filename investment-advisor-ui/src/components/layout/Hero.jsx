import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative pt-24 pb-16 bg-gradient-to-br from-primary-light via-white to-blue-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-vibrant rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center mb-4"
        >
          <Sparkles className="w-8 h-8 text-primary-vibrant mr-2" />
          <span className="text-sm font-semibold text-primary-vibrant uppercase tracking-wider">
            Intelligent Stock Discovery
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-deep mb-6 leading-tight"
        >
          Discover Your Perfect
          <br />
          <span className="bg-gradient-to-r from-primary-vibrant to-blue-600 bg-clip-text text-transparent">
            Investment Match
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-medium-gray max-w-3xl mx-auto leading-relaxed"
        >
          Navigate the Indian stock market with confidence. Our intelligent
          advisor helps you find stocks that match your investment goals,
          risk appetite, and values.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex items-center justify-center space-x-6 text-sm text-neutral-medium-gray"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-secondary-emerald rounded-full mr-2"></div>
            <span>Multi-dimensional filtering</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-secondary-emerald rounded-full mr-2"></div>
            <span>Educational insights</span>
          </div>
          <div className="hidden md:flex items-center">
            <div className="w-2 h-2 bg-secondary-emerald rounded-full mr-2"></div>
            <span>Beginner-friendly</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

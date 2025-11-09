import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'

export default function Tooltip({ title, content, tip, learnMoreLink }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-medium-gray hover:text-primary-vibrant transition-colors focus-visible-ring rounded-full"
        aria-label="More information"
      >
        <Info className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100"
            style={{ top: '100%' }}
          >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
            </div>

            {/* Content */}
            <div className="relative p-4">
              {title && (
                <>
                  <h4 className="font-semibold text-sm text-primary-deep mb-2">
                    {title}
                  </h4>
                  <div className="w-full h-px bg-gray-200 mb-3"></div>
                </>
              )}

              <p className="text-xs text-neutral-medium-gray leading-relaxed mb-3">
                {content}
              </p>

              {tip && (
                <div className="bg-primary-light bg-opacity-50 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm">💡</span>
                    <p className="text-xs text-primary-deep leading-relaxed flex-1">
                      {tip}
                    </p>
                  </div>
                </div>
              )}

              {learnMoreLink && (
                <a
                  href={learnMoreLink}
                  className="text-xs font-medium text-primary-vibrant hover:underline focus-visible-ring rounded"
                >
                  Learn More →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

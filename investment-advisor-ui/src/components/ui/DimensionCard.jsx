import { motion } from 'framer-motion'
import Tooltip from './Tooltip'

export default function DimensionCard({
  icon: Icon,
  title,
  tooltipContent,
  children,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-transparent hover:border-primary-light"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-light bg-opacity-30 rounded-lg">
            <Icon className="w-5 h-5 text-primary-vibrant" />
          </div>
          <h3 className="text-lg font-semibold text-primary-deep">
            {title}
          </h3>
        </div>
        <Tooltip {...tooltipContent} />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-5"></div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

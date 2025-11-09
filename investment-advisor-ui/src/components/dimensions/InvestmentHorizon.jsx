import { Calendar } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion } from 'framer-motion'

const horizonOptions = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: '5Y+', label: '5Y+' },
]

export default function InvestmentHorizon({ value, onChange, delay }) {
  const tooltipContent = {
    title: 'Investment Horizon',
    content: 'This is how long you plan to hold your investment before selling.',
    tip: 'Longer horizons typically lead to better returns due to compounding and riding out market volatility.',
  }

  return (
    <DimensionCard
      icon={Calendar}
      title="Investment Horizon"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="flex flex-wrap gap-2">
        {horizonOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              focus-visible-ring
              ${
                value === option.value
                  ? 'bg-primary-vibrant text-white shadow-md'
                  : 'bg-gray-100 text-neutral-medium-gray hover:bg-gray-200'
              }
            `}
            aria-pressed={value === option.value}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 text-sm text-neutral-medium-gray"
        >
          <span className="font-medium text-primary-deep">Selected: </span>
          {value}
        </motion.div>
      )}
    </DimensionCard>
  )
}

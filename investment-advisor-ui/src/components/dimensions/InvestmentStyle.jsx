import { Target } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion } from 'framer-motion'

const styles = [
  { value: 'value', label: 'Value', icon: '💎' },
  { value: 'growth', label: 'Growth', icon: '📈' },
  { value: 'dividend', label: 'Dividend', icon: '💰' },
  { value: 'momentum', label: 'Momentum', icon: '🚀' },
  { value: 'quality', label: 'Quality', icon: '⭐' },
  { value: 'blend', label: 'Blend', icon: '🎯' },
]

export default function InvestmentStyle({ value, onChange, delay }) {
  const tooltipContent = {
    title: 'Investment Style',
    content: 'Your investing philosophy determines which stocks you find attractive.',
    tip: 'Different styles perform better in different market conditions. Blend offers a balanced approach across all styles.',
  }

  return (
    <DimensionCard
      icon={Target}
      title="Investment Style"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="relative">
        {/* Background slider */}
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => {
            const isSelected = value === style.value
            return (
              <motion.button
                key={style.value}
                onClick={() => onChange(style.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  focus-visible-ring flex items-center space-x-2
                  ${
                    isSelected
                      ? 'bg-primary-vibrant text-white shadow-md'
                      : 'bg-gray-100 text-neutral-medium-gray hover:bg-gray-200'
                  }
                `}
                aria-pressed={isSelected}
              >
                <span>{style.icon}</span>
                <span>{style.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Description of selected style */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-neutral-medium-gray"
          >
            {value === 'value' && 'Undervalued stocks with low P/E and P/B ratios'}
            {value === 'growth' && 'Companies with high earnings growth potential'}
            {value === 'dividend' && 'Regular income through dividends (yield >2%)'}
            {value === 'momentum' && 'Stocks with strong upward price trends'}
            {value === 'quality' && 'Fundamentally strong companies with high ROE and low debt'}
            {value === 'blend' && 'Balanced approach across multiple investment styles'}
          </motion.div>
        )}
      </div>
    </DimensionCard>
  )
}

import { Layers } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const marketCapOptions = [
  { value: 'large', label: 'Large Cap', range: '₹20K Cr+', size: 'text-lg' },
  { value: 'mid', label: 'Mid Cap', range: '₹5-20K Cr', size: 'text-base' },
  { value: 'small', label: 'Small Cap', range: '₹1-5K Cr', size: 'text-sm' },
  { value: 'micro', label: 'Micro Cap', range: '<₹1K Cr', size: 'text-xs' },
]

export default function MarketCap({ value = [], onChange, delay }) {
  const tooltipContent = {
    title: 'Market Capitalization',
    content: 'The total market value of a company\'s outstanding shares. Larger companies are typically more stable but may have slower growth.',
    tip: 'Diversifying across market caps can balance stability and growth potential in your portfolio.',
  }

  const toggleCap = (capValue) => {
    if (capValue === 'multi') {
      // Multi-cap selects all or deselects all
      if (value.length === 4) {
        onChange([])
      } else {
        onChange(['large', 'mid', 'small', 'micro'])
      }
    } else {
      if (value.includes(capValue)) {
        onChange(value.filter(v => v !== capValue))
      } else {
        onChange([...value, capValue])
      }
    }
  }

  const isMultiCapSelected = value.length === 4

  return (
    <DimensionCard
      icon={Layers}
      title="Market Cap Preference"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="space-y-3">
        {/* Individual market cap options */}
        <div className="grid grid-cols-2 gap-3">
          {marketCapOptions.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <motion.button
                key={option.value}
                onClick={() => toggleCap(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200
                  focus-visible-ring
                  ${
                    isSelected
                      ? 'border-primary-vibrant bg-primary-light bg-opacity-20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-primary-vibrant" />
                  </div>
                )}
                <div className={`font-semibold text-primary-deep mb-1 ${option.size}`}>
                  {option.label}
                </div>
                <div className="text-xs text-neutral-medium-gray font-mono">
                  {option.range}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Multi-cap option */}
        <motion.button
          onClick={() => toggleCap('multi')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            w-full p-4 rounded-lg border-2 transition-all duration-200
            focus-visible-ring
            ${
              isMultiCapSelected
                ? 'border-primary-vibrant bg-gradient-to-r from-primary-light to-blue-100 bg-opacity-20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
          aria-pressed={isMultiCapSelected}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-primary-deep">Multi-Cap</div>
              <div className="text-xs text-neutral-medium-gray">Mix of all sizes</div>
            </div>
            {isMultiCapSelected && <Check className="w-5 h-5 text-primary-vibrant" />}
          </div>
        </motion.button>

        {/* Selected display */}
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 pt-2"
          >
            <span className="text-sm text-neutral-medium-gray">Selected:</span>
            {value.map(cap => (
              <span
                key={cap}
                className="px-2 py-1 bg-primary-light bg-opacity-30 text-primary-deep text-xs rounded-full"
              >
                {marketCapOptions.find(o => o.value === cap)?.label}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </DimensionCard>
  )
}

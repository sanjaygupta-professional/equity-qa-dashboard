import { Activity } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion } from 'framer-motion'

const riskLevels = [
  { value: 1, label: 'Very Low', color: 'bg-secondary-emerald', emoji: '🟢' },
  { value: 2, label: 'Low', color: 'bg-yellow-400', emoji: '🟡' },
  { value: 3, label: 'Medium', color: 'bg-secondary-amber', emoji: '🟠' },
  { value: 4, label: 'High', color: 'bg-orange-500', emoji: '🔴' },
  { value: 5, label: 'Very High', color: 'bg-secondary-red', emoji: '🔴🔴' },
]

export default function RiskAppetite({ value, onChange, delay }) {
  const tooltipContent = {
    title: 'Risk Appetite',
    content: 'How much volatility and potential losses can you handle in your investments?',
    tip: 'Higher risk may offer higher returns, but also higher potential losses. Choose based on your financial stability and emotional comfort.',
  }

  const currentLevel = riskLevels.find(level => level.value === value)

  return (
    <DimensionCard
      icon={Activity}
      title="Risk Appetite"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="space-y-4">
        {/* Slider */}
        <div className="relative pt-2">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus-visible-ring"
            style={{
              background: `linear-gradient(to right,
                #10B981 0%,
                #10B981 ${((value - 1) / 4) * 100}%,
                #e5e7eb ${((value - 1) / 4) * 100}%,
                #e5e7eb 100%)`
            }}
            aria-label="Risk appetite level"
            aria-valuemin="1"
            aria-valuemax="5"
            aria-valuenow={value}
            aria-valuetext={currentLevel?.label}
          />

          {/* Markers */}
          <div className="flex justify-between mt-2">
            {riskLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => onChange(level.value)}
                className={`
                  flex flex-col items-center space-y-1 focus-visible-ring rounded p-1
                  ${value === level.value ? 'opacity-100' : 'opacity-40 hover:opacity-70'}
                  transition-opacity
                `}
                aria-label={`Set risk to ${level.label}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${level.color} transition-transform ${
                    value === level.value ? 'scale-125' : ''
                  }`}
                ></div>
                <span className="text-xs text-neutral-medium-gray whitespace-nowrap">
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Selection Display */}
        {currentLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl mb-1">{currentLevel.emoji}</div>
            <div className="text-sm font-semibold text-primary-deep">
              {currentLevel.label} Risk
            </div>
          </motion.div>
        )}
      </div>
    </DimensionCard>
  )
}

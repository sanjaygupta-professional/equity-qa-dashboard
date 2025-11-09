import { Leaf } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion } from 'framer-motion'

const themes = [
  { value: 'esg', label: 'ESG Compliant', icon: '🌱', description: 'Environmental, Social, Governance' },
  { value: 'export', label: 'Export Oriented', icon: '🌐', description: 'Global market exposure' },
  { value: 'makeInIndia', label: 'Make in India', icon: '🇮🇳', description: 'Domestic manufacturing' },
  { value: 'domestic', label: 'Domestic Consumption', icon: '🏠', description: 'India growth story' },
  { value: 'digital', label: 'Digital Economy', icon: '💻', description: 'Technology-driven' },
  { value: 'none', label: 'No Preference', icon: '━', description: 'All themes included' },
]

export default function ThemePreference({ value = [], onChange, delay }) {
  const tooltipContent = {
    title: 'Themes & Values',
    content: 'Align your investments with trends and values that matter to you.',
    tip: 'Thematic investing can help you support causes you care about while potentially benefiting from long-term trends.',
  }

  const toggleTheme = (themeValue) => {
    if (themeValue === 'none') {
      onChange([])
    } else {
      if (value.includes(themeValue)) {
        onChange(value.filter(v => v !== themeValue))
      } else {
        onChange([...value, themeValue])
      }
    }
  }

  const isNoPreference = value.length === 0

  return (
    <DimensionCard
      icon={Leaf}
      title="Themes & Values"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {themes.map((theme) => {
          const isSelected = theme.value === 'none' ? isNoPreference : value.includes(theme.value)
          return (
            <motion.button
              key={theme.value}
              onClick={() => toggleTheme(theme.value)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 focus-visible-ring
                ${
                  isSelected
                    ? 'border-primary-vibrant bg-gradient-to-br from-primary-light to-blue-100 bg-opacity-20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
              aria-pressed={isSelected}
            >
              <div className="text-3xl mb-2">{theme.icon}</div>
              <div className="text-xs font-semibold text-primary-deep mb-1">
                {theme.label}
              </div>
              <div className="text-[10px] text-neutral-medium-gray">
                {theme.description}
              </div>
            </motion.button>
          )
        })}
      </div>

      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          <span className="text-sm text-neutral-medium-gray">Selected themes:</span>
          {value.map(themeValue => {
            const theme = themes.find(t => t.value === themeValue)
            return theme ? (
              <span
                key={themeValue}
                className="px-3 py-1 bg-primary-vibrant bg-opacity-10 text-primary-deep text-xs rounded-full flex items-center space-x-1"
              >
                <span>{theme.icon}</span>
                <span>{theme.label}</span>
              </span>
            ) : null
          })}
        </motion.div>
      )}
    </DimensionCard>
  )
}

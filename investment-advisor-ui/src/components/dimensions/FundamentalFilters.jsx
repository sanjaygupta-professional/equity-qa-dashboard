import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion, AnimatePresence } from 'framer-motion'

const filterGroups = {
  profitability: [
    { value: 'consistent', label: 'Consistent Profits (3Y+)', tooltip: 'Companies profitable for 3+ years' },
    { value: 'highROE', label: 'High ROE (>15%)', tooltip: 'Return on Equity >15% (efficient capital use)' },
    { value: 'lowDebt', label: 'Debt-Free / Low Debt', tooltip: 'Debt-to-Equity <1 (financial stability)' },
  ],
  valuation: [
    { value: 'peLow', label: 'P/E < Industry Average', tooltip: 'Potentially undervalued stocks' },
    { value: 'pegLow', label: 'PEG Ratio < 1', tooltip: 'Growth at reasonable price' },
  ],
  dividend: [
    { value: 'regular', label: 'Regular Dividend Payers', tooltip: 'Regular income, mature companies' },
    { value: 'highYield', label: 'Dividend Yield > 2%', tooltip: 'Higher dividend income' },
  ],
}

export default function FundamentalFilters({ value, onChange, delay }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const tooltipContent = {
    title: 'Quality Filters',
    content: 'Financial health indicators that help identify fundamentally strong companies.',
    tip: 'Combining multiple quality filters can help find stocks with strong fundamentals, but may reduce the number of results.',
  }

  const toggleFilter = (category, filterValue) => {
    const currentCategoryFilters = value[category] || []
    const newCategoryFilters = currentCategoryFilters.includes(filterValue)
      ? currentCategoryFilters.filter(v => v !== filterValue)
      : [...currentCategoryFilters, filterValue]

    onChange(category, newCategoryFilters)
  }

  const totalSelected =
    (value.profitability?.length || 0) +
    (value.valuation?.length || 0) +
    (value.dividend?.length || 0)

  return (
    <DimensionCard
      icon={ShieldCheck}
      title="Quality Filters"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="space-y-3">
        {/* Expand/Collapse trigger */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
          aria-expanded={isExpanded}
        >
          <span className="text-sm text-neutral-medium-gray">
            {totalSelected === 0 ? 'None selected' : `${totalSelected} filter${totalSelected !== 1 ? 's' : ''} selected`}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </button>

        {/* Filter groups */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-4"
            >
              {/* Profitability */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-medium-gray uppercase tracking-wider px-1">
                  Profitability
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {filterGroups.profitability.map((filter) => {
                    const isSelected = value.profitability?.includes(filter.value)
                    return (
                      <label
                        key={filter.value}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <button
                          onClick={() => toggleFilter('profitability', filter.value)}
                          className={`
                            relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible-ring
                            ${isSelected ? 'bg-secondary-emerald' : 'bg-gray-300'}
                          `}
                          role="switch"
                          aria-checked={isSelected}
                        >
                          <motion.div
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{ x: isSelected ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                        <span className="text-sm text-neutral-dark-gray group-hover:text-primary-deep">
                          {filter.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Valuation */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-medium-gray uppercase tracking-wider px-1">
                  Valuation
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {filterGroups.valuation.map((filter) => {
                    const isSelected = value.valuation?.includes(filter.value)
                    return (
                      <label
                        key={filter.value}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <button
                          onClick={() => toggleFilter('valuation', filter.value)}
                          className={`
                            relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible-ring
                            ${isSelected ? 'bg-secondary-emerald' : 'bg-gray-300'}
                          `}
                          role="switch"
                          aria-checked={isSelected}
                        >
                          <motion.div
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{ x: isSelected ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                        <span className="text-sm text-neutral-dark-gray group-hover:text-primary-deep">
                          {filter.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Dividend */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-medium-gray uppercase tracking-wider px-1">
                  Dividend
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {filterGroups.dividend.map((filter) => {
                    const isSelected = value.dividend?.includes(filter.value)
                    return (
                      <label
                        key={filter.value}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <button
                          onClick={() => toggleFilter('dividend', filter.value)}
                          className={`
                            relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible-ring
                            ${isSelected ? 'bg-secondary-emerald' : 'bg-gray-300'}
                          `}
                          role="switch"
                          aria-checked={isSelected}
                        >
                          <motion.div
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{ x: isSelected ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                        <span className="text-sm text-neutral-dark-gray group-hover:text-primary-deep">
                          {filter.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DimensionCard>
  )
}

import { motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import InvestmentHorizon from '../dimensions/InvestmentHorizon'
import RiskAppetite from '../dimensions/RiskAppetite'
import MarketCap from '../dimensions/MarketCap'
import SectorPreference from '../dimensions/SectorPreference'
import InvestmentStyle from '../dimensions/InvestmentStyle'
import FundamentalFilters from '../dimensions/FundamentalFilters'
import ThemePreference from '../dimensions/ThemePreference'
import { filterStocks } from '../../utils/filterStocks'
import { stocksData } from '../../data/stocksData'

export default function FilterDashboard({
  filters,
  updateFilter,
  updateFundamentalFilter,
  setResults,
  setIsSearching,
  hasActiveFilters
}) {
  const handleFindInvestments = async () => {
    setIsSearching(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const filteredResults = filterStocks(stocksData, filters)
    setResults(filteredResults)
    setIsSearching(false)

    // Smooth scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const isButtonEnabled = hasActiveFilters()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-primary-deep mb-3">
          Customize Your Search
        </h2>
        <p className="text-neutral-medium-gray max-w-2xl mx-auto">
          Select your preferences across multiple dimensions to find stocks that match your investment goals.
        </p>
      </motion.div>

      {/* Dimension cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InvestmentHorizon
          value={filters.investmentHorizon}
          onChange={(value) => updateFilter('investmentHorizon', value)}
          delay={0}
        />
        <RiskAppetite
          value={filters.riskAppetite}
          onChange={(value) => updateFilter('riskAppetite', value)}
          delay={0.05}
        />
        <MarketCap
          value={filters.marketCap}
          onChange={(value) => updateFilter('marketCap', value)}
          delay={0.1}
        />
        <SectorPreference
          value={filters.sectors}
          onChange={(value) => updateFilter('sectors', value)}
          delay={0.15}
        />
        <InvestmentStyle
          value={filters.investmentStyle}
          onChange={(value) => updateFilter('investmentStyle', value)}
          delay={0.2}
        />
        <FundamentalFilters
          value={filters.fundamentalFilters}
          onChange={updateFundamentalFilter}
          delay={0.25}
        />
      </div>

      {/* ESG & Themes - full width */}
      <div className="mb-8">
        <ThemePreference
          value={filters.themes}
          onChange={(value) => updateFilter('themes', value)}
          delay={0.3}
        />
      </div>

      {/* Find Investments Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={handleFindInvestments}
          disabled={!isButtonEnabled}
          whileHover={isButtonEnabled ? { y: -2, scale: 1.02 } : {}}
          whileTap={isButtonEnabled ? { scale: 0.98 } : {}}
          className={`
            relative px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl
            transition-all duration-300 focus-visible-ring
            ${
              isButtonEnabled
                ? 'bg-gradient-to-r from-primary-vibrant to-blue-600 text-white hover:shadow-primary-vibrant/50'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-disabled={!isButtonEnabled}
        >
          <span className="flex items-center space-x-3">
            {false ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Finding matches...</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                <span>
                  {isButtonEnabled
                    ? 'Find My Investment Matches'
                    : 'Select at least one filter'}
                </span>
              </>
            )}
          </span>

          {/* Pulse animation when enabled */}
          {isButtonEnabled && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary-vibrant"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>
    </section>
  )
}

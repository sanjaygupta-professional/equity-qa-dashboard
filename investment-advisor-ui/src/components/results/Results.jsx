import { motion } from 'framer-motion'
import { TrendingUp, Lightbulb } from 'lucide-react'
import StockCard from './StockCard'

export default function Results({ results, filters }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section id="results-section" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-secondary-emerald mr-2" />
            <h2 className="text-3xl font-bold text-primary-deep">
              We found {results.length} stock{results.length !== 1 ? 's' : ''} matching your criteria
            </h2>
          </div>

          {/* Filter summary */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-medium-gray">
            {filters.investmentHorizon && (
              <span className="px-3 py-1 bg-primary-light bg-opacity-30 rounded-full">
                Horizon: {filters.investmentHorizon}
              </span>
            )}
            {filters.marketCap.length > 0 && (
              <span className="px-3 py-1 bg-primary-light bg-opacity-30 rounded-full">
                {filters.marketCap.length} Market Cap{filters.marketCap.length !== 1 ? 's' : ''}
              </span>
            )}
            {filters.sectors.length > 0 && (
              <span className="px-3 py-1 bg-primary-light bg-opacity-30 rounded-full">
                {filters.sectors.length} Sector{filters.sectors.length !== 1 ? 's' : ''}
              </span>
            )}
            {filters.investmentStyle && filters.investmentStyle !== 'blend' && (
              <span className="px-3 py-1 bg-primary-light bg-opacity-30 rounded-full">
                {filters.investmentStyle} style
              </span>
            )}
          </div>
        </motion.div>

        {/* Educational Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-gradient-to-r from-primary-light to-blue-50 rounded-xl p-6 border-l-4 border-primary-vibrant"
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-white rounded-lg">
              <Lightbulb className="w-6 h-6 text-primary-vibrant" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-deep mb-2">
                Insight for Your Selection
              </h3>
              <p className="text-sm text-neutral-medium-gray leading-relaxed mb-3">
                {filters.riskAppetite <= 2
                  ? 'With a conservative risk appetite, consider focusing on large-cap stocks with consistent dividend histories. These provide stability and regular income.'
                  : filters.riskAppetite >= 4
                  ? 'With a high risk appetite, you can explore mid and small-cap stocks for higher growth potential. Consider diversifying across 4-5 stocks to manage risk.'
                  : 'With a balanced risk appetite, consider diversifying across 3-4 sectors. Large-cap stocks provide stability while mid-caps can boost growth.'}
              </p>
              <button className="text-sm font-medium text-primary-vibrant hover:underline focus-visible-ring rounded">
                Learn More About Portfolio Building →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results grid */}
        {results.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-primary-deep mb-2">
              No stocks match your current filters
            </h3>
            <p className="text-neutral-medium-gray mb-6">Try:</p>
            <ul className="text-sm text-neutral-medium-gray space-y-2 mb-8">
              <li>• Broadening your sector selection</li>
              <li>• Adjusting risk appetite</li>
              <li>• Removing some quality filters</li>
            </ul>
            <div className="flex items-center justify-center space-x-4">
              <button className="px-6 py-2 bg-gray-100 text-neutral-dark-gray rounded-lg hover:bg-gray-200 transition-colors focus-visible-ring">
                Adjust Filters
              </button>
              <button className="px-6 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-blue-600 transition-colors focus-visible-ring">
                Reset All
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

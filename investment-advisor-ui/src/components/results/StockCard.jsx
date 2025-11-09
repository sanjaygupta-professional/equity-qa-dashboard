import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Info, TrendingUp, TrendingDown, Star } from 'lucide-react'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function StockCard({ stock }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const isPositiveChange = stock.change >= 0

  // Calculate star rating from match score
  const fullStars = Math.floor(stock.matchScore / 20)
  const hasHalfStar = (stock.matchScore % 20) >= 10

  // Get market cap label
  const marketCapLabel = {
    large: 'Large Cap',
    mid: 'Mid Cap',
    small: 'Small Cap',
    micro: 'Micro Cap'
  }[stock.marketCapType] || ''

  // Format market cap in crores
  const formatMarketCap = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L Cr`
    }
    return `₹${(value / 1000).toFixed(0)}K Cr`
  }

  // Get matching badges
  const badges = []
  if (stock.fundamentals.highROE) badges.push('High ROE')
  if (stock.fundamentals.consistentProfits) badges.push('Consistent Profits')
  if (stock.fundamentals.lowDebt) badges.push('Low Debt')
  if (stock.fundamentals.regularDividend) badges.push('Dividend Payer')

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-primary-deep text-lg mb-1 line-clamp-1">
              {stock.name}
            </h3>
            <p className="text-xs text-neutral-medium-gray font-mono">
              {stock.symbol}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible-ring"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-medium-gray'
                }`}
              />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible-ring"
              aria-label="More information"
            >
              <Info className="w-5 h-5 text-neutral-medium-gray" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-3">
          <span className="text-2xl font-bold text-primary-deep font-mono">
            ₹{stock.price.toFixed(2)}
          </span>
          <span
            className={`flex items-center text-sm font-medium ${
              isPositiveChange ? 'text-secondary-emerald' : 'text-secondary-red'
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {isPositiveChange ? '+' : ''}
            {stock.change.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        {/* Market Cap and Sector */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-neutral-medium-gray mb-1">Market Cap</p>
            <p className="font-semibold text-primary-deep font-mono">
              {formatMarketCap(stock.marketCap)}
            </p>
            <p className="text-xs text-primary-vibrant">{marketCapLabel}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-medium-gray mb-1">Sector</p>
            <p className="font-semibold text-primary-deep capitalize">
              {stock.sector.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-medium-gray">P/E: </span>
            <span className="font-semibold text-primary-deep font-mono">{stock.pe}</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div>
            <span className="text-neutral-medium-gray">ROE: </span>
            <span className="font-semibold text-primary-deep font-mono">{stock.roe}%</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div>
            <span className="text-neutral-medium-gray">D/E: </span>
            <span className="font-semibold text-primary-deep font-mono">
              {stock.debtToEquity.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Match Score */}
        <div className="bg-gradient-to-r from-primary-light to-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary-deep">Match Score</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < fullStars
                      ? 'fill-secondary-amber text-secondary-amber'
                      : i === fullStars && hasHalfStar
                      ? 'fill-secondary-amber text-secondary-amber opacity-50'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stock.matchScore}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-primary-vibrant to-blue-600"
              ></motion.div>
            </div>
            <span className="text-sm font-bold text-primary-vibrant font-mono">
              {stock.matchScore}%
            </span>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="px-2 py-1 bg-secondary-emerald bg-opacity-10 text-secondary-emerald text-xs rounded-full flex items-center"
              >
                <span className="mr-1">✓</span>
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button className="px-4 py-2 border border-primary-vibrant text-primary-vibrant rounded-lg hover:bg-primary-light hover:bg-opacity-20 transition-colors text-sm font-medium focus-visible-ring">
            View Details
          </button>
          <button className="px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium focus-visible-ring">
            Add to Watchlist
          </button>
        </div>
      </div>
    </motion.div>
  )
}

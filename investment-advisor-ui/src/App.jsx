import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero'
import FilterDashboard from './components/layout/FilterDashboard'
import Results from './components/results/Results'

function App() {
  const [filters, setFilters] = useState({
    investmentHorizon: null,
    riskAppetite: 3,
    marketCap: [],
    sectors: [],
    investmentStyle: 'blend',
    fundamentalFilters: {
      profitability: [],
      valuation: [],
      dividend: []
    },
    themes: []
  })

  const [results, setResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const updateFundamentalFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      fundamentalFilters: {
        ...prev.fundamentalFilters,
        [category]: value
      }
    }))
  }

  const hasActiveFilters = () => {
    const { investmentHorizon, marketCap, sectors, themes, fundamentalFilters } = filters
    const hasFundamentalFilters =
      fundamentalFilters.profitability.length > 0 ||
      fundamentalFilters.valuation.length > 0 ||
      fundamentalFilters.dividend.length > 0

    return investmentHorizon !== null ||
           marketCap.length > 0 ||
           sectors.length > 0 ||
           themes.length > 0 ||
           hasFundamentalFilters
  }

  return (
    <div className="min-h-screen bg-neutral-soft-gray">
      <Header />
      <Hero />
      <FilterDashboard
        filters={filters}
        updateFilter={updateFilter}
        updateFundamentalFilter={updateFundamentalFilter}
        setResults={setResults}
        setIsSearching={setIsSearching}
        hasActiveFilters={hasActiveFilters}
      />
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Results results={results} filters={filters} />
        </motion.div>
      )}
    </div>
  )
}

export default App

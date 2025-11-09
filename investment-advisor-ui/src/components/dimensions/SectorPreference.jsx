import { useState } from 'react'
import { Grid3x3, X, Search } from 'lucide-react'
import DimensionCard from '../ui/DimensionCard'
import { motion, AnimatePresence } from 'framer-motion'

const sectors = [
  { value: 'it', label: 'IT & Technology', icon: '🖥️' },
  { value: 'banking', label: 'Banking & Finance', icon: '🏦' },
  { value: 'pharma', label: 'Pharmaceuticals', icon: '💊' },
  { value: 'fmcg', label: 'FMCG & Consumer Goods', icon: '🛒' },
  { value: 'auto', label: 'Automobile', icon: '🚗' },
  { value: 'infra', label: 'Infrastructure', icon: '🏗️' },
  { value: 'energy', label: 'Energy & Power', icon: '⚡' },
  { value: 'metals', label: 'Metals & Mining', icon: '⚙️' },
  { value: 'telecom', label: 'Telecom', icon: '📱' },
  { value: 'realestate', label: 'Real Estate', icon: '🏘️' },
  { value: 'psu', label: 'PSU (Public Sector)', icon: '🏛️' },
  { value: 'diversified', label: 'Diversified', icon: '🌐' },
]

export default function SectorPreference({ value = [], onChange, delay }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const tooltipContent = {
    title: 'Sector Preference',
    content: 'Choose the industries you want to invest in. Diversifying across sectors can reduce risk.',
    tip: 'Defensive sectors (FMCG, Pharma) are stable in downturns, while cyclical sectors (Auto, Real Estate) follow economic cycles.',
  }

  const toggleSector = (sectorValue) => {
    if (sectorValue === 'all') {
      onChange([])
    } else {
      if (value.includes(sectorValue)) {
        onChange(value.filter(v => v !== sectorValue))
      } else {
        onChange([...value, sectorValue])
      }
    }
  }

  const removeSector = (sectorValue) => {
    onChange(value.filter(v => v !== sectorValue))
  }

  const filteredSectors = sectors.filter(sector =>
    sector.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DimensionCard
      icon={Grid3x3}
      title="Sector Preference"
      tooltipContent={tooltipContent}
      delay={delay}
    >
      <div className="space-y-3">
        {/* Dropdown trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
          aria-expanded={isOpen}
        >
          <span className="text-sm text-neutral-medium-gray">
            {value.length === 0 ? 'Select Sectors' : `Selected: ${value.length} sector${value.length !== 1 ? 's' : ''}`}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </button>

        {/* Dropdown content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-medium-gray" />
                  <input
                    type="text"
                    placeholder="Search sectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
                  />
                </div>

                {/* All Sectors option */}
                <button
                  onClick={() => toggleSector('all')}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm transition-colors focus-visible-ring
                    ${value.length === 0 ? 'bg-primary-vibrant text-white' : 'hover:bg-gray-200'}
                  `}
                >
                  All Sectors (No Filter)
                </button>

                {/* Sector list */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredSectors.map((sector) => {
                    const isSelected = value.includes(sector.value)
                    return (
                      <button
                        key={sector.value}
                        onClick={() => toggleSector(sector.value)}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors focus-visible-ring
                          ${isSelected ? 'bg-primary-light bg-opacity-40' : 'hover:bg-gray-200'}
                        `}
                      >
                        <span className="text-lg">{sector.icon}</span>
                        <span className="flex-1 text-left">{sector.label}</span>
                        {isSelected && (
                          <div className="w-2 h-2 bg-primary-vibrant rounded-full"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected chips */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map(sectorValue => {
              const sector = sectors.find(s => s.value === sectorValue)
              return sector ? (
                <motion.div
                  key={sectorValue}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary-vibrant bg-opacity-10 text-primary-deep rounded-full text-xs"
                >
                  <span>{sector.icon}</span>
                  <span>{sector.label}</span>
                  <button
                    onClick={() => removeSector(sectorValue)}
                    className="hover:bg-primary-vibrant hover:bg-opacity-20 rounded-full p-0.5 focus-visible-ring"
                    aria-label={`Remove ${sector.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ) : null
            })}
          </div>
        )}
      </div>
    </DimensionCard>
  )
}

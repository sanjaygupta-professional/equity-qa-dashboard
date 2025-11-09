export function filterStocks(stocksData, filters) {
  let filtered = [...stocksData]

  // Filter by market cap
  if (filters.marketCap && filters.marketCap.length > 0) {
    filtered = filtered.filter(stock =>
      filters.marketCap.includes(stock.marketCapType)
    )
  }

  // Filter by sector
  if (filters.sectors && filters.sectors.length > 0) {
    filtered = filtered.filter(stock =>
      filters.sectors.includes(stock.sector)
    )
  }

  // Filter by investment style
  if (filters.investmentStyle && filters.investmentStyle !== 'blend') {
    filtered = filtered.filter(stock =>
      stock.style.includes(filters.investmentStyle)
    )
  }

  // Filter by themes
  if (filters.themes && filters.themes.length > 0) {
    filtered = filtered.filter(stock =>
      filters.themes.some(theme => stock.themes.includes(theme))
    )
  }

  // Filter by fundamental filters
  if (filters.fundamentalFilters) {
    const { profitability, valuation, dividend } = filters.fundamentalFilters

    // Profitability filters
    if (profitability && profitability.length > 0) {
      filtered = filtered.filter(stock => {
        return profitability.every(filter => {
          switch (filter) {
            case 'consistent':
              return stock.fundamentals.consistentProfits
            case 'highROE':
              return stock.fundamentals.highROE
            case 'lowDebt':
              return stock.fundamentals.lowDebt
            default:
              return true
          }
        })
      })
    }

    // Valuation filters
    if (valuation && valuation.length > 0) {
      filtered = filtered.filter(stock => {
        return valuation.every(filter => {
          switch (filter) {
            case 'peLow':
              return stock.fundamentals.peLow
            case 'pegLow':
              return stock.fundamentals.pegLow
            default:
              return true
          }
        })
      })
    }

    // Dividend filters
    if (dividend && dividend.length > 0) {
      filtered = filtered.filter(stock => {
        return dividend.every(filter => {
          switch (filter) {
            case 'regular':
              return stock.fundamentals.regularDividend
            case 'highYield':
              return stock.fundamentals.highDividendYield
            default:
              return true
          }
        })
      })
    }
  }

  // Calculate match score for each stock
  const scoredStocks = filtered.map(stock => {
    let score = 0
    let maxScore = 0

    // Investment horizon scoring (simplified - would need historical data for real implementation)
    maxScore += 10

    // Risk appetite scoring
    maxScore += 10
    const riskLevel = filters.riskAppetite
    if (riskLevel <= 2 && stock.marketCapType === 'large') score += 10
    else if (riskLevel === 3 && (stock.marketCapType === 'large' || stock.marketCapType === 'mid')) score += 10
    else if (riskLevel >= 4 && (stock.marketCapType === 'mid' || stock.marketCapType === 'small')) score += 10

    // Market cap match
    if (filters.marketCap.includes(stock.marketCapType)) {
      score += 15
    }
    maxScore += 15

    // Sector match
    if (filters.sectors.length === 0 || filters.sectors.includes(stock.sector)) {
      score += 15
    }
    maxScore += 15

    // Investment style match
    if (filters.investmentStyle === 'blend' || stock.style.includes(filters.investmentStyle)) {
      score += 15
    }
    maxScore += 15

    // Themes match
    if (filters.themes.length === 0) {
      score += 10
    } else {
      const matchingThemes = filters.themes.filter(theme => stock.themes.includes(theme)).length
      score += (matchingThemes / filters.themes.length) * 10
    }
    maxScore += 10

    // Fundamental filters match
    let fundamentalMatches = 0
    let fundamentalTotal = 0

    if (filters.fundamentalFilters.profitability) {
      filters.fundamentalFilters.profitability.forEach(filter => {
        fundamentalTotal++
        if (
          (filter === 'consistent' && stock.fundamentals.consistentProfits) ||
          (filter === 'highROE' && stock.fundamentals.highROE) ||
          (filter === 'lowDebt' && stock.fundamentals.lowDebt)
        ) {
          fundamentalMatches++
        }
      })
    }

    if (filters.fundamentalFilters.valuation) {
      filters.fundamentalFilters.valuation.forEach(filter => {
        fundamentalTotal++
        if (
          (filter === 'peLow' && stock.fundamentals.peLow) ||
          (filter === 'pegLow' && stock.fundamentals.pegLow)
        ) {
          fundamentalMatches++
        }
      })
    }

    if (filters.fundamentalFilters.dividend) {
      filters.fundamentalFilters.dividend.forEach(filter => {
        fundamentalTotal++
        if (
          (filter === 'regular' && stock.fundamentals.regularDividend) ||
          (filter === 'highYield' && stock.fundamentals.highDividendYield)
        ) {
          fundamentalMatches++
        }
      })
    }

    if (fundamentalTotal > 0) {
      score += (fundamentalMatches / fundamentalTotal) * 25
    } else {
      score += 25
    }
    maxScore += 25

    const matchScore = Math.round((score / maxScore) * 100)

    return {
      ...stock,
      matchScore
    }
  })

  // Sort by match score (descending)
  scoredStocks.sort((a, b) => b.matchScore - a.matchScore)

  return scoredStocks
}

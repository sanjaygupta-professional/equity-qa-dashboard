# 📊 Indian Equity Valuation Data Quality Dashboard

A comprehensive Streamlit dashboard for visualizing and validating Indian equity valuation data.

## 🚀 Quick Start

```bash
# Run the dashboard
streamlit run equity_valuation_dashboard.py
```

The dashboard will automatically load data from `valuation_analysis_2025.csv`.

## 📋 Features

### 1. 📊 Overview & Statistics
- **Key Metrics Dashboard**: Total companies, columns, missing data, duplicates, outliers
- **Data Preview**: Quick view of the dataset
- **Summary Statistics**: Comprehensive statistical analysis of all numeric columns

### 2. 🔍 Data Quality Checks
- **Missing Values Analysis**:
  - Visual bar charts showing missing data by column
  - Detailed percentage breakdown
  - Sortable table view

- **Duplicate Detection**:
  - Automatic duplicate row identification
  - View duplicate records

- **Outlier Detection**:
  - IQR-based outlier detection for all numeric columns
  - Visual bar charts for outlier distribution
  - Detailed outlier records for each column

### 3. 💰 Valuation Metrics Analysis
- **PE Ratio Analysis**:
  - Distribution histogram
  - Box plot visualization

- **Price vs Intrinsic Value**:
  - Scatter plot comparison
  - Overvalued/Undervalued identification
  - Value gap percentage calculation

- **Market Cap Analysis**:
  - Bar chart by company
  - Pie chart distribution

- **Growth Analysis**:
  - CAGR vs PE scatter plot
  - Size-based bubble visualization

### 4. 🏥 Financial Health Indicators
- **Dividend Analysis**:
  - Dividend yield comparison
  - Payout ratio vs yield analysis

- **Risk Analysis (Beta)**:
  - Beta distribution by company
  - Risk categorization (Low/Medium/High)
  - Reference line at market beta (β = 1)

- **Operating Profit Growth**:
  - Base year to 2025 projection growth
  - Color-coded performance visualization

### 5. 🔎 Interactive Data Explorer
- **Dynamic Filtering**:
  - PE Ratio range slider
  - Market Cap range slider
  - Dividend Yield range slider

- **Real-time Results**: Updates automatically as you adjust filters

- **Data Export**: Download filtered data as CSV

## 📊 Data Quality Score

The dashboard automatically calculates a data quality score based on:
- ✅ Missing values (33%)
- ✅ Duplicate rows (33%)
- ✅ Outlier detection (34%)

**Score Display**:
- 🟢 100%: Perfect quality
- 🟡 66-99%: Good quality with minor issues
- 🔴 <66%: Needs attention

## 📁 Data Format

The dashboard expects a CSV file with the following columns:

**Company Identifiers**:
- `Symbol`: Company ticker symbol
- `Ticker_NS`: NSE ticker

**Valuation Metrics**:
- `PE`: Price to Earnings ratio
- `PEG`: Price/Earnings to Growth ratio
- `EPS_TTM`: Earnings per share (trailing twelve months)
- `Market_Cap`: Market capitalization
- `Current_Price`: Current stock price
- `Intrinsic_Value`: Calculated intrinsic value
- `Book_Value`: Book value per share

**Financial Metrics**:
- `Sales_2025`: Projected sales for 2025
- `Operating_Profit_Base`: Base year operating profit
- `Operating_Profit_2025`: Projected 2025 operating profit
- `CAGR`: Compound annual growth rate

**Dividend Metrics**:
- `Dividend_Payout_%`: Dividend payout percentage
- `Dividend_Yield`: Dividend yield percentage

**Risk Metrics**:
- `Beta from Money Control`: Stock beta (volatility vs market)
- `Cost_of_Equity`: Cost of equity percentage

**Other Metrics**:
- `Base_Year`: Base year for calculations
- `Tax_%`: Tax percentage
- `Interest`: Interest expenses
- `Shares`: Number of shares
- `EV`: Enterprise Value
- `EV_to_Capital_Employed`: EV to capital employed ratio

## 🎨 Visualizations Included

1. **Bar Charts**: Missing data, outliers, market cap, dividend yield, beta, operating profit growth
2. **Histograms**: PE ratio distribution
3. **Box Plots**: PE ratio outliers
4. **Scatter Plots**: Price vs intrinsic value, CAGR vs PE, dividend payout vs yield
5. **Pie Charts**: Market cap distribution, risk categories
6. **Line Charts**: Reference lines for key thresholds

## 🔧 Technical Stack

- **Streamlit**: Web application framework
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical operations
- **Plotly**: Interactive visualizations
- **Python 3.7+**: Programming language

## 💡 Usage Tips

1. **Start with Overview**: Get familiar with your dataset
2. **Check Data Quality**: Identify issues that need fixing
3. **Analyze Valuations**: Look for over/undervalued stocks
4. **Review Financial Health**: Assess risk and growth metrics
5. **Use Filters**: Find stocks matching your criteria
6. **Export Results**: Download filtered data for further analysis

## 📝 Data Quality Checks Performed

### Automatic Checks:
- ✅ Missing value detection and quantification
- ✅ Duplicate row identification
- ✅ Outlier detection using IQR method (1.5 × IQR rule)
- ✅ Data type validation
- ✅ Statistical anomaly detection

### Manual Review Supported:
- Filter and inspect specific companies
- Compare metrics across companies
- Identify valuation opportunities
- Assess risk profiles

## 🎯 Use Cases

1. **Data Quality Assurance**: Validate data before analysis
2. **Investment Research**: Identify investment opportunities
3. **Portfolio Analysis**: Compare holdings across metrics
4. **Risk Assessment**: Evaluate portfolio risk using beta
5. **Valuation Analysis**: Find over/undervalued stocks
6. **Dividend Planning**: Identify high-yield dividend stocks

## 📊 Sample Analysis Workflow

1. **Load Data** → Check overview statistics
2. **Quality Check** → Fix any missing values or outliers
3. **Valuation Analysis** → Identify undervalued stocks (Price < Intrinsic Value)
4. **Risk Assessment** → Filter by beta range
5. **Growth Analysis** → Find high CAGR stocks with reasonable PE
6. **Export Results** → Download shortlisted companies

## 🔄 Updating Data

To update the dashboard with new data:

1. Replace `valuation_analysis_2025.csv` with new data
2. Ensure column names match the expected format
3. Refresh the dashboard (it will auto-reload)

Or use the "Upload new file" option in the sidebar.

## 🆘 Troubleshooting

**Issue**: Dashboard doesn't load data
- **Solution**: Ensure `valuation_analysis_2025.csv` is in the same directory

**Issue**: Missing visualizations
- **Solution**: Check that required columns exist in your CSV

**Issue**: Outliers seem incorrect
- **Solution**: This is normal for financial data; review context

## 📞 Support

For issues or questions:
1. Check that your CSV format matches the expected structure
2. Verify all numeric columns contain valid numbers
3. Review the Data Quality Checks section for specific issues

---

**Built for Indian Equity Data Analysis** | Last Updated: 2025

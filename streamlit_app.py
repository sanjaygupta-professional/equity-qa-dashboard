import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import pymongo
from pymongo import MongoClient
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Authentication
def check_password():
    def password_entered():
        # Get credentials from Streamlit secrets
        users = st.secrets["users"]
        
        username = st.session_state["username"]
        password = st.session_state["password"]
        
        if username in users and users[username] == password:
            st.session_state["password_correct"] = True
            st.session_state["current_user"] = username
            del st.session_state["password"]  # Don't store password
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        # First run, show input for password
        st.markdown("### 🔐 Equity Data QA Dashboard - Login Required")
        st.text_input("Username", key="username")
        st.text_input("Password", type="password", key="password")
        st.button("Login", on_click=password_entered)
        st.info("Please contact admin for login credentials")
        return False
    elif not st.session_state["password_correct"]:
        # Password incorrect, show input + error
        st.markdown("### 🔐 Equity Data QA Dashboard - Login Required")
        st.text_input("Username", key="username")
        st.text_input("Password", type="password", key="password")
        st.button("Login", on_click=password_entered)
        st.error("😞 User not known or password incorrect")
        return False
    else:
        # Password correct
        return True

# MongoDB connection
@st.cache_resource
def init_mongodb():
    # Get MongoDB connection from Streamlit secrets
    connection_string = st.secrets["mongodb"]["connection_string"]
    client = MongoClient(connection_string)
    return client['trade_ai']

# Data loading functions
@st.cache_data
def load_companies():
    db = init_mongodb()
    companies = list(db.company_meta.find({}, {'Symbol': 1, 'Company': 1, 'Current_Price': 1, 'Market_Capitalization': 1}))
    return pd.DataFrame(companies)

@st.cache_data
def load_sector_data():
    db = init_mongodb()
    sectors = list(db.nifty_stock_sector_data.find({}))
    return pd.DataFrame(sectors)

@st.cache_data
def get_data_completeness():
    db = init_mongodb()
    
    collections = {
        'Balance Sheet': 'company_fundamental_balance_sheet',
        'P&L Statement': 'company_fundamental_pl_statement', 
        'Cash Flow': 'company_fundamental_cashflow',
        'Quarterly Results': 'company_fundamental_quarterly_results'
    }
    
    completeness_data = []
    
    for stmt_type, collection_name in collections.items():
        try:
            # Get unique companies and their data count
            pipeline = [
                {'$group': {'_id': '$Symbol', 'count': {'$sum': 1}, 'company': {'$first': '$Company'}}},
                {'$sort': {'_id': 1}}
            ]
            
            company_counts = list(db[collection_name].aggregate(pipeline))
            
            for company in company_counts:
                completeness_data.append({
                    'Symbol': company['_id'],
                    'Company': company.get('company', company['_id']),
                    'Statement': stmt_type,
                    'Record_Count': company['count']
                })
        except Exception as e:
            st.error(f"Error loading {stmt_type}: {str(e)}")
    
    return pd.DataFrame(completeness_data)

def load_financial_data(symbol, statement_type):
    db = init_mongodb()
    
    collection_map = {
        'Balance Sheet': 'company_fundamental_balance_sheet',
        'P&L Statement': 'company_fundamental_pl_statement',
        'Cash Flow': 'company_fundamental_cashflow',
        'Quarterly Results': 'company_fundamental_quarterly_results'
    }
    
    collection_name = collection_map.get(statement_type)
    if not collection_name:
        return pd.DataFrame()
    
    try:
        # Try to sort by Year first, then Quarter
        sample_doc = db[collection_name].find_one()
        if sample_doc and 'Year' in sample_doc:
            data = list(db[collection_name].find({'Symbol': symbol}).sort('Year', 1))
        elif sample_doc and 'Quarter' in sample_doc:
            data = list(db[collection_name].find({'Symbol': symbol}).sort('Quarter', 1))
        else:
            data = list(db[collection_name].find({'Symbol': symbol}))
        
        return pd.DataFrame(data)
    except Exception as e:
        st.error(f"Error loading {statement_type} for {symbol}: {str(e)}")
        return pd.DataFrame()

# Data Quality Checks
def check_data_quality(df, statement_type):
    issues = []
    
    if df.empty:
        return ["No data available"]
    
    # Check for missing values
    missing_cols = df.isnull().sum()
    for col, missing_count in missing_cols.items():
        if missing_count > 0 and col not in ['_id', 'None', 'DERIVED']:
            issues.append(f"{col}: {missing_count} missing values")
    
    # Statement-specific validations
    if statement_type == 'P&L Statement':
        if 'Sales' in df.columns and 'Net_profit' in df.columns:
            negative_sales = (df['Sales'] < 0).sum()
            if negative_sales > 0:
                issues.append(f"Negative sales in {negative_sales} records")
            
            # Check profit margins
            df_clean = df.dropna(subset=['Sales', 'Net_profit'])
            if not df_clean.empty:
                # Avoid division by zero
                valid_sales = df_clean['Sales'] != 0
                if valid_sales.any():
                    margin = (df_clean.loc[valid_sales, 'Net_profit'] / df_clean.loc[valid_sales, 'Sales']) * 100
                    extreme_margins = ((margin > 100) | (margin < -100)).sum()
                    if extreme_margins > 0:
                        issues.append(f"{extreme_margins} records with extreme profit margins (>100% or <-100%)")
    
    elif statement_type == 'Balance Sheet':
        if 'Total' in df.columns:
            zero_totals = (df['Total'] == 0).sum()
            if zero_totals > 0:
                issues.append(f"{zero_totals} records with zero total assets")
    
    elif statement_type == 'Cash Flow':
        if 'Cash_from_Operating_Activity' in df.columns:
            df_clean = df.dropna(subset=['Cash_from_Operating_Activity'])
            if not df_clean.empty:
                extreme_cf = (abs(df_clean['Cash_from_Operating_Activity']) > 50000).sum()
                if extreme_cf > 0:
                    issues.append(f"{extreme_cf} records with extreme operating cash flows (>50,000 or <-50,000)")
    
    return issues if issues else ["No issues detected"]

# Streamlit App
def main():
    st.set_page_config(
        page_title="Equity Data QA Dashboard", 
        layout="wide", 
        initial_sidebar_state="expanded",
        page_icon="🔍"
    )
    
    # Check authentication first
    if not check_password():
        return
    
    # Header with user info
    col1, col2 = st.columns([4, 1])
    with col1:
        st.title("🔍 Equity Data Quality Assurance Dashboard")
        st.markdown("**Validate financial data quality for equity research**")
    with col2:
        st.markdown(f"**User:** {st.session_state.get('current_user', 'Unknown')}")
        if st.button("🚪 Logout"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
    
    # Sidebar navigation
    st.sidebar.title("📋 Navigation")
    st.sidebar.markdown("---")
    
    view = st.sidebar.radio(
        "Select View", 
        ["📊 Overview", "🏢 Company Details", "📈 Data Quality Analysis"],
        help="Choose the analysis view"
    )
    
    # Add some sidebar info
    st.sidebar.markdown("---")
    st.sidebar.markdown("### ℹ️ About")
    st.sidebar.markdown("This dashboard validates equity data quality across financial statements.")
    st.sidebar.markdown(f"**Last Updated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Main content based on selection
    try:
        if view == "📊 Overview":
            show_overview()
        elif view == "🏢 Company Details":
            show_company_details()
        elif view == "📈 Data Quality Analysis":
            show_quality_analysis()
    except Exception as e:
        st.error(f"Error loading view: {str(e)}")
        st.info("Please check database connection and try again.")

def show_overview():
    st.header("📊 Data Completeness Overview")
    
    with st.spinner("Loading data..."):
        companies_df = load_companies()
        completeness_df = get_data_completeness()
        sector_df = load_sector_data()
    
    if companies_df.empty:
        st.error("No company data available. Please check database connection.")
        return
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Companies", len(companies_df))
    
    with col2:
        if not completeness_df.empty:
            unique_companies_with_data = completeness_df['Symbol'].nunique()
            st.metric("Companies with Data", unique_companies_with_data)
        else:
            st.metric("Companies with Data", 0)
    
    with col3:
        if not completeness_df.empty:
            total_records = completeness_df['Record_Count'].sum()
            st.metric("Total Records", f"{total_records:,}")
        else:
            st.metric("Total Records", 0)
    
    with col4:
        if not completeness_df.empty:
            avg_records = completeness_df.groupby('Symbol')['Record_Count'].sum().mean()
            st.metric("Avg Records/Company", f"{avg_records:.0f}")
        else:
            st.metric("Avg Records/Company", 0)
    
    # Data completeness visualization
    if not completeness_df.empty:
        st.subheader("📈 Data Completeness Matrix")
        
        pivot_df = completeness_df.pivot(index='Symbol', columns='Statement', values='Record_Count').fillna(0)
        
        if not pivot_df.empty:
            fig = px.imshow(
                pivot_df.values,
                x=pivot_df.columns,
                y=pivot_df.index,
                color_continuous_scale='RdYlGn',
                aspect='auto',
                title="Record Counts by Company and Statement Type",
                labels=dict(x="Financial Statement", y="Company Symbol", color="Record Count")
            )
            fig.update_layout(height=max(400, len(pivot_df) * 20), font=dict(size=10))
            st.plotly_chart(fig, use_container_width=True)
        
        # Gap analysis
        st.subheader("🚨 Data Gaps Analysis")
        
        expected_statements = ['Balance Sheet', 'P&L Statement', 'Cash Flow', 'Quarterly Results']
        all_companies = set(companies_df['Symbol'])
        
        gap_analysis = []
        for company in all_companies:
            company_data = completeness_df[completeness_df['Symbol'] == company]
            available_statements = set(company_data['Statement'].tolist())
            missing_statements = set(expected_statements) - available_statements
            
            if missing_statements:
                gap_analysis.append({
                    'Symbol': company,
                    'Missing_Statements': ', '.join(missing_statements),
                    'Available_Statements': len(available_statements),
                    'Missing_Count': len(missing_statements)
                })
        
        if gap_analysis:
            gap_df = pd.DataFrame(gap_analysis)
            st.dataframe(gap_df.sort_values('Missing_Count', ascending=False), use_container_width=True)
            
            # Summary of gaps
            st.info(f"📊 **Summary**: {len(gap_analysis)} companies have missing data across {len(expected_statements)} statement types.")
        else:
            st.success("✅ All companies have complete statement coverage!")
    else:
        st.warning("No completeness data available.")

def show_company_details():
    st.header("🏢 Company Financial Data Details")
    
    companies_df = load_companies()
    
    if companies_df.empty:
        st.error("No company data available")
        return
    
    # Company selection
    selected_company = st.selectbox(
        "🔍 Select Company",
        options=companies_df['Symbol'].tolist(),
        format_func=lambda x: f"{x} - {companies_df[companies_df['Symbol']==x]['Company'].iloc[0] if not companies_df[companies_df['Symbol']==x].empty else x}",
        help="Choose a company to analyze"
    )
    
    if selected_company:
        company_info = companies_df[companies_df['Symbol'] == selected_company].iloc[0]
        
        # Company metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            price = company_info.get('Current_Price', 'N/A')
            st.metric("Current Price", f"₹{price}" if price != 'N/A' else 'N/A')
        with col2:
            market_cap = company_info.get('Market_Capitalization', 'N/A')
            st.metric("Market Cap", f"₹{market_cap:.0f} Cr" if market_cap != 'N/A' else 'N/A')
        with col3:
            st.metric("Company Name", company_info.get('Company', 'N/A'))
        
        # Statement analysis tabs
        tab1, tab2, tab3, tab4 = st.tabs([
            "📋 Balance Sheet", 
            "💰 P&L Statement", 
            "💧 Cash Flow", 
            "📊 Quarterly Results"
        ])
        
        with tab1:
            show_statement_data(selected_company, 'Balance Sheet')
        
        with tab2:
            show_statement_data(selected_company, 'P&L Statement')
        
        with tab3:
            show_statement_data(selected_company, 'Cash Flow')
        
        with tab4:
            show_statement_data(selected_company, 'Quarterly Results')

def show_statement_data(symbol, statement_type):
    with st.spinner(f"Loading {statement_type} data..."):
        df = load_financial_data(symbol, statement_type)
    
    if df.empty:
        st.warning(f"No {statement_type} data available for {symbol}")
        return
    
    # Data quality assessment
    quality_issues = check_data_quality(df, statement_type)
    
    # Quality status
    col1, col2 = st.columns([3, 1])
    with col1:
        if quality_issues and quality_issues[0] != "No issues detected":
            st.error("⚠️ Data Quality Issues Detected")
            with st.expander("View Issues"):
                for issue in quality_issues:
                    st.write(f"• {issue}")
        else:
            st.success("✅ No data quality issues detected")
    
    with col2:
        st.metric("Records", len(df))
    
    # Data table
    st.subheader(f"📄 {statement_type} Data")
    
    # Remove MongoDB ObjectId column for display
    display_df = df.drop(['_id'], axis=1, errors='ignore')
    
    # Show data with formatting
    st.dataframe(
        display_df, 
        use_container_width=True,
        height=400
    )
    
    # Visualizations
    create_statement_visualizations(df, statement_type, symbol)

def create_statement_visualizations(df, statement_type, symbol):
    """Create appropriate visualizations based on statement type"""
    
    if df.empty:
        return
    
    # Determine date column
    date_col = None
    for col in ['Year', 'Quarter']:
        if col in df.columns:
            date_col = col
            break
    
    if not date_col:
        st.info("No time series data available for visualization")
        return
    
    st.subheader("📈 Trend Analysis")
    
    # Statement-specific visualizations
    if statement_type == 'P&L Statement':
        numeric_cols = ['Sales', 'Net_profit', 'Profit_before_tax']
        available_cols = [col for col in numeric_cols if col in df.columns]
        
        if available_cols:
            create_trend_chart(df, available_cols, f"{symbol} - P&L Trends", date_col)
    
    elif statement_type == 'Balance Sheet':
        numeric_cols = ['Total', 'Equity_Share_Capital', 'Reserves']
        available_cols = [col for col in numeric_cols if col in df.columns]
        
        if available_cols:
            create_trend_chart(df, available_cols, f"{symbol} - Balance Sheet Trends", date_col)
    
    elif statement_type == 'Cash Flow':
        numeric_cols = ['Net_Cash_Flow', 'Cash_from_Operating_Activity', 'Cash_from_Investing_Activity']
        available_cols = [col for col in numeric_cols if col in df.columns]
        
        if available_cols:
            create_trend_chart(df, available_cols, f"{symbol} - Cash Flow Trends", date_col)
    
    elif statement_type == 'Quarterly Results':
        numeric_cols = ['Sales', 'Net_profit', 'Operating_Profit']
        available_cols = [col for col in numeric_cols if col in df.columns]
        
        if available_cols:
            create_trend_chart(df, available_cols, f"{symbol} - Quarterly Trends", date_col)

def create_trend_chart(df, columns, title, date_col):
    """Create trend charts for financial data"""
    
    # Clean data for visualization
    df_clean = df.dropna(subset=columns + [date_col])
    
    if df_clean.empty:
        st.info("No data available for trend analysis")
        return
    
    fig = go.Figure()
    
    for col in columns:
        if col in df_clean.columns:
            fig.add_trace(go.Scatter(
                x=df_clean[date_col],
                y=df_clean[col],
                mode='lines+markers',
                name=col.replace('_', ' ').title(),
                line=dict(width=2)
            ))
    
    fig.update_layout(
        title=title,
        xaxis_title=date_col,
        yaxis_title="Amount (₹ Cr)",
        height=400,
        hovermode='x unified',
        showlegend=True
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_quality_analysis():
    st.header("📈 Comprehensive Data Quality Analysis")
    
    companies_df = load_companies()
    
    if companies_df.empty:
        st.error("No company data available")
        return
    
    st.subheader("🔍 Bulk Quality Analysis")
    st.markdown("Analyze data quality across all companies and financial statements.")
    
    if st.button("🚀 Start Quality Analysis", type="primary"):
        run_bulk_quality_analysis(companies_df)

def run_bulk_quality_analysis(companies_df):
    """Run comprehensive quality analysis for all companies"""
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    quality_results = []
    statement_types = ['Balance Sheet', 'P&L Statement', 'Cash Flow', 'Quarterly Results']
    
    total_checks = len(companies_df) * len(statement_types)
    completed_checks = 0
    
    # Analysis loop
    for idx, company in companies_df.iterrows():
        symbol = company['Symbol']
        status_text.text(f"Analyzing {symbol} ({idx + 1}/{len(companies_df)})...")
        
        for statement_type in statement_types:
            df = load_financial_data(symbol, statement_type)
            issues = check_data_quality(df, statement_type)
            
            quality_results.append({
                'Symbol': symbol,
                'Company': company.get('Company', symbol),
                'Statement': statement_type,
                'Record_Count': len(df),
                'Issues': '; '.join(issues),
                'Status': '✅ Clean' if issues == ["No issues detected"] else '⚠️ Issues Found'
            })
            
            completed_checks += 1
            progress_bar.progress(completed_checks / total_checks)
    
    status_text.text("✅ Analysis completed!")
    
    # Display results
    display_quality_results(quality_results)

def display_quality_results(quality_results):
    """Display the results of quality analysis"""
    
    results_df = pd.DataFrame(quality_results)
    
    # Summary metrics
    st.subheader("📊 Quality Summary")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        clean_records = len(results_df[results_df['Status'] == '✅ Clean'])
        st.metric("Clean Records", clean_records)
    
    with col2:
        issue_records = len(results_df[results_df['Status'] == '⚠️ Issues Found'])
        st.metric("Records with Issues", issue_records)
    
    with col3:
        total_data_records = results_df['Record_Count'].sum()
        st.metric("Total Data Records", f"{total_data_records:,}")
    
    with col4:
        companies_analyzed = results_df['Symbol'].nunique()
        st.metric("Companies Analyzed", companies_analyzed)
    
    # Quality distribution chart
    status_counts = results_df['Status'].value_counts()
    fig = px.pie(
        values=status_counts.values, 
        names=status_counts.index, 
        title="Data Quality Distribution",
        color_discrete_map={'✅ Clean': 'green', '⚠️ Issues Found': 'orange'}
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Filtering options
    st.subheader("🔍 Filter Results")
    col1, col2 = st.columns(2)
    
    with col1:
        filter_status = st.selectbox("Status", ["All", "✅ Clean", "⚠️ Issues Found"])
    
    with col2:
        statement_types = ['All'] + results_df['Statement'].unique().tolist()
        filter_statement = st.selectbox("Statement Type", statement_types)
    
    # Apply filters
    filtered_df = results_df.copy()
    if filter_status != "All":
        filtered_df = filtered_df[filtered_df['Status'] == filter_status]
    if filter_statement != "All":
        filtered_df = filtered_df[filtered_df['Statement'] == filter_statement]
    
    # Display filtered results
    st.subheader("📋 Detailed Results")
    st.dataframe(
        filtered_df.sort_values(['Status', 'Symbol']), 
        use_container_width=True,
        height=400
    )
    
    # Export functionality
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("📥 Export to CSV"):
            csv = results_df.to_csv(index=False)
            st.download_button(
                label="⬇️ Download Report",
                data=csv,
                file_name=f"equity_data_quality_report_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
                mime="text/csv",
                type="primary"
            )

if __name__ == "__main__":
    main()
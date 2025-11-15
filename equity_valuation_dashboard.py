import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

# Page configuration
st.set_page_config(
    page_title="Equity Valuation Data Quality Dashboard",
    layout="wide",
    initial_sidebar_state="expanded",
    page_icon="📊"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .quality-good {
        color: #28a745;
        font-weight: bold;
    }
    .quality-warning {
        color: #ffc107;
        font-weight: bold;
    }
    .quality-bad {
        color: #dc3545;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)

@st.cache_data
def load_data(file_path):
    """Load CSV data with error handling"""
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        st.error(f"Error loading data: {str(e)}")
        return pd.DataFrame()

def analyze_data_quality(df):
    """Comprehensive data quality analysis"""
    quality_report = {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'missing_values': {},
        'duplicate_rows': 0,
        'numeric_columns': [],
        'outliers': {},
        'data_types': {}
    }

    # Missing values analysis
    for col in df.columns:
        missing_count = df[col].isnull().sum()
        missing_pct = (missing_count / len(df)) * 100
        if missing_count > 0:
            quality_report['missing_values'][col] = {
                'count': missing_count,
                'percentage': round(missing_pct, 2)
            }

    # Duplicate rows
    quality_report['duplicate_rows'] = df.duplicated().sum()

    # Numeric columns
    quality_report['numeric_columns'] = df.select_dtypes(include=[np.number]).columns.tolist()

    # Data types
    quality_report['data_types'] = df.dtypes.to_dict()

    # Outlier detection for numeric columns
    for col in quality_report['numeric_columns']:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
        if len(outliers) > 0:
            quality_report['outliers'][col] = len(outliers)

    return quality_report

def display_overview(df, quality_report):
    """Display data overview and summary statistics"""
    st.header("📊 Data Overview")

    # Key metrics
    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.metric("Total Companies", quality_report['total_rows'])

    with col2:
        st.metric("Total Columns", quality_report['total_columns'])

    with col3:
        missing_cols = len(quality_report['missing_values'])
        st.metric("Columns with Missing Data", missing_cols)

    with col4:
        st.metric("Duplicate Rows", quality_report['duplicate_rows'])

    with col5:
        outlier_cols = len(quality_report['outliers'])
        st.metric("Columns with Outliers", outlier_cols)

    # Data preview
    st.subheader("📋 Data Preview")
    st.dataframe(df.head(10), use_container_width=True)

    # Summary statistics
    st.subheader("📈 Summary Statistics")
    st.dataframe(df.describe(), use_container_width=True)

def display_data_quality_checks(df, quality_report):
    """Display detailed data quality checks"""
    st.header("🔍 Data Quality Analysis")

    # Missing values analysis
    st.subheader("❌ Missing Values Analysis")

    if quality_report['missing_values']:
        missing_df = pd.DataFrame([
            {
                'Column': col,
                'Missing Count': info['count'],
                'Missing %': info['percentage']
            }
            for col, info in quality_report['missing_values'].items()
        ]).sort_values('Missing %', ascending=False)

        # Visualization
        fig = px.bar(
            missing_df,
            x='Column',
            y='Missing %',
            title='Missing Data by Column (%)',
            color='Missing %',
            color_continuous_scale='Reds'
        )
        fig.update_layout(height=400, xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

        # Detailed table
        st.dataframe(missing_df, use_container_width=True)
    else:
        st.success("✅ No missing values found in the dataset!")

    # Duplicate rows check
    st.subheader("🔄 Duplicate Rows Check")
    if quality_report['duplicate_rows'] > 0:
        st.warning(f"⚠️ Found {quality_report['duplicate_rows']} duplicate rows in the dataset")
        if st.checkbox("Show duplicate rows"):
            duplicates = df[df.duplicated(keep=False)]
            st.dataframe(duplicates, use_container_width=True)
    else:
        st.success("✅ No duplicate rows found!")

    # Outlier detection
    st.subheader("📊 Outlier Detection")

    if quality_report['outliers']:
        outlier_df = pd.DataFrame([
            {'Column': col, 'Outlier Count': count}
            for col, count in quality_report['outliers'].items()
        ]).sort_values('Outlier Count', ascending=False)

        # Visualization
        fig = px.bar(
            outlier_df,
            x='Column',
            y='Outlier Count',
            title='Outliers Detected by Column',
            color='Outlier Count',
            color_continuous_scale='Oranges'
        )
        fig.update_layout(height=400, xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

        # Detailed table
        st.dataframe(outlier_df, use_container_width=True)

        # Show outlier details
        st.subheader("Outlier Details")
        selected_col = st.selectbox("Select column to view outliers", list(quality_report['outliers'].keys()))
        if selected_col:
            Q1 = df[selected_col].quantile(0.25)
            Q3 = df[selected_col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outliers = df[(df[selected_col] < lower_bound) | (df[selected_col] > upper_bound)]
            st.dataframe(outliers[['Symbol', selected_col]], use_container_width=True)
    else:
        st.success("✅ No outliers detected in numeric columns!")

def display_valuation_metrics(df):
    """Display valuation metrics visualizations"""
    st.header("💰 Valuation Metrics Analysis")

    # Key valuation metrics
    valuation_cols = ['PE', 'PEG', 'EPS_TTM', 'Market_Cap', 'Current_Price', 'Intrinsic_Value']
    available_cols = [col for col in valuation_cols if col in df.columns]

    if not available_cols:
        st.warning("No valuation metrics available for visualization")
        return

    # PE Ratio Analysis
    if 'PE' in df.columns:
        st.subheader("📊 PE Ratio Distribution")

        col1, col2 = st.columns(2)

        with col1:
            fig = px.histogram(
                df,
                x='PE',
                nbins=20,
                title='PE Ratio Distribution',
                labels={'PE': 'Price to Earnings Ratio'}
            )
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            fig = px.box(
                df,
                y='PE',
                title='PE Ratio Box Plot',
                labels={'PE': 'Price to Earnings Ratio'}
            )
            st.plotly_chart(fig, use_container_width=True)

    # Price vs Intrinsic Value
    if 'Current_Price' in df.columns and 'Intrinsic_Value' in df.columns:
        st.subheader("💎 Current Price vs Intrinsic Value")

        df_clean = df.dropna(subset=['Current_Price', 'Intrinsic_Value'])

        fig = px.scatter(
            df_clean,
            x='Intrinsic_Value',
            y='Current_Price',
            text='Symbol',
            title='Current Price vs Intrinsic Value',
            labels={
                'Intrinsic_Value': 'Intrinsic Value (₹)',
                'Current_Price': 'Current Price (₹)'
            },
            hover_data=['Symbol', 'PE', 'Market_Cap']
        )

        # Add diagonal line for reference (Price = Intrinsic Value)
        max_val = max(df_clean['Current_Price'].max(), df_clean['Intrinsic_Value'].max())
        fig.add_trace(
            go.Scatter(
                x=[0, max_val],
                y=[0, max_val],
                mode='lines',
                name='Price = Intrinsic Value',
                line=dict(color='red', dash='dash')
            )
        )

        fig.update_traces(textposition='top center')
        st.plotly_chart(fig, use_container_width=True)

        # Value analysis
        df_clean['Value_Gap_%'] = ((df_clean['Current_Price'] - df_clean['Intrinsic_Value']) / df_clean['Intrinsic_Value']) * 100

        overvalued = df_clean[df_clean['Value_Gap_%'] > 10]
        undervalued = df_clean[df_clean['Value_Gap_%'] < -10]

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Overvalued Stocks", len(overvalued))
        with col2:
            st.metric("Fairly Valued Stocks", len(df_clean) - len(overvalued) - len(undervalued))
        with col3:
            st.metric("Undervalued Stocks", len(undervalued))

    # Market Cap Distribution
    if 'Market_Cap' in df.columns:
        st.subheader("📈 Market Capitalization Analysis")

        col1, col2 = st.columns(2)

        with col1:
            fig = px.bar(
                df.sort_values('Market_Cap', ascending=False),
                x='Symbol',
                y='Market_Cap',
                title='Market Cap by Company',
                labels={'Market_Cap': 'Market Cap (₹ Cr)'}
            )
            fig.update_layout(xaxis_tickangle=-45)
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            fig = px.pie(
                df,
                values='Market_Cap',
                names='Symbol',
                title='Market Cap Distribution'
            )
            st.plotly_chart(fig, use_container_width=True)

    # Growth Metrics
    if 'CAGR' in df.columns and 'PE' in df.columns:
        st.subheader("📊 Growth Analysis (CAGR vs PE)")

        df_clean = df.dropna(subset=['CAGR', 'PE'])

        fig = px.scatter(
            df_clean,
            x='CAGR',
            y='PE',
            text='Symbol',
            title='Growth Rate (CAGR) vs PE Ratio',
            labels={
                'CAGR': 'CAGR (%)',
                'PE': 'Price to Earnings Ratio'
            },
            size='Market_Cap',
            hover_data=['Symbol', 'PEG']
        )
        fig.update_traces(textposition='top center')
        st.plotly_chart(fig, use_container_width=True)

def display_financial_health(df):
    """Display financial health metrics"""
    st.header("🏥 Financial Health Indicators")

    # Dividend Analysis
    if 'Dividend_Payout_%' in df.columns and 'Dividend_Yield' in df.columns:
        st.subheader("💵 Dividend Analysis")

        col1, col2 = st.columns(2)

        with col1:
            fig = px.bar(
                df.sort_values('Dividend_Yield', ascending=False),
                x='Symbol',
                y='Dividend_Yield',
                title='Dividend Yield by Company (%)',
                labels={'Dividend_Yield': 'Dividend Yield (%)'}
            )
            fig.update_layout(xaxis_tickangle=-45)
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            fig = px.scatter(
                df,
                x='Dividend_Payout_%',
                y='Dividend_Yield',
                text='Symbol',
                title='Dividend Payout % vs Dividend Yield',
                labels={
                    'Dividend_Payout_%': 'Dividend Payout %',
                    'Dividend_Yield': 'Dividend Yield (%)'
                }
            )
            fig.update_traces(textposition='top center')
            st.plotly_chart(fig, use_container_width=True)

    # Beta Analysis (Risk)
    if 'Beta from Money Control' in df.columns:
        st.subheader("📉 Risk Analysis (Beta)")

        df_clean = df.dropna(subset=['Beta from Money Control'])

        col1, col2 = st.columns(2)

        with col1:
            fig = px.bar(
                df_clean.sort_values('Beta from Money Control', ascending=False),
                x='Symbol',
                y='Beta from Money Control',
                title='Beta by Company',
                labels={'Beta from Money Control': 'Beta'},
                color='Beta from Money Control',
                color_continuous_scale='RdYlGn_r'
            )
            fig.update_layout(xaxis_tickangle=-45)

            # Add reference line at Beta = 1
            fig.add_hline(y=1, line_dash="dash", line_color="red",
                         annotation_text="Market Beta = 1")

            st.plotly_chart(fig, use_container_width=True)

        with col2:
            # Categorize by beta
            df_clean['Risk_Category'] = pd.cut(
                df_clean['Beta from Money Control'],
                bins=[0, 0.8, 1.2, float('inf')],
                labels=['Low Risk (β < 0.8)', 'Medium Risk (0.8 ≤ β ≤ 1.2)', 'High Risk (β > 1.2)']
            )

            risk_counts = df_clean['Risk_Category'].value_counts()

            fig = px.pie(
                values=risk_counts.values,
                names=risk_counts.index,
                title='Risk Distribution',
                color_discrete_sequence=['green', 'orange', 'red']
            )
            st.plotly_chart(fig, use_container_width=True)

    # Operating Profit Growth
    if 'Operating_Profit_Base' in df.columns and 'Operating_Profit_2025' in df.columns:
        st.subheader("📈 Operating Profit Growth")

        df_clean = df.dropna(subset=['Operating_Profit_Base', 'Operating_Profit_2025'])
        df_clean['OP_Growth_%'] = ((df_clean['Operating_Profit_2025'] - df_clean['Operating_Profit_Base']) / df_clean['Operating_Profit_Base']) * 100

        fig = px.bar(
            df_clean.sort_values('OP_Growth_%', ascending=False),
            x='Symbol',
            y='OP_Growth_%',
            title='Operating Profit Growth (Base Year to 2025)',
            labels={'OP_Growth_%': 'Growth %'},
            color='OP_Growth_%',
            color_continuous_scale='RdYlGn'
        )
        fig.update_layout(xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

def display_interactive_filters(df):
    """Display data with interactive filtering"""
    st.header("🔍 Interactive Data Explorer")

    st.markdown("### Filter Options")

    col1, col2, col3 = st.columns(3)

    with col1:
        # PE filter
        if 'PE' in df.columns:
            pe_min, pe_max = float(df['PE'].min()), float(df['PE'].max())
            pe_range = st.slider(
                "PE Ratio Range",
                min_value=pe_min,
                max_value=pe_max,
                value=(pe_min, pe_max)
            )

    with col2:
        # Market Cap filter
        if 'Market_Cap' in df.columns:
            mc_min, mc_max = float(df['Market_Cap'].min()), float(df['Market_Cap'].max())
            mc_range = st.slider(
                "Market Cap Range (₹ Cr)",
                min_value=mc_min,
                max_value=mc_max,
                value=(mc_min, mc_max)
            )

    with col3:
        # Dividend Yield filter
        if 'Dividend_Yield' in df.columns:
            dy_min, dy_max = float(df['Dividend_Yield'].min()), float(df['Dividend_Yield'].max())
            dy_range = st.slider(
                "Dividend Yield Range (%)",
                min_value=dy_min,
                max_value=dy_max,
                value=(dy_min, dy_max)
            )

    # Apply filters
    filtered_df = df.copy()

    if 'PE' in df.columns:
        filtered_df = filtered_df[(filtered_df['PE'] >= pe_range[0]) & (filtered_df['PE'] <= pe_range[1])]

    if 'Market_Cap' in df.columns:
        filtered_df = filtered_df[(filtered_df['Market_Cap'] >= mc_range[0]) & (filtered_df['Market_Cap'] <= mc_range[1])]

    if 'Dividend_Yield' in df.columns:
        filtered_df = filtered_df[(filtered_df['Dividend_Yield'] >= dy_range[0]) & (filtered_df['Dividend_Yield'] <= dy_range[1])]

    # Display filtered data
    st.markdown(f"### Filtered Results: {len(filtered_df)} companies")
    st.dataframe(filtered_df, use_container_width=True)

    # Export filtered data
    if len(filtered_df) > 0:
        csv = filtered_df.to_csv(index=False)
        st.download_button(
            label="📥 Download Filtered Data (CSV)",
            data=csv,
            file_name="filtered_equity_data.csv",
            mime="text/csv"
        )

def main():
    # Header
    st.markdown('<h1 class="main-header">📊 Indian Equity Valuation Data Quality Dashboard</h1>', unsafe_allow_html=True)
    st.markdown("**Comprehensive data visualization and quality analysis for equity valuation data**")
    st.markdown("---")

    # File upload or load default
    st.sidebar.title("📂 Data Source")

    data_source = st.sidebar.radio(
        "Choose data source",
        ["Use uploaded CSV file", "Upload new file"]
    )

    df = None

    if data_source == "Use uploaded CSV file":
        file_path = "valuation_analysis_2025.csv"
        df = load_data(file_path)
        if not df.empty:
            st.sidebar.success(f"✅ Loaded {len(df)} companies from valuation_analysis_2025.csv")
    else:
        uploaded_file = st.sidebar.file_uploader("Upload CSV file", type=['csv'])
        if uploaded_file is not None:
            df = pd.read_csv(uploaded_file)
            st.sidebar.success(f"✅ Loaded {len(df)} companies")

    if df is None or df.empty:
        st.warning("⚠️ No data loaded. Please upload a CSV file or check the default file path.")
        return

    # Analyze data quality
    quality_report = analyze_data_quality(df)

    # Sidebar navigation
    st.sidebar.markdown("---")
    st.sidebar.title("📋 Navigation")

    view = st.sidebar.radio(
        "Select View",
        [
            "📊 Overview & Statistics",
            "🔍 Data Quality Checks",
            "💰 Valuation Metrics",
            "🏥 Financial Health",
            "🔎 Interactive Explorer"
        ]
    )

    # Display selected view
    if view == "📊 Overview & Statistics":
        display_overview(df, quality_report)

    elif view == "🔍 Data Quality Checks":
        display_data_quality_checks(df, quality_report)

    elif view == "💰 Valuation Metrics":
        display_valuation_metrics(df)

    elif view == "🏥 Financial Health":
        display_financial_health(df)

    elif view == "🔎 Interactive Explorer":
        display_interactive_filters(df)

    # Footer
    st.sidebar.markdown("---")
    st.sidebar.markdown("### ℹ️ About")
    st.sidebar.info(
        "This dashboard provides comprehensive data quality analysis and visualization "
        "for Indian equity valuation data. Use the navigation menu to explore different views."
    )

    # Data quality summary in sidebar
    st.sidebar.markdown("### 📈 Data Quality Score")

    total_checks = 3  # Missing values, duplicates, outliers
    passed_checks = 0

    if not quality_report['missing_values']:
        passed_checks += 1
    if quality_report['duplicate_rows'] == 0:
        passed_checks += 1
    if not quality_report['outliers']:
        passed_checks += 1

    quality_score = (passed_checks / total_checks) * 100

    if quality_score == 100:
        st.sidebar.success(f"Quality Score: {quality_score:.0f}% ✅")
    elif quality_score >= 66:
        st.sidebar.warning(f"Quality Score: {quality_score:.0f}% ⚠️")
    else:
        st.sidebar.error(f"Quality Score: {quality_score:.0f}% ❌")

if __name__ == "__main__":
    main()

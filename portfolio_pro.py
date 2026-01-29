import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import pytz
import numpy as np
import os

st.set_page_config(page_title="Executive Portfolio", layout="wide")

# --- CUSTOM CSS ---
st.markdown("""
<style>
    div[data-testid="stMetricLabel"] > label { font-size: 12px !important; }
    div[data-testid="stMetricValue"] > div { font-size: 18px !important; }
    div[data-testid="stMetricDelta"] > div { font-size: 12px !important; }
    .js-plotly-plot { margin-top: -10px; }
    /* Signal Badges */
    .trend-bullish { color: #00ff00; font-size: 11px; font-weight: bold; }
    .trend-bearish { color: #ff4b4b; font-size: 11px; font-weight: bold; }
    .trend-neutral { color: #888888; font-size: 11px; }
    .trend-golden { color: #ffd700; font-size: 11px; font-weight: bold; }
    .trend-extended { color: #ff8c00; font-size: 11px; font-weight: bold; }
    .sig-bull { color: #00ff00; font-size: 11px; font-weight: bold; border: 1px solid #00ff00; padding: 1px 4px; border-radius: 4px; }
    .sig-bear { color: #ff4b4b; font-size: 11px; font-weight: bold; border: 1px solid #ff4b4b; padding: 1px 4px; border-radius: 4px; }
</style>
""", unsafe_allow_html=True)

# --- 1. SESSION STATE & DATA ---
if 'raw_data' not in st.session_state:
    st.session_state.raw_data = pd.DataFrame()

def robust_clean(df):
    df.columns = [str(c).strip() for c in df.columns]
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].astype(str).str.strip()
    for col in ['Units', 'Value ($)', 'Filled']:
        if col in df.columns:
            df[col] = df[col].astype(str).str.replace('$', '', regex=False)\
                                         .str.replace(',', '', regex=False)\
                                         .str.replace('--', '0', regex=False)
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    return df

# --- 2. SIDEBAR (AUTO-LOAD MEMBER DIRECT FILE) ---
with st.sidebar:
    st.header("📂 Data Management")
    
    # 1. Allow manual upload (Overrides default)
    uploaded_file = st.file_uploader("Upload New Data", type=["csv", "xlsx"])
    
    # 2. Check for "Baked In" data if no upload
    if uploaded_file:
        try:
            if uploaded_file.name.endswith('.csv'):
                df_input = pd.read_csv(uploaded_file)
            else:
                df_input = pd.read_excel(uploaded_file)
            st.session_state.raw_data = robust_clean(df_input)
            st.success("✅ New file loaded!")
        except Exception as e:
            st.error(f"Error: {e}")
            
    elif st.session_state.raw_data.empty:
        # 3. AUTO-LOAD: Look for 'MemberDirectTransactions.xlsx' (or csv)
        default_xlsx = "MemberDirectTransactions.xlsx"
        default_csv = "MemberDirectTransactions.csv"
        
        if os.path.exists(default_xlsx):
            try:
                df_input = pd.read_excel(default_xlsx)
                st.session_state.raw_data = robust_clean(df_input)
                st.info(f"📱 Mobile Mode: Loaded {default_xlsx}")
            except Exception as e: st.error(f"Could not load {default_xlsx}: {e}")
            
        elif os.path.exists(default_csv):
            try:
                df_input = pd.read_csv(default_csv)
                st.session_state.raw_data = robust_clean(df_input)
                st.info(f"📱 Mobile Mode: Loaded {default_csv}")
            except Exception as e: st.error(f"Could not load {default_csv}: {e}")
        else:
            st.warning(f"⚠️ No data found. Please upload '{default_xlsx}' or use the uploader.")

    if st.button("🗑️ Reset / Delete Data"):
        st.session_state.raw_data = pd.DataFrame()
        st.rerun()

    st.divider()
    fy_choice = st.selectbox("Financial Year", ["2023-24", "2024-25", "2025-26"], index=1)
    st.divider()
    st.header("🏠 Property & Debt")
    prop_val = st.number_input("Property Valuation ($)", value=0)
    mortgage = st.number_input("Mortgage Balance ($)", value=0)

# --- GLOBAL INDICATOR FUNCTION ---
def calculate_technical_indicators(prices_df):
    if len(prices_df) < 50: return 50, 0, 0, "" 
    
    delta = prices_df.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    sma50 = prices_df.rolling(window=50).mean()
    sma200 = prices_df.rolling(window=200).mean()

    divergence_signal = ""
    try:
        window_size = 11 
        is_low = prices_df == prices_df.rolling(window=window_size, center=True).min()
        is_high = prices_df == prices_df.rolling(window=window_size, center=True).max()
        low_dates = prices_df[is_low].index
        high_dates = prices_df[is_high].index
        
        if len(low_dates) >= 2:
            last_low_date = low_dates[-1]
            prev_low_date = low_dates[-2]
            if (prices_df.index[-1] - last_low_date).days < 25: 
                price_last = prices_df.loc[last_low_date]
                price_prev = prices_df.loc[prev_low_date]
                rsi_last = rsi.loc[last_low_date]
                rsi_prev = rsi.loc[prev_low_date]
                if (price_last < price_prev) and (rsi_last > rsi_prev):
                    divergence_signal = "⚡ Bullish Div"

        if len(high_dates) >= 2:
            last_high_date = high_dates[-1]
            prev_high_date = high_dates[-2]
            if (prices_df.index[-1] - last_high_date).days < 25:
                price_last = prices_df.loc[last_high_date]
                price_prev = prices_df.loc[prev_high_date]
                rsi_last = rsi.loc[last_high_date]
                rsi_prev = rsi.loc[prev_high_date]
                if (price_last > price_prev) and (rsi_last < rsi_prev):
                    divergence_signal = "⚠️ Bearish Div"
    except: pass

    return rsi.iloc[-1], sma50.iloc[-1], sma200.iloc[-1], divergence_signal

# --- 3. MARKET TICKER ---
st.markdown("### 🌎 Global Market Pulse")
tz_ny = pytz.timezone('America/New_York')
now_ny = datetime.now(tz_ny)
market_open = 9 <= now_ny.hour < 16 and now_ny.weekday() < 5
status_label = " (Live)" if market_open else " (Fut)"

tickers_to_fetch = {
    "ASX 200": "XJO", 
    f"S&P 500{status_label}": "ES=F", 
    f"Dow Jones{status_label}": "YM=F", 
    f"Nasdaq{status_label}": "NQ=F",
    "Nikkei 225": "^N225",
    "Nifty 50": "^NSEI",
    "Gold (USD)": "GC=F", 
    "Silver (USD)": "SI=F", 
    "AUD/USD": "AUDUSD=X", 
    "10Y T-Note": "ZN=F"
}

@st.cache_data(ttl=300, show_spinner=False)
def get_market_data(ticker_map):
    results = {}
    fallback_map = {"XJO": "^AXJO", "ES=F": "SPY", "YM=F": "DIA", "NQ=F": "QQQ", "GC=F": "GLD", "SI=F": "SLV", "ZN=F": "IEF", "^N225": "^N225", "^NSEI": "^NSEI"}
    
    for name, sym in ticker_map.items():
        try:
            ticker = yf.Ticker(sym)
            hist_hourly = ticker.history(period="5d", interval="60m")
            if hist_hourly.empty and sym in fallback_map:
                sym = fallback_map[sym]
                ticker = yf.Ticker(sym)
                hist_hourly = ticker.history(period="5d", interval="60m")
            
            hist_daily = ticker.history(period="2y", interval="1d")
            
            if not hist_hourly.empty and 'Close' in hist_hourly.columns:
                series = hist_hourly['Close'].dropna()
                curr_price = series.iloc[-1]
                try: prev_close = ticker.fast_info['previous_close']
                except: 
                    try: prev_close = ticker.info.get('previousClose')
                    except: prev_close = series.iloc[0]

                if not hist_daily.empty and len(hist_daily) > 200:
                    rsi, sma50, sma200, div_signal = calculate_technical_indicators(hist_daily['Close'])
                    
                    if not pd.isna(sma50) and curr_price > sma50: med_trend = "Bullish"
                    elif not pd.isna(sma50): med_trend = "Bearish"
                    else: med_trend = "Neutral"
                    
                    if not pd.isna(sma200):
                        if curr_price > sma200: 
                            long_trend = "Bullish"
                            if not pd.isna(sma50) and sma50 > sma200:
                                extension = (curr_price - sma50) / sma50
                                if extension > 0.08: long_trend = "Extended"
                                elif extension > -0.02: long_trend = "Golden"
                        else: 
                            long_trend = "Bearish"
                    else: long_trend = "Neutral"
                else:
                    med_trend, long_trend, div_signal = "Neutral", "Neutral", ""
                
                results[name] = {
                    'series': series, 'current': curr_price, 'prev_close': prev_close,
                    'med_trend': med_trend, 'long_trend': long_trend, 'div': div_signal
                }
            else: results[name] = None
        except: results[name] = None
    return results

def make_sparkline(data_list, color):
    fig = go.Figure(data=[go.Scatter(x=list(range(len(data_list))), y=data_list, mode='lines', line=dict(color=color, width=2))])
    fig.update_layout(showlegend=False, xaxis=dict(visible=False, fixedrange=True), yaxis=dict(visible=False, fixedrange=True),
                      margin=dict(t=0, b=0, l=0, r=0), height=40, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', hovermode=False)
    return fig

market_data = get_market_data(tickers_to_fetch)
items = list(tickers_to_fetch.items())
rows = [items[:5], items[5:]]

for row_items in rows:
    cols = st.columns(len(row_items))
    for i, (name, sym) in enumerate(row_items):
        col = cols[i]
        c_metric, c_chart = col.columns([2, 1])
        data_pack = market_data.get(name)
        if data_pack:
            curr = data_pack['current']
            prev = data_pack['prev_close']
            m_trend = data_pack['med_trend']
            l_trend = data_pack['long_trend']
            div_sig = data_pack['div']
            chg = ((curr - prev) / prev) * 100 if prev and prev > 0 else 0
            fmt = f"{curr:,.4f}" if "USD" in name or "AUD" in name else f"{curr:,.0f}"
            trend_color = '#00ff00' if chg >= 0 else '#ff4b4b'
            c_metric.metric(name, fmt, f"{chg:.2f}%")
            
            m_html = f"<span class='trend-bullish'>M:🟢</span>" if m_trend == "Bullish" else f"<span class='trend-bearish'>M:🔴</span>"
            if l_trend == "Golden": l_html = f"<span class='trend-golden'>L:✨Golden</span>"
            elif l_trend == "Extended": l_html = f"<span class='trend-extended'>L:🚀Extended</span>"
            elif l_trend == "Bullish": l_html = f"<span class='trend-bullish'>L:🟢</span>"
            elif l_trend == "Bearish": l_html = f"<span class='trend-bearish'>L:🔴</span>"
            else: l_html = f"<span class='trend-neutral'>L:➖</span>"
            div_html = ""
            if div_sig:
                if "Bullish" in div_sig: div_html = f"<br><span class='sig-bull'>{div_sig}</span>"
                else: div_html = f"<br><span class='sig-bear'>{div_sig}</span>"
            c_metric.markdown(f"{m_html} &nbsp; {l_html}{div_html}", unsafe_allow_html=True)
            c_chart.plotly_chart(make_sparkline(data_pack['series'].tolist(), trend_color), use_container_width=True, config={'displayModeBar': False})
        else:
            c_metric.metric(name, "N/A", "No Data")

st.divider()

# --- 4. DATA PROCESSING ---
if not st.session_state.raw_data.empty:
    df_raw = st.session_state.raw_data.copy()
    df_raw['Status'] = df_raw['Status'].astype(str).str.strip().str.lower()
    df_raw['Action'] = df_raw['Action'].astype(str).str.strip().str.lower()
    df_raw['Investment type'] = df_raw['Investment type'].astype(str).str.strip()

    df = df_raw[
        (df_raw['Investment type'].str.contains('Shares|ETF', case=False, na=False)) & 
        (~df_raw['Status'].isin(['rejected', 'expired', 'cancelled', 'failed']))
    ].copy()
    df = df.sort_values(by='Date')
    
    if df.empty:
        st.warning("No valid holdings found.")
    else:
        def calc_holdings_avg(group):
            total_units = 0
            total_cost = 0
            date_queue = [] 
            for index, row in group.iterrows():
                units = row['Filled']
                val = row['Value ($)']
                action = row['Action']
                if action in ['buy', 'reinvest', 'drp', 'transfer', 'allotment', 'exercise', 'bonus']:
                    total_units += units
                    total_cost += val
                    date_queue.append({'units': units, 'date': row['Date']})
                elif action in ['sell', 'disposal']:
                    if total_units > 0:
                        current_avg_price = total_cost / total_units
                        total_units -= units
                        total_cost -= (units * current_avg_price)
                        units_to_remove = units
                        while units_to_remove > 0 and date_queue:
                            oldest = date_queue[0]
                            if oldest['units'] > units_to_remove:
                                oldest['units'] -= units_to_remove
                                units_to_remove = 0
                            else:
                                units_to_remove -= oldest['units']
                                date_queue.pop(0)
            final_avg_cost = total_cost / total_units if total_units > 0 else 0
            one_year_ago = pd.Timestamp.now() - pd.DateOffset(years=1)
            long_term_units = sum(lot['units'] for lot in date_queue if lot['date'] <= one_year_ago)
            return pd.Series({'Units': total_units, 'AvgCost': final_avg_cost, 'TotalCostBasis': total_cost, 'Qty > 12m': long_term_units})

        holdings = df.groupby('Investment').apply(calc_holdings_avg, include_groups=False).reset_index()
        holdings = holdings[holdings['Units'] > 0.001]
        
        holdings['Ticker'] = holdings['Investment'].apply(lambda x: f"{x}.AX" if "." not in x else x)
        
        MANUAL_SECTORS = {
            "VTS.AX": "US Equity", "VAS.AX": "Aus Equity", "VGS.AX": "Global Equity", "VAE.AX": "Emerging Markets",
            "GOLD.AX": "Commodities", "VEQ.AX": "Europe Equity", "FANG.AX": "US Tech", "VAF.AX": "Fixed Income",
            "VVLU.AX": "Global Value", "NDIA.AX": "India Equity", "IFRA.AX": "Infrastructure", "IJP.AX": "Japan Equity",
            "HACK.AX": "Cybersecurity", "A200.AX": "Aus Equity", "IVV.AX": "US Equity"
        }

        @st.cache_data(ttl=3600, show_spinner=False)
        def get_stock_details(ticker_list):
            prices, prev_prices, sectors, yields, volumes, avg_volumes = {}, {}, {}, {}, {}, {}
            ex_divs, betas = {}, {}
            technical_data = {} 
            try:
                if ticker_list:
                    data = yf.download(ticker_list, period="2y", progress=False)
                    bench_data = yf.download("^AXJO", period="1y", progress=False)['Close']
                    if isinstance(bench_data, pd.DataFrame): bench_data = bench_data.iloc[:,0]
                    bench_ret = bench_data.pct_change().dropna()

                    if len(ticker_list) == 1:
                        close_col = data['Close'] if 'Close' in data else data.xs('Close', axis=1, level=0)
                        vol_col = data['Volume'] if 'Volume' in data else data.xs('Volume', axis=1, level=0)
                        if isinstance(close_col, pd.DataFrame): close_col = close_col.iloc[:, 0]
                        if isinstance(vol_col, pd.DataFrame): vol_col = vol_col.iloc[:, 0]
                        t = ticker_list[0]
                        prices[t] = float(close_col.iloc[-1])
                        prev_prices[t] = float(close_col.iloc[-2]) if len(close_col)>1 else float(close_col.iloc[-1])
                        volumes[t] = float(vol_col.iloc[-1])
                        avg_volumes[t] = float(vol_col.mean())
                        rsi, sma50, sma200, div = calculate_technical_indicators(close_col)
                        technical_data[t] = {'rsi': rsi, 'sma50': sma50, 'sma200': sma200, 'div': div}
                        stock_ret = close_col.pct_change().dropna()
                        try:
                            common = stock_ret.index.intersection(bench_ret.index)
                            if len(common) > 30:
                                cov = np.cov(stock_ret[common], bench_ret[common])[0][1]
                                var = np.var(bench_ret[common])
                                betas[t] = cov / var
                            else: betas[t] = 0
                        except: betas[t] = 0
                    else:
                        close_df = data['Close'] if 'Close' in data else data.xs('Close', axis=1, level=0)
                        vol_df = data['Volume'] if 'Volume' in data else data.xs('Volume', axis=1, level=0)
                        for t in ticker_list:
                            try:
                                series = close_df[t]
                                prices[t] = float(series.iloc[-1])
                                prev_prices[t] = float(series.iloc[-2])
                                volumes[t] = float(vol_df[t].iloc[-1])
                                avg_volumes[t] = float(vol_df[t].mean())
                                rsi, sma50, sma200, div = calculate_technical_indicators(series)
                                technical_data[t] = {'rsi': rsi, 'sma50': sma50, 'sma200': sma200, 'div': div}
                                stock_ret = series.pct_change().dropna()
                                common = stock_ret.index.intersection(bench_ret.index)
                                if len(common) > 30:
                                    cov = np.cov(stock_ret[common], bench_ret[common])[0][1]
                                    var = np.var(bench_ret[common])
                                    betas[t] = cov / var
                                else: betas[t] = 0
                            except:
                                prices[t], prev_prices[t], volumes[t], avg_volumes[t] = 0,0,0,0
                                technical_data[t] = {'rsi': 50, 'sma50': 0, 'sma200': 0, 'div': ''}
                                betas[t] = 0
            except: pass
            
            for t in ticker_list:
                sectors[t] = MANUAL_SECTORS.get(t, 'Unknown')
                if t not in prices: 
                    prices[t], prev_prices[t], volumes[t], avg_volumes[t] = 0,0,0,0
                    technical_data[t] = {'rsi': 50, 'sma50': 0, 'sma200': 0, 'div': ''}
                    betas[t] = 0
                try:
                    ticker_obj = yf.Ticker(t)
                    
                    # --- YIELD NORMALIZER ---
                    raw_yield = ticker_obj.info.get('dividendYield', 0)
                    try: raw_yield = float(raw_yield)
                    except: raw_yield = 0
                    
                    if raw_yield > 0.50: raw_yield = raw_yield / 100
                    
                    if 0 < raw_yield < 0.30:
                        yields[t] = raw_yield
                    else:
                        divs = ticker_obj.dividends
                        if not divs.empty:
                            one_year_ago = pd.Timestamp.now(tz=divs.index.tz) - pd.DateOffset(years=1)
                            last_year_divs = divs[divs.index >= one_year_ago]
                            total_div = last_year_divs.sum()
                            if prices[t] > 0: 
                                calc_yield = total_div / prices[t]
                                if calc_yield < 0.30: yields[t] = calc_yield
                                else: yields[t] = 0
                            else: yields[t] = 0
                        else: yields[t] = 0

                    try:
                        ex_ts = ticker_obj.info.get('exDividendDate', None)
                        if ex_ts: ex_divs[t] = datetime.fromtimestamp(ex_ts).strftime('%d-%b')
                        else:
                            divs = ticker_obj.dividends
                            if not divs.empty: ex_divs[t] = divs.index[-1].strftime('%d-%b')
                            else: ex_divs[t] = "-"
                    except: ex_divs[t] = "-"

                    if sectors[t] == 'Unknown': 
                        try: sectors[t] = ticker_obj.info.get('sector', 'Unknown')
                        except: pass
                except: 
                    yields[t] = 0
                    ex_divs[t] = "-"
            return prices, prev_prices, sectors, yields, volumes, avg_volumes, technical_data, ex_divs, betas

        with st.spinner('Analyzing Portfolio...'):
            tickers_list = holdings['Ticker'].tolist()
            price_map, prev_price_map, sector_map, yield_map, vol_map, avg_vol_map, tech_map, ex_div_map, beta_map = get_stock_details(tickers_list)

        holdings['LivePrice'] = holdings['Ticker'].map(price_map).fillna(0)
        holdings['PrevClose'] = holdings['Ticker'].map(prev_price_map).fillna(0)
        holdings['Sector'] = holdings['Ticker'].map(sector_map).fillna('Unknown')
        
        holdings['DivYield'] = holdings['Ticker'].map(yield_map).fillna(0)
        holdings['Ex-Div'] = holdings['Ticker'].map(ex_div_map).fillna("-")
        holdings['Beta'] = holdings['Ticker'].map(beta_map).fillna(0)
        holdings['Volume'] = holdings['Ticker'].map(vol_map).fillna(0)
        holdings['Avg Vol (4m)'] = holdings['Ticker'].map(avg_vol_map).fillna(0)
        
        holdings['RSI'] = holdings['Ticker'].apply(lambda x: tech_map.get(x, {}).get('rsi', 50))
        holdings['SMA50'] = holdings['Ticker'].apply(lambda x: tech_map.get(x, {}).get('sma50', 0))
        holdings['SMA200'] = holdings['Ticker'].apply(lambda x: tech_map.get(x, {}).get('sma200', 0))
        holdings['Div'] = holdings['Ticker'].apply(lambda x: tech_map.get(x, {}).get('div', ''))
        
        def get_signal(row):
            rsi = row['RSI']
            if rsi < 30: return "🟢 Oversold"
            elif rsi > 70: return "🔴 Overbought"
            else: return "⚪ Neutral"
            
        def get_med_trend(row):
            if row['LivePrice'] > row['SMA50'] and row['SMA50'] > 0: return "📈 Bull"
            elif row['LivePrice'] < row['SMA50'] and row['SMA50'] > 0: return "📉 Bear"
            else: return "-"

        def get_long_trend(row):
            if pd.isna(row['SMA200']) or row['SMA200'] == 0: return "-"
            if row['LivePrice'] > row['SMA200']:
                if row['SMA50'] > 0:
                    ext = (row['LivePrice'] - row['SMA50']) / row['SMA50']
                    if ext > 0.08: return "🚀 Extended"
                return "🟢 Bull"
            else: return "🔴 Bear"

        holdings['Signal'] = holdings.apply(get_signal, axis=1)
        holdings['Med Trend'] = holdings.apply(get_med_trend, axis=1)
        holdings['Long Trend'] = holdings.apply(get_long_trend, axis=1)

        holdings['CurrentValue'] = holdings['Units'] * holdings['LivePrice']
        holdings['GainLoss'] = holdings['CurrentValue'] - holdings['TotalCostBasis']
        holdings['Return%'] = holdings.apply(lambda x: (x['GainLoss']/x['TotalCostBasis']*100) if x['TotalCostBasis']>0 else 0, axis=1)
        holdings['EstAnnualIncome'] = holdings['CurrentValue'] * holdings['DivYield']
        holdings['DayChg$'] = (holdings['LivePrice'] - holdings['PrevClose']) * holdings['Units']
        holdings['DayChg%'] = ((holdings['LivePrice'] - holdings['PrevClose']) / holdings['PrevClose']) * 100
        holdings['DayChg%'] = holdings['DayChg%'].fillna(0)
        
        total_port_val = holdings['CurrentValue'].sum()
        holdings['Weight %'] = (holdings['CurrentValue'] / total_port_val * 100).fillna(0)
        
        st.subheader("🚨 Anomaly Monitor")
        hot_assets = holdings[holdings['RSI'] > 75]
        cold_assets = holdings[holdings['RSI'] < 25]
        div_assets = holdings[holdings['Div'] != ""]
        
        c1, c2, c3 = st.columns(3)
        with c1:
            if not hot_assets.empty:
                st.error(f"🔥 **Overheated (RSI > 75):**")
                for _, row in hot_assets.iterrows():
                    st.write(f"- {row['Investment']} (RSI: {row['RSI']:.0f})")
            else: st.success("✅ No overheated assets.")
        with c2:
            if not cold_assets.empty:
                st.info(f"❄️ **Deep Freeze (RSI < 25):**")
                for _, row in cold_assets.iterrows():
                    st.write(f"- {row['Investment']} (RSI: {row['RSI']:.0f})")
            else: st.success("✅ No oversold assets.")
        with c3:
            if not div_assets.empty:
                st.warning(f"⚡ **Divergence Detected:**")
                for _, row in div_assets.iterrows():
                    st.write(f"- {row['Investment']}: {row['Div']}")
            else: st.success("✅ No divergences detected.")

        st.divider()

        st.subheader("📊 Portfolio Snapshot")
        total_cost = holdings['TotalCostBasis'].sum()
        total_gain = holdings['GainLoss'].sum()
        total_income = holdings['EstAnnualIncome'].sum()
        total_day_chg = holdings['DayChg$'].sum()
        total_return_pct = (total_gain / total_cost * 100) if total_cost > 0 else 0
        total_day_chg_pct = (total_day_chg / (total_port_val - total_day_chg) * 100) if (total_port_val - total_day_chg) > 0 else 0
        
        avg_yield = (total_income / total_port_val * 100) if total_port_val > 0 else 0
        weighted_beta = (holdings['Beta'] * (holdings['Weight %'] / 100)).sum()

        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Net Worth", f"${total_port_val:,.2f}", f"{total_day_chg_pct:.2f}%")
        m2.metric("Total Gain", f"${total_gain:,.2f}", f"{total_return_pct:.2f}%")
        m3.metric("Daily Change", f"${total_day_chg:,.2f}", delta_color="normal")
        m4.metric("Est. Income", f"${total_income:,.2f}", f"{avg_yield:.2f}% Yield")
        m5.metric("Portfolio Beta", f"{weighted_beta:.2f}", help="Weighted Volatility vs ASX200")

        st.subheader("📋 Holdings Detail (Click to sort)")
        cols_to_show = ['Investment', 'Weight %', 'Ex-Div', 'DivYield', 'Beta', 'LivePrice', 'DayChg$', 'DayChg%', 'RSI', 'Div', 'Signal', 'Med Trend', 'Long Trend', 'CurrentValue', 'GainLoss', 'Return%']
        
        def color_rsi(val):
            if pd.isna(val): return ''
            if val < 30: return 'color: #00ff00; font-weight: bold' 
            if val > 70: return 'color: #ff4b4b; font-weight: bold' 
            return ''
        
        def color_div(val):
            if 'Bullish' in str(val): return 'color: #00ff00; font-weight: bold'
            if 'Bearish' in str(val): return 'color: #ff4b4b; font-weight: bold'
            return ''
            
        def color_beta(val):
            if pd.isna(val): return ''
            if val > 1.3: return 'color: #ff4b4b; font-weight: bold' 
            if val < 0.8: return 'color: #00ff00; font-weight: bold' 
            return '' 

        event = st.dataframe(
            holdings[cols_to_show].style.format({
                'Weight %': '{:.2f}%', 'Beta': '{:.2f}', 'LivePrice': '${:,.2f}', 
                'DivYield': '{:.2%}',
                'DayChg$': '${:,.2f}', 'DayChg%': '{:,.2f}%', 'RSI': '{:.0f}',
                'CurrentValue': '${:,.2f}', 'GainLoss': '${:,.2f}', 'Return%': '{:.2f}%'
            }).map(lambda x: 'color: #00ff00' if isinstance(x, (int,float)) and x>0 else ('color: #ff4b4b' if isinstance(x,(int,float)) and x<0 else ''), subset=['GainLoss', 'Return%', 'DayChg$', 'DayChg%'])
              .map(color_rsi, subset=['RSI'])
              .map(color_div, subset=['Div'])
              .map(color_beta, subset=['Beta']),
            use_container_width=True, hide_index=True,
            on_select="rerun", selection_mode="single-row",
            column_config={
                "Investment": st.column_config.TextColumn(help="Asset Name / Ticker"),
                "Weight %": st.column_config.NumberColumn(help="% of Total Portfolio. Watch for concentration risk >15%"),
                "Ex-Div": st.column_config.TextColumn(help="Next Ex-Dividend Date. Buy before this date to receive the payout"),
                "DivYield": st.column_config.NumberColumn(help="Annual Dividend Yield based on trailing 12m payouts"),
                "Beta": st.column_config.NumberColumn(help="Volatility vs Market. 1.0=Market, >1.3=Aggressive, <0.8=Defensive (Green)"),
                "LivePrice": st.column_config.NumberColumn(help="Current Market Price (Delayed 15-20 min)"),
                "DayChg$": st.column_config.NumberColumn(help="Dollar value change today"),
                "DayChg%": st.column_config.NumberColumn(help="Percentage value change today"),
                "RSI": st.column_config.NumberColumn(help="Momentum: >70=Overbought (Red), <30=Oversold (Green)"),
                "Div": st.column_config.TextColumn(help="Divergence: When Price trend conflicts with RSI trend (Reversal signal)"),
                "Signal": st.column_config.TextColumn(help="RSI Status: Overbought or Oversold"),
                "Med Trend": st.column_config.TextColumn(help="50-Day Moving Average Trend (Medium Term)"),
                "Long Trend": st.column_config.TextColumn(help="200-Day Moving Average Trend (Long Term / Golden Cross)"),
                "CurrentValue": st.column_config.NumberColumn(help="Total Market Value of Position"),
                "GainLoss": st.column_config.NumberColumn(help="Total Profit/Loss since inception"),
                "Return%": st.column_config.NumberColumn(help="Total Return on Investment %")
            }
        )

        if len(event.selection.rows) > 0:
            selected_idx = event.selection.rows[0]
            if selected_idx < len(holdings):
                selected_ticker = holdings.iloc[selected_idx]['Ticker']
                selected_name = holdings.iloc[selected_idx]['Investment']
                
                st.divider()
                st.markdown(f"### 📈 Price Trend: {selected_name} (1 Year)")
                with st.spinner(f"Loading chart for {selected_name}..."):
                    chart_data = yf.download(selected_ticker, period="1y", progress=False)
                    if not chart_data.empty:
                        close_series = chart_data['Close'] if 'Close' in chart_data else chart_data.xs('Close', axis=1, level=0)
                        if isinstance(close_series, pd.DataFrame): close_series = close_series.iloc[:, 0]
                        
                        fig_detail = go.Figure()
                        fig_detail.add_trace(go.Scatter(x=close_series.index, y=close_series.values, name="Price", line=dict(color='#00ff00', width=2)))
                        sma50 = close_series.rolling(window=50).mean()
                        sma200 = close_series.rolling(window=200).mean()
                        fig_detail.add_trace(go.Scatter(x=sma50.index, y=sma50.values, name="50-Day SMA", line=dict(color='yellow', width=1, dash='dash')))
                        fig_detail.add_trace(go.Scatter(x=sma200.index, y=sma200.values, name="200-Day SMA", line=dict(color='white', width=1)))
                        fig_detail.update_layout(template="plotly_dark", height=350, margin=dict(l=0,r=0,t=10,b=0), legend=dict(orientation="h", y=1.1))
                        st.plotly_chart(fig_detail, use_container_width=True)
        else:
            st.info("👆 Click on any row above to see a detailed 1-year price chart.")

        st.divider()

        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col1:
            st.write("**Sector Allocation**")
            if not holdings.empty:
                fig_sec = px.pie(holdings, values='CurrentValue', names='Sector', hole=0.4)
                fig_sec.update_layout(margin=dict(t=0, b=0, l=0, r=0), height=300, showlegend=False)
                fig_sec.update_traces(textposition='inside', textinfo='percent+label')
                st.plotly_chart(fig_sec, use_container_width=True)
                
        with col2:
            st.write("**Top Performers (Return %)**")
            top_movers = holdings.sort_values(by='Return%', ascending=True).tail(5)
            fig_perf = go.Figure(go.Bar(x=top_movers['Return%'], y=top_movers['Investment'], orientation='h', marker_color='#00ff00'))
            fig_perf.update_layout(margin=dict(t=0, b=0, l=0, r=0), height=300, xaxis_title="Return %")
            st.plotly_chart(fig_perf, use_container_width=True)
            
        with col3:
            st.write("**FY Performance**")
            fy_start_date = datetime(int(fy_choice.split("-")[0]), 7, 1)
            chart_end = min(datetime.now(), datetime(int(fy_choice.split("-")[0]) + 1, 6, 30))
            
            try:
                my_perf = get_portfolio_history(df, fy_start_date, chart_end)
                fig_fy = go.Figure()
                if my_perf is not None:
                     fig_fy.add_trace(go.Scatter(x=my_perf.index, y=my_perf, name="Portfolio", line=dict(color='#00ff00', width=2)))
                fig_fy.update_layout(template="plotly_dark", height=300, margin=dict(l=0,r=0,t=10,b=0), showlegend=False)
                st.plotly_chart(fig_fy, use_container_width=True)
            except Exception as e: st.write("Chart unavailable")

else:
    st.info("Upload your Member Direct file to see the analysis.")
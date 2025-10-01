import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="STC GasX",
    page_icon="💲",
    layout="wide"
)

with st.sidebar:
    st.sidebar.image(
        "https://i.imgur.com/7j5aq4l.png",
        use_container_width=True
    )
    st.sidebar.markdown("📘 **About**")
    st.sidebar.markdown("""
    **STC GasX** adalah **Web3 Cost Comparator** yang menghubungkan biaya transaksi blockchain dengan biaya off-chain tradisional. Dengan memanfaatkan harga gas Ethereum terkini, konversi mata uang real-time, dan parameter biaya off-chain yang bisa diatur pengguna, GasX memberikan **wawasan yang jelas dan actionable** bagi siapa saja yang ingin mengevaluasi efisiensi biaya solusi Web3 dibandingkan metode konvensional.  

    Baik untuk peneliti, developer, maupun analis bisnis, GasX membantu **memvisualisasikan biaya per transaksi**, memahami komposisi biaya, dan mengambil **keputusan berbasis data** untuk adopsi Web3.
    
    ---
    #### 🔮 Vision Statement
    > STC GasX membayangkan masa depan di mana **adopsi Web3 dipandu oleh kejelasan dan wawasan**, memungkinkan keputusan yang lebih cerdas dan integrasi yang lebih mulus antara blockchain dan sistem keuangan tradisional.
    
    Visi kami adalah membuat **transparansi finansial Web3** menjadi sederhana dan mudah diakses.  
    Kami ingin memberdayakan pengguna—akademisi, perusahaan, maupun penggiat teknologi—untuk **membandingkan, menganalisis, dan mengoptimalkan biaya transaksi** antara on-chain dan off-chain.  
        
    ---
    ### 🧩 Apps Showcase
    Lihat disini untuk semua tools yang kami kembangkan:
    [ELPEEF](https://showcase.elpeef.com/)
    
    ---
    #### 🙌 Dukungan & kontributor
    - ⭐ **Star / Fork**: [GitHub repo](https://github.com/mrbrightsides/gasx)
    - Built with 💙 by [Khudri](https://s.id/khudri)
    - Dukung pengembangan proyek ini melalui: 
      [💖 GitHub Sponsors](https://github.com/sponsors/mrbrightsides) • 
      [☕ Ko-fi](https://ko-fi.com/khudri) • 
      [💵 PayPal](https://www.paypal.com/paypalme/akhmadkhudri) • 
      [🍵 Trakteer](https://trakteer.id/akhmad_khudri)

    Versi UI: v1.0 • Streamlit • Theme Dark
    """)

import streamlit.components.v1 as components

def embed_iframe(src, hide_top_px=100, hide_bottom_px=0, height=800):
    components.html(f"""
    <style>
        @media (max-width: 768px) {{
            .hide-on-mobile {{
                display: none !important;
            }}
            .show-on-mobile {{
                display: block !important;
                padding: 24px 12px;
                background: #ffecec;
                color: #d10000;
                font-weight: bold;
                text-align: center;
                border-radius: 12px;
                font-size: 1.2em;
                margin-top: 24px;
                animation: fadeIn 0.6s ease-in-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }}
        }}
        @media (min-width: 769px) {{
            .show-on-mobile {{
                display: none !important;
            }}
        }}
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(12px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
    </style>

    <!-- Desktop view -->
    <div class="hide-on-mobile" style="height:{height}px; overflow:hidden; position:relative;">
        <iframe src="{src}" 
                style="width:100%; height:calc(100% + {hide_top_px + hide_bottom_px}px); 
                       border:none; position:relative; top:-{hide_top_px}px;">
        </iframe>
    </div>

    <!-- Mobile fallback -->
    <div class="show-on-mobile">
        📱 Tampilan ini tidak tersedia di perangkat seluler.<br>
        Silakan buka lewat laptop atau desktop untuk pengalaman penuh 💻
    </div>
    """, height=height + hide_top_px + hide_bottom_px)

# URL Ohara
iframe_url = "https://stc-gasx.elpeef.com/"

# Panggil fungsi
embed_iframe(iframe_url, hide_top_px=40, hide_bottom_px = -145, height=800)

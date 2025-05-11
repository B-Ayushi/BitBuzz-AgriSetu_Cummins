import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# MUST be the first Streamlit command
st.set_page_config(page_title="🌾 Smart Crop Selector", layout="wide")

# Load and preprocess data
@st.cache_data
def load_data():
    try:
        df = pd.read_csv("merged_hybrid_crops.csv")

        # Data cleaning
        df = df.drop_duplicates(subset=["Crop", "Hybrid"])
        df.fillna("Not Specified", inplace=True)

        # Ensure required columns exist
        required_columns = ["Crop", "Hybrid", "Benefit1", "Benefit2", "Benefit3",
                            "Region", "Duration", "Yield", "DiseaseResistance",
                            "SpecialFeatures", "Vendors"]

        for col in required_columns:
            if col not in df.columns:
                df[col] = "Not Specified"

        # Create searchable text features
        df["Search_Features"] = (
            df["Crop"] + " " + df["Hybrid"] + " " +
            df["Benefit1"] + " " + df["Benefit2"] + " " + df["Benefit3"] + " " +
            df["Region"] + " " + df["SpecialFeatures"]
        )
        return df
    except Exception as e:
        st.error(f"Error loading data: {str(e)}")
        return pd.DataFrame(columns=required_columns)

with st.spinner('Loading crop data...'):
    df = load_data()

# Train simple recommendation model
@st.cache_resource
def train_model(data):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(data)
    return vectorizer, tfidf_matrix

if not df.empty:
    vectorizer, tfidf_matrix = train_model(df["Search_Features"])

# Recommendation engine
def get_recommendations(user_input, selected_crop):
    try:
        if selected_crop != "All":
            crop_filtered_df = df[df["Crop"] == selected_crop]
        else:
            crop_filtered_df = df.copy()

        query_vec = vectorizer.transform([user_input])
        similarities = cosine_similarity(query_vec,
                                         vectorizer.transform(crop_filtered_df["Search_Features"])).flatten()

        crop_filtered_df["Match_Score"] = similarities
        return crop_filtered_df.sort_values("Match_Score", ascending=False)
    except Exception as e:
        st.error(f"Recommendation error: {str(e)}")
        return pd.DataFrame()

# Streamlit UI
st.title("🌾 Smart Crop Selector")
st.markdown("*Helping farmers choose the perfect hybrid seeds for their needs*")

# Sidebar filters
with st.sidebar:
    st.header("🔍 Filter Options")
    crop_options = ["All"] + sorted(df["Crop"].unique().tolist()) if not df.empty else ["All"]
    crop = st.selectbox("Select Crop", crop_options)

    region_options = ["All"] + sorted(df["Region"].unique().tolist()) if not df.empty else ["All"]
    region = st.selectbox("Your Region", region_options)

    priority = st.radio("Priority", ["Yield", "Disease Resistance", "Early Maturity"])

# Main display
tab1, tab2, tab3 = st.tabs(["🌱 Hybrid Recommendations", "📊 Compare Varieties", "🧪 Traits Summary"])

with tab1:
    st.header("Top Hybrids For You")

    if not df.empty:
        query_map = {
            "Yield": "high yield",
            "Disease Resistance": "disease resistant",
            "Early Maturity": "early maturity"
        }
        recommendations = get_recommendations(query_map[priority], crop).head(5)

        if not recommendations.empty:
            for _, row in recommendations.iterrows():
                with st.expander(f"🏆 **{row['Hybrid']}** ({row['Crop']}) - Score: {row['Match_Score']:.2f}"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.markdown(f"""
                        **Benefits:**  
                        • {row['Benefit1']}  
                        • {row['Benefit2']}  
                        • {row['Benefit3']}  

                        **Region:** {row['Region']}  
                        **Duration:** {row['Duration']}  
                        """)

                    with col2:
                        st.markdown(f"""
                        **Yield:** {row['Yield']}  
                        **Disease Resistance:** {row['DiseaseResistance']}  
                        **Special Features:** {row['SpecialFeatures']}  
                        """)

                    if row['Vendors'] != "Not Specified":
                        st.success(f"**Buy from:** {row['Vendors']}")
                    else:
                        st.warning("Vendor information not available")
        else:
            st.warning(f"No {crop if crop != 'All' else ''} hybrids found with '{priority}' characteristics")
    else:
        st.warning("No crop data available for recommendations")

with tab2:
    st.header("Compare Varieties")
    filtered_df = df.copy()
    if not df.empty:
        if crop != "All":
            filtered_df = filtered_df[filtered_df["Crop"] == crop]
        if region != "All":
            filtered_df = filtered_df[filtered_df["Region"].str.contains(region, case=False)]

    if not filtered_df.empty:
        compare_options = st.multiselect(
            "Select hybrids to compare",
            filtered_df["Hybrid"].unique(),
            default=filtered_df["Hybrid"].head(2).tolist() if len(filtered_df) >= 2 else []
        )

        if compare_options:
            compare_df = filtered_df[filtered_df["Hybrid"].isin(compare_options)]
            st.dataframe(
                compare_df.set_index("Hybrid")[
                    ["Crop", "Benefit1", "Benefit2", "Yield", "Duration"]
                ],
                use_container_width=True
            )

            st.bar_chart(
                compare_df.set_index("Hybrid")[["Yield"]],
                color="#4CAF50"
            )
    else:
        st.warning("No crops available for comparison")

with tab3:
    st.header("Traits Summary")
    if not df.empty:
        st.dataframe(
            df[["Hybrid", "Crop", "Benefit1", "Benefit2", "Benefit3", "DiseaseResistance"]],
            use_container_width=True
        )
    else:
        st.warning("Data not available for trait summary.")

# Footer
st.markdown("---")
st.caption("Data sources: ICAR, ICRISAT, Seed Companies | © 2024 AgriTech Advisor")

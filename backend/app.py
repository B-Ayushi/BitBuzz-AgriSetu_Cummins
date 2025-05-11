from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)

# Function to train and save the model
def train_and_save_model():
    # Load the dataset (adjust path as needed)
    data = pd.read_csv(r'C:\Users\ayush\OneDrive\Desktop\BitBuzz\client\vite-project\Crop_recommendation.csv')

    # Prepare features and target
    X = data.drop('target', axis=1)  # Features
    y = data['target']  # Target variable

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Model Accuracy: {accuracy * 100:.2f}%')

    # Save the trained model
    joblib.dump(model, 'backend/models/model.joblib')  # Save model in the models folder
    return model

# API endpoint to recommend crops
@app.route('/recommend-crops', methods=['POST'])
def recommend_crops():
    # Check if model exists, else train it
    try:
        model = joblib.load('backend/models/model.joblib')  # Try loading the pre-trained model
    except FileNotFoundError:
        print("Model not found, training a new model.")
        model = train_and_save_model()  # Train the model if not found

    # Get the user input from the request body
    data = request.get_json()
    input_data = [[
        data['N'], 
        data['P'], 
        data['K'], 
        data['temperature'], 
        data['humidity'], 
        data['ph'], 
        data['rainfall']
    ]]

    # Make predictions
    prediction = model.predict(input_data)

    # Return the recommendation
    return jsonify({'recommendation': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)

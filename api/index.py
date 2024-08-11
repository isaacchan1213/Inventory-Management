from flask import Flask, jsonify, request
import json
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

chat = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_retries=2,
    api_key=os.getenv('GROQ_API_KEY')  
)

system_message = "You are a helpful assistant."
human_message = "{text}"

prompt = ChatPromptTemplate.from_messages([("system", system_message), ("human", human_message)])
chain = prompt | chat

@app.route('/api/get-calories', methods=['POST'])
def get_suggestions():
    data = request.json
    food = data.get('food', '')

    user_message = f"""Provide only the number of calories for the following food item. No extra text, details, or explanations. No range. Just the number.
                       Food: {food}
                    """

    messages = [
        ("system", "You are educated in food science."),
        ("user", user_message)
    ]

    try:
        # Generate the response
        response = chain.invoke({"text": user_message})
        response_content = response.content if hasattr(response, 'content') else "No response from model"
        
        match = re.search(r'\b\d+\b', response_content.strip())
        if match:
            calories = int(match.group())
        else:
            calories = "Error: No valid number found in response"

        return jsonify({'response': calories})
    except Exception as e:
        print("Error:", e)  # Print error to console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
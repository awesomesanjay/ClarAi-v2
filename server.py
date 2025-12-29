from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

app = Flask(__name__)

# Cloud Inference Configuration
# We will try the requested model first. If it fails (due to not being on the free tier),
# we can switch to a reliable standard model like Llama-3-8B-Instruct.
# MODEL_ID = "meta-llama/Llama-4-Scout-17B-16E-Instruct"
# Fallback if the above is too heavy/unavailable on free API:
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct" 

HF_TOKEN = os.getenv("HF_TOKEN")

print(f"Initializing Cloud Client for: {MODEL_ID}")
client = InferenceClient(token=HF_TOKEN)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    system_prompt = data.get('system_prompt', '')
    user_prompt = data.get('prompt', '')
    
    print(f"Request: {len(user_prompt)} chars to Cloud API...")

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_prompt})

    try:
        # Use simple chat_completion which handles format handling automatically
        response = client.chat_completion(
            model=MODEL_ID,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        # Verify structure
        if response.choices and len(response.choices) > 0:
            return jsonify({"text": response.choices[0].message.content})
        else:
            return jsonify({"error": "No response from Cloud API"}), 500

    except Exception as e:
        print(f"Cloud API Error: {e}")
        return jsonify({
            "error": str(e),
            "hint": "Model might be too large for free Inference API. Try changing MODEL_ID in server.py to 'meta-llama/Meta-Llama-3-8B-Instruct'"
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running", "mode": "cloud_inference"})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port)

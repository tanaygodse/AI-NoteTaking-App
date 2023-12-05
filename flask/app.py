from flask import Flask, request, jsonify, make_response
import torch
from transformers import pipeline
import nltk 
nltk.download('punkt')
nltk.download('stopwords')
import networkx as nx
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import re
from flask_cors import CORS
import io
import requests
from pypdf import PdfReader  


classifier = pipeline("summarization")

app = Flask(__name__)
CORS(app)


def preprocess_text(text):
    sentences = sent_tokenize(text)
    words = [word_tokenize(sentence) for sentence in sentences]
    words = [word.lower() for sublist in words for word in sublist if word.isalnum() and not any(char.isdigit() for char in word) and len(word) >= 4]
    words = [word for word in words if word not in stopwords.words('english')]
    return words

def build_text_rank_graph(words):
    G = nx.Graph()
    G.add_nodes_from(set(words))

    for i in range(len(words) - 1):
        word1, word2 = words[i], words[i + 1]
        if not G.has_edge(word1, word2):
            G.add_edge(word1, word2)

    return G

@app.route('/summarize/', methods=['GET'])
def summarize():
    text = request.args.get('text', '')
    return classifier(text, max_length=100)[0]['summary_text']

@app.route('/generate/', methods=['GET'])
def generate(): 
    try:
        url = request.args.get('url', '')
        print(url)
        r = requests.get(url)
        f = io.BytesIO(r.content)
        reader = PdfReader(f)
        text = reader.pages[0].extract_text().split('\n')
        print(text)

        # Join the list elements into a single string
        text_string = '\n'.join(text)

        preprocessed_words = preprocess_text(text_string)
        text_rank_graph = build_text_rank_graph(preprocessed_words)
        text_rank_scores = nx.pagerank(text_rank_graph)
        print(text_rank_scores)
        return jsonify(text_rank_scores)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)
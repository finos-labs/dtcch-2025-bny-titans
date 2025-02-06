from flask import Flask, jsonify, request
from Util.TradeAnalyzer import TradeAnalyzer
from Sanctions.process_transactions import process_transactions, save_results_to_csv
from Sanctions.transaction_entity_extraction import get_sanction_entity_records
import os
import asyncio
import pandas as pd

app = Flask(__name__)
analyzer = TradeAnalyzer('Data/Trade_Activity_Broadridge_DTCC_subset.csv')
analyzer.load_data()

@app.route('/preprocess', methods=['GET'])
def preprocess():
    analyzer.preprocess()
    return jsonify({"message": "DATA PREPROCESSING DONE"})

@app.route('/analyze', methods=['GET'])
def analyze():
    analyzer.analyze()
    return jsonify({"message": "ANALYSIS DONE"})

@app.route('/explain_anomaly/<int:anomaly_id>', methods=['GET'])
def explain_anomaly(anomaly_id):
    response, prompt = analyzer.explain_anomaly(anomaly_id)
    return jsonify({"response": response, "prompt": prompt})

@app.route('/get_input_sheet', methods=['GET'])
def input_sheet():
    return jsonify({"input_sheet": analyzer.get_input_sheet_as_json()})

@app.route('/identify_anomalies', methods=['GET'])
def output_sheet():
    return jsonify({"output_sheet": analyzer.get_output_sheet_as_json()})

@app.route("/process-transactions/", methods=["POST"])
def process_transactions_api():
    temp_file_path = None
    output_file = "./Sanctions/processed_results.csv"
    try:
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        # If the user does not select a file, the browser submits an empty file without a filename
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the uploaded file to a temporary location
        temp_file_path = f"./Sanctions/{file.filename}"
        file.save(temp_file_path)

        # Process the transactions
        results = asyncio.run(process_transactions(temp_file_path))

        # Save the results to a CSV file (append mode)
        save_results_to_csv(results, output_file, append=True)

        # Return only the newly processed transactions as JSON
        return jsonify([result for result in results])

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary files
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.route("/sanction_entity_list/", methods=["GET"])
def sanction_entity_list():
    try:
        # Get the sanction entity records from the database
        records = asyncio.run(get_sanction_entity_records())
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/processed-records/", methods=["GET"])
def get_processed_records():
    output_file = "./Sanctions/processed_results.csv"
    try:
        if not os.path.exists(output_file):
            return jsonify({"error": "No processed records found"}), 404

        # Read the entire CSV file and return the content as JSON
        df = pd.read_csv(output_file)
        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

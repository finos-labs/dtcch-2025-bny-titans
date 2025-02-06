import pandas as pd
import asyncio
from Sanctions.transaction_entity_extraction import get_entities, get_sanctioned_matches, process_name, aggregate_decision

async def process_transaction(swift_input):
    parsed_data, entity_names_data = await get_entities(swift_input)
    print('parsed_data:', parsed_data)
    sanctioned_entities_data = await get_sanctioned_matches(entity_names_data)
    print('sanctioned_entities_data:', sanctioned_entities_data)
    llm_decisions_data, decisions = await process_name(sanctioned_entities_data, parsed_data)
    final_decision = aggregate_decision(decisions)
    return {
        "parsed_data": parsed_data,
        "entity_names_data": entity_names_data,
        "sanctioned_entities_data": sanctioned_entities_data,
        "llm_decisions_data": llm_decisions_data,
        "final_decision": final_decision
    }

async def process_transactions(file_path):
    df = pd.read_excel(file_path) if file_path.endswith('.xlsx') else pd.read_csv(file_path)
    results = []
    for index, row in df.iterrows():
        swift_message = row['swift_message']
        result = await process_transaction(swift_message)
        results.append(result)
    return results

def save_results_to_csv(results, output_file):
    rows = []
    print('results:', results)
    for result in results:
        row = {
            "swift_message": result['parsed_data'],
            "entity_names": result['entity_names_data'],
            "sanctioned_entities": result['sanctioned_entities_data'],
            "llm_decisions": result['llm_decisions_data'],
            "final_decision": result['final_decision'][0]['Aggregate result']
        }
        rows.append(row)
    df = pd.DataFrame(rows)
    df.to_csv(output_file, index=False)

if __name__ == "__main__":
    import sys
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    results = asyncio.run(process_transactions(input_file))
    save_results_to_csv(results, output_file)
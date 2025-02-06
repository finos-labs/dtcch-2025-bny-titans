import re
import asyncio
import json
import uuid
import os
from langchain import LLMChain, PromptTemplate
from langchain.llms import OpenAI
import jellyfish
from impala.dbapi import connect
from jellyfish import levenshtein_distance
from dotenv import load_dotenv
from fuzzywuzzy import fuzz

def get_props():
    props = dict(
        l.rstrip().split('=')
        for l in open("properties_path.properties") (placeholder)
        if not l.startswith("#"))
    return props

props = get_props()
username = props['IMPALA_USERNAME']
password = props['IMPALA_PASSWORD']
host = props['IMPALA_HOST']
port = props['IMPALA_PORT']
database = props['IMPALA_DATABASE']
agent_token = props['AGENT_TOKEN']

conn = connect(
    host=host,
    port=port,
    database=database,
    auth_mechanism="LDAP",
    user=username,
    password=password,
    use_ssl=True,
    kerberos_service_name="impala",
    krb_host="host" (placeholder)
)

def parse_mt103(message):
    # Split the message into blocks
    blocks = {}
    block_pattern = re.compile(r'\{(\d+):(.*?)\}(?=\{|$)', re.DOTALL)
    block_matches = block_pattern.finditer(message)
    for match in block_matches:
        block_number = match.group(1)
        block_content = match.group(2)
        blocks[block_number] = block_content.strip()
    
    # Parse Block 4
    transaction_details = {}
    if '4' in blocks:
        block4 = blocks['4']
        # Remove any trailing '-}' if present
        block4 = block4.rstrip('-}')
        # Split fields by line breaks, handling multi-line fields
        fields = re.split(r'(?=\r?:\d{2}[A-Z]?:)', block4, flags=re.DOTALL)
        for field in fields: 
            if field.strip():
                # Match the tag and content
                match = re.match(r':(\d{2}[A-Z]?):(.*)', field.strip(), re.DOTALL)
                if match:
                    tag = match.group(1)
                    content = match.group(2).strip()
                    transaction_details[tag] = content
    return transaction_details

async def call_agent_yoda(question, agent_id):
    max_retries = 3
    for retry_count in range(max_retries):
        try:
            llm = OpenAI(api_key=agent_token)
            prompt = PromptTemplate(template=question)
            chain = LLMChain(llm=llm, prompt=prompt)
            result = await asyncio.get_event_loop().run_in_executor(
                None, chain.run, str(question)
            )
            return result
        except Exception as e:
            print(f"Error calling entities extraction agent: {e}")
            if retry_count < max_retries - 1:
                await asyncio.sleep(0.1)
            else:
                return None

async def json_parser(message: str):
    if not message:
        print('No message to parse.')
        return None
    try:
        start = message.find('{')
        end = message.rfind('}') + 1
        json_str = message[start:end]
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print('JSON parsing error:', e)
        return None

async def phonetic_query_execution(name):
    try:
        conn = connect(
                host=host,
                port=port,
                database=database,
                auth_mechanism="LDAP",
                user=username,
                password=password,
                use_ssl=True,
                kerberos_service_name="impala",
                krb_host="host" (placeholder)
            )
        cur = conn.cursor()  
        query = f"SELECT sanctioned_entity, entity_type, country FROM sanctions_names_phonetic_indexed WHERE search_index = '{name}';"
        cur.execute(query)
        results = cur.fetchall()
        print('results for phonetic search', results)
        cur.close()
        return results
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return []

async def starting_char_query_execution(name):
    conn = connect(
                host=host,
                port=port,
                database=database,
                auth_mechanism="LDAP",
                user=username,
                password=password,
                use_ssl=True,
                kerberos_service_name="impala",
                krb_host="host" (placeholder)
            )
    cur = conn.cursor()  
    cur = conn.cursor()
    query = f"SELECT sanctioned_entity, entity_type, country FROM sanctions_names_starting_char_indexed WHERE search_index = '{name}';"
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return results

async def get_sanction_entity_records():
    conn = connect(
                host=host,
                port=port,
                database=database,
                auth_mechanism="LDAP",
                user=username,
                password=password,
                use_ssl=True,
                kerberos_service_name="impala",
                krb_host="host" (placeholder)
            )
    cur = conn.cursor()
    query = "SELECT sanctioned_entity, entity_type, country FROM sanctions_names_starting_char_indexed WHERE entity_type in ('company', 'other');"
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    
    # Convert results to a list of dictionaries
    records = [
        {
            'sanctioned_entity': row[0],
            'entity_type': row[1],
            'country': row[2]
        }
        for row in results
    ]
    return records

async def get_phonetic_match(name):
    phonetic_code = jellyfish.soundex(name)
    phonetic_matches = await phonetic_query_execution(phonetic_code)
    filtered_matches = [
        match for match in phonetic_matches
        if fuzz.partial_ratio(name, match[0]) >= 75 and levenshtein_distance(name, match[0]) <= 4
    ]
    return filtered_matches
 
async def get_starting_char_match(name):
    starting_char_code = name[0].lower()
    starting_char_matches = await starting_char_query_execution(starting_char_code)
    filtered_matches = [
        match for match in starting_char_matches
        if fuzz.partial_ratio(name, match[0]) >= 85 and levenshtein_distance(name, match[0]) <= 4
    ]
    return filtered_matches

async def get_agent_id(entity_type):
    agent_ids = {
    'default_agent_id': 'default', (placeholder)
    'individual': 'individual_agent_id', (placeholder)
    'company': 'company_agent_id', (placeholder)
    'other': 'other_agent_id', (placeholder)
    'vessel': 'vessel_agent_id', (placeholder)
    }
    return agent_ids.get(entity_type, 'agent_id_for_default')

async def get_entities(swift_message):
    parsed_data = parse_mt103(swift_message)
    agent_id = await get_agent_id("default_agent_id")
    agent_response = await call_agent_yoda(parsed_data, agent_id)
    agent_response = await json_parser(agent_response)
    all_names = agent_response['entity_names'] + agent_response['securities_assets']
    if 'payment_destination_country' in agent_response:
        all_names.append(agent_response['payment_destination_country'])
    print('all_names:', all_names)
    return parsed_data, all_names

async def get_sanctioned_matches(all_names):
    name_matches = {}
    for name in all_names:
        name = name.lower()
        phonetic_matches = await get_phonetic_match(name)
        starting_char_matches = await get_starting_char_match(name)
        all_matches = phonetic_matches + starting_char_matches
        # Remove duplicates from all_matches
        all_matches = list(set(all_matches))
        name_matches[name] = all_matches
    return name_matches

async def process_name(name_matches, parsed_data):
    all_results = []
    decisions = {}
    for name, all_matches in name_matches.items():
        if not all_matches:
            decisions[name] = ["RELEASE"]
            all_results.append({
                'name': name,
                'sanctioned_entity': None,
                'result': "RELEASE",
                'decision_making_process': "No sanctioned entity matches found.",
                'reason_code': "NO_MATCH"
            })
        else:
            decisions[name] = []
            for match in all_matches:
                sanctioned_entity, entity_type, _ = match
                if entity_type == 'company' or entity_type == 'other':
                    agent_id = await get_agent_id(entity_type)
                    decision_response = await call_agent_yoda({
                        'sanctioned_entity': sanctioned_entity,
                        'transaction_data': parsed_data,
                        'potential_sanctioned_entity': name
                    }, agent_id)
                    decision = await json_parser(decision_response)
                    if decision and 'result' in decision:
                        decisions[name].append(decision['result'])
                        all_results.append({
                            'name': name,
                            'sanctioned_entity': sanctioned_entity,
                            'result': decision['result'],
                            'decision_making_process': decision['decision_making_process'],
                            'reason_code': decision['code']
                        })
    return all_results, decisions

def aggregate_decision(decisions):
    all_decisions = [decision for decision_list in decisions.values() for decision in decision_list]
    final_decision = 'HOLD' if 'HOLD' in all_decisions else 'RELEASE'
    return [{'Aggregate result' : final_decision}]

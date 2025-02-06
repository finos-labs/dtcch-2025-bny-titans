export const sanction_data = [
  {
    "swift_message": "{'20': '1234567890', '23B': 'CRED', '32A': '231019EUR12345,67', '33B': 'EUR12345,67', '50K': '/123456789\\nJOHN DOE\\n123 MAIN STREET\\nANYTOWN US', '59': '/987654321\\nrosneft\\n456 HIGH STREET\\nOTHERTOWN MYANMAR', '71A': 'OUR'}",
    "entity_names": "['JOHN DOE', 'rosneft', 'Myanmar']",
    "sanctioned_entities": "{'john doe': [], 'rosneft': [('rosneft', 'company', '? NULL')], 'myanmar': [('myanmar', 'other', 'MYANMAR')]}",
    "llm_decisions": "[{'name': 'john doe', 'sanctioned_entity': None, 'result': 'RELEASE', 'decision_making_process': 'No sanctioned entity matches found.', 'reason_code': 'NO_MATCH'}, {'name': 'rosneft', 'sanctioned_entity': 'rosneft', 'result': 'HOLD', 'decision_making_process': \"The transaction entity 'rosneft' matches the sanctioned entity 'rosneft'. After removing common terms and legal structures, the core names are identical. According to the Name Matching rule, if the core names of both entities exactly match, the transaction should be held regardless of any other differences.\", 'reason_code': 'NAME_OR_KEYWORD_MATCH'}, {'name': 'myanmar', 'sanctioned_entity': 'myanmar', 'result': 'HOLD', 'decision_making_process': \"The sanctioned entity is 'myanmar', which is a location. According to the LOCATION_SCREENING rule, if a sanctioned location is mentioned in the transaction, the transaction should be HOLD. In this case, the transaction details include the address '456 HIGH STREET, OTHERTOWN MYANMAR', which directly mentions the sanctioned location 'MYANMAR'. Therefore, the transaction should be HOLD.\", 'reason_code': 'SANCTIONED_GEO/LOCATION_MATCH'}]",
    "final_decision": "HOLD"
  },
  {
    "swift_message": "{'16R': 'SETPRTY', '20C': ':RELA//PSS2002041111111', '23G': 'CAST', '98E': ':PREP//20200204100000,0/N05', '16S': 'SETTRAN', '25D': ':CPRC//CAND', '24B': ':CAND//CANI', '35B': 'ISIN USP1000P111\\nXXX united shipbuilding corporation  4.05 20APR20', '36B': ':SETT//FAMT/3070000,', '19A': ':SETT//USD3039300,', '97A': ':SAFE//734826', '22F': ':SETR//TRAD', '22H': ':PAYM//APMT', '98A': ':TRAD//20200124', '95R': ':REAG/DTCYID/TENDER'}",
    "entity_names": "['united shipbuilding corporation', 'USP1000P111', 'United States']",
    "sanctioned_entities": "{'united shipbuilding corporation': [('united shipbuilding corporation', 'company', '? NULL')], 'usp1000p111': [], 'united states': []}",
    "llm_decisions": "[{'name': 'united shipbuilding corporation', 'sanctioned_entity': 'united shipbuilding corporation', 'result': 'HOLD', 'decision_making_process': \"Both the transaction entity and the sanctioned entity are companies. Applying the name matching rule, we extract the core names by removing common terms. While 'United' and 'Shipbuilding' can be generic descriptors, in this context they form the core company name. The core names of both entities are 'United Shipbuilding', which exactly match. Therefore, according to the decision rules, the transaction should be HELD.\", 'reason_code': 'NAME_OR_KEYWORD_MATCH'}, {'name': 'usp1000p111', 'sanctioned_entity': None, 'result': 'RELEASE', 'decision_making_process': 'No sanctioned entity matches found.', 'reason_code': 'NO_MATCH'}, {'name': 'united states', 'sanctioned_entity': None, 'result': 'RELEASE', 'decision_making_process': 'No sanctioned entity matches found.', 'reason_code': 'NO_MATCH'}]",
    "final_decision": "HOLD"
  }
];
export const sanction_entity_data = [
  {
    "sanctioned_entity": "melendez rivas, carmen teresa",
    "entity_type": "individual",
    "country": "NULL"
  },
  {
    "sanctioned_entity": "al-freij, fahd",
    "entity_type": "individual",
    "country": "NULL"
  },
  {
    "sanctioned_entity": "punti, pere",
    "entity_type": "individual",
    "country": "NULL"
  }
];
export enum SanctionsSource {
  SANCTION_ENTITY = 'Sanctions Entity',
  SANCTION_SCREENING = 'Sanctions Screening',
}
export interface SanctionEntityRow {
    sanctioned_entity: string;
    entity_type: boolean;
    country: number;
}
export interface SanctionScreenRow {
    swift_message: object;
    final_decision: boolean;
}
from langchain import LLMChain, PromptTemplate
from langchain.llms import OpenAI

def get_props():
    props = dict(
        l.rstrip().split('=')
        for l in open("properties_path.properties") (placeholder)
        if not l.startswith("#"))
    return props

props = get_props()
agent_token = props['AGENT_TOKEN']

def get_response_from_llm(question):
    llm = OpenAI(api_key=agent_token)
    prompt = PromptTemplate(template=question)
    chain = LLMChain(llm=llm, prompt=prompt)
    response = chain.run(question)
    return response
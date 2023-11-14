
from langchain.document_loaders import TextLoader
import textwrap
from langchain.text_splitter import CharacterTextSplitter
import os
from langchain.embeddings import OpenAIEmbeddings,HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
import pickle
from langchain.chains import RetrievalQAWithSourcesChain,ConversationalRetrievalChain
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.llms import HuggingFaceHub



#openai_api='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'
os.environ['HUGGINGFACEHUB_API_TOKEN']='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'
#os.environ['OPENAI_API_KEY']="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"

def chat_bot(question):
    question=question
    os.environ['HUGGINGFACEHUB_API_TOKEN']='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'

    loader=TextLoader("data.txt") 
    text=loader.load()

    textsplitter=CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks=textsplitter.split_text(str(text))


    # embedding=OpenAIEmbeddings()
    embedding=HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-base")
    vector_store=FAISS.from_texts(texts=chunks,embedding=embedding)
    llm=HuggingFaceHub(repo_id="google/flan-t5-base")
    memory=ConversationBufferMemory(memory_key='chat_history',return_messages=True)
    conversation=ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(),
        memory=memory
    )
    response=conversation({'question':question})
    print("\n")
    print("me :::::::" ,response['question'])
    print("\n")
    print( 'Bot ::::' , response['answer'])
    

if __name__ == '__main__':
    chat_bot('tell me about india')
    
    
    
    
    
    
    

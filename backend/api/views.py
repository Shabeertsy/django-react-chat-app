from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.utils import timezone
from .models import Course,UserRating,User
from .serializers import CourseSerializer
import json


## ML ##
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np



@api_view(['POST'])
def create_course(request):
    if request.method == 'POST':
        all_data = json.loads(request.data.get('courses'))
        for data in all_data:
            serializer = CourseSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
        return Response('courses added successfully', status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


## content based recommedation system ##
@api_view(['GET'])
def content_recommendations(request):
    course_name=request.GET.get('name')
    data = pd.DataFrame(Course.objects.all().values('title', 'description','price','tags'))
    data['new_tags']=data['description']+" "+data['tags']
    new_data=data.drop(columns=['description','tags'])

    tfidf_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    vector = tfidf_vectorizer.fit_transform(new_data['new_tags']).toarray()
    print('vec',vector)

    similiarity=cosine_similarity(vector)
    my_course_id=new_data[new_data['title']==course_name].index[0]
    distance=sorted(list(enumerate(similiarity[my_course_id])),reverse=True,key=lambda vector:vector[1])

    recommended_course=[]
    for i in distance[0:5]:
        name=new_data.iloc[i[0]].title
        recommended_course.append(name)
    return Response({'recommendations':recommended_course,'sm':similiarity})




# @api_view(['GET'])
# def collaborative_recommendations(request, user_id):
#     course_name=request.GET.get('name')
#     data = pd.DataFrame(UserRating.objects.all().values('user', 'course__title', 'rating', 'review'))
#     grouped_df=data.groupby('user').count()['rating']>1
#     greater_users=grouped_df[grouped_df].index

#     rating_with_name=data[data['user'].isin(greater_users)]
#     pivot_table = rating_with_name.pivot_table(index='course__title', columns='user', values='rating').fillna(0)
#     similiarity_score=cosine_similarity(pivot_table)
    
#     index=np.where(pivot_table.index==course_name)[0][0]
#     all_list=sorted(list(enumerate(similiarity_score[index])), key=lambda x:x[1], reverse=True )[1:6]

#     recomended=[]
#     for i in all_list:
#         course=pivot_table.index[i[0]]
#         recomended.append(course)

#     return Response({'similar_courses': recomended})



@api_view(['GET'])
def collaborative_recommendations(request, user_id):
    data = pd.DataFrame(UserRating.objects.all().values('user', 'course__title', 'rating', 'review'))
    pivot_table = data.pivot_table(index='user', columns='course__title', values='rating', fill_value=0)
    user_similarity = cosine_similarity(pivot_table)

    user_index = pivot_table.index.get_loc(user_id)
    user_similarity_scores = list(enumerate(user_similarity[user_index]))
    user_similarity_scores = sorted(user_similarity_scores, key=lambda x: x[1], reverse=True)[1:]

    print('user',user_similarity_scores)
    top_similar_users = user_similarity_scores[:5]

    similar_users = []
    for user_index, _ in top_similar_users:
        similar_user_id = pivot_table.index[user_index] 
        similar_users.append({'user':similar_user_id,'index':user_index})

    print('Similar Users:', similar_users)

    recommended_courses = []
    for user_index, similarity_score in top_similar_users:
        unrated_courses = pivot_table.columns[pivot_table.loc[user_id] == 0]
        try:
            rated_by_similar_users = pivot_table.iloc[user_index][unrated_courses]
            print(rated_by_similar_users)
            for course in rated_by_similar_users[rated_by_similar_users > 0].index:
                if course not in recommended_courses:
                    recommended_courses.append(course)
        except:
            continue
        
    return Response({'recommended_courses': recommended_courses,})





### chatbot ###
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
import os
from langchain.embeddings import OpenAIEmbeddings,HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQAWithSourcesChain,ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI


# openai_api='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'
# # os.environ['HUGGINGFACEHUB_API_TOKEN']='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'
# os.environ['OPENAI_API_KEY']="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"


# @api_view(["POST"])
# def chat_bot(request):

#     question=request.GET.get('question')
#     loader=TextLoader("data.txt") 
#     text=loader.load()

#     textsplitter=CharacterTextSplitter(
#         separator="\n",
#         chunk_size=1000,
#         chunk_overlap=200,
#         length_function=len,
#     )
#     chunks=textsplitter.split_text(str(text))


#     # embedding=OpenAIEmbeddings()
#     embedding=HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-base")
#     vector_store=FAISS.from_text(texts=chunks,embedding=embedding)
#     llm=ChatOpenAI()
#     memory=ConversationBufferMemory(memory_key='chat_history',return_messages=True)
#     conversation=ConversationalRetrievalChain.from_llm(
#         llm=llm,
#         retriever=vector_store.as_retriver(),
#         memory=memory
#     )
#     print(conversation({'question':question}))

#     return Response('hii', status=status.HTTP_200_OK)


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
import random
import json

import torch

from .model import NeuralNet
from .nltk_utils import bag_of_words, tokenize


# #openai_api='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'
# #os.environ['OPENAI_API_KEY']="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"
# @api_view(["GET"])
# def chat_bot(request):
#     question='what is jsx'
#     os.environ['HUGGINGFACEHUB_API_TOKEN']='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'

#     loader=TextLoader("data.txt") 
#     text=loader.load()

#     textsplitter=CharacterTextSplitter(
#         separator="\n",
#         chunk_size=1000,
#         chunk_overlap=200,
#         length_function=len,
#     )
#     chunks=textsplitter.split_text(str(text))


#     # embedding=OpenAIEmbeddings()
#     embedding=HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-base")
#     vector_store=FAISS.from_texts(texts=chunks,embedding=embedding)
#     llm=HuggingFaceHub(repo_id="google/flan-t5-base")
#     memory=ConversationBufferMemory(memory_key='chat_history',return_messages=True)
#     conversation=ConversationalRetrievalChain.from_llm(
#         llm=llm,
#         retriever=vector_store.as_retriever(),
#         memory=memory
#     )
#     print(conversation({'question':question}))
    # response = conversation.generate_response(question)
    # print(response)






@api_view(["POST"])
def chat_bot(request):
    question=request.data.get('que')


    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    with open('intents.json', 'r') as json_data:
        intents = json.load(json_data)

    FILE = "data.pth"
    data = torch.load(FILE)

    input_size = data["input_size"]
    hidden_size = data["hidden_size"]
    output_size = data["output_size"]
    all_words = data['all_words']
    tags = data['tags']
    model_state = data["model_state"]

    model = NeuralNet(input_size, hidden_size, output_size).to(device)
    model.load_state_dict(model_state)
    model.eval()

    bot_name = "Bot"
    # sentence = "do you use credit cards?"
    sentence = f"You:{question} "

    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                res=f"{bot_name}: {random.choice(intent['responses'])}"
    else:
        res=f"{bot_name}: I do not understand..."
    return Response ({'res':res})
    



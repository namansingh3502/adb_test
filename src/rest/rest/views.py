import json
import os

from bson import ObjectId
from pymongo import MongoClient
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import TaskForm

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]

db = MongoClient(mongo_uri)['adb_test_db']
collection = db['todo_items']  # Specify the collection name


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class TodoListView(APIView):

    def get(self, request):
        try:
            todo_items = list(collection.find())  # Fetch all todo items
            print("todo_items : ", todo_items)
            return Response({"tasks": JSONEncoder().encode(todo_items)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        task_form = TaskForm(request.data)

        if task_form.is_valid():
            try:
                collection.insert_one(task_form.cleaned_data)
                todo_items = list(collection.find())
                return Response({"tasks": JSONEncoder().encode(todo_items)}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": task_form.errors}, status=status.HTTP_400_BAD_REQUEST)

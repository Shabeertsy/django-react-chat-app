from django.shortcuts import render,redirect
from .models import Task,QuestionsCompleted
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse



def index(request):
    return render(request,'table.html')


### task section ####
def add_task(request):
    if request.method == 'POST':
        print('aaa',request.POST)
        Task.objects.create(
            chapter_name=request.POST.get('chapter_name'),
            unit=request.POST.get('uniit'),
            comments=request.POST.get('comments'),
            section=request.POST.get('section'),
            due_date=request.POST.get('due_date'),
        )
    return redirect('dashboard')



def get_tasks(request):
    # Prepare empty structure
    data = {
        "classes": {sec: [] for sec in ['A', 'B', 'C', 'D', 'E', 'F']},
        "questions": {sec: [] for sec in ['A', 'B', 'C', 'D', 'E', 'F']},
    }

    # Populate "classes" from Task model
    tasks = Task.objects.all().order_by('due_date')
    for task in tasks:
        if task.section in data["classes"]:
            data["classes"][task.section].append([
                task.unit or "",
                task.chapter_name or "",
                task.comments or "",
                task.due_date.strftime("%Y-%m-%d") if task.due_date else "",
                "Completed" if task.is_completed else "Pending"
            ])

    questions = QuestionsCompleted.objects.all().order_by('due_date')
    for q in questions:
        if q.section in data["questions"]:
            data["questions"][q.section].append([
                f"{q.unit} Unit",
                f"{q.number_of_questions} ",
                f"{q.number_of_essay_questions} ",
                q.due_date.strftime("%Y-%m-%d") if q.due_date else "",
                f"{q.number_of_questions_completed} ",
                f"{q.number_of_essay_questions_completed} ",
                f"{q.number_of_questions - q.number_of_questions_completed} " if q.number_of_questions !=0 else 0,
                f"{q.number_of_essay_questions - q.number_of_essay_questions_completed} " if q.number_of_essay_questions !=0 else 0,
            ])

    return JsonResponse(data)


### Qusestion  section ###

def add_questions(request):
    if request.method == 'POST':
        data=request.POST
        QuestionsCompleted.objects.create(
            due_date=data.get('due_date'),
            section=data.get('section'),
            number_of_essay_questions=data.get('number_of_essay_questions',0),
            number_of_questions=data.get('number_of_quesions',0),
        )
    return redirect('dashboard')

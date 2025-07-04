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
            chapter_name=request.POST.get('chapter'),
            unit=request.POST.get('unit'),
            comments=request.POST.get('comments'),
            section=request.POST.get('section'),
            due_date=request.POST.get('due_date'),
        )
        print('due_date',request.POST.get('due_date'))
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
                "Completed" if task.is_completed else "Pending",
                f"{task.id} ",
            ])

    questions = QuestionsCompleted.objects.all().order_by('due_date')
    for q in questions:
        if q.section in data["questions"]:
            data["questions"][q.section].append([
                f"{q.unit}",
                f"{q.number_of_questions} ",
                f"{q.number_of_essay_questions} ",
                q.due_date.strftime("%Y-%m-%d") if q.due_date else "",
                f"{q.number_of_questions_completed} ",
                f"{q.number_of_essay_questions_completed} ",
                f"{q.number_of_questions - q.number_of_questions_completed} " if q.number_of_questions !=0 else 0,
                f"{q.number_of_essay_questions - q.number_of_essay_questions_completed} " if q.number_of_essay_questions !=0 else 0,
                f"{q.id} ",

            ])

    print(data,'data')
    return JsonResponse(data)


### Qusestion  section ###

def add_questions(request):
    if request.method == 'POST':
        data=request.POST
        QuestionsCompleted.objects.create(
            due_date=data.get('due_date'),
            unit=data.get('unit'),
            section=data.get('section'),
            number_of_essay_questions=data.get('number_of_essay_questions',0),
            number_of_questions=data.get('number_of_questions',0),
        )
    return redirect('dashboard')


from django.shortcuts import  get_object_or_404
from django.http import JsonResponse

def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return JsonResponse({'success': True})

def delete_question(request, question_id):
    print('qqqqq',question_id)
    question = get_object_or_404(QuestionsCompleted, id=question_id)
    question.delete()
    return JsonResponse({'success': True})



def mark_task_completed(request, pk):
    try:
        task = Task.objects.get(pk=pk)
        task.is_completed = True if not task.is_completed else False  # Toggle completion status
        task.save()
        return JsonResponse({'success': True,'status': 'Completed' if task.is_completed else 'Pending'})
    except Task.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Task not found'})




def update_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        task.unit = request.POST.get('unit')
        task.chapter = request.POST.get('chapter')
        task.comments = request.POST.get('comments')
        task.due_date = request.POST.get('due_date')
        task.section = request.POST.get('section')
        task.class_name = request.POST.get('class_name')
        task.save()
        return redirect('dashboard')
    return redirect('dashboard')


def update_question_progress(request, pk):
    question = get_object_or_404(QuestionsCompleted, pk=pk)
    if request.method == 'POST':
        questions= request.POST.get('questions_completed', 0)
        questions=0 if questions == '' else questions
        essay_questions = request.POST.get('essay_completed', 0)
        essay_questions=0 if essay_questions == '' else essay_questions
        question.number_of_essay_questions_completed = question.number_of_essay_questions_completed + int(essay_questions)
        question.number_of_questions_completed = question.number_of_questions_completed + int(questions)
        question.save()
        return redirect('dashboard')
    return redirect('dashboard')
    



from django.http import JsonResponse
from .models import Task
import json
from datetime import datetime

@csrf_exempt
def bulk_add_tasks(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            for item in data:
                Task.objects.create(
                    unit=item.get("unit"),
                    chapter_name=item.get("chapter"),
                    comments=item.get("comments"),
                    section=item.get("section"),
                    due_date=item.get("due_date")
                )
            return JsonResponse({"success": True, "message": "Tasks added successfully."})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "message": "Only POST method allowed."})

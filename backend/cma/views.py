from django.shortcuts import render,redirect
from .models import Task,QuestionsCompleted, Notes
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.template.loader import get_template
from weasyprint import HTML


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')


@login_required
def index(request):
    classes_queryset = Task.objects.all().order_by('due_date')
    questions_queryset = QuestionsCompleted.objects.all().order_by('due_date')

    total_classes = classes_queryset.count()
    total_questions = 0
    completed_questions = 0
    completed_classes = Task.objects.filter(is_completed=True).count()

    classes = { sec: 0 for sec in "ABCDEF" }
    questions = { sec: 0 for sec in "ABCDEF" }

    for c in classes_queryset:
        classes[c.section] = Task.objects.filter(is_completed=True, section=c.section).count()

    for q in questions_queryset:
        total_questions += 1
        que_items = QuestionsCompleted.objects.filter(section=q.section)
        num_que = 0
        flag = True

        for qu in que_items:
            num_que += qu.number_of_questions_completed
            if qu.number_of_questions != qu.number_of_questions_completed or qu.number_of_essay_questions != qu.number_of_essay_questions_completed:
                flag = False
        if flag:
            completed_questions += 1
        questions[q.section] = num_que


    total_items = total_classes + total_questions
    completed_items = completed_classes + completed_questions
    if total_items > 0:
        progress_percent = int((completed_items / total_items) * 100)
    else:
        progress_percent = 0

    print(progress_percent)

    return render(request, 'table.html', {
        'dummy_classes': classes,
        'dummy_questions': questions,
        'progress_percent': progress_percent,
    })




def notes(request, chapter_id):
    chapter = get_object_or_404(Task, id=chapter_id)

    # Try to get the note for this chapter
    note, created = Notes.objects.get_or_create(chapter=chapter)

    if request.method == 'POST':
        content = request.POST.get('content')
        note.text = content
        note.save()
        return redirect('notes', chapter_id=chapter.id)

    context = {
        'note': note,
        'chapter': chapter,
    }
    return render(request, 'notes.html', context)


def read_notes(request, chapter_id):
    chapter = get_object_or_404(Task, id=chapter_id)

    note = Notes.objects.filter(chapter=chapter).first()

    if not note:
        return render(request, 'read_notes.html', {'error': 'No notes found for this chapter.'})

    context = {
        'note': note,
        'chapter': chapter,
    }
    return render(request, 'read.html', context)



def download_notes_pdf(request, chapter_id):
    chapter = Task.objects.get(id=chapter_id)
    note = Notes.objects.filter(chapter=chapter).first()

    # 2. Render the HTML template
    template = get_template('notes_pdf.html')
    html_string = template.render({'chapter': chapter, 'note': note})

    # 3. Generate PDF
    pdf_file = HTML(string=html_string).write_pdf()

    # 4. Return as response
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Notes_{chapter.unit}.pdf"'
    return response




### task section ####
def add_task(request):
    if request.method == 'POST':
        Task.objects.create(
            chapter_name=request.POST.get('chapter'),
            unit=request.POST.get('unit'),
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
                "Completed" if (q.number_of_questions == q.number_of_questions_completed and q.number_of_essay_questions == q.number_of_essay_questions_completed) else "Pending",
                f"{q.id} ",

            ])

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



@csrf_exempt
def generate_questions_from_tasks(request):
    try:
        tasks = Task.objects.all()
        created_count = 0

        for task in tasks:
            # Check if a QuestionsCompleted already exists for this unit + section
            exists = QuestionsCompleted.objects.filter(
                unit=task.unit,
                section=task.section
            ).exists()

            if not exists:
                QuestionsCompleted.objects.create(
                    unit=task.unit,
                    section=task.section,
                    due_date=task.due_date,
                    number_of_questions=150,   # ← customize default values
                    number_of_questions_completed=0,
                    number_of_essay_questions=5,
                    number_of_essay_questions_completed=0
                )
                created_count += 1

        return JsonResponse({
            "success": True,
            "message": f"{created_count} QuestionsCompleted objects created."
        })

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})

# views.py

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv('OPENAI_API_KEY',''),
)

def get_answer(question):
        chapter=None
        print('questionj,',question)
        try:
            text_content = 'cma related data'
            if chapter:
                prompt = f"""
You are an expert CMA USA study assistant bot with a friendly, casual tone.

• If the user says hi or greets you, greet them back in a friendly, casual way.
• If the user asks for advice or tips, give practical, short, clear answers.
• If the user asks for CMA USA sample questions, ALWAYS provide at least 3 actual sample questions with proper CMA USA context (Part 1 or Part 2) — include question + options if possible.
• The student’s exam is on October 27, 2025.

 answer only based on this question Question: {question} if user give simple messages like hi ,hello or greetings responsds in a friendly, casual way
     if question containes word chapter ask chapter id to user
Only provide the answer — do not repeat the question.
"""

            else:
                prompt = f"""
You are an expert CMA USA study assistant bot with a friendly, casual tone.

• Base your answer on this CMA USA content: {text_content}
• If the user greets casually, reply casually like a study buddy.
• If the user asks about anything related to CMA USA — syllabus, tips, strategy — answer directly and practically.
• Use simple language.
• The student’s exam is on October 27, 2025.

 answer only based on this question Question: {question}

Only provide the answer — do not reflect the question.
"""

            # Call OpenRouter with your specified model
            messages = [
                {"role": "system", "content": "You are a helpful assistant."}]

            messages.append({"role": "user", "content": prompt})


            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": "https://your-site.com",   # Replace!
                    "X-Title": "Your Site Name",               # Replace!
                },
                model="deepseek/deepseek-r1-0528:free",
                messages=messages
            )

            answer = completion.choices[0].message.content.strip()
            print(answer,'answer')
            return {'response': answer}
        except:
            return False



def chatbot(request):
    if request.method == 'POST':
        data = json.loads(request.body) 
        user_message = data.get('message') 

        res=get_answer(user_message)
        print(res,'asdfadsf')
        if not res == False:
            return JsonResponse(res)
        else:
            return JsonResponse({'response': 'your bot is not available now '})

    return render(request, 'chatbot.html')

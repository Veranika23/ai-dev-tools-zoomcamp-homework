from django.shortcuts import render, redirect
from .models import Todo
from .forms import TodoForm 

def home(request):
    todos = Todo.objects.all()
    return render(request, 'home.html', {'todos': todos})


def todo_create(request):
    if request.method == 'POST':
        form = TodoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = TodoForm()
    return render(request, 'todo_form.html', {'form': form})


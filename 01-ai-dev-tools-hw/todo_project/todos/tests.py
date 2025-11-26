from django.test import TestCase
from .models import Todo
from django.urls import reverse

class TodoModelTest(TestCase):
    def test_create_todo_with_all_fields(self):
        todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date="2025-12-31 23:59",
            resolved=True
        )
        self.assertEqual(todo.title, "Test TODO")
        self.assertEqual(todo.description, "Test description")
        self.assertTrue(todo.resolved)

    def test_create_todo_with_required_fields(self):
        todo = Todo.objects.create(title="Only Title")
        self.assertEqual(todo.title, "Only Title")
        self.assertFalse(todo.resolved)

    def test_mark_todo_as_resolved(self):
        todo = Todo.objects.create(title="To Resolve")
        todo.resolved = True
        todo.save()
        self.assertTrue(Todo.objects.get(id=todo.id).resolved)

    def test_str_representation(self):
        todo = Todo.objects.create(title="String Test")
        self.assertEqual(str(todo), "String Test")

class TodoViewTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(title="View Test")

    def test_home_page_lists_todos(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "View Test")
        self.assertTemplateUsed(response, "home.html")

    def test_create_todo_via_form(self):
        response = self.client.post(reverse('todo_create'), {
            'title': 'Form TODO',
            'description': 'Form description',
            'due_date': '2025-12-31 23:59',
            'resolved': False
        })
        self.assertEqual(response.status_code, 302)  # Redirect after creation
        self.assertTrue(Todo.objects.filter(title='Form TODO').exists())

    def test_create_todo_invalid_form(self):
        response = self.client.post(reverse('todo_create'), {
            'description': 'No title'
        })
        self.assertEqual(response.status_code, 200)
        form = response.context['form']
        self.assertTrue(form.errors)
        self.assertIn('title', form.errors)
        self.assertIn('This field is required.', form.errors['title'])

    def test_home_url_resolves(self):
        url = reverse('home')
        self.assertEqual(url, '/')

    def test_add_url_resolves(self):
        url = reverse('todo_create')
        self.assertEqual(url, '/add/')

from django.template.loader import render_to_string

class TemplateTest(TestCase):
    def test_home_extends_base(self):
        response = self.client.get(reverse('home'))
        self.assertTemplateUsed(response, "base.html")
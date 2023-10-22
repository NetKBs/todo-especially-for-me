import * as controller from "./controller.js"

//Observer
export const todoList = {
    todos: [],

    render: function() {

        const todoListContainer = document.getElementById('todo-list');
        todoListContainer.innerHTML = '';
        const fragment = document.createDocumentFragment()

        this.todos.forEach((todo, index) => {

            const todoContainer = document.createElement('div');
            todoContainer.classList.add('list-group-item');

            const div_todo_right_items = document.createElement('div');
            const div_todo_left_items = document.createElement('div');
            div_todo_left_items.classList.add('div-todo-left-items');

            if (todo.isEditing === true) {
                todoContainer.classList.add('my-2');

                const newTextbox = document.createElement('input');
                newTextbox.type = 'text';
                newTextbox.value = todo.title;
                newTextbox.dataset.todoId = todo.id;
                newTextbox.classList.add('form-control');
                todoContainer.appendChild(newTextbox);

                const newDatePicker = document.createElement('input');
                newDatePicker.type = 'date';
                newDatePicker.value = todo.dueDate;
                newDatePicker.dataset.todoId = todo.id;
                newTextbox.classList.add('form-control');
                todoContainer.appendChild(newDatePicker);

                const updateButton = document.createElement('button');
                updateButton.innerText = 'Update';
                updateButton.classList.add('btn', 'my-1', 'btn-sm', 'btn-outline-success');
                updateButton.dataset.todoId = todo.id;
                updateButton.onclick = event => controller.onUpdate(index, event);
                todoContainer.appendChild(updateButton);

                const description = document.createElement('textarea');
                description.innerText = todo.description;
                description.classList.add('todo-description');
                description.dataset.todoId = todo.id;
                description.placeholder = 'More about...';
                description.classList.add('col-12');
                todoContainer.appendChild(description);

            } else {

                const dueDate_text = todo.dueDate == "" ? "" : `<span class="dueDate">${todo.dueDate}</span>`;
                const title_text = todo.isDone === true ? `<span class="text-decoration-line-through">${todo.title}</span>` : todo.title;

                const titleContent = document.createElement('p');
                titleContent.innerHTML = `<span class="task-title-text">${title_text} ${dueDate_text}</span>`;
                titleContent.addEventListener('click', () => controller.descriptionDisplayState(index));
                div_todo_left_items.appendChild(titleContent);

                if (!todo.isDone) {
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.classList.add('btn', 'edit-btn', 'btn-sm', 'btn-outline-info');
                    editButton.onclick = () => controller.editState(index);
                    div_todo_right_items.appendChild(editButton);
                }

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => controller.onDelete(todo);
                deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
                div_todo_right_items.appendChild(deleteButton);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('checkbox-todo', 'form-check-input');
                checkbox.onchange = event => controller.checkboxState(index, event);

                if (todo.isDone === true) checkbox.checked = true;
                
                div_todo_left_items.prepend(checkbox);

                const description = document.createElement('textarea');
                description.innerText = todo.description;
                description.placeholder = 'More about...';
                description.disabled = true;
                description.classList.add('col-12', 'todo-description');

                if (!todo.shownDescription) description.classList.add('hidden-description');

                todoContainer.appendChild(div_todo_left_items);
                todoContainer.appendChild(div_todo_right_items);
                todoContainer.appendChild(description);
            }

            fragment.appendChild(todoContainer);

        });
        
        todoListContainer.appendChild(fragment)
    },

}

// Initialize
const savedTodos = JSON.parse(localStorage.getItem('todos'));

if (Array.isArray(savedTodos)) {
    todoList.todos = savedTodos;
} else {
    todoList.todos = [];
}

todoList.render(); 

document.getElementById('btn-add').addEventListener('click', controller.addTodo);
document.getElementById('todo-title').addEventListener('animationend', event => event.target.classList.remove('warning'));
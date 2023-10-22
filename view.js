import * as controller from "./controller.js"

//Observer
export const todoList = {
    todos: [],

    render: function() {

        const todoListContainer = document.getElementById('todo-list');
        const fragment = document.createDocumentFragment()

        todoListContainer.innerHTML = '';

        this.todos.forEach((todo, index) => {

            const todoContainer = document.createElement('div');
            todoContainer.classList.add('list-group-item');

            const div_todo_right_items = document.createElement('div');
            const div_todo_left_items = document.createElement('div');
            div_todo_left_items.classList.add('div-todo-left-items');

            if (todo.isEditing === true) {
                todoContainer.classList.add('my-2');

                const newTextbox = document.createElement('input');
                const newDatePicker = document.createElement('input');
                const updateButton = document.createElement('button');
                const description = document.createElement('textarea');

                Object.assign(newTextbox, {
                    type: "text",
                    value: todo.title,
                    classList: 'form-control',
                })
                newTextbox.dataset.todoId = todo.id;

                Object.assign(newDatePicker, {
                    type: "date",
                    value: todo.dueDate,
                })
                newDatePicker.dataset.todoId = todo.id;

                Object.assign(updateButton, {
                    innerText: "Update",
                    classList: "btn my-1 btn-sm btn-outline-success", 
                    onclick:  event => controller.onUpdate(index, event),
                })
                updateButton.dataset.todoId = todo.id;

                Object.assign(description, {
                    innerText: todo.description,
                    placeholder: "More about...",
                    classList: "todo-description col-12",
                })
                description.dataset.todoId = todo.id;

                todoContainer.appendChild(newTextbox);
                todoContainer.appendChild(newDatePicker);
                todoContainer.appendChild(updateButton);
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
                const checkbox = document.createElement('input');
                const description = document.createElement('textarea');

                Object.assign(deleteButton, {
                    innerText: "Delete",
                    classList: "btn btn-sm btn-outline-danger",
                    onclick: () => controller.onDelete(todo)
                })

                Object.assign(checkbox, {
                    type: "checkbox",
                    classList: "checkbox-todo form-check-input",
                    onchange: event => controller.checkboxState(index, event)
                })
                if (todo.isDone === true) checkbox.checked = true;

                Object.assign(description, {
                    innerText: todo.description,
                    placeholder: "More about...",
                    disabled: true,
                    classList: 'col-12 todo-description',
                })
                if (!todo.shownDescription) description.classList.add('hidden-description');


                div_todo_right_items.appendChild(deleteButton);
                div_todo_left_items.prepend(checkbox);
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
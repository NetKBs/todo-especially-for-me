import * as controller from "./controller.js"

//Observer
export const todoList = {
    todos: [],

    render: function() {
        // Get the DOM element for the todo list
        const todoListElement = document.getElementById('todo-list');
        todoListElement.innerHTML = '';

        this.todos.forEach((todo, index) => {
            // Create a div element for the todo
            const element = document.createElement('div');
            element.classList.add('list-group-item');

            // Create two div elements for the left and right sides of the todo
            const div_todo_right_items = document.createElement('div');
            const div_todo_left_items = document.createElement('div');
            div_todo_left_items.classList.add('div-todo-left-items');

            // If the todo is in editing state, create elements for editing it
            if (todo.isEditing === true) {
                element.classList.add('my-2');

                // Create an input element for the todo title
                const newTextbox = document.createElement('input');
                newTextbox.type = 'text';
                newTextbox.value = todo.title;
                newTextbox.dataset.todoId = todo.id;
                newTextbox.classList.add('form-control');
                element.appendChild(newTextbox);

                // Create an input element for the due date
                const newDatePicker = document.createElement('input');
                newDatePicker.type = 'date';
                newDatePicker.value = todo.dueDate;
                newDatePicker.dataset.todoId = todo.id;
                newTextbox.classList.add('form-control');
                element.appendChild(newDatePicker);

                // Create a button to update the todo
                const updateButton = document.createElement('button');
                updateButton.innerText = 'Update';
                updateButton.classList.add('btn', 'my-1', 'btn-sm', 'btn-outline-success');
                updateButton.dataset.todoId = todo.id;
                updateButton.onclick = event => controller.onUpdate(index, event);
                element.appendChild(updateButton);

                // Create a textarea element for additional task description
                const description = document.createElement('textarea');
                description.innerText = todo.description;
                description.classList.add('todo-description');
                description.dataset.todoId = todo.id;
                description.placeholder = 'More about...';
                description.classList.add('col-12');
                element.appendChild(description);

            } else {
                // If the todo is not in editing state, create elements for displaying it

                /* Create a span element for the due date, or an empty 
                   string if there is no due date. The same for the title
                   create a span or just leave it normal */
                const dueDate_text = todo.dueDate == "" ? "" : `<span class="dueDate">${todo.dueDate}</span>`;
                const title_text = todo.isDone === true ? `<span class="text-decoration-line-through">${todo.title}</span>` : todo.title;


                // <p> etiquete for the task title
                const titleP = document.createElement('p');
                titleP.innerHTML = `<span class="task-title-text">${title_text} ${dueDate_text}</span>`;
                /* Add an event listener to the titleP element to display the task 
                   description when clicked*/
                titleP.addEventListener('click', () => controller.descriptionDisplayState(index));
                div_todo_left_items.appendChild(titleP);

                // If the task is not done, create a button to allow edit it
                if (!todo.isDone) {
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.classList.add('btn', 'edit-btn', 'btn-sm', 'btn-outline-info');
                    editButton.onclick = () => controller.editState(index);
                    div_todo_right_items.appendChild(editButton);
                }

                // Add a Delete button to every todo
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => controller.onDelete(todo);
                deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
                div_todo_right_items.appendChild(deleteButton);

                // Add a checkbox to mark as Done or not a todo
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('checkbox-todo', 'form-check-input');
                checkbox.onchange = event => controller.checkboxState(index, event);
                // Set checkbox state
                if (todo.isDone === true) {
                    checkbox.checked = true;
                }
                div_todo_left_items.prepend(checkbox);

                // Add a textarea for addiontal description of the task 
                const description = document.createElement('textarea');
                description.innerText = todo.description;
                description.placeholder = 'More about...';
                description.disabled = true;
                description.classList.add('col-12', 'todo-description');
                // Check if it should show the todo description
                if (!todo.shownDescription) {
                    description.classList.add('hidden-description');
                }

                // Add divs with the todo elements
                element.appendChild(div_todo_left_items);
                element.appendChild(div_todo_right_items);
                element.appendChild(description);
            }

            todoListElement.appendChild(element);

        });
    },

}


// Retrieve localStorage (convert it to an array)
const savedTodos = JSON.parse(localStorage.getItem('todos'));

if (Array.isArray(savedTodos)) {
    todoList.todos = savedTodos;
} else {
    todoList.todos = [];
}

todoList.render(); 

document.getElementById('btn-add').addEventListener('click', controller.addTodo);
document.getElementById('todo-title').addEventListener('animationend', event => event.target.classList.remove('warning'));
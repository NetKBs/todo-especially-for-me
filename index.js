/*///////////////////////////////////////////////////////////////////////////  
                                    View
///////////////////////////////////////////////////////////////////////////*/

//Observer
const todoList =  {
    todos: [],

    render: function () {
        const todoListElement = document.getElementById('todo-list');
        todoListElement.innerHTML = '';

        this.todos.forEach((todo, index) => {

            const element = document.createElement('div');
            element.classList.add('list-group-item');

            const div_todo_left_items = document.createElement('div');
            div_todo_left_items.classList.add('div-todo-left-items');

            const div_todo_right_items = document.createElement('div');

            //Manage editing state
            if (todo.isEditing === true) {

                const newTextbox = document.createElement('input');
                newTextbox.type = 'text';
                newTextbox.value = todo.title;
                newTextbox.dataset.todoId = todo.id; 
                newTextbox.classList.add('form-control');

                const newDatePicker = document.createElement('input');
                newDatePicker.type = 'date';
                newDatePicker.value = todo.dueDate;
                newDatePicker.dataset.todoId = todo.id; 
                newTextbox.classList.add('form-control');

                const updateButton  = document.createElement('button');
                updateButton.innerText = 'Update';
                updateButton.classList.add('btn', 'btn-outline-success');
                updateButton.dataset.todoId = todo.id; 
                updateButton.onclick = event => onUpdate(index, event);

                /* Textarea for addiontal description of the task */
                const description = document.createElement('input');
                description.type = 'textarea';
                description.value = todo.description;
                description.dataset.todoId = todo.id; 
                description.placeholder = 'More about...';
                description.classList.add('col-12');

                element.appendChild(newTextbox);
                element.appendChild(newDatePicker);
                element.appendChild(updateButton);
                element.appendChild(description);

            } else {

                const dueDate_text = todo.dueDate == "" ?  "": `<span class="dueDate">${todo.dueDate}</span>`;
                const title_text = todo.isDone === true ? `<span class="text-decoration-line-through">${todo.title}</span>` : todo.title;

                const titleP = document.createElement('p');
                titleP.innerHTML = `<span class="task-title-text">${title_text} ${dueDate_text}</span>`;
                titleP.addEventListener('click', () => descriptionDisplayState(index));
                div_todo_left_items.appendChild(titleP);

                if (!todo.isDone) {
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.dataset.todoId = todo.id;
                    editButton.classList.add('btn', 'edit-btn', 'btn-sm', 'btn-outline-info');
                    editButton.onclick = () => editState(index);
                    div_todo_right_items.appendChild(editButton);
                }

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => onDelete(todo);
                deleteButton.id = todo.id;
                deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
                div_todo_right_items.appendChild(deleteButton);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.todoId = todo.id;
                checkbox.classList.add('checkbox-todo', 'form-check-input');
                checkbox.onchange = event => checkboxState(index, event);
                // Set checkbox state
                if (todo.isDone === true) {
                    checkbox.checked = true;
                }
                div_todo_left_items.prepend(checkbox);

                /* Textarea for addiontal description of the task */
                const description = document.createElement('input');
                description.type = 'textarea';
                description.value = todo.description;
                description.placeholder = 'More about...';
                description.disabled = true;
                description.classList.add('col-12');
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





/*///////////////////////////////////////////////////////////////////////////  
                                    Model
///////////////////////////////////////////////////////////////////////////*/

// Creates a Todo
const createTodo = (title, dueDate) => {
    const id = '' + new Date().getTime(); // time in miliseconds

    todoList.todos.push({
        title: title,
        dueDate: dueDate,
        isDone: false,
        isEditing: false,
        description: "",
        shownDescription: false,
        id: id
    });

    saveTodos();
}

// Delete a todo
const removeTodo = idToDelete => {
    todoList.todos = todoList.todos.filter(todo => todo.id !== idToDelete);
    saveTodos();
}

const changeCheckboxState = (checkbox, index) => {
    todoList.todos[index].isDone = checkbox.checked;
    saveTodos();
}

const changeDisplayState = index => {
    if (todoList.todos[index].shownDescription) {
        todoList.todos[index].shownDescription = false;
    } else {
        todoList.todos[index].shownDescription = true;
    } 
}

const updateTodo = (title, dueDate, description, index) => {
    todoList.todos[index].title = title;
    todoList.todos[index].dueDate = dueDate;
    todoList.todos[index].description = description;

    changeEditState(index);
    saveTodos();
}

const changeEditState = index => {

    if(todoList.todos[index].isEditing === false) {
        todoList.todos[index].isEditing = true;
    } else {
        todoList.todos[index].isEditing = false;
    }

}

// Convert an array to a string then save it
const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todoList.todos)); 


/*///////////////////////////////////////////////////////////////////////////  
                                Controller
///////////////////////////////////////////////////////////////////////////*/

const onUpdate = (todoIndex, event) => {
    const todoId = event.target.dataset.todoId;
    const todoInputs = document.querySelectorAll(`[data-todo-id="${todoId}"]:not(button)`);
    const textbox = todoInputs[0];
    const datePicker = todoInputs[1];
    const description = todoInputs[2];

    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');
    } else {
        updateTodo(textbox.value.trim(), datePicker.value, description.value.trim(), todoIndex);
        todoList.render();
    }
}

const onDelete = todoToDelete => {
    removeTodo(todoToDelete.id);
    todoList.render();
}

const descriptionDisplayState = index => {
    changeDisplayState(index);  
    todoList.render();
}

const editState = index => {
    changeEditState(index);
    todoList.render();
};


const checkboxState = (index, event) => {
    const checkbox = event.target;
    changeCheckboxState(checkbox, index);
    todoList.render();
}

const addTodo = () => {
    const textbox = document.getElementById('todo-title');
    const datePicker = document.getElementById('date-picker');

    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');

    } else {
        createTodo(textbox.value.trim(), datePicker.value);
        todoList.render();
    }

}


/*///////////////////////////////////////////////////////////////////////////  
                                Initialization
///////////////////////////////////////////////////////////////////////////*/

// Retrieve localStorage (convert it to an array)
const savedTodos = JSON.parse(localStorage.getItem('todos'));
// check if it's an array
if (Array.isArray(savedTodos)) {
    todoList.todos = savedTodos;
} else {
    todoList.todos = [];
}

todoList.render(); // update view

document.getElementById('btn-add').addEventListener('click', addTodo);
// Event to handler visual effects with inputs errors
document.getElementById('todo-title').addEventListener('animationend', event => event.target.classList.remove('warning'));


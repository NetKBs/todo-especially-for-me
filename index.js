/*///////////////////////////////////////////////////////////////////////////  
                                    View
///////////////////////////////////////////////////////////////////////////*/

//Observer
const todoList = {
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
                updateButton.onclick = event => onUpdate(index, event);
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
                    string if there is no due date */
                const dueDate_text = todo.dueDate == "" ? "" : `<span class="dueDate">${todo.dueDate}</span>`;
                const title_text = todo.isDone === true ? `<span class="text-decoration-line-through">${todo.title}</span>` : todo.title;

                const titleP = document.createElement('p');
                titleP.innerHTML = `<span class="task-title-text">${title_text} ${dueDate_text}</span>`;
                // Add an event listener to the titleP element to display the task description when clicked
                titleP.addEventListener('click', () => descriptionDisplayState(index));
                div_todo_left_items.appendChild(titleP);

                // If the task is not done, create a button to allow edit it
                if (!todo.isDone) {
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.dataset.todoId = todo.id;
                    editButton.classList.add('btn', 'edit-btn', 'btn-sm', 'btn-outline-info');
                    editButton.onclick = () => editState(index);
                    div_todo_right_items.appendChild(editButton);
                }

                // Add a Delete button to every todo
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => onDelete(todo);
                deleteButton.id = todo.id;
                deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
                div_todo_right_items.appendChild(deleteButton);

                // Add a checkbox to mark as Done or not a todo
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



/*///////////////////////////////////////////////////////////////////////////  
                                    Model
///////////////////////////////////////////////////////////////////////////*/

// Creates a new Todo object and adds it to the todoList
const createTodo = (title, dueDate, description) => {
    const id = '' + new Date().getTime();

    todoList.todos.push({
        title: title,
        dueDate: dueDate,
        isDone: false,
        isEditing: false,
        description: description,
        shownDescription: false,
        id: id
    });

    saveTodos();
}

// Removes a Todo from the todoList based on its ID
const removeTodo = idToDelete => {
    todoList.todos = todoList.todos.filter(todo => todo.id !== idToDelete);
    saveTodos();
}
/* Changes the isDone property of a Todo based on the
   state of its associated checkbox*/
const changeCheckboxState = (checkbox, index) => {
    todoList.todos[index].isDone = checkbox.checked;
    saveTodos();
}

/* Toggles the shownDescription property of a Todo 
to show or hide its description*/
const changeDisplayState = index => {
    if (todoList.todos[index].shownDescription) {
        todoList.todos[index].shownDescription = false;
    } else {
        todoList.todos[index].shownDescription = true;
    }
}

// Updates the properties of a Todo at the specified index with new values
const updateTodo = (title, dueDate, description, index) => {
    todoList.todos[index].title = title;
    todoList.todos[index].dueDate = dueDate;
    todoList.todos[index].description = description;

    changeEditState(index);
    saveTodos();
}

// Toggles the isEditing property of a Todo to enter or exit edit mode
const changeEditState = index => {

    if (todoList.todos[index].isEditing === false) {
        todoList.todos[index].isEditing = true;
    } else {
        todoList.todos[index].isEditing = false;
    }

}

// Converts the todoList array to a string and saves it to local storage
const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todoList.todos));


/*///////////////////////////////////////////////////////////////////////////  
                                Controller
///////////////////////////////////////////////////////////////////////////*/


// Handles updating a todo when the user clicks on the update button
const onUpdate = (index, event) => {
    const todoId = event.target.dataset.todoId;
    const todoInputs = document.querySelectorAll(`[data-todo-id="${todoId}"]:not(button)`);
    const textbox = todoInputs[0];
    const datePicker = todoInputs[1];
    const description = todoInputs[2];

    // Checks if the todo title input is empty and adds a warning class to it 
    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');
    } else {
        updateTodo(textbox.value.trim(), datePicker.value, description.value.trim(), index);
        todoList.render();
    }
}

// Handles deleting a todo when the user clicks on the delete button
const onDelete = todo => {
    removeTodo(todo.id);
    todoList.render();
}

/* Toggles the display of a todo's description when the user clicks 
on the description button*/
const descriptionDisplayState = index => {
    changeDisplayState(index);
    todoList.render();
}

/* Toggles the editing state of a todo when the user clicks 
on the edit button*/
const editState = index => {
    changeEditState(index);
    todoList.render();
};

/* Handles changing the state of a todo's checkbox when the 
user clicks on it*/
const checkboxState = (index, event) => {
    const checkbox = event.target;
    changeCheckboxState(checkbox, index);
    todoList.render();
}

/* Adds a new todo to the todo list when the user clicks 
on the add todo button*/
const addTodo = () => {
    const textbox = document.getElementById('todo-title');
    const datePicker = document.getElementById('date-picker');
    const description = document.getElementById('todo-description');

    /* Checks if the todo title input is empty and adds a warning 
    class to it */
    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');

    } else {
        createTodo(textbox.value.trim(), datePicker.value, description.value.trim());
        textbox.value = "";
        datePicker.value = "";
        description.value = "";
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

// Events
// To add a new todo
document.getElementById('btn-add').addEventListener('click', addTodo);
//To handler visual effects with inputs errors
document.getElementById('todo-title').addEventListener('animationend', event => event.target.classList.remove('warning'));
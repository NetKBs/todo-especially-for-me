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

            //Manage editing state
            if (todo.isEditing === true) {
                const newTextbox = document.createElement('input');
                newTextbox.type = 'text';
                newTextbox.value = todo.title;
                newTextbox.dataset.todoId = todo.id; 

                const newDatePicker = document.createElement('input');
                newDatePicker.type = 'date';
                newDatePicker.value = todo.dueDate;
                newDatePicker.dataset.todoId = todo.id; 

                const updateButton  = document.createElement('button');
                updateButton.innerText = 'Update';
                updateButton.dataset.todoId = todo.id; 
                updateButton.onclick = event => onUpdate(index, event);

                element.appendChild(newTextbox);
                element.appendChild(newDatePicker);
                element.appendChild(updateButton);

            } else {

                element.innerText = `${todo.title} | ${todo.dueDate}`;

                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.dataset.todoId = todo.id;
                editButton.onclick = () => editState(index);
                element.appendChild(editButton);

                const deleteButton = document.createElement('button');

                deleteButton.innerText = 'Delete';
                deleteButton.style = 'margin-left:12px';
                deleteButton.onclick = () => onDelete(todo);
                deleteButton.id = todo.id;
                element.appendChild(deleteButton);

                const checkbox = document.createElement('input');

                checkbox.type = 'checkbox';
                checkbox.dataset.todoId = todo.id;
                checkbox.onchange = event => checkboxState(index, event);
                // Set checkbox state
                if (todo.isDone === true) {
                    checkbox.checked = true;
                }
                element.prepend(checkbox);
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
        id: id
    });

    saveTodos();
}

// Delete a todo
const removeTodo = idToDelete => {
    todoList.todos = todoList.todos.filter(todo => todo.id !== idToDelete);
    saveTodos();
}

// Delete all todos
const removeAllTodo = () => {
    todoList.todos.length = 0;
    saveTodos();
}

const changeCheckboxState = (checkbox, index) => {
    todoList.todos[index].isDone = checkbox.checked;
    saveTodos();
}

const updateTodo = (title, dueDate, index) => {
    todoList.todos[index].title = title;
    todoList.todos[index].dueDate = dueDate;

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

    updateTodo(textbox.value, datePicker.value, todoIndex);
    todoList.render();
}

const onDelete = todoToDelete => {
    removeTodo(todoToDelete.id);
    todoList.render();
}

const editState = index => {
    changeEditState(index);
    todoList.render();
};


const checkboxState = (index, event) => {
    const checkbox = event.target;
    changeCheckboxState(checkbox, index);
}

const addTodo = () => {
    const textbox = document.getElementById('todo-title');
    const datePicker = document.getElementById('date-picker');
    createTodo(textbox.value, datePicker.value);
    todoList.render();
}

const clearTodo = () => {
    document.getElementById('todo-list').innerHTML = '';
    removeAllTodo();
    todoList.render();
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
document.getElementById('btn-clear').addEventListener('click', clearTodo);


import { todoList } from "./view.js";

export const createTodo = (title, dueDate, description) => {
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

export const removeTodo = idToDelete => {
    todoList.todos = todoList.todos.filter(todo => todo.id !== idToDelete);
    saveTodos();
}

export const changeCheckboxState = (checkbox, index) => {
    todoList.todos[index].isDone = checkbox.checked;
    saveTodos();
}

/* Toggles the shownDescription property of a Todo 
   to show or hide its description*/
export const changeDisplayState = index => {
    if (todoList.todos[index].shownDescription) {
        todoList.todos[index].shownDescription = false;
    } else {
        todoList.todos[index].shownDescription = true;
    }
}

export const updateTodo = (title, dueDate, description, index) => {
    todoList.todos[index].title = title;
    todoList.todos[index].dueDate = dueDate;
    todoList.todos[index].description = description;

    changeEditState(index);
    saveTodos();
}

export const changeEditState = index => {

    if (todoList.todos[index].isEditing === false) {
        todoList.todos[index].isEditing = true;
    } else {
        todoList.todos[index].isEditing = false;
    }

}

const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todoList.todos));
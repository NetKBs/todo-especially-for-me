import { todoList } from "./view.js";
import * as model from "./model.js";

export const onUpdate = (index, event) => {
    const todoId = event.target.dataset.todoId;
    const todoInputs = document.querySelectorAll(`[data-todo-id="${todoId}"]:not(button)`);
    const textbox = todoInputs[0];
    const datePicker = todoInputs[1];
    const description = todoInputs[2];

    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');
    } else {
        model.updateTodo(textbox.value.trim(), datePicker.value, description.value.trim(), index);
        todoList.render();
    }
}

export const onDelete = todo => {
    model.removeTodo(todo.id);
    todoList.render();
}

export const descriptionDisplayState = index => {
    model.changeDisplayState(index);
    todoList.render();
}

export const editState = index => {
    model.changeEditState(index);
    todoList.render();
};

export const checkboxState = (index, event) => {
    const checkbox = event.target;
    model.changeCheckboxState(checkbox, index);
    todoList.render();
}

export const addTodo = () => {
    const textbox = document.getElementById('todo-title');
    const datePicker = document.getElementById('date-picker');
    const description = document.getElementById('todo-description');

    /* Checks if the todo title input is empty and adds a warning 
       class to it */
    if (textbox.value.trim() == "") {
        textbox.classList.add('warning');

    } else {
        model.createTodo(textbox.value.trim(), datePicker.value, description.value.trim());
        textbox.value = "";
        datePicker.value = "";
        description.value = "";
        todoList.render();
    }

}
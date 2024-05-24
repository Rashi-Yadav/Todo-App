const todoNameIn = document.getElementById("todo-name");
const todoDescriptionIn = document.getElementById("todo-description");
const form = document.getElementById("form");
const todoRemainingUl = document.querySelector(".todo-remaining-ul");
const todoDoneUl = document.querySelector(".todo-done-ul");

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/4c7dc6d8278f488b867564e82758dab5/todoData")
    .then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].todoData.isCompleted === false) {
          console.log();
          showTodoRemaining(res.data[i].todoData, res.data[i]._id);
        } else {
          showTodoDone(res.data[i].todoData, res.data[i]._id);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoData = {
    name: todoNameIn.value,
    description: todoDescriptionIn.value,
    isCompleted: false,
  };

  axios
    .post(
      "https://crudcrud.com/api/4c7dc6d8278f488b867564e82758dab5/todoData",
      { todoData }
    )
    .then((result) => {
      console.log(result);
      createTodo(todoData);
      clearFields();
      reloadPage();
    })
    .catch((err) => {
      console.log(err);
    });

});

function clearFields() {
  todoNameIn.value = "";
  todoDescriptionIn.value = "";
}

function showTodoRemaining(todo, todoId) {
  createTodo(todo, todoId);
}

function showTodoDone(todo, todoId) {
  createTodo(todo, todoId);
}

function createTodo(todo, todoId) {
  const li = document.createElement("li");
  li.className = "list-items-group";
  const liTextNode = document.createTextNode(
    `${todo.name} - ${todo.description}`
  );

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.className = "btn btn-success complete new-button";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn btn-danger delete new-button";

  const divForButton = document.createElement("div");
  li.appendChild(liTextNode);

  completeBtn.addEventListener("click", () => {
    console.log(todoId);
    axios
      .put(
        `https://crudcrud.com/api/4c7dc6d8278f488b867564e82758dab5/todoData/${todoId}`,
        {
          todoData: {
            name: todo.name,
            description: todo.description,
            isCompleted: true
          }
        }
      )
      .then((res) => {
        li.remove()
        completeBtn.remove()
        todoDoneUl.appendChild(li);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  deleteBtn.addEventListener("click", () => {
    axios
      .delete(
        `https://crudcrud.com/api/4c7dc6d8278f488b867564e82758dab5/todoData/${todoId}`
      )
      .then((res) => {
        console.log(res);
        li.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  if (!todo.isCompleted) {
    divForButton.appendChild(completeBtn);
    divForButton.appendChild(deleteBtn);
    li.appendChild(divForButton);
    todoRemainingUl.appendChild(li);
  } else {
    divForButton.appendChild(deleteBtn);
    li.appendChild(divForButton);
    todoDoneUl.appendChild(li);
  }

}

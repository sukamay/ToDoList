let items = [];

function $(selector) {
    return document.querySelector(selector);
}

function addTodo() {
    let todo = $('#add-todo');
    let msg = todo.value;
    console.log(msg);
    if(msg === ''){
        console.warn('msg is empty!');
        return;
    }
    items.push({
        msg: msg,
        completed: false
    });
    update();
    todo.value = '';
}

function update() {
    let todo_list = $('.todo-list');
    todo_list.innerHTML = '';
    let todo_child = '';
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        todo_child += '<li id="item' + i + '"';
        if(item.completed) {
            todo_child += 'class="completed"';
        }
        todo_child += 'style="display: block;"><div class="view"><input class="toggle" type="checkbox">  <label class="todo-label">'
        + item.msg + '</label><button class="destroy"></button></div></li>';
    }
    todo_list.innerHTML = todo_child;
    $('.todo-count').innerText = (items.length > 0 ? items.length + ' items': 'No items') + ' left';
}


window.onload = function () {
    $('#add-todo').addEventListener('keyup', function (event) {
        if(event.keyCode !== 13)
            return;
        addTodo();
    }, false);
};

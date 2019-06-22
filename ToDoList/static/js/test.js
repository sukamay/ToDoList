function $(id) {
    return document.getElementById(id);
}

let activeAmount = 0;

function updateActive(offset) {
    activeAmount += offset;
    let active = $('active');
    active.innerHTML = activeAmount + ' items left';
}

function addTodo() {
    let todo = $('todo');
    let msg = todo.value;
    let list = $('list');
    if (msg === '') {
        console.warn('msg is empty');
        return;
    }

    let node = document.createElement('li');
    node.className = 'list-item'; // "class" is a reserved keyword
    node.innerHTML = msg;
    list.insertBefore(node, list.firstChild);
    node.addEventListener('click', function() {
        list.removeChild(node);
        updateActive(-1);
    }, false);

    todo.value = '';
    updateActive(+1); // +1 === 1
}

window.onload = function(){
    $('add').addEventListener('click', addTodo, false);
    $('todo').addEventListener('keyup', function(event) {
        if (event.keyCode !== 0xd) return;
        addTodo();
    }, false);
    $('button1').addEventListener('click', function(ev){
        log('button capturing');
    }, true);
    $('button1').addEventListener('click', function(ev){
        log('button bubbling');
    }, false);

    $('bg').addEventListener('click', function(ev){
        log('bg bubbling');
    }, false);
    $('bg').addEventListener('click', function(ev){
        log('bg capturing');
    }, true);
    let car = $('car');
    console.log(car.className === 'car');
    document.querySelectorAll(".glass").forEach(function (value) {
        value.style.color = "red";
    });
    document.querySelectorAll(".wheel").forEach(function (value) {
        let text = value.innerHTML;
        text = text.replace(new RegExp('Wheel','g'),'<span class="highlight">Wheel</span>');
        value.innerHTML = text;
    });
};

function $(id){
    return document.getElementById(id);
}

function log(msg){
    alert(msg);
    console.log(msg)
}




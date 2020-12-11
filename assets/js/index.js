var title, todolist, donelist, todocount, donecount, prev;
var list = {
    todolist: [],
    donelist: [],
};
init();

function init() {
    title = document.querySelector("#title");
    todolist = document.querySelector("#todolist");
    donelist = document.querySelector("#donelist");
    todocount = document.querySelector("#todocount");
    donecount = document.querySelector("#donecount");
    document.addEventListener("keyup", keyHandler);
    todolist.addEventListener("change", changeHandler); //修改在那个列表中
    todolist.addEventListener("click", clickHandler); //删除元素
    todolist.addEventListener("dblclick", dblclickHandler); //修改显示input
    todolist.addEventListener("focusout", blurHandler); //input失焦处理

    donelist.addEventListener("change", changeHandler); //修改在那个列表中
    donelist.addEventListener("click", clickHandler); //删除元素


    if (localStorage.list) {
        list = JSON.parse(localStorage.list);
        render();
    }
}

function keyHandler(e) {
    if (e.keyCode !== 13 || title.value.trim().length === 0) return;
    list.todolist.push(title.value);
    title.value = "";
    render();
}

function blurHandler(e) {

    var index = Array.from(todolist.children).indexOf(
        e.target.parentElement.parentElement
    );
    list.todolist[index] = e.target.value;
    render();
}

function changeHandler(e) {
    if (e.target.type !== "checkbox") return;
    switchList(e.target, e.target.checked);
}

function dblclickHandler(e) {
    if (e.target.nodeName !== "P") return;
    var input = e.target.firstElementChild;
    if (prev) {
        prev.style.display = "none";
    }
    prev = input;
    input.style.display = "block";
    input.value = e.target.textContent;
    input.setSelectionRange(0, input.value.length); //选中文本框字符串
    input.focus(); //聚焦
}

function switchList(target, bool, remove) {
    var arr = bool ? list.todolist : list.donelist;
    var arr1 = bool ? list.donelist : list.todolist;
    var elem =
        remove === undefined ?
        target.nextElementSibling :
        target.previousElementSibling;
    var index = arr.indexOf(elem.textContent);
    var del = arr.splice(index, 1);
    if (remove === undefined) arr1.push(del[0]);
    render();
}

function clickHandler(e) {
    if (e.target.nodeName !== "A") return;
    switchList(
        e.target, !e.target.parentElement.firstElementChild.checked,
        true
    );
}

function render() {
    localStorage.list = JSON.stringify(list);
    for (var prop in list) {
        window[prop].innerHTML = list[prop].reduce((value, item) => {
            return (
                value +
                `
            <li>
                <input type="checkbox" ${
                  prop === "donelist" ? "checked" : ""
                }>
                <p>${item}<input type="text" style="display:none"></p>
                <a href="javascript:void(0)">-</a>     
             </li>
            `
            );
        }, "");
    }
    todocount.textContent = list.todolist.length;
    donecount.textContent = list.donelist.length;
}
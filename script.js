// --- HTML要素を取得 ---
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');

// --- イベントリスナーの設定 ---
// DOMContentLoaded: HTMLの読み込みと解析が終わった時点で実行
document.addEventListener('DOMContentLoaded', loadTasks);
addButton.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskClick);
taskInput.addEventListener('keydown', function(event) {
    if (event.isComposing || event.key !== 'Enter') {
        return;
    }
    addTask();
});

// --- 関数定義 ---

/**
 * タスクを追加する関数
 */
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        return;
    }

    createTaskElement(taskText, false); // 新しいタスク要素を作成
    taskInput.value = ''; // 入力欄をクリア
    saveTasks(); // 変更を保存
}

/**
 * タスクの完了状態を切り替える、またはタスクを削除する関数
 * @param {MouseEvent} event - クリックイベントの情報
 */
function handleTaskClick(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('delete-button')) {
        const listItem = clickedElement.parentElement;
        listItem.remove();
    } else if (clickedElement.tagName === 'SPAN') {
        const listItem = clickedElement.parentElement;
        listItem.classList.toggle('completed');
    }

    saveTasks(); // 変更を保存
}

/**
 * 現在のタスクリストをローカルストレージに保存する関数
 */
function saveTasks() {
    const tasks = [];
    // taskList内のすべてのli要素を取得
    const listItems = taskList.querySelectorAll('li');

    // 各li要素からタスク情報（テキストと完了状態）をオブジェクトとして抽出し、配列に追加
    listItems.forEach(item => {
        const taskSpan = item.querySelector('span');
        tasks.push({
            text: taskSpan.textContent,
            completed: item.classList.contains('completed')
        });
    });

    // タスクの配列をJSON文字列に変換して、'tasks'というキーでローカルストレージに保存
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * ローカルストレージからタスクを読み込んで表示する関数
 */
function loadTasks() {
    // 'tasks'というキーで保存されたJSON文字列を取得
    const savedTasks = localStorage.getItem('tasks');

    // データがなければ何もしない
    if (!savedTasks) {
        return;
    }

    // JSON文字列をJavaScriptの配列に変換
    const tasks = JSON.parse(savedTasks);

    // 配列内の各タスク情報をもとに、画面にタスク要素を作成して表示
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

/**
 * 新しいタスクのHTML要素を作成してリストに追加する関数
 * @param {string} text - タスクのテキスト
 * @param {boolean} isCompleted - タスクが完了しているかどうか
 */
function createTaskElement(text, isCompleted) {
    const listItem = document.createElement('li');
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';

    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

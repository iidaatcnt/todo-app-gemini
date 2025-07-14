// --- HTML要素を取得 ---
// document.getElementById('ID名') で、HTMLから特定のIDを持つ要素を探してきます。
const taskInput = document.getElementById('task-input'); // タスク入力欄
const addButton = document.getElementById('add-button'); // 追加ボタン
const taskList = document.getElementById('task-list');   // タスクリスト

// --- 関数定義 ---

/**
 * タスクを追加する関数
 */
function addTask() {
    // 入力欄のテキストを取得し、前後の余白を削除します。
    const taskText = taskInput.value.trim();

    // 入力欄が空っぽの場合は、何もせずに処理を終了します。
    if (taskText === '') {
        return; // returnで関数を抜ける
    }

    // --- ここから、新しいタスク要素を組み立てます ---

    // 1. <li>要素（リストの1行）を作成
    const listItem = document.createElement('li');

    // 2. タスクのテキストを表示する<span>要素を作成
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText; // <span>の中に、入力されたテキストを入れる

    // 3. 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除'; // ボタンの文字
    deleteButton.className = 'delete-button'; // CSSでデザインを当てるためのクラス名

    // 4. <li>要素に、テキスト(<span>)と削除ボタンを追加
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);

    // --- 組み立てたタスク要素を、画面のリストに追加します ---
    taskList.appendChild(listItem);

    // 最後に、入力欄を空にして、次のタスクを入力しやすくします。
    taskInput.value = '';
}

/**
 * タスクの完了状態を切り替える、またはタスクを削除する関数
 * @param {MouseEvent} event - クリックイベントの情報
 */
function handleTaskClick(event) {
    // event.target には、クリックされた要素そのものが入っています。
    const clickedElement = event.target;

    // クリックされたのが「削除ボタン」の場合
    if (clickedElement.classList.contains('delete-button')) {
        // ボタンの親要素である<li>をリストから削除します。
        const listItem = clickedElement.parentElement;
        listItem.remove();
    }
    // クリックされたのがタスクの文字（<span>）の場合
    else if (clickedElement.tagName === 'SPAN') {
        // その親要素である<li>に 'completed' クラスを付けたり外したりします。
        // classList.toggle() は、クラスがあれば外し、なければ付ける、という便利な命令です。
        const listItem = clickedElement.parentElement;
        listItem.classList.toggle('completed');
    }
}

// --- イベントリスナーの設定 ---
// これで、ボタンやリストがユーザーの操作に反応するようになります。

// 「追加」ボタンがクリックされたら、addTask関数を実行します。
addButton.addEventListener('click', addTask);

// タスクリスト（<ul>）でクリックイベントが発生したら、handleTaskClick関数を実行します。
// これを「イベント委任」と呼び、後から追加したタスクにも反応できる効率的な方法です。
taskList.addEventListener('click', handleTaskClick);

// 入力欄でキーが押された時に反応します。
taskInput.addEventListener('keydown', function(event) {
    // IMEが変換中でなく、押されたキーが「Enter」キーの場合
    if (event.isComposing || event.key !== 'Enter') {
        return;
    }
    // addTask関数を実行します。
    addTask();
});

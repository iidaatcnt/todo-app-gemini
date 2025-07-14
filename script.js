document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');

    // --- アプリケーションの状態 ---
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- イベントリスナーの設定 ---
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.isComposing || e.key !== 'Enter') return;
        addTask();
    });

    // タスクリスト全体のイベントを監視（イベント委任）
    taskList.addEventListener('click', handleTaskAction);

    // --- 初期化処理 ---
    renderTasks();

    // --- 関数定義 ---

    /**
     * 新しいタスクを追加する
     */
    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') {
            alert('タスクを入力してください。');
            return;
        }

        tasks.push({
            id: Date.now(),
            text: text,
            status: 'todo', // 'todo', 'in-progress', 'completed'
            completedAt: null
        });

        taskInput.value = '';
        saveAndRender();
    }

    /**
     * タスクリストでのアクションを処理する
     * @param {Event} e - クリックイベント
     */
    function handleTaskAction(e) {
        const target = e.target;
        const parentLi = target.closest('li');
        if (!parentLi) return;

        const taskId = Number(parentLi.dataset.id);

        // 削除ボタンが押された場合
        if (target.classList.contains('delete-button')) {
            deleteTask(taskId);
            return;
        }

        // 編集ボタンが押された場合
        if (target.classList.contains('edit-button')) {
            editTask(taskId, parentLi);
            return;
        }

        // 上記以外（タスク自体）がクリックされた場合、ステータスを切り替える
        cycleTaskStatus(taskId);
    }

    /**
     * タスクを編集する
     * @param {number} id - タスクID
     */
    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        const newText = prompt('タスクを編集してください:', task.text);

        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveAndRender();
        }
    }

    /**
     * タスクを削除する
     * @param {number} id - タスクID
     */
    function deleteTask(id) {
        if (confirm('本当にこのタスクを削除しますか？')) {
            tasks = tasks.filter(t => t.id !== id);
            saveAndRender();
        }
    }

    /**
     * タスクのステータスを循環させる
     * @param {number} id - タスクID
     */
    function cycleTaskStatus(id) {
        const task = tasks.find(t => t.id === id);
        switch (task.status) {
            case 'todo':
                task.status = 'in-progress';
                break;
            case 'in-progress':
                task.status = 'completed';
                task.completedAt = new Date();
                break;
            case 'completed':
                task.status = 'todo';
                task.completedAt = null;
                break;
        }
        saveAndRender();
    }

    /**
     * 変更を保存して再描画する
     */
    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    /**
     * タスクリストと進捗バーを再描画する
     */
    function renderTasks() {
        taskList.innerHTML = ''; // リストをクリア

        if (tasks.length === 0) {
            updateProgressBar();
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.className = task.status; // 'todo', 'in-progress', 'completed'

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const statusContainer = document.createElement('div');
            statusContainer.className = 'status-container';

            // ステータスラベルの追加
            if (task.status === 'in-progress') {
                const statusLabel = document.createElement('span');
                statusLabel.className = 'status-label in-progress-label';
                statusLabel.textContent = '＜今ここ';
                statusContainer.appendChild(statusLabel);
            } else if (task.status === 'completed') {
                const completedDate = document.createElement('span');
                completedDate.className = 'completed-date';
                const d = new Date(task.completedAt);
                completedDate.textContent = `${d.getMonth() + 1}/${d.getDate()}済み`;
                statusContainer.appendChild(completedDate);
            }

            // ボタンコンテナの追加
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = '編集';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '削除';

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            li.appendChild(taskText);
            li.appendChild(statusContainer);
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });

        updateProgressBar();
    }

    /**
     * 進捗バーを更新する
     */
    function updateProgressBar() {
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        progressBar.style.width = `${progress}%`;
        progressLabel.textContent = `進捗: ${Math.round(progress)}%`;
    }
});

var editorCodeBlock;
console.stdlog = console.log.bind(console);
console.log = function() {
    newConsoleLog(arguments);
    console.stdlog.apply(console, arguments);
}

window.isCodeUnsaved = false;

document.addEventListener('DOMContentLoaded', () => {
    let lastStoredCode = JSON.parse(localStorage.getItem('lastStoredCode'));
    let containerElement = document.querySelector('#container');
    let defaultCode = '\n//JS Code Editor \n//Please code below...\n';
    editorCodeBlock = monaco.editor.create(containerElement, {
        value: lastStoredCode || defaultCode,
        language: 'javascript',
        theme: 'vs-dark',
        lineNumbers: 'on',
        glyphMargin: false,
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        lineHeight: 20,
    });
    editorCodeBlock.getModel().onDidChangeContent(() => {
        window.isCodeUnsaved = true;
    });
    loadSavedCodesToSession();
    loadSavedCards();
});

window.addEventListener('beforeunload', (e) => {
    if (window.isCodeUnsaved) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function run() {
    let result = 'error';
    let target_pre = document.getElementById('target');
    let consoleDom = document.querySelector('#console');
    let codeToRun = editorCodeBlock.getValue();
    try {
        result = eval(codeToRun);
        localStorage.setItem('lastStoredCode', JSON.stringify(codeToRun));

    } catch (e) {
        result = e;
    }
    target_pre.innerText = result;
    consoleDom.innerText += '---Logged on ' + new Date().toLocaleString() + '\n';
}

function newConsoleLog(arguments) {
    let consoleDom = document.querySelector('#console');
    consoleDom.innerText += Array.from(arguments) + '\n';
}

function clearConsole() {
    let consoleDom = document.querySelector('#console');
    consoleDom.innerText = '';
    console.clear();
}

function saveCode() {
    window.isCodeUnsaved = false;
    let inputCodeName = document.querySelector('#codeEditorName');
    let codeToSave = editorCodeBlock.getValue();
    let snackBar = document.querySelector('#snackbar');

    inputCodeName.classList.remove('shakeClass');
    inputCodeName.offsetHeight;
    let codeNameSaveAS = inputCodeName.value.trim();
    if (!codeNameSaveAS) {
        inputCodeName.classList.add('codeNameInputError', 'shakeClass');
        inputCodeName.value = '';
    } else {
        inputCodeName.classList.remove('codeNameInputError', 'shakeClass');
        let savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || {};
        savedCodes[codeNameSaveAS] = codeToSave;
        localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
        snackBar.classList.add('show');
        setTimeout(() => snackBar.classList.remove('show'), 3000);
        localStorage.removeItem('lastStoredCode');
        loadSavedCards();
        // window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }
}

function loadSavedCodesToSession() {
    if (window.savedCodes) {
        localStorage.setItem('savedCodes', JSON.stringify({...window.savedCodes, ...JSON.parse(localStorage.getItem('savedCodes')) }));
    }
}

function loadSavedCards() {
    let cardsRowDiv = document.querySelector('#savedCodeCards');
    let savedCodes = JSON.parse(localStorage.getItem('savedCodes'));
    cardsRowDiv.innerHTML = '';
    for (const codeTitle in savedCodes) {
        cardsRowDiv.innerHTML += generateCards(codeTitle, savedCodes[codeTitle]);
    }
}

function generateCards(title, code) {

    let htmlData = `<div class="col-lg-2 m-2 card"><div class="card-body text-center"> <h5 class="card-title">${ title }</h5>`;
    htmlData += `<button class="btn card-link" onclick="editCode('${title}')"><i class="material-icons editSvg">edit</i></button>`;
    htmlData += `<button class="btn card-link" onclick="openDeleteModal('${title}')"><i class="material-icons deleteSvg">delete_forever</i></button></div></div>`;
    return htmlData;
}

function editCode(title) {
    let savedCodes = JSON.parse(localStorage.getItem('savedCodes'));
    let inputCodeName = document.querySelector('#codeEditorName');
    if (savedCodes[title]) {
        editorCodeBlock.setValue(savedCodes[title]);
        inputCodeName.value = title;
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
}

function openDeleteModal(title) {
    let modalCardTitle = document.querySelector('#modalCardTitle');
    modalCardTitle.innerText = 'Delete ' + title + ' code ?';
    $("#myModal").modal("show");
    window.codeToBeDeleted = title;
}

function deleteCode() {
    let savedCodes = JSON.parse(localStorage.getItem('savedCodes'));
    delete savedCodes[window.codeToBeDeleted];
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    $("#myModal").modal("hide");
    loadSavedCards();
}

$(document).ready(function() {
    $('#runButton').tooltip({ title: "Ctrl + Enter", animation: true });
});
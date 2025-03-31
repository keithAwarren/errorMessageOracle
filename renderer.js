const { ipcRenderer } = require('electron');

async function invokeOracle() {
    const input = document.getElementById('errorInput').value;
    const output = document.getElementById('oracleOutput');
    output.textContent = 'Consulting the stars...';

    const response = await ipcRenderer.invoke('invoke-oracle', input);
    output.textContent = response;
}
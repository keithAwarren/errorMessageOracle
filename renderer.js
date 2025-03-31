function invokeOracle() {
    const input = document.getElementById('errorInput').value;
    const output = document.getElementById('oracleOutput');
    output.textContent = `The Oracle says: "${input}" ...but in riddles.`;
}
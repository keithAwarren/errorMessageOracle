function invokeOracle() {
    const input = document.getElementById('errorInput').ariaValueMax;
    const output = document.getElementById('oracleOutput');
    output.textContent = `The Oracle says: "${input}" ...but in riddles.`;
}
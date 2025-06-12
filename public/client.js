document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const startBtn = document.getElementById('startSession');
  const askBtn = document.getElementById('ask');
  const responsesList = document.getElementById('responses');

  startBtn.addEventListener('click', () => {
    fetch('/session/start', { method: 'POST' })
      .then(res => res.json())
      .then(data => alert(data.status || data.error));
  });

  askBtn.addEventListener('click', () => {
    const type = parseInt(document.getElementById('qtype').value, 10);
    const choiceCount = parseInt(document.getElementById('choiceCount').value, 10) || 0;
    const text = document.getElementById('qtext').value;
    const answer = document.getElementById('qanswer').value;
    // clear previous responses
    responsesList.innerHTML = '';
    fetch('/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, choiceCount, text, answer })
    })
      .then(res => res.json())
      .then(data => alert(data.status || data.error));
  });

  socket.on('clicker-response', msg => {
    const li = document.createElement('li');
    li.textContent = `Clicker ${msg.clickerId} answered ${msg.response}`;
    responsesList.appendChild(li);
  });
});

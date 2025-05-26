let mysteryChar = null;
let allChars = [];

fetch('/mystery')
    .then(res => res.json())
    .then(data => mysteryChar = data);

fetch('/characters')
  .then(res => res.json())
  .then(data => {
    allChars = data;
    renderCharacterGrid(data);
  })
  .catch(err => {
    console.error('Error loading characters:', err);
    alert("Error loading characters.");
  });

function renderCharacterGrid(data) {
  const grid = document.getElementById('characterGrid');
  grid.innerHTML = '';
  data.forEach(char => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${char.Image}" alt="${char.Name}">
      <h3>${char.Name}</h3>
      <p><strong>Gender : </strong>${char.Gender}</p>
      <p><strong>Age : </strong>${char.Age}</p>
      <p><strong>Type : </strong>${char.Type}</p>
      <p><strong>Guild : </strong>${char.Guild}</p>
      <p><strong>Class : </strong>${char.Class}</p>
      <p><strong>Rank : </strong>${char.Rank}</p>
      <p><strong>Country : </strong>${char.Country}</p>
      <p><strong>Weapon : </strong>${char.Weapon}</p>
      <p><strong>Arc : </strong>${char.Arc}</p>
    `;
    grid.appendChild(div);
  });
}

function submitGuess() {
  const input = document.getElementById('guessInput');
  const guessName = input.value.trim();
  const guessChar = allChars.find(c => c.Name.toLowerCase() === guessName.toLowerCase());

  if (!guessChar) {
    alert("Character not found!");
    return;
  }

  const fieldsToCompare = ['Image', 'Name', 'Gender', 'Age', 'Type', 'Guild', 'Class', 'Rank', 'Country', 'Weapon', 'Arc'];
  const guessRow = document.createElement('div');
  guessRow.className = 'guess-row';

  fieldsToCompare.forEach(field => {
    const cell = document.createElement('div');
    cell.className = 'guess-cell';

    const guessValue = guessChar[field];
    const mysteryValue = mysteryChar[field];

    if (guessValue === mysteryValue) {
      if (field === 'Image') {
        const img = document.createElement('img');
        img.src = guessValue;
        img.alt = guessChar.Name;
        cell.appendChild(img);
      } else {
        cell.classList.add('correct');
        cell.textContent = guessValue;
      }
    } else if (field === 'Age') {
        const guessAge = parseInt(guessValue, 10);
        const mysteryAge = parseInt(mysteryValue, 10);
        if (!isNaN(guessAge) && !isNaN(mysteryAge)) {
          cell.classList.add('incorrect');
          cell.textContent = guessAge > mysteryAge ? `${guessValue} ↓` : `${guessValue} ↑`;
        } else {
          cell.classList.add('incorrect');
          cell.textContent = guessValue;
        }
      } else {
        cell.classList.add('incorrect');
        cell.textContent = guessValue;
      }

    guessRow.appendChild(cell);
  });

  document.getElementById('guesses').appendChild(guessRow);
  input.value = '';
}

function showSuggestions() {
    const input = document.getElementById('guessInput');
    const suggestionsBox = document.getElementById('suggestions');
    const query = input.value.toLowerCase();

    suggestionsBox.innerHTML = '';
    
    const matches = allChars.filter(c => c.Name.toLowerCase().includes(query));
    
    if (!query || matches.length === 0) {
      suggestionsBox.style.visibility = 'hidden';
      return;
    }

    suggestionsBox.style.visibility = 'visible';
    
    matches.forEach(char => {
      const suggestion = document.createElement('div');
      suggestion.className = 'suggestion-item'; // pour styliser proprement
      suggestion.addEventListener('click', () => {
        input.value = char.Name;
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.visibility = 'hidden';
      });

      const img = document.createElement('img');
      img.src = char.Image;
      img.alt = char.Name;
      img.className = 'suggestion-image';

      const name = document.createElement('span');
      name.textContent = char.Name;
      name.className = 'suggestion-name';

      suggestion.appendChild(img);
      suggestion.appendChild(name);
      suggestionsBox.appendChild(suggestion);
    });
}

document.addEventListener('click', (e) => {
    if (!document.getElementById('guessInput').contains(e.target)) {
      document.getElementById('suggestions').innerHTML = '';
      document.getElementById('suggestions').style.visibility = 'hidden';
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('guessInput');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitGuess();
    }
  });
});
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
    
    if (!mysteryChar) {
        alert("Mystery character not loaded yet.");
        return;
    }

    const guessChar = allChars.find(c => c.Name.toLowerCase() === guessName.toLowerCase());

    if (!guessChar) {
    alert("Character not found !");
    return;
    }

    const fieldsToCompare = ['Name','Gender', 'Age', 'Type', 'Guild', 'Class', 'Rank', 'Country', 'Weapon', 'Arc'];
    const result = fieldsToCompare.map(field => {
    if (guessChar[field] === mysteryChar[field]) return '🟩';
    else return '🟥';
    });

    const guessRow = document.createElement('div');
    guessRow.textContent = `${guessChar.Name} -> ${result.join(' ')}`;
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
    suggestion.textContent = char.Name;
    suggestion.style.padding = '5px';
    suggestion.style.cursor = 'pointer';
    suggestion.addEventListener('click', () => {
        input.value = char.Name;
        suggestionsBox.innerHTML = '';
    });
    suggestionsBox.appendChild(suggestion);
    });
}

document.addEventListener('click', (e) => {
    if (!document.getElementById('guessInput').contains(e.target)) {
    document.getElementById('suggestions').innerHTML = '';
    document.getElementById('suggestions').style.visibility = 'hidden';
    }
});
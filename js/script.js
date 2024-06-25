document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
});

document.getElementById('checkButton').addEventListener('click', function() {
    const nameInput = document.getElementById('nameInput');
    const photoInput = document.getElementById('photoInput');
    const name = nameInput.value;
    const resultElement = document.getElementById('result');
    const resultPhoto = document.getElementById('resultPhoto');
    
    if (name.trim() === "") {
        alert("Ketik namanya dulu ege!");
        return;
    }

    if (photoInput.files.length === 0) {
        alert("Upload fotonya dulu ege!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const photoData = event.target.result;
        fetch('khodam/list.txt')
            .then(response => response.text())
            .then(data => {
                const khodams = data.split('\n').filter(khodam => khodam.trim() !== "");
                const randomKhodam = khodams[Math.floor(Math.random() * khodams.length)];
                resultElement.innerHTML = `Ramalan <strong>Khodam</strong> untuk <strong>${name}</strong> adalah : <strong>${randomKhodam}</strong>`;
                resultElement.classList.add('has-result');
                
                resultPhoto.src = photoData;
                resultPhoto.style.display = 'block';
                
                const tableBody = document.getElementById('checkTableBody');
                const newRow = tableBody.insertRow();
                const nameCell = newRow.insertCell(0);
                const khodamCell = newRow.insertCell(1);
                nameCell.textContent = name;
                khodamCell.textContent = randomKhodam;
                saveToLocalStorage(name, randomKhodam, photoData);
                
                // Clear the input field
                nameInput.value = '';
                photoInput.value = '';
            })
            .catch(error => console.error('Error:', error));
    };
    reader.readAsDataURL(photoInput.files[0]);
});

document.getElementById('clearButton').addEventListener('click', function() {
    localStorage.removeItem('khodamData');
    document.getElementById('checkTableBody').innerHTML = '';
});

function saveToLocalStorage(name, khodam, photo) {
    const data = JSON.parse(localStorage.getItem('khodamData')) || [];
    data.push({ name: name, khodam: khodam, photo: photo });
    localStorage.setItem('khodamData', JSON.stringify(data));
}

function loadTableData() {
    const data = JSON.parse(localStorage.getItem('khodamData')) || [];
    const tableBody = document.getElementById('checkTableBody');
    data.forEach(item => {
        const newRow = tableBody.insertRow();
        const nameCell = newRow.insertCell(0);
        const khodamCell = newRow.insertCell(1);
        nameCell.textContent = item.name;
        khodamCell.textContent = item.khodam;
    });
}

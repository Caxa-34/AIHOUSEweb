function convertNewlinesToBreaks(text) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

// Функция для экранирования специальных HTML символов
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Объединяем обе функции
function formatTextForHtml(text) {
    let escapedText = escapeHtml(text);
    return convertNewlinesToBreaks(escapedText);
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', async function () {
    const publicationId = localStorage.getItem('publicId'); // Получение ID публикации из localStorage
    console.log(`Fetching full publication for publicationId: ${publicationId}`);

    const formData = {
        id: publicationId,
        idUser: localStorage.getItem('id')
    };

    try {
        const response = await fetch('http://94.228.126.25:3210/api/publications/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch publication: ${response.statusText}`);
        }

        const res = await response.json();
        const publication = res.publication;
        // Обновляем содержимое страницы
        console.log(publication);

        document.getElementById('authorName').textContent = publication.author.name;
        document.getElementById('dateAdd').textContent = new Date(publication.dateCreate).toLocaleDateString();
        document.getElementById('titleText').textContent = publication.title;

        const pubText = document.getElementById('mainText');
        pubText.innerHTML = formatTextForHtml(publication.text);
        document.getElementById('countLikes').textContent = publication.countLikes; // Количество лайков
        

        const authorname = document.getElementById('authorName');
        console.log(authorname);


    } catch (error) {
        console.error('Error fetching full publication:', error);
        alert("Кажется возникла ошибка при загрузке полной публикации.");
    }
});


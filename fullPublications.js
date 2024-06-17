document.addEventListener('DOMContentLoaded', async function () {
    const publicationId = localStorage.getItem('publicId'); // Получение ID публикации из localStorage
    console.log(`Fetching full publication for publicationId: ${publicationId}`);

    const formData = {
        id: publicationId
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

        const publication = await response.json();
        console.log('Publication fetched:', publication);

        // Обновляем содержимое страницы
        document.getElementById('authorName').textContent = publication.author.name;
        document.getElementById('dateAdd').textContent = new Date(publication.dateCreate).toLocaleDateString();
        document.getElementById('titleText').textContent = publication.title;
        document.getElementById('mainText').textContent = publication.text;
        //document.getElementById('publicationLikes').textContent = publication.countLikes; // Количество лайков

       

    } catch (error) {
        console.error('Error fetching full publication:', error);
        alert("Кажется возникла ошибка при загрузке полной публикации.");
    }
});
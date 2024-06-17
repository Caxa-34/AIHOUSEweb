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
    const userId = localStorage.getItem('id');
    console.log(`Fetching publications for userId: ${userId}`);

    const formData = { idUser: userId };

    console.log('Хранилище: ' + localStorage.id);
    try {
        const response = await fetch('http://94.228.126.25:3210/api/publications/getByAuthor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const responsePub = await response.json();
        console.log('Полный ответ API:', responsePub);
        const publications = responsePub.publications;
        console.log('Publications fetched:', publications);

        // Проверка наличия массива publications
        if (!Array.isArray(publications)) {
            throw new Error('Publications is not an array or missing');
        }

        publications.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });

        const publicationContainer = document.getElementById('myPubContent');
        publicationContainer.innerHTML = '';

        publications.forEach(publication => {
            let text = publication.text;
            // Обрезаем текст до 210 символов, если он длиннее
            let truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';
          
            const formattedDate = formatDate(publication.dateCreate);

            // Создаем шаблон для каждой публикации
            const publicationTemplate = `
                <div class="pub">
                    <div class="heads">
                        <img class="pubImege" src="img/user_icon.png">
                        <div class="headerPub">
                            <p class="dateAdd">${formattedDate}</p>
                            <div class="likes">
                                <img id="likeBtn" src="img/like.svg">
                                <p class="countLikes">${publication.countLikes}</p>
                            </div>
                        </div>
                    </div>
                    <p id="textTitle" class="titleElement">${publication.title}</p>
                    <p id="textPost" class="textElement">${truncatedText}</p>
                     <p class="readMore" data-publication-id="${publication.id}">Читать далее...</p>
                    <div class="actionPanel">
                       
                    </div>
                </div>
            `;
            // Добавляем шаблон публикации в контейнер
            publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);
        });

        const publicationElements = document.querySelectorAll('.readMore');
        publicationElements.forEach(element => { 
            element.addEventListener('click', function() {
              const publicationIdforRead = this.getAttribute('data-publication-id');
                 localStorage.setItem('publicId', publicationIdforRead); // Сохранение ID публикации
                 console.log("id в хранилище " + localStorage.getItem('publicId'));
              window.location.href = 'fullPublication.html';
            });
         });

    } catch (error) {
        console.error('Error fetching publications:', error);
        alert("Кажется, возникла ошибка");
    }
});


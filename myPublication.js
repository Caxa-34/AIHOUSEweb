function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// Функция для показа уведомления
function showNotification(message) {

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);
    // Показ уведомления
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        document.body.removeChild(notification);
    }, 2000);
};

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
        const publicationContainer = document.getElementById('myPubContent');
        publicationContainer.innerHTML = '';



        publications.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });


        if (publications == 0) {
            publicationContainer.textContent = 'У вас пока что нет ни одной записи';
            publicationContainer.style.marginLeft = '3rem';
            publicationContainer.style.fontSize = '2rem';
            publicationContainer.style.fontFamily = 'Inter';
            publicationContainer.style.fontWeight = '600';
            publicationContainer.style.color = '#1B1967';
            publicationContainer.style.marginTop = '3rem';
        }
        else {
            publicationContainer.innerHTML = '';

        }

        function renderPublications(publications) {
            publicationContainer.innerHTML = '';


            if (publications.length === 0) {
                publicationContainer.innerHTML = '<p>Ничего нет</p>'; // Если публикаций нет
                return;
            }

            publications.forEach(publication => {
                let text = publication.text;
                // Обрезаем текст до 210 символов, если он длиннее
                let truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';

                const formattedDate = formatDate(publication.dateCreate);


                // Создаем шаблон для каждой публикации
                const publicationTemplate = `
                <div class="pub">
                    <div class="heads">
                        
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
                    <div class="actionPanel">
                     <p class="readMore" data-publication-id="${publication.id}">Читать далее...</p>
                     <img src="./img/del_pub.svg" class="delete" id="delPub" data-publication-id="${publication.id}">
                       
                    </div>
                </div>
            `;
                // Добавляем шаблон публикации в контейнер
                publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);
            });

            const publicationElements = document.querySelectorAll('.readMore');
            publicationElements.forEach(element => {
                element.addEventListener('click', function () {
                    const publicationIdforRead = this.getAttribute('data-publication-id');
                    localStorage.setItem('publicId', publicationIdforRead); // Сохранение ID публикации
                    console.log("id в хранилище " + localStorage.getItem('publicId'));
                    window.location.href = 'fullPublication.html';
                });
            });

            const deletePublic = document.querySelectorAll('.delete');
            deletePublic.forEach(element => {
                element.addEventListener('click', async function () {
                    const idPublication = this.getAttribute('data-publication-id');

                    console.log("id в хранилище ", idPublication);

                    try {
                        const formatDate ={
                            idPublication: idPublication
                        }
                        const response = await fetch('http://94.228.126.25:3210/api/complaints/ban', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formatDate)
                        });
                        
                        console.log(`Response status: ${response.status}`);

                        if (!response.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }

                        const responsePub = await response.json();
                        console.log('Полный ответ API:', responsePub);
 

                        showNotification("Публикация удалена");
                        location.reload();
                    }
                    catch (error) {
                        console.error('Error fetching publications:', error);
                        showNotification("Ошибка при удалении публикации");
                    }

                });
            });

        }
        renderPublications(publications);

        // Функция поиска публикаций по имени автора и заголовку
        function searchScorePublication() {
            const searchInput = document.getElementById('searchPub').value.toLowerCase();
            const searchWords = searchInput.split(/\s+/).filter(word => word.length > 0);

            if (searchWords.length === 0) {
                // Если строка поиска пуста, отображаем все публикации
                renderPublications(publications);
                return;
            }

            const filteredPublications = publications.filter(publication => {
                const title = publication.title;
                const text = publication.text;

                return searchWords.some(word => title.includes(word) || text.includes(word));
            });

            renderPublications(filteredPublications);
        }

        // Добавление обработчика события на кнопку поиска
        document.getElementById('searchPub').addEventListener('input', searchScorePublication);

    } catch (error) {
        console.error('Error fetching publications:', error);
        alert("Кажется, возникла ошибка");
    }
});


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
        const response = await fetch('http://94.228.126.25:3210/api/publications/drafts/get', {
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
        const drafts = responsePub.drafts;
        console.log('drafts fetched:', drafts);

        // Проверка наличия массива drafts
        if (!Array.isArray(drafts)) {
            throw new Error('drafts is not an array or missing');
        }

        drafts.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });

        const publicationContainer = document.getElementById('myPubContentDraft');
        publicationContainer.innerHTML = '';


        
        if(drafts == 0)
            {
                publicationContainer.textContent = 'У вас пока что нет ни одного черновика';
                publicationContainer.style.marginLeft = '3rem';
                publicationContainer.style.fontSize = '2rem';
                publicationContainer.style.fontFamily = 'Inter';
                publicationContainer.style.fontWeight = '600';
                publicationContainer.style.color = '#1B1967';
                publicationContainer.style.marginTop = '3rem';
            }
            else{
                publicationContainer.innerHTML = '';
               
            }


        drafts.forEach(draft => {
            let text = draft.text;
            // Обрезаем текст до 210 символов, если он длиннее
            let truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';

            const formattedDate = formatDate(draft.dateUpdate);

            // Создаем шаблон для каждой публикации
            const publicationTemplate = `
                <div class="pub">
                    <div class="heads">
                        <div class="headerPub">
                            <p class="dateAdd">${formattedDate}</p>
                        </div>
                    </div>
                    <p id="textTitle" class="titleElement" data-title="${draft.title}">${draft.title}</p>
                    <p id="textPost" class="textElement">${truncatedText}</p>
                    <p class="readMore" data-id="${draft.id}" data-title="${draft.title}" data-text="${draft.text}">Читать далее...</p>
                    <div class="actionPanel">
                       
                    </div>
                </div>
            `;
            // Добавляем шаблон публикации в контейнер
            publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);




            const draftElements = document.querySelectorAll('.readMore');

            draftElements.forEach(element => {
                element.addEventListener('click', function () {
                    const draftIdforRead = this.getAttribute('data-id');
                    const draftTitleforRead = this.getAttribute('data-title');
                    const draftTextforRead = this.getAttribute('data-text');
                    console.log("id:  " + draftIdforRead + "\ntitle:  " + draftTitleforRead + "\ntext:  " + draftTextforRead);

                    localStorage.setItem('draftId', draftIdforRead);
                    localStorage.setItem('draftTitle', draftTitleforRead);
                    localStorage.setItem('draftText', draftTextforRead);

                    console.log("id в хранилище " + localStorage.getItem('draftId') + " " + localStorage.getItem('draftTitle') + " " + localStorage.getItem('draftText'));

                    window.location.href = 'createPubications.html';



                });
            });

        });


    } catch (error) {
        console.error('Error fetching drafts:', error);
        alert("Кажется, возникла ошибка");
    }
});


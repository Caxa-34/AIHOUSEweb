document.addEventListener('click', function () {
    
    
    function searchScorePublication(pubTitle, pubText, searchText) {
        pubTitle = this.getAttribute('data-title');
        pubText = this.getAttribute('data-text');
        searchText = document.getElementById('searchText');
        

        const searchWords = searchText.split(/\s+/).filter(word => word).map(word => word.toLowerCase());
        const title = pubTitle.toLowerCase();
        const text = pubText.toLowerCase();
        let score = 0;
    
        searchWords.forEach(word => {
            if (title.includes(word)) {
                score += 10;
            }
            if (text.includes(word)) {
                score += 1;
            }
        });
    
        return score;
    }
    



});
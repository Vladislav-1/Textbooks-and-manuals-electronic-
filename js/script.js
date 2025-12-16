document.addEventListener('DOMContentLoaded', function () {
    const documentLinks = document.querySelectorAll('.document-link');
    const previewContent = document.getElementById('preview-content');
    const noPreview = document.getElementById('no-preview');
    const mainDownloadBtn = document.getElementById('main-download-btn');
    const bookDescription = document.getElementById('book-description');

    // Данные о книгах
    const books = {
        'verstka': {
            title: 'Создаём свой первый веб-сайт',
            filename: 'uchebnik_po_HTML_dlya_pensionerov.pdf',
            description: 'Этот учебник предназначен для пенсионеров, желающих постичь науку вёрстки веб-сайтов. Он содержит подробное объяснение с большим количеством примеров и упражнений.',
            size: '7.66 МБ'
        },
        'vsc-programm': {
            title: 'Учебник по работе с Visual Studio Code для верстки сайтов',
            filename: 'uchebnik-po-rabote-s-Visual-Studio-Code-dlya-verstki-saitov.pdf',
            description: 'Для людей "золотого возраста", которые хотят научиться верстать сайты с помощью современного и удобного инструмента.',
            size: '8.4 МБ'
        },
        'marketing-Faberlic': {
            title: 'Учебник по маркетингу для консультанта компании «Фаберлик»',
            filename: 'uchebnik-po-marketingu-dlya-konsultanta-kompanii-Faberlic.pdf',
            description: 'Для людей "золотого возраста", которые хотят научиться верстать сайты с помощью современного и удобного инструмента.',
            size: '21.5 МБ'
        },

    };

    // Обработка кликов по документам в меню
    documentLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Удаляем класс selected у всех элементов
            documentLinks.forEach(item => {
                item.classList.remove('selected');
            });

            // Добавляем класс selected текущему элементу
            this.classList.add('selected');

            // Получаем тип превью из data-атрибута
            const previewType = this.getAttribute('data-preview');

            // Скрываем все превью
            document.querySelectorAll('.preview-section').forEach(section => {
                section.style.display = 'none';
            });

            // Скрываем сообщение "выберите учебник"
            noPreview.style.display = 'none';

            // Показываем соответствующее превью
            const previewElement = document.getElementById(`${previewType}-preview`);
            if (previewElement) {
                previewElement.style.display = 'block';
            }

            // Обновляем кнопку скачивания
            if (books[previewType]) {
                const book = books[previewType];
                // ИСПРАВЛЕННЫЙ ПУТЬ - относительный вместо абсолютного
                mainDownloadBtn.href = `downloads/${book.filename}`;
                mainDownloadBtn.innerHTML = `<i class="fas fa-download download-icon"></i> Скачать "${book.title}" (${book.size})`;
                mainDownloadBtn.download = book.filename;

                // Обновляем описание книги
                bookDescription.textContent = book.description;
            }
        });
    });

    // Для демонстрации - автоматически выбираем первый элемент
    if (documentLinks.length > 0) {
        documentLinks[0].click();
    }

    console.log("Сайт готов к работе! PDF-файлы должны находиться в папке downloads/");
});

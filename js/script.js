document.addEventListener("DOMContentLoaded", function () {
  const documentLinks = document.querySelectorAll(".document-link");
  const previewContent = document.getElementById("preview-content");
  const noPreview = document.getElementById("no-preview");
  const mainDownloadBtn = document.getElementById("main-download-btn");
  const bookDescription = document.getElementById("book-description");

  // Данные о книгах
  const books = {
    verstka: {
      title: "Создаём свой первый веб-сайт",
      filename: "uchebnik_po_HTML_dlya_pensionerov.pdf",
      description:
        "Этот учебник предназначен для пенсионеров, желающих постичь науку вёрстки веб-сайтов. Он содержит подробное объяснение с большим количеством примеров и упражнений.",
      size: "7.66 МБ",
    },
    "vsc-programm": {
      title: "Учебник по работе с Visual Studio Code для верстки сайтов",
      filename:
        "uchebnik-po-rabote-s-Visual-Studio-Code-dlya-verstki-saitov.pdf",
      description:
        'Для людей "золотого возраста", которые хотят научиться верстать сайты с помощью современного и удобного инструмента.',
      size: "8.4 МБ",
    },
    "marketing-Faberlic": {
      title: "Учебник по маркетингу для консультанта компании «Фаберлик»",
      filename: "uchebnik-po-marketingu-dlya-konsultanta-kompanii-Faberlic.pdf",
      description:
        "Для людей, которые зарегистрировались в Фаберлик и желают в нём успешно развиваться.",
      size: "21.5 МБ",
    },
    "posob-bank": {
      title:
        "Пособие для повышения квалификации банковского работника «БАНКОВСКОЕ ДЕЛО в эпоху цифровой трансформации: компетенции будущего»",
      filename:
        "posobie-dlya-bankovskogo-rabotnika-po-povysheniyu-kvalifikacii.pdf",
      description:
        "Для банковского работника, поставившего перед собой цель дальнейшего профессионального роста.",
      size: "21.5 МБ",
    },
    "posob-ryba-more": {
      title:
        "ПОСОБИЕ для директора-женщины «СТРАТЕГИЧЕСКОЕ ЛИДЕРСТВО в оптовом бизнесе рыбы и морепродуктов»",
      filename:
        "posobie-dlya-direktora-zhenschiny-strategicheskoe-liderstvo-v-optovom-biznese-ryby-i-moreproduktov.pdf",
      description:
        "Для женщин, занимающих руководящие должности в отрасли оптовой торговли рыбой и морепродуктами, желающих повысить свою квалификацию.",
      size: "8.8 МБ",
    },
    "posob-stili-CSS": {
      title: "Учебник для пенсионеров «СТИЛИ CSS в веб-разработке»",
      filename: "uchebnik-dlya-pensionerov-stili-CSS-v-veb-razrabotke.pdf",
      description:
        'Для людей "золотого возраста", которые хотят научиться верстать красивые сайты.',
      size: "13.9 МБ",
    },
    "uchebnik-yazyk-razmetki-gipertexta": {
      title:
        "Учебник «Язык разметки гипертекста (HTML): от основ до семантики и доступности»",
      filename:
        "uchebnik-yazyk-razmetki-gipertexta-(HTML)-ot-osnov-do-semantiki-i-dostupnosti.pdf",
      description:
        "Развернутое, максимально полное описание языка разметки гипертекста (HTML) с подробными примерами.",
      size: "7.4 МБ",
    },
  };

  // Обработка кликов по документам в меню
  documentLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Удаляем класс selected у всех элементов
      documentLinks.forEach((item) => {
        item.classList.remove("selected");
      });

      // Добавляем класс selected текущему элементу
      this.classList.add("selected");

      // Получаем тип превью из data-атрибута
      const previewType = this.getAttribute("data-preview");

      // Скрываем все превью
      document.querySelectorAll(".preview-section").forEach((section) => {
        section.style.display = "none";
      });

      // Скрываем сообщение "выберите учебник"
      noPreview.style.display = "none";

      // Показываем соответствующее превью
      const previewElement = document.getElementById(`${previewType}-preview`);
      if (previewElement) {
        previewElement.style.display = "block";
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

  console.log(
    "Сайт готов к работе! PDF-файлы должны находиться в папке downloads/"
  );
});

// ============================================
// СЧЕТЧИК ПОСЕТИТЕЛЕЙ ДЛЯ САЙТА УЧЕБНИКОВ
// ============================================

class VisitCounter {
  constructor() {
    this.stats = {
      totalVisits: 0,
      todayVisits: 0,
      uniqueVisits: 0,
      totalDownloads: 0,
      lastVisit: null,
      firstVisit: null,
    };

    this.today = new Date().toDateString();
    this.visitorId = this.getVisitorId();

    this.init();
  }

  // Генерация уникального ID посетителя
  getVisitorId() {
    let visitorId = localStorage.getItem("textbookVisitorId");
    if (!visitorId) {
      visitorId =
        "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("textbookVisitorId", visitorId);
    }
    return visitorId;
  }

  // Инициализация счетчика
  async init() {
    this.loadStats();
    await this.recordVisit();
    this.displayStats();
    this.setupDownloadTracking();
    this.setupVisitLogger();
  }

  // Загрузка статистики из localStorage
  loadStats() {
    const saved = localStorage.getItem("textbookStats");
    if (saved) {
      this.stats = JSON.parse(saved);

      // Сброс счетчика сегодняшних посещений, если это новый день
      if (this.stats.lastVisit) {
        const lastVisitDate = new Date(this.stats.lastVisit).toDateString();
        if (lastVisitDate !== this.today) {
          this.stats.todayVisits = 0;
        }
      }
    }

    // Первое посещение
    if (!this.stats.firstVisit) {
      this.stats.firstVisit = new Date().toISOString();
    }
  }

  // Сохранение статистики в localStorage
  saveStats() {
    localStorage.setItem("textbookStats", JSON.stringify(this.stats));
  }

  // Запись посещения
  async recordVisit() {
    // Проверяем, был ли сегодня визит у этого пользователя
    const todayVisitsKey = `textbookVisits_${this.today}`;
    const todayVisits = JSON.parse(
      localStorage.getItem(todayVisitsKey) || "[]"
    );

    const isUniqueToday = !todayVisits.includes(this.visitorId);

    if (isUniqueToday) {
      todayVisits.push(this.visitorId);
      localStorage.setItem(todayVisitsKey, JSON.stringify(todayVisits));
      this.stats.todayVisits++;
    }

    // Общие посещения
    const allVisitsKey = "textbookAllVisits";
    const allVisits = JSON.parse(localStorage.getItem(allVisitsKey) || "[]");

    if (!allVisits.includes(this.visitorId)) {
      allVisits.push(this.visitorId);
      localStorage.setItem(allVisitsKey, JSON.stringify(allVisits));
      this.stats.uniqueVisits++;
    }

    // Обновляем общий счетчик
    this.stats.totalVisits++;
    this.stats.lastVisit = new Date().toISOString();

    this.saveStats();

    // Логируем посещение
    this.logVisit("page_visit", "Посещение сайта");

    return this.stats;
  }

  // Логирование событий
  logVisit(type, details, bookTitle = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      visitorId: this.visitorId,
      type: type,
      details: details,
      bookTitle: bookTitle,
      page: window.location.pathname,
    };

    // Сохраняем лог
    const logs = JSON.parse(localStorage.getItem("textbookVisitLogs") || "[]");
    logs.unshift(logEntry); // Добавляем в начало
    logs.splice(100, logs.length); // Ограничиваем 100 записями
    localStorage.setItem("textbookVisitLogs", JSON.stringify(logs));

    // Обновляем статистику в реальном времени
    this.displayStats();
  }

  // Отображение статистики в футере
  displayStats() {
    // Создаем или находим блок статистики
    let statsContainer = document.querySelector(".visit-stats");

    if (!statsContainer) {
      const footerContent = document.querySelector(".footer-content");
      if (!footerContent) return;

      statsContainer = document.createElement("div");
      statsContainer.className = "visit-stats";
      statsContainer.style.cssText = `
                margin-top: 2rem;
                padding: 1rem;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 0.9rem;
            `;

      footerContent.appendChild(statsContainer);
    }

    // Форматируем дату
    const lastVisit = this.stats.lastVisit
      ? new Date(this.stats.lastVisit).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "никогда";

    // Форматируем первую дату посещения
    const firstVisit = this.stats.firstVisit
      ? new Date(this.stats.firstVisit).toLocaleDateString("ru-RU")
      : "сегодня";

    // Отображаем статистику
    statsContainer.innerHTML = `
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${this.stats.totalVisits.toLocaleString(
                      "ru-RU"
                    )}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">всего посещений</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${this.stats.uniqueVisits.toLocaleString(
                      "ru-RU"
                    )}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">уникальных посетителей</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${this.stats.todayVisits.toLocaleString(
                      "ru-RU"
                    )}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">сегодня</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${this.stats.totalDownloads.toLocaleString(
                      "ru-RU"
                    )}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">скачиваний</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.7;">
                Ваш ID: ${this.visitorId.substring(0, 8)}... • 
                Первый визит: ${firstVisit} • 
                Последний: ${lastVisit}
            </div>
        `;
  }

  // Отслеживание скачиваний
  setupDownloadTracking() {
    const downloadButtons = document.querySelectorAll(".download-btn");

    downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Находим название учебника
        let bookTitle = "";
        const previewContent = document.getElementById("preview-content");
        const activePreview = previewContent.querySelector(
          '.preview-section[style*="block"]'
        );

        if (activePreview) {
          const titleElement = activePreview.querySelector(".section-title");
          if (titleElement) {
            bookTitle = titleElement.textContent.replace("Оглавление: ", "");
          }
        }

        // Увеличиваем счетчик скачиваний
        this.stats.totalDownloads++;
        this.saveStats();

        // Логируем скачивание
        this.logVisit("download", "Скачивание учебника", bookTitle);

        // Показываем уведомление
        this.showDownloadNotification(bookTitle);
      });
    });
  }

  // Уведомление о скачивании
  showDownloadNotification(bookTitle) {
    // Создаем уведомление
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

    // Добавляем стили для анимации
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);

    notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Учебник скачивается</strong>
                    <div style="font-size: 0.9rem; margin-top: 0.2rem;">${
                      bookTitle || "Учебник"
                    }</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Логирование времени на сайте
  setupVisitLogger() {
    let startTime = Date.now();

    // Обновляем время каждую минуту
    const timeInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - startTime) / 60000); // в минутах

      if (timeSpent > 0) {
        this.logVisit("time_spent", `На сайте ${timeSpent} минут`);
      }
    }, 60000); // Каждую минуту

    // Очищаем интервал при закрытии страницы
    window.addEventListener("beforeunload", () => {
      clearInterval(timeInterval);
      const timeSpent = Math.floor((Date.now() - startTime) / 60000);
      if (timeSpent > 0) {
        this.logVisit("session_end", `Сессия: ${timeSpent} минут`);
      }
    });
  }

  // Получение полной статистики (для администратора)
  getFullStats() {
    const logs = JSON.parse(localStorage.getItem("textbookVisitLogs") || "[]");
    const todayVisitsKey = `textbookVisits_${this.today}`;
    const todayVisitors = JSON.parse(
      localStorage.getItem(todayVisitsKey) || "[]"
    );

    return {
      summary: this.stats,
      todayVisitors: todayVisitors.length,
      recentLogs: logs.slice(0, 10),
      allLogsCount: logs.length,
    };
  }

  // Сброс статистики (только для отладки)
  resetStats() {
    if (
      confirm(
        "Вы уверены, что хотите сбросить всю статистику? Это действие нельзя отменить."
      )
    ) {
      localStorage.removeItem("textbookStats");
      localStorage.removeItem("textbookVisitLogs");
      localStorage.removeItem("textbookAllVisits");

      // Удаляем все ключи с посещениями по дням
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("textbookVisits_")) {
          localStorage.removeItem(key);
        }
      });

      alert("Статистика сброшена. Страница будет перезагружена.");
      location.reload();
    }
  }
}

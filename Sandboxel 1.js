
    // 1. Описываем ваши правила Конвея со взвешенными соседями
    const lifeRules = {
        live: { alive: [2, 3] },
        dead: { birth: [3] },
        neighbors: [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [-1, 1], [-1, -1], [1, -1]
        ]
    };
(async()=>{
    await new Promise(res=>setTimeout(res,500));
    // Глобальная функция очистки категорий и кнопок UI игры
    function wipeGameUI() {
        // Очищаем массив категорий в ядре игры
        if (window.categories) window.categories = ["custom_life"];
        
        // Находим контейнеры интерфейса Sandboxels
        const elementButtonWindow = document.getElementById("elementButtons");
        const categoryButtonWindow = document.getElementById("categoryButtons");
        
        if (elementButtonWindow) elementButtonWindow.innerHTML = "";
        if (categoryButtonWindow) categoryButtonWindow.innerHTML = "";
    }

    // Хелпер для честного подсчета соседей (без Race Condition)
    function countWeight(x, y) {
        let neigh = 0;
        for (const [xPos, yPos, weight] of lifeRules.neighbors) {
            let nx = x + xPos;
            let ny = y + yPos;
            if (!outOfBounds(nx, ny) && pixelMap[nx][ny]) {
                // Считаем только те, что БЫЛИ живыми на начало этого кадра
                if (pixelMap[nx][ny].element === 'alive') {
                    neigh += weight ?? 1;
                }
            }
        }
        return neigh;
    }

    // 2. Регистрируем ваши элементы
    // Элемент-приветствие
    elements["Welcome to conway's game of life"] = {
        color: '#c8c8c8',
        category: 'custom_life',
        tick(pixel) {
            deletePixel(pixel.x, pixel.y); // Самоочищается при попытке нарисовать им
        }
    };

    // Живая клетка
    elements.alive = {
        color: '#00ff00',
        category: 'custom_life',
        state: 'solid',
        density: 1000,
        tick(pixel) {
            let neigh = countWeight(pixel.x, pixel.y);
            if (!lifeRules.live.alive.includes(neigh)) {
                pixel.data.nextState = 'dead'; // Отложенная мутация
            }
        }
    };

    // Мертвая клетка
    elements.dead = {
        color: '#989898',
        category: 'custom_life',
        state: 'solid',
        density: 1000,
        tick(pixel) {
            let neigh = countWeight(pixel.x, pixel.y);
            if (lifeRules.dead.birth.includes(neigh)) {
                pixel.data.nextState = 'alive'; // Отложенная мутация
            }
        }
    };

    // 3. Главный архитектурный хук
    runAfterAutoload(() => {
        // Удаляем ВСЕ стандартные элементы игры из реестра, кроме нашего пака
        const allowed = ["Welcome to conway's game of life", "alive", "dead", "eraser"];
        for (const key in elements) {
            if (!allowed.includes(key)) {
                delete elements[key];
            }
        }

        // Жестко принудительно перерисовываем интерфейс Sandboxels
        wipeGameUI();

        // Если в движке есть встроенная функция инициализации кнопок, вызываем её
        if (typeof window.createButtons === "function") {
            window.createButtons();
        }

        // Перехватываем конец тика симуляции для одновременного обновления клеток Конвея
        const originalUpdateSim = window.updateSim;
        window.updateSim = function() {
            if (originalUpdateSim) originalUpdateSim();

            // Буферизация: применяем изменения состояний клеток в один проход
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let pixel = pixelMap[x][y];
                    if (pixel && pixel.data && pixel.data.nextState) {
                        changePixel(pixel, pixel.data.nextState, true);
                        pixel.data.nextState = null;
                    }
                }
            }
        };
    });
})();

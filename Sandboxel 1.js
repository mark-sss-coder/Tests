// Глобальные правила Игры «Жизнь» Конвея (открыты для других модов)
window.lifeRules = {
    live: { alive: [2, 3] },
    dead: { birth: [3] },
    neighbors: [, [1, 0, 1, 0], [0, -1, 1, 0], [-1, 0, 1, 0],
, [-1, 1, 1, 0], [-1, -1, 1, 0], [1, -1, 1, 0]
    ]
};

// Текстовый блок-приветствие
elements['Welcome to conway\'s game of life!'] = {
    color: '#c8c8c8',
    category: 'land',
    density: 1000,
    tick(block) {
        deletePixel(block.x, block.y); // Корректное удаление пикселя из ядра
    }
};

// Живая клетка
elements.alive = {
    color: '#cecece',
    category: 'land',
    density: 1000,
    tick(pixel) {
        let neigh = 0;
        
        // Считаем соседей напрямую через твои lifeRules
        for (const [xPos, yPos, weight, deadWeight] of window.lifeRules.neighbors) {
            let nx = pixel.x + xPos;
            let ny = pixel.y + yPos;
            
            if (outOfBounds(nx, ny)) {
                neigh += deadWeight ?? 0;
            } else {
                // В Sandboxels оси инвертированы: pixelMap[y][x]
                let checkPixel = pixelMap[ny] ? pixelMap[ny][nx] : null;
                if (checkPixel && checkPixel.element === 'alive') {
                    neigh += weight ?? 1;
                } else {
                    neigh += deadWeight ?? 0;
                }
            }
        }
        
        if (!window.lifeRules.live.alive.includes(neigh)) {
            pixel.data.nextState = 'dead'; // Буферизация, чтобы не ломать кадр соседям
        }
    }
};

// Мертвая клетка
elements.dead = {
    color: '#989898',
    category: 'land',
    density: 1000,
    tick(pixel) {
        let neigh = 0;
        
        for (const [xPos, yPos, weight, deadWeight] of window.lifeRules.neighbors) {
            let nx = pixel.x + xPos;
            let ny = pixel.y + yPos;
            
            if (outOfBounds(nx, ny)) {
                neigh += deadWeight ?? 0;
            } else {
                let checkPixel = pixelMap[ny] ? pixelMap[ny][nx] : null;
                if (checkPixel && checkPixel.element === 'alive') {
                    neigh += weight ?? 1;
                } else {
                    neigh += deadWeight ?? 0;
                }
            }
        }
        
        if (window.lifeRules.dead.birth.includes(neigh)) {
            pixel.data.nextState = 'alive';
        }
    }
};

// Ждем загрузки игры, выводим кнопки вперед и запускаем буфер симуляции
runAfterAutoload(() => {
    // Выводим элементы в самое начало первой вкладки интерфейса
    const oldElements = { ...elements };
    for (const key in elements) delete elements[key];
    elements.alive = oldElements.alive;
    elements.dead = oldElements.dead;
    Object.assign(elements, oldElements);

    if (typeof window.createButtons === "function") {
        window.createButtons();
    }

    // Синхронно применяем изменения состояний в конце каждого кадра
    const originalUpdateSim = window.updateSim;
    window.updateSim = function() {
        if (originalUpdateSim) originalUpdateSim();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pixel = pixelMap[y] ? pixelMap[y][x] : null;
                if (pixel && pixel.data && pixel.data.nextState) {
                    changePixel(pixel, pixel.data.nextState, true);
                    pixel.data.nextState = null;
                }
            }
        }
    };
});

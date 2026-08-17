// 1. Правила Игры «Жизнь» (доступны глобально)
window.lifeRules = {
    live: { alive: [2, 3] },
    dead: { birth: [3] },
    neighbors: [, [1, 0, 1, 0], [0, -1, 1, 0], [-1, 0, 1, 0],
, [-1, 1, 1, 0], [-1, -1, 1, 0], [1, -1, 1, 0]
    ]
};

// 2. Блок-приветствие (самоочищается при клике)
elements['Welcome to conway\'s game of life!'] = {
    color: '#c8c8c8',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
        pixel.element = "eraser"; // По официальному гайду: просто превращаем в ластик/пустоту
    }
};

// 3. Живая клетка
elements.alive = {
    color: '#cecece',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
        let neigh = 0;
        
        for (const [xPos, yPos, weight, deadWeight] of window.lifeRules.neighbors) {
            let nx = pixel.x + xPos;
            let ny = pixel.y + yPos;
            
            if (outOfBounds(nx, ny)) {
                neigh += deadWeight ?? 0;
            } else {
                // Используем правильные оси из ядра Sandboxels: pixelMap[y][x]
                let checkPixel = pixelMap[ny] ? pixelMap[ny][nx] : null;
                if (checkPixel && checkPixel.element === 'alive') {
                    neigh += weight ?? 1;
                } else {
                    neigh += deadWeight ?? 0;
                }
            }
        }
        
        // Записываем будущее состояние в кастомное свойство объекта пикселя
        if (!window.lifeRules.live.alive.includes(neigh)) {
            pixel.nextState = 'dead';
        } else {
            pixel.nextState = 'alive';
        }
    }
};

// 4. Мертвая клетка
elements.dead = {
    color: '#989898',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
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
            pixel.nextState = 'alive';
        } else {
            pixel.nextState = 'dead';
        }
    }
};

// 5. Чистый перенос состояния (Вызывается движком на каждом кадре для каждого пикселя)
// Этот дополнительный шаг гарантирует синхронность без перезаписи ядра
elements.alive.postTick = function(pixel) {
    if (pixel.nextState) {
        pixel.element = pixel.nextState;
    }
};
elements.dead.postTick = elements.alive.postTick;

// 6. Сортировка кнопок (выводим их в самый верх вкладки land)
const oldElements = { ...elements };
for (const key in elements) delete elements[key];
elements.alive = oldElements.alive;
elements.dead = oldElements.dead;
Object.assign(elements, oldElements);

// Обновляем интерфейс игры
if (typeof window.createButtons === "function") {
    window.createButtons();
}

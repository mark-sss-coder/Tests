(() => {
    var lifeRules = {
        live: { live: [2, 3] },
        dead: { live: [3] },
        neighbors: [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
    };

    elements.alive = {
        color: '#eeeeee',
        name: 'Alive cell',
        category: 'land'
    };

    elements.dead = {
        color: '#888888',
        name: 'Dead cell',
        category: 'land'
    };

    runEveryTick(() => {
        // 1. Делаем снимок только ИМЕН элементов, чтобы не портить живую карту во время цикла
        const oldElements = pixelMap.map(row => row.map(pixel => pixel ? pixel.element : null));

        // 2. Итерируемся по фиксированной сетке Sandboxel
        for (let i = 0; i < pixelMapW; i++) {
            for (let j = 0; j < pixelMapH; j++) {
                let nCount = 0;

                for (let n of lifeRules.neighbors) {
                    const ni = i + n[0];
                    const nj = j + n[1];

                    // Защита: проверяем границы встроенной функцией игры
                    if (outOfBounds(ni, nj)) {
                        nCount += (n[3] ?? 0); // Вес мертвой клетки за экраном
                    } else {
                        // Безопасное чтение: если колонки ni нет, ?. предотвратит краш
                        const neighborElement = oldElements[ni]?.[nj];
                        if (neighborElement === 'alive') {
                            nCount += (n[2] ?? 1); // Вес живой клетки
                        } else {
                            nCount += (n[3] ?? 0); // Вес мертвой клетки
                        }
                    }
                }

                const currentPixel = pixelMap[i][j];
                const currentElement = oldElements[i][j];

                // 3. Применяем правила "Жизни"
                if (currentPixel) {
                    if (currentElement === 'alive' && !lifeRules.live.live.includes(nCount)) {
                        changePixel(currentPixel, 'dead');
                    } 
                    else if (currentElement === 'dead' && lifeRules.dead.live.includes(nCount)) {
                        changePixel(currentPixel, 'alive');
                    }
                }
            }
        }
    });
    
    console.log("Мод 'Жизнь' успешно внедрен в консоль!");
})();

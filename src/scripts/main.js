'use strict';

export class Game {
  constructor(initialState) {
    this.score = 0; // Початковий рахунок
    this.status = 'playing'; // Статус гри

    // Створюємо поле: або копіюємо вхідне, або створюємо порожнє 4x4
    if (initialState) {
      this.field = initialState.map(row => [...row]);
    } else {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  // Метод для додавання випадкової плитки (2 або 4) у порожню клітинку
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { x, y } = emptyCells[randomIndex];

    this.field[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  // Скидання гри до початкового стану
  start() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  // Допоміжні методи для отримання даних
  getState() {
    return this.field;
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }

  // РУХ ЛІВОРУЧ ⬅️
  moveLeft() {
    let moved = false;

    this.field = this.field.map(row => {
      let filteredRow = row.filter(item => item !== 0); // Прибираємо нулі

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2; // Злиття
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1); // Видаляємо зайве

          if (filteredRow[i] === 2048) {
            this.status = 'won';
          }
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0); // Додаємо нулі в кінець
      }

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  // РУХ ПРАВОРУЧ ➡️
  moveRight() {
    let moved = false;

    this.field = this.field.map(row => {
      let filteredRow = row.filter(item => item !== 0); // Прибираємо нулі

      // Йдемо з кінця для правильного злиття праворуч
      for (let i = filteredRow.length - 2; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i + 1] *= 2; // Подвоюємо саме ПРАВЕ число
          this.score += filteredRow[i + 1];
          filteredRow.splice(i, 1); // Видаляємо ЛІВЕ число

          // Після видалення елемента i, наше подвоєне число тепер на позиції i
          if (filteredRow[i] === 2048) {
            this.status = 'won';
          }
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.unshift(0); // Додаємо нулі на ПОЧАТОК
      }

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }
  // РУХ ВГОРУ ⬆️
  moveUp() {
    this.field = this.transpose(this.field);

    const moved = this.moveLeft();

    this.field = this.transpose(this.field);

    return moved;
  }

  // РУХ ВНИЗ ⬇️
  moveDown() {
    this.field = this.transpose(this.field);

    const moved = this.moveRight();

    this.field = this.transpose(this.field);

    return moved;
  }
} // Кінець класу Game

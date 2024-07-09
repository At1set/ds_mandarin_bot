export function compareObjects(obj1, obj2) {
  // Проверяем, что оба объекта существуют
  if (!obj1 || !obj2) {
    return false
  }

  // Проверяем, что у объектов одинаковое количество свойств
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }

  // Проверяем, что у объектов одинаковые свойства и значения
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
        return false
      }
    }
  }

  // Если все свойства и значения одинаковые, объекты равны
  return true
}
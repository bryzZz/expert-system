import { BuildingType } from "../types";

const getAvg = (arr: number[]) => {
  return arr.reduce((acc, cur) => acc + cur) / arr.length;
};

export function getTopology(
  forecast: Record<string, number[]>,
  objectsCount: Record<BuildingType, number>
) {
  const avgForecast = Object.fromEntries(
    Object.entries(forecast).map(([key, value]) => [key, getAvg(value)])
  );
  console.log(avgForecast);

  const results: string[][] = [[], [], [], []];

  for (let i = 0; i < objectsCount["windmill"] ?? 0; i++) {
    results[2].push(`windmill${i + 1}`);
  }
  for (let i = 0; i < objectsCount["solarPanel"] ?? 0; i++) {
    results[2].push(`solarPanel${i + 1}`);
  }

  for (let i = 0; i < objectsCount["home"] ?? 0; i++) {
    results[3].push(`home${i + 1}`);
  }

  // Распределение больниц
  const allHospitals = new Array((objectsCount["hospital"] ?? 0) * 2)
    .fill(0)
    .map((_, i) => `hospital${Math.floor(i / 2)}`);
  for (let i = 0; i < allHospitals.length; i++) {
    for (let j = 0; j < results.length; j++) {
      if (results[j].includes(allHospitals[i])) continue;

      results[j].push(allHospitals[i]);

      break;
    }
  }

  // Распределение заводов
  const allFactories = new Array(objectsCount["factory"] ?? 0)
    .fill(0)
    .map((_, i) => `factory${Math.floor(i / 2)}`);
  for (let i = 0; i < allFactories.length; i++) {
    for (let j = 0; j < results.length; j++) {
      if (results[j].includes(allFactories[i])) continue;

      results[j].push(allFactories[i]);

      break;
    }
  }

  return results;

  //Тут что-то делать
  //Для начала пускай просто раскидывает объекты по веткам, согласно правилам. По возможности, использует все ветки.
  //Из словаря с количеством объектов создать 2 списка, где каждый объект хранится отдельно - отдельно для генераторов и потребителей.
  //Т.К. ветки всего 4, необходимо раздельно раскидать по ним приёмники и генераторы так, чтобы суммарная мощность на каждой ветке была минимальной.
  //Для этого:
  //(Вариант без учёта подстанции)
  //Расчитаем суммарную мощность для всех потребителей и производителей
  //Делить напряжение лучше всего поровну, что оставляет всего три варианта деления напряжения между приёмниками и производителями:
  //1:3, 2:2 и 3:1 (соотношение линий)
  //uP - мощность потребителей
  //uG - мощность генераторов
  //(А если учитывать подстанцию???)
  //Тогда можно сбалансить бОльшую часть мощности за подстанцией, а остальное раскидать поровну на оставшиеся две ветки.
  //Тогда сравниваем генераторы и потребителей.
  //if uP > uG then подключаем тупо ВСЕ генераторы за подстанцией, балансим их потребителями и раскидываем остальных потребителей поровну по остальным веткам.
  //if uP ~~ uG then подключаем всех за подстанцией и всё
  //else см. парой строк выше, но с генераторами вместо потребителей
  //Посчитать средние показатели затрат и генерации для каждого здания отдельно
  //С
}

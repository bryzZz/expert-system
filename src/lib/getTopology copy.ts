import { BuildingType } from "../types";

export function getTopology(
  forecast: Record<string, number[]>,
  objectsCount: Record<BuildingType, number>
) {
  const keys = ["Дома", "Заводы", "Больницы", "Солнце", "Ветер"];

  const getAvg = (arr: number[]) => {
    return arr.reduce((acc, cur) => acc + cur) / arr.length;
  };

  function getcount(
    N: number,
    order: number,
    border: number,
    eng: {
      [k: string]: number;
    }
  ) {
    const l: number[] = [0, 0, 0, 0, 0];
    for (let j = 0; j < N; j++) {
      const b = border & 7;
      const o = order & 3;
      let e = eng[keys[b]];
      if (b === 4 || b === 3) {
        e *= -1;
      }
      l[o] = l[o] + e;
      border = border >> 3;
      order = order >> 2;
    }
    l[4] = l[3] + l[2];

    for (let i = 0; i < 5; i++) {
      let koef = 0.000888889 * (l[i] * l[i]);
      if (koef > 0.2) koef = 0.2;
      l[i] = Math.abs(l[i]) * koef;
    }
    return l[0] + l[1] + l[2] + l[3] + l[4];
  }

  function getprevtopology(
    d: number,
    f: number,
    h: number,
    s: number,
    w: number,
    eng: {
      [k: string]: number;
    }
  ) {
    const N = d + f * 2 + h * 2 + s + w;

    let border = 0;

    let minorder = 0;
    let mineng = 10000;
    for (let i = 0; i < d; i++) {
      border = (border << 3) | 0;
    }
    for (let i = 0; i < f; i++) {
      border = (border << 6) | 9;
    }
    for (let i = 0; i < s; i++) {
      border = (border << 3) | 3;
    }
    for (let i = 0; i < w; i++) {
      border = (border << 3) | 4;
    }
    for (let i = 0; i < h; i++) {
      border = (border << 6) | 18;
    }

    let order = 0;
    for (order; order < 2 ** (N * 2 + 1); order++) {
      let isCorrect = true;
      let Plines = 0;
      let Clines = 0;
      const tempH = order & (2 ** (h * 4 + 1) - 1);
      for (let i = 0; i < h; i++) {
        if (((tempH >> (i * 4)) & 3) == ((tempH >> (i * 4 + 2)) & 3)) {
          isCorrect = false;
          break;
        }
        Clines |=
          (1 << ((tempH >> (i * 4)) & 3)) | (1 << ((tempH >> (i * 4 + 2)) & 3));
      }
      const tempG = (order >> (h * 4)) & ((1 << ((s + w) * 2 + 1)) - 1);
      for (let i = 0; i < s + w; i++) {
        Plines |= 1 << ((tempG >> (i * 2)) & 3);
      }

      for (let i = s + w + h * 2; i < N; i++) {
        Clines |= 1 << ((order >> (i * 2)) & 3);
      }
      if (isCorrect && (Clines & Plines) == 0) {
        const f = getcount(N, order, border, eng);
        if (f < mineng) {
          mineng = f;
          minorder = order;
        }
      }
    }

    return { N, border, minorder };
  }

  const avgForecast = Object.fromEntries(
    Object.entries(forecast).map(([key, value]) => [key, getAvg(value)])
  );

  const a = getprevtopology(
    objectsCount.home ?? 0,
    objectsCount.factory ?? 0,
    objectsCount.hospital ?? 0,
    objectsCount.solarPanel ?? 0,
    objectsCount.windmill ?? 0,
    avgForecast
  );

  let house_count = 0;
  let hospital_count = 1;
  let factory_count = 1;
  let solar_count = 0;
  let windmill_count = 0;
  const results: string[][] = [[], [], [], []];
  const buildings: string[] = [
    "home",
    "factory",
    "hospital",
    "windmill",
    "solarPanel",
  ];
  for (let i = 0; i < a["N"]; i++) {
    const build_index = a["border"] & 7;
    const build_line = a["minorder"] & 3;
    let tempbuild = buildings[build_index];

    switch (build_index) {
      case 0: {
        //house
        house_count++;
        tempbuild += house_count;
        break;
      }
      case 1: {
        //factory
        factory_count++;
        tempbuild += Math.floor(factory_count / 2);
        break;
      }
      case 2: {
        //hospital
        hospital_count++;
        tempbuild += Math.floor(hospital_count / 2);
        break;
      }
      case 4: {
        //windmill
        windmill_count++;
        tempbuild += windmill_count;
        break;
      }
      case 3: {
        //solar
        solar_count++;
        tempbuild += solar_count;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    results[build_line].push(tempbuild);

    a["border"] = a["border"] >> 3;
    a["minorder"] = a["minorder"] >> 2;
  }

  return results;
}

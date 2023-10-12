export const CSVToArray = (strData: string) => {
  const lines = strData.split("\n");
  const labels = lines[0].split("	");
  labels.shift();

  const result = labels.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
  }, {} as Record<string, number[]>);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const data = line.split("	");
    data.shift();

    for (let i = 0; i < data.length; i++) {
      result[labels[i]].push(Number(data[i]));
    }
  }

  return result;
};

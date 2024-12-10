type SimpleObject = { [key: string]: string | number | boolean };
type ArrayOfObjects = SimpleObject[];

const UnwindObject = (
  data: SimpleObject,
  indexer?: { value: number; },
) => {
  if (!indexer || !indexer.value) {
    indexer = { value: 0 };
  }

  return Object.entries(data)
    .map((item) => {
      if (typeof item[1] === 'object') {
        return UnwindObject(item[1], indexer);
      }
      indexer.value++;

      const key = (item.at(0) + '_' + indexer.value).toLocaleLowerCase();
      return Object.fromEntries([[key, item.at(1)]]);
    })
    .flat();
};

const SortByKeysNatural = (data: ArrayOfObjects) => {
  return data.sort(
    (a, b) => {
      const _a = Object.keys(a).at(0) || "";
      const _b = Object.keys(b).at(0) || "";

      return _a.localeCompare(_b, undefined, {
        numeric: true,
        caseFirst: 'upper'
      });
    }
  );
};

export const FlatString = <T>(data: T): string => {
  return SortByKeysNatural(UnwindObject(data as SimpleObject))
    .map((item) => Object.values(item).at(0))
    .join('');
};

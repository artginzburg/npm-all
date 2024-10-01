export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];
export type Join<T extends string[], Separator extends string> = T extends []
  ? ''
  : T extends [infer Head, ...infer Tail]
    ? Head extends string
      ? `${Head}${Tail extends [] ? '' : Separator}${Join<Tail extends string[] ? Tail : [], Separator>}`
      : never
    : never;

export function typedSplit<Word extends string, Separator extends string>(
  word: Word,
  separator: Separator,
) {
  return word.split(separator) as Split<Word, Separator>;
}

/** If you're passing a literal array — remember to use `as const`, otherwise the return type will be `never` */
export function typedJoin<Words extends string[], Separator extends string>(
  arr: Words,
  separator: Separator,
) {
  return arr.join(separator) as Join<Words, Separator>;
}

export type AutocompleteUnknownString<T> = T | ({} & string);

export type ExtractNumberAndUnit<
  S extends string,
  Acc extends string = '',
  Dot extends '.' | '' = '',
> = S extends `${infer F}${infer R}`
  ? F extends `${number}`
    ? ExtractNumberAndUnit<R, `${Acc}${F}`, Dot>
    : F extends '.'
      ? Dot extends '.'
        ? [StringAsNumber<Acc>, `.${R}`]
        : ExtractNumberAndUnit<`${R}`, `${Acc}.`, '.'>
      : [Acc extends '' ? never : StringAsNumber<Acc>, S]
  : never;

export type StringAsNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

export function parseUnitString<UnitString extends string>(unitString: UnitString) {
  const value = parseFloat(unitString);
  const unit = unitString.replace(String(value), '');
  type Extracted = ExtractNumberAndUnit<UnitString>;

  return [value as Extracted[0], unit as Extracted[1]] as const;
}

export function getLinariaDataAttribute<
  Props extends Record<string, string | number | bigint | boolean | null | undefined>,
>(attribute: keyof Props & string & `data-${string}`, value?: `${Props[typeof attribute]}`) {
  return `[${attribute as typeof attribute}${value === undefined ? '' : `='${value}'`}]`;
}

export type LinariaHTMLElementType<T> =
  T extends React.ComponentType<infer P>
    ? P extends React.HTMLAttributes<infer U>
      ? U
      : never
    : never;

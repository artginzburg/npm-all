/**
 * You can use this type to pass props that are not optimal to be passed by {@link ReactStateTuple}
 * due to being also used in the passing component.
 *
 * @example
 *   ReactStateRecord<'rememberMe', boolean>;
 *   // is the same as:
 *   {
 *     rememberMe: boolean;
 *     setRememberMe: Dispatch<SetStateAction<boolean>>;
 *   }
 */
export type ReactStateRecord<StateName extends string, StateType> = Record<StateName, StateType> &
  Record<`set${Capitalize<StateName>}`, ReactStateSetter<StateType>>;

/**
 * The type returned by {@link React.useState}. Useful for passing the whole state through just one
 * component prop.
 *
 * @example
 *   ReactStateTuple<boolean>;
 *   // is the same as:
 *   [boolean, Dispatch<SetStateAction<boolean>>];
 */
export type ReactStateTuple<StateType> = [StateType, ReactStateSetter<StateType>];

/**
 * The type of the second element returned by {@link React.useState}. Just a shortcut to have one
 * generic type instead of a sequence of two.
 *
 * @example
 *   ReactStateSetter<boolean>;
 *   // is the same as:
 *   Dispatch<SetStateAction<boolean>>;
 */
export type ReactStateSetter<StateType> = React.Dispatch<React.SetStateAction<StateType>>;

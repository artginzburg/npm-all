import type { JSX } from 'react';

export const inputAutoCompletes = {
  tel: {
    type: 'tel',
    autoComplete: 'tel',
    name: 'phone',
  },
  fullName: {
    type: 'text',
    autoCapitalize: 'words',
    autoComplete: 'name',
    style: {
      textTransform: 'capitalize',
    },
  },
  email: {
    type: 'email',
    autoComplete: 'email',
    name: 'email',
    style: {
      textTransform: 'lowercase',
    },
  },
  address: {
    postalCode: {
      type: 'number',
      autoComplete: 'postal-code',
    },
    city: {
      type: 'text',
      autoComplete: 'address-level2',
      autoCapitalize: 'on',
    },
    /**
     * Has to then be manually split into `street` and `home_number`, if the back-end expects those.
     * But back-end should not expect those, as it just adds a level of complexity, not to mention
     * that there's no autocomplete to get street and house number separately (which your designer
     * should also be aware of)
     */
    streetAndHouse: {
      type: 'text',
      autoComplete: 'address-line1',
      autoCapitalize: 'on',
    },
    /** Aka "flat number" */
    apartmentNumber: {
      type: 'text',
      autoComplete: 'address-line2',
    },
  },
} as const satisfies Record<
  string,
  JSX.IntrinsicElements['input'] | Record<string, JSX.IntrinsicElements['input']>
>;

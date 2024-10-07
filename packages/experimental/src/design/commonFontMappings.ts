export enum CommonFontStyle {
  Normal = 'normal',
  Italic = 'italic',
}
export type FontStyle = `${CommonFontStyle}`;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping */
export enum CommonFontWeight {
  /** (Hairline) */
  aThin = 100,
  /** (Ultra Light) */
  bExtraLight = 200,
  cLight = 300,
  /** (Normal) */
  dRegular = 400,
  eMedium = 500,
  /** (Demi Bold) */
  fSemiBold = 600,
  gBold = 700,
  /** (Ultra Bold) */
  hExtraBold = 800,
  /** (Heavy) */
  iBlack = 900,
}

export type FontWeight<T extends keyof typeof CommonFontWeight = keyof typeof CommonFontWeight> =
  `${(typeof CommonFontWeight)[T]}`;

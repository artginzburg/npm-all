// eslint-disable-next-line @typescript-eslint/no-unused-vars
function htmlTableToObject(
  /** @type {HTMLTableElement} */
  table,
  /** Mostly useful for cells that have `span`s inside that are only shown on mobiles */
  onlyVisible = true,
) {
  const trs = table.querySelectorAll('tr');
  // @ts-expect-error this helper is designed for manual usage in the browser, so this is not critical
  const headers = Array.from(trs[0].querySelectorAll('th')).map((th) =>
    (onlyVisible ? th.innerText : (th.textContent ?? th.innerText)).trim(),
  );
  const ret = [];
  for (let i = 1; i < trs.length; i++) {
    /** @type Record<string, string> */
    const obj = {};
    // @ts-expect-error this helper is designed for manual usage in the browser, so this is not critical
    const tds = trs[i].querySelectorAll('td');
    for (let j = 0; j < tds.length; j++) {
      // @ts-expect-error this helper is designed for manual usage in the browser, so this is not critical
      obj[headers[j]] = // @ts-expect-error this helper is designed for manual usage in the browser, so this is not critical
        (onlyVisible ? tds[j].innerText : (tds[j].textContent ?? tds[j].innerText)).trim();
    }
    ret.push(obj);
  }
  return ret;
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import groupBy from 'object.groupby';

import type { parsedTable } from './parsedTable';

export function groupDeviceSizes(tableContent: typeof parsedTable) {
  const filtered = tableContent.filter(
    (device) => device['Scale Factor'] !== '1' && !device['Family & Model'].includes('Watch'),
  );

  const grouped = groupBy(
    filtered,
    (device) => `${device['Logical Width']}_${device['Logical Height']}_${device['Scale Factor']}`,
  );

  if (process.env.NODE_ENV !== 'production') {
    {
      // Validate that grouping by logical dimensions also groups by physical dimensions
      Object.values(grouped).forEach((deviceGroup) => {
        const deviceToCompare = deviceGroup[0]!;
        const logicalDimensions = `${deviceToCompare['Physical Width']}x${deviceToCompare['Physical Height']}`;
        if (
          !deviceGroup.every(
            (device) =>
              `${device['Physical Width']}x${device['Physical Height']}` === logicalDimensions,
          ) &&
          !(deviceToCompare['Family & Model'] === 'iPhone 13 mini') // ! ignoring the mini iPhones here, since idk how am I supposed to deal with that, other than merging the minis into another group and hoping Apple planned for that.
        ) {
          console.error(
            'The following device group has different physical dimensions, whilst logical stay the same. How the hell is this possible and how do I target that via a media query?',
            deviceGroup,
          );
        }
      });
    }
    {
      // Validate length
      const length = Object.keys(grouped).length;

      if (length > 19) {
        console.error(
          'Check the filters, something unnecessary might still be in the Apple device sizes. Or they made a device with yet different dimensions',
        );
      }
    }
  }

  const merged = Object.values(grouped).map((devices) => {
    const sourceDevice = devices.at(-1)!;
    const modelsString = devices
      .map((device) => device['Family & Model'])
      .join('__')
      .replaceAll(' ', '_');
    const asDeviceSize = {
      filename: `${sourceDevice['Physical Width']}x${sourceDevice['Physical Height']}__${modelsString}`,
      pixelRatio: Number(sourceDevice['Scale Factor']),
      width: Number(sourceDevice['Logical Width']),
      height: Number(sourceDevice['Logical Height']),
    };
    return asDeviceSize;
  });

  return merged;
}

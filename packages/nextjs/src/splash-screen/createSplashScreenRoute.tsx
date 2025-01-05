import { ImageResponse } from 'next/og';

import { appleDeviceSizesWithSlugs, getAppleDeviceSizeBySlug } from './shared';

export function createSplashScreenRoute({
  ImageComponent,
  imageSize,
  sizingStrategy,
  ImageContainerComponent = FullCenterImageContainerComponent,
  imageContainerComponentProps,
}: {
  ImageComponent: React.FC<{ style: React.CSSProperties }>;
  imageSize: ImageSize;
  sizingStrategy: SizingStrategy;
  ImageContainerComponent?: React.FC<ImageContainerComponentProps>;
  imageContainerComponentProps?: Partial<React.ComponentProps<typeof ImageContainerComponent>>;
}): {
  generateStaticParams: () => SplashParams[];
  GET: (_req: Request, { params }: SplashProps) => Promise<ImageResponse>;
} {
  return {
    generateStaticParams: () => appleDeviceSizesWithSlugs,
    async GET(_req, { params }) {
      const { slug } = await params;
      const deviceSize = getAppleDeviceSizeBySlug(slug);
      const screenSize = getScreenSizeByDeviceSize(deviceSize);

      return new ImageResponse(
        (
          <ImageContainerComponent {...imageContainerComponentProps}>
            <ImageComponent style={sizingStrategy.sizingMethod(screenSize, imageSize)} />
          </ImageContainerComponent>
        ),
        {
          ...screenSize,
        },
      );
    },
  };
}

type SplashParams = { slug: string };
export type SplashProps = { params: Promise<SplashParams> };

function getScreenSizeByDeviceSize(
  deviceSize: ReturnType<typeof getAppleDeviceSizeBySlug>,
): ImageSize {
  return {
    width: deviceSize.width * deviceSize.pixelRatio,
    height: deviceSize.height * deviceSize.pixelRatio,
  };
}

export class SizingStrategy {
  constructor(public sizingMethod: (screenSize: ImageSize, imageSize: ImageSize) => ImageSize) {}
}

export class SizingStrategyByWidthPercentage extends SizingStrategy {
  constructor(targetWidthPercents: number) {
    super((screenSize, imageSize) => {
      const targetWidth = screenSize.width * targetWidthPercents;
      const autoHeight = (targetWidth / imageSize.width) * imageSize.height;

      return {
        width: targetWidth,
        height: autoHeight,
      };
    });
  }
}
export type ImageSize = { width: number; height: number };

export type ImageContainerComponentProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
};
export function FullCenterImageContainerComponent(props: ImageContainerComponentProps) {
  return (
    <div
      {...props}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}
    />
  );
}

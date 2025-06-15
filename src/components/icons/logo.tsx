import Image, { type ImageProps } from 'next/image';

interface LogoProps extends Omit<ImageProps, 'src' | 'alt'> {
  className?: string;
  // Explicit width/height for the Next/Image component. These define the aspect ratio and base render size.
  // Tailwind classes in className can then scale this.
  width?: number;
  height?: number;
}

// Assuming an approximate aspect ratio of 3:1 (e.g., 150px width, 50px height) for the new logo.
// Adjust these default width/height values if your logo's aspect ratio is different.
const Logo = ({ className, width = 150, height = 50, ...rest }: LogoProps) => (
  <Image
    // Replace this placeholder with the actual path to your logo image in the /public directory
    // For example: src="/snowman-logo.png"
    src="/logo.png"
    alt="Snowman Studio Logo"
    width={width} // Intrinsic width of the logo image
    height={height} // Intrinsic height of the logo image
    className={className} // Tailwind classes for display size control (e.g., h-10 w-auto)
    priority // Logo in header is often LCP, consider removing if not always the case or controlling from call site
    {...rest}
  />
);

export default Logo;

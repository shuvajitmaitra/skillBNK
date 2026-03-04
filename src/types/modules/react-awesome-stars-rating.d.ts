declare module "react-awesome-stars-rating" {
  import { ComponentType } from "react";

  interface AwesomeStarsRatingProps {
    value: number;
    onChange: (value: number) => void;
    size?: number;
    isHalf?: boolean;
    disabled?: boolean;
    [key: string]: any; // Allow other props as well
  }

  const AwesomeStarsRating: ComponentType<AwesomeStarsRatingProps>;

  export default AwesomeStarsRating;
}

export enum AnimationStylesEnum {
  SLIDE_LEFT_RIGHT,
  DROP_DOWN_UP,
  SLIDE_UP
}

export function getAnimationStyles(): typeof AnimationStylesEnum {
  return AnimationStylesEnum;
}

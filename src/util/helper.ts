import config from '@/../tailwind.config';

export function randomHexColor(): string {
  let hexCode = "";
  const tintDarkcolors = Object.values(config.theme.extend.colors.systemTintDark);
  let randomIndex = Math.round(Math.random()*(tintDarkcolors.length-1));
  hexCode = tintDarkcolors[randomIndex];
  return hexCode;
}

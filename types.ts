
export enum ThemeType {
  PinkSoft = 'PinkSoft',
  BlueSky = 'BlueSky',
  MidnightBlue = 'MidnightBlue',
  MaroonMahony = 'MaroonMahony',
  ChocolateCaramel = 'ChocolateCaramel'
}

export enum Language {
  English = 'en',
  Indonesian = 'id',
  Malaysian = 'ms'
}

export enum SubjectType {
  ProductOnly = 'Product Only',
  Held = 'Held',
  FullModel = 'Full Model',
  POV = 'POV'
}

export enum Gender {
  Female = 'Female',
  Male = 'Male'
}

export enum Style {
  Retro = 'Retro',
  SoftAesthetic = 'Soft Aesthetic'
}

export enum AspectRatio {
  Square = '1:1',
  Portrait = '9:16',
  Landscape = '16:9',
  Standard = '4:3',
  Tall = '3:4'
}

export enum Resolution {
  HD = 'HD',
  Standard = 'Standard'
}

export interface AppTheme {
  bg: string;
  card: string;
  text: string;
  accent: string;
  border: string;
  secondaryText: string;
}

export interface AppState {
  theme: ThemeType;
  language: Language;
  productImage: string | null;
  backgroundImage: string | null;
  subjectType: SubjectType;
  gender: Gender;
  noModel: boolean;
  additionalPrompt: string;
  style: Style;
  count: number;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  branding: string;
}

export enum CarModel {
    Fabia = 'Fabia',
    Octavia = 'Octavia',
    Superb = 'Superb',
    Kodiaq = 'Kodiaq',
    Karoq = 'Karoq'
  }

export enum EngineType {
    OneZeroTSI = "1.0 TSI",
    OneFiveTSI = "1.5 TSI",
    OneSixTDI = "1.6 TDI",
    TwoZeroTDI = "2.0 TDI"
}

export enum TrimLevel {
    Essence = 'Essence',
    Selection = 'Selection',
    LK = 'LK',
    RS = 'RS'
}

export enum OptionalService {
    NoOptionalService = "Nincs extra szolgáltatás",
    OneYearWarranty = '1 év garancia',
    ThreeYearWarranty = '3 év garancia',
    SmallServiceDiscount = 'Kedvezményes kis szervíz',
    LargeServiceDiscount = 'Kedvezményes nagy szervíz'
}


export const availableImages: string[] = [
    'assets/carImages/fabia-blue.png',
    'assets/carImages/fabia-red.png',
    'assets/carImages/fabia-white.png',
    'assets/carImages/karoq-black.png',
    'assets/carImages/karoq-orange.png',
    'assets/carImages/karoq-red.png',
    'assets/carImages/kodiaq-white.png',
    'assets/carImages/kodiaq-blue.png',
    'assets/carImages/kodiaq-yellow.png',
    'assets/carImages/octavia-black.png',
    'assets/carImages/octavia-grey.png',
    'assets/carImages/octavia-white.png',
    'assets/carImages/superb-green.png',
    'assets/carImages/superb-grey.png',
    'assets/carImages/superb-red.png',
] as const;

export const PRODUCT_UNITS = {
    KG: "kg" as const,
    PIECE: "piece" as const,
} as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[keyof typeof PRODUCT_UNITS];

export const UNIT_LABELS = {
    [PRODUCT_UNITS.KG]: {
        short: "кг",
        full: "кілограм",
        perUnit: "/ кг",
    },
    [PRODUCT_UNITS.PIECE]: {
        short: "шт",
        full: "штука",
        perUnit: "/ шт",
    },
} as const;

export const DEFAULT_UNIT = PRODUCT_UNITS.KG;

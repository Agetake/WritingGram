import { LevelInterface } from "./level.interface";
import { PaperTypeInterface } from "./paper-type.interface";

export interface DeadlineRatesInterface {
  id: string;
  hoursRemaining: 6 | 12 | 24 | 48 | 72 | 120 | 168 | 240 | 336 | 672 | 1344; // hours
  levels:[
    {
      id: LevelInterface['code'],
      paperTypes: [
        {
          id: PaperTypeInterface['code'],
          rate: [
            {
              id: 'single-spaced';
              type: {
                original: {
                  pricePerPage: number;
                };
                rewriting: {
                  pricePerPage: number;
                };
                editing: {
                  pricePerPage: number;
                };
              }
            },
            {
              id: 'double-spaced';
              type: {
                original: {
                  pricePerPage: number;
                };
                rewriting: {
                  pricePerPage: number;
                };
                editing: {
                  pricePerPage: number;
                };
              }
            }
          ]
        }
      ]
    }
  ]
}

export interface PageRateInterface {
  id: 'single-spaced' | 'double-spaced';
  type: {
    original: {
      pricePerPage: number;
    };
    rewriting: {
      pricePerPage: number;
    };
    editing: {
      pricePerPage: number;
    };
  }
}

export interface LevelRatesInterface {
  id: LevelInterface['code'],
  paperTypes: [
    id: PaperTypeInterface['code'],
    rate: PageRateInterface
  ]
}

export interface PaperCalculatorInterface {
  deadline: number;
  levelCode: number;
  paperTypeCode: number;
  spacing: 'double-spaced' | 'single-spaced';
  noOfPages: number;
  mode: 'original' | 'editing' | 'rewriting';
}

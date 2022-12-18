import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DeadlineRatesInterface, PaperCalculatorInterface } from 'src/app/shared/interfaces/rate.interface';
import { RatesService } from 'src/app/shared/services/rates/rates.service';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewRateComponent } from '../view-rate/view-rate.component';
import { paperTypes } from 'src/assets/json/paper-types.data';
import { levels } from 'src/assets/json/levels.data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit, OnDestroy {

  rates: DeadlineRatesInterface[] | [] = [];

  destroy$ = new Subject();

  displayedColumns: string[] = ['hoursRemaining', 'more'];

  dataSource = new MatTableDataSource<DeadlineRatesInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  noOfPages = 1;

  deadlines = [6, 12, 24, 48, 72, 120, 168, 240, 336, 672, 1344]; // hours

  price: number | null = null;

  paperDetails: PaperCalculatorInterface | null = null;

  loading = true;

  user: UserInterface | null = null;

  pricePerPage: number | null = null;

  orderForm: FormGroup = new FormGroup({
    paperTypeCode: new FormControl({value: 3, disabled: false}, Validators.required),
    levelCode: new FormControl({value: 2, disabled: false}, Validators.required),
    deadline: new FormControl({value: 72, disabled: false}, Validators.required),
    spacing: new FormControl({value: 'double-spaced', disabled: false}, Validators.required),
    mode: new FormControl({value: 'original', disabled: false}, Validators.required),
    pricePerPage: new FormControl('', Validators.required),
  })


  constructor(
    private ratesService: RatesService,
    private dialog: MatDialog,
    public sharedService: SharedService,
    private router: Router,
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.ratesService.getRates().pipe(takeUntil(this.destroy$)).subscribe((rates) => {
      this.rates = rates;
      this.dataSource = new MatTableDataSource(rates);
      this.dataSource.paginator = this.paginator;
    });
    this.levelService.getLevels().pipe(takeUntil(this.destroy$)).subscribe((levels) => {
      if (levels) {
        this.levels = levels;
      }
    });
    this.paperTypeService.getPaperTypes().pipe(takeUntil(this.destroy$)).subscribe((types) => {
      if (types) {
        this.paperTypes = types;
      }
    });
    this.paperDetails = {
      deadline:this.orderForm.value.deadline,
      levelCode:this.orderForm.value.levelCode,
      paperTypeCode:this.orderForm.value.paperTypeCode,
      spacing:this.orderForm.value.spacing,
      noOfPages:this.noOfPages,
      mode:this.orderForm.value.mode,
    }
    this.getPrice();
    this.pricePerPage = this.price;
    this.orderForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      this.pricePerPage = this.orderForm.value.pricePerPage;
      this.getPrice();
    });
    this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

  }

  viewRate(rate: DeadlineRatesInterface) {
    const dialogData = {
      rate: rate,
    };
    const dialogRef: MatDialogRef<ViewRateComponent> = this.dialog.open(ViewRateComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  decrementPages() {
    this.noOfPages = this.noOfPages > 1 ? this.noOfPages -= 1 : this.noOfPages = 1;
  }

  incrementPages() {
    this.noOfPages = this.noOfPages += 1;
  }

  async updateRate() {
    const deadline  = this.orderForm.value.deadline;
    const levelCode = this.orderForm.value.levelCode;
    const paperTypeCode = this.orderForm.value.paperTypeCode;
    const spacing = this.orderForm.value.spacing;
    const pricePerPage = this.orderForm.value.pricePerPage;
    const mode = this.orderForm.value.mode;
    const deadId = `${deadline}-hours`;
    this.ratesService.getRate(deadId).pipe().subscribe(async (rate) => {
      if (rate) {
        rate.levels.filter((level) => level.id === levelCode).find((level) => level.paperTypes.find((type) => type.id === paperTypeCode))!.paperTypes.find((type) => type.id === paperTypeCode)!.rate.find((rate) => rate.id === spacing)!.type[mode as keyof DeadlineRatesInterface['levels'][0]['paperTypes'][0]['rate'][0]['type']].pricePerPage = pricePerPage;
        await this.ratesService.update(rate);
        this.snackBar.open('Rates Updated Successfully', '', {
          duration: 2000
        });
        // const updatedLevels = rate.levels.filter((level) => level.id === levelCode);
        // const paperTypes = updatedLevels.find((level) => level.paperTypes.find((type) => type.id === paperTypeCode));
        // const paperType = paperTypes?.paperTypes.find((type) => type.id === paperTypeCode);
        // const currentSpacing = paperType?.rate.find((rate) => rate.id === spacing);
        // const currentPrice= currentSpacing?.type[mode as keyof DeadlineRatesInterface['levels'][0]['paperTypes'][0]['rate'][0]['type']].pricePerPage;
        // console.log('current price', currentPrice);
      }
    });
  }

  getPrice() {
    this.paperDetails = {
      deadline:this.orderForm.value.deadline,
      levelCode:this.orderForm.value.levelCode,
      paperTypeCode:this.orderForm.value.paperTypeCode,
      spacing:this.orderForm.value.spacing,
      noOfPages:this.noOfPages,
      mode:this.orderForm.value.mode,
    }
    this.sharedService.getPrice(this.paperDetails).pipe(takeUntil(this.destroy$)).subscribe((price) => {
      if (price) {
        this.price = price.price;
      }
    });
  }

  async addPrices(deadline: number) {
      const deadId = `${deadline}-hours`;
      const hoursRemaining = deadline as unknown as DeadlineRatesInterface['hoursRemaining'];
      let rate: DeadlineRatesInterface = {
        id: deadId,
        hoursRemaining: hoursRemaining,
        levels: [] as unknown as DeadlineRatesInterface['levels'],
      }
      await Promise.all(this.levels.map(async (level) => {
        const levelId = level.code;
        await Promise.all(this.paperTypes.map(async (type) => {
          const paperTypeCode = type.code;
          rate.levels.push({
              id: levelId,
              paperTypes: [
                {
                id: paperTypeCode,
                rate: [
                  {
                    id: 'single-spaced',
                    type: {
                      original: {
                        pricePerPage: 20,
                      },
                      rewriting: {
                        pricePerPage: 12,
                      },
                      editing: {
                        pricePerPage: 8,
                      },
                    }
                  },
                  {
                    id: 'double-spaced',
                    type: {
                      original: {
                        pricePerPage: 40,
                      },
                      rewriting: {
                        pricePerPage: 20,
                      },
                      editing: {
                        pricePerPage: 14,
                      },
                    }
                  }
                ]
                }
              ]
            })
        }));
      }));
      await this.ratesService.create(rate!);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

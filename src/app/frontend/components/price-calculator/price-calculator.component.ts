import { Component, OnInit, OnDestroy } from '@angular/core';
import { paperTypes } from 'src/assets/json/paper-types.data';
import { levels } from 'src/assets/json/levels.data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DeadlineRatesInterface, PaperCalculatorInterface } from 'src/app/shared/interfaces/rate.interface';
import { RatesService } from 'src/app/shared/services/rates/rates.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { LoginComponent } from '../../dialogs/login/login.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-price-calculator',
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit, OnDestroy {
  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  noOfPages = 1;

  deadlines = [6, 12, 24, 48, 72, 120, 168, 240, 336, 672, 1344]; // hours

  price: Number | null = null;

  destroy$ =  new Subject();

  paperDetails: PaperCalculatorInterface | null = null;

  loading = true;

  user: UserInterface | null = null;

  orderForm: FormGroup = new FormGroup({
    paperTypeCode: new FormControl({value: 3, disabled: false}, Validators.required),
    levelCode: new FormControl({value: 2, disabled: false}, Validators.required),
    deadline: new FormControl({value: 72, disabled: false}, Validators.required),
    spacing: new FormControl({value: 'double-spaced', disabled: false}, Validators.required),
    mode: new FormControl({value: 'original', disabled: false}, Validators.required),
  })

  constructor(
    public sharedService: SharedService,
    private ratesService: RatesService,
    private router: Router,
    private dialog: MatDialog,
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
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
    this.orderForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      this.getPrice();
    });
    this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  async orderPaper() {
    this.paperDetails = {
      deadline:this.orderForm.value.deadline,
      levelCode:this.orderForm.value.levelCode,
      paperTypeCode:this.orderForm.value.paperTypeCode,
      spacing:this.orderForm.value.spacing,
      noOfPages:this.noOfPages,
      mode:this.orderForm.value.mode,
    }
    if (this.user) {
      this.router.navigateByUrl('/order');
      return;
    }
    localStorage.removeItem('redirectUrl');
    localStorage.setItem('redirectUrl', '/order');
    const dialogRef: MatDialogRef<LoginComponent> = this.dialog.open(LoginComponent, {
      width: '60vw',
    });
    dialogRef.afterClosed().subscribe();
  }

  decrementPages() {
    this.noOfPages = this.noOfPages > 1 ? this.noOfPages -= 1 : this.noOfPages = 1;
    this.getPrice();
  }

  incrementPages() {
    this.noOfPages = this.noOfPages += 1;
    this.getPrice();
  }

  async addPrices() {
    await Promise.all(this.deadlines.map(async (deadline) => {
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
    }));
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

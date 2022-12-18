import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/dialogs/file-upload/file-upload.component';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperDisciplineInterface } from 'src/app/shared/interfaces/paper-discipline.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { PriceInterface } from 'src/app/shared/interfaces/price.interface';
import { PaperCalculatorInterface } from 'src/app/shared/interfaces/rate.interface';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit, OnDestroy {
  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  disciplines: PaperDisciplineInterface[] = [];

  destroy$ = new Subject();

  paperFormats = ['APA', 'MLA', 'Chicago/Turabian', 'Harvard', 'OSCOLA'];

  deadlines = [6, 12, 24, 48, 72, 120, 168, 240, 336, 672, 1344]; // hours

  noOfPages = 1;

  paperId: string | null = null;

  user: UserInterface | null = null;

  paperDetails: PaperCalculatorInterface | null = null;

  price: number | null = null;

  pricePerPage: number | null = null;

  orderForm: FormGroup = new FormGroup({
    paperTypeCode: new FormControl({value: 3, disabled: false}, Validators.required),
    levelCode: new FormControl({value: 2, disabled: false}, Validators.required),
    deadline: new FormControl({value: 72, disabled: false}, Validators.required),
    spacing: new FormControl({value: 'double-spaced', disabled: false}, Validators.required),
    mode: new FormControl({value: 'original', disabled: false}, Validators.required),
    discipline: new FormControl({value: 3, disabled: false}, Validators.required),
    topic: new FormControl('', Validators.required),
    instructions: new FormControl('', Validators.required),
    format: new FormControl({value: 'APA', disabled: false}, Validators.required)
  })

  constructor(
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private disciplineService: DisciplineService,
    public sharedService: SharedService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
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
    this.disciplineService.getDisciplines().pipe(takeUntil(this.destroy$)).subscribe((disciplines) => {
      if (disciplines) {
        this.disciplines = disciplines;
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

  decrementPages() {
    this.noOfPages = this.noOfPages > 1 ? this.noOfPages -= 1 : this.noOfPages = 1;
    this.getPrice();
  }

  incrementPages() {
    this.noOfPages = this.noOfPages += 1;
    this.getPrice();
  }

  uploadFile(type: string) {
    // if (this.user) {
    //   const paper: Partial<PaperInterface> = {
    //     id: this.paperId ? this.paperId : this.sharedService.generateUniqueId(this.orderForm.value.topic),
    //     title: this.orderForm.value.title,
    //     customer: this.user,
    //     active: false,
    //   }
    //   this.user.papers = [paper.id];
    //   const dialogData = {
    //     type: type,
    //     user: this.user,
    //   };
    //   const dialogRef: MatDialogRef<FileUploadComponent> = this.dialog.open(FileUploadComponent, {
    //     width: '550px',
    //     data: dialogData,
    //   });
    //   dialogRef.afterClosed().subscribe();
    // }
  }

  orderPaper() {
    if (this.user && this.orderForm.valid && this.price) {
      const paper: PaperInterface = {
        id: this.sharedService.generateUniqueId(this.orderForm.value.topic),
        active: true,
        createdAt: new Date().toISOString(),
        customer: this.user,
        topic: this.orderForm.value.topic,
        instructions: this.orderForm.value.instructions,
        format: this.orderForm.value.format,
        deadline: this.orderForm.value.deadline,
        paperTypeCode: this.orderForm.value.paperTypeCode,
        noOfPages: this.noOfPages,
        spacing: this.orderForm.value.spacing,
        levelCode: this.orderForm.value.levelCode,
        mode: this.orderForm.value.mode,
        discipline: this.orderForm.value.discipline,
        assigned: false,
      }
      const products: [] = [];
      localStorage.setItem('writing-gram-cart', JSON.stringify(products));
      this.sharedService.addToCart(paper, this.price);
      this.router.navigateByUrl('/checkout');
    }
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
        this.pricePerPage = price.pricePerPage;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

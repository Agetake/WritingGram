import { Component, OnInit, OnDestroy } from '@angular/core';
import { startWith, Subject, takeUntil } from 'rxjs';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { PaperService } from 'src/app/shared/services/paper/paper.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();

  paper: PaperInterface | null = null;

  noOfPages: number | null = null;

  price: number | null = null;

  pricePerPage: number | null = null;

  constructor(
    public sharedService: SharedService,
    private paperService: PaperService
  ) { }

  ngOnInit(): void {
    this.sharedService.cartContent$.pipe(startWith(localStorage.getItem('writing-gram-cart') ? JSON.parse(localStorage.getItem('writing-gram-cart') as unknown as string) : []), takeUntil(this.destroy$)).subscribe((cartContents) => {
      cartContents.forEach((content: { count: number, product: PaperInterface, totalPrice: number }) => {
        this.paper = content.product;
        this.noOfPages = content.product.noOfPages;
        this.price = content.totalPrice;
        this.pricePerPage = this.price / content.product.noOfPages;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  checkout() {
    if (this.paper) {
      this.paperService.create(this.paper).then((res) => {
        console.log('paper posted successfully', res);
      });
    }
  }
}

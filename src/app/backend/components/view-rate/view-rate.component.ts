import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeadlineRatesInterface } from 'src/app/shared/interfaces/rate.interface';
import { RatesService } from 'src/app/shared/services/rates/rates.service';

@Component({
  selector: 'app-view-rate',
  templateUrl: './view-rate.component.html',
  styleUrls: ['./view-rate.component.scss']
})
export class ViewRateComponent implements OnInit, OnDestroy {
  rate: DeadlineRatesInterface | null = null;

  destroy$ = new Subject();

  constructor(
    @Optional() public dialogRef: MatDialogRef<ViewRateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.rate) {
      this.rate = this.data.rate;
      console.log('rrate', this.rate)
      this.rate?.levels.map((level) => console.log('level', level))
    }
  }

  updateRate() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

}

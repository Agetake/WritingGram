import { Injectable } from '@angular/core';
import { getApp } from '@angular/fire/app';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap, retry, takeUntil } from 'rxjs';
import { ErrorInterface } from '../interfaces/error.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { shareReplay } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { PaperInterface } from '../interfaces/paper.interface';
import { PaperCategoryInterface } from '../interfaces/paper-category.interface';
import { RatesService } from './rates/rates.service';
import { PaperCalculatorInterface } from 'src/app/shared/interfaces/rate.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  cartContent$ = new Subject<{ product: PaperInterface, count: number, totalPrice: number }[]>();

  currency$ = new BehaviorSubject('USD');

  isAdminRole$ = new BehaviorSubject(false);

  constructor(
    private afs: AngularFirestore,
    private firebaseFns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private ratesService: RatesService
    ) { }

  generateUniqueId(itemName: string): string {
    var current = new Date()
    const code = `${itemName.substring(0, 2)}${Math.random().toString(36).slice(-8)}${current.toISOString().replace(/-/g, "").replace(/:/g, "")}`;
    return code.substring(0, 12).toLowerCase();
  }


  getProductCategories(): Observable<PaperCategoryInterface[]> {
    const productCategories:Observable<PaperCategoryInterface[]> = this.afs.collection<PaperCategoryInterface>('productCategories').valueChanges();
    return productCategories;
  }

  logErrorsToCloud(error: ErrorInterface) {
    const currentUrl = window.location.href;
    const newError = error;
    newError.url = currentUrl;
    if (!environment.useEmulators) {
      const firebaseFN = this.firebaseFns.httpsCallable('logErrors');
      firebaseFN(newError).pipe(
      );
    } else {
      const functions = getFunctions(getApp());
      connectFunctionsEmulator(functions, 'localhost', 5001);
      const logError = httpsCallable(functions, 'logErrors');
      logError(newError)
        .then()
        .catch();
    }
  }

  addToCart(product: PaperInterface, totalPrice: number) {
    let products: { product: PaperInterface, count: number, totalPrice: number }[] | null = null;
    if(localStorage.getItem('writing-gram-cart')){
        products = JSON.parse(localStorage.getItem('writing-gram-cart') as unknown as string);
    }
    if (products && products.length > 0 ) {
      if (!products.some((prod: { product: PaperInterface, count: number, totalPrice: number }) => prod.product.id === product.id)) {
        const cartProduct = { product, count: 1, totalPrice: totalPrice } as unknown as { product: PaperInterface, count: number, totalPrice: number };
        products.push(cartProduct);
      } else {
        const newProducts = products.map((prod: { product: PaperInterface, count: number, totalPrice: number }) =>
          {
            if(prod.product.id === product.id) {
              const newCount = prod.count + 1;
              prod.count = newCount;
              return prod;
            }
            return prod;
          }
        );
      }
    } else {
      products = [{ product, count: 1, totalPrice: totalPrice }];
    }
    localStorage.setItem('writing-gram-cart', JSON.stringify(products));
    this.cartContent$.next(products);
  }

  removeFromCart(product: { product: PaperInterface, count: number, totalPrice: number }) {
    let products: { product: PaperInterface, count: number, totalPrice: number }[] | null = null;
    if(localStorage.getItem('writing-gram-cart')){
        products = JSON.parse(localStorage.getItem('writing-gram-cart') as unknown as string);
    }
    if (products && products.length > 0 ) {
        products.map((prod: { product: PaperInterface, count: number, totalPrice: number }) =>
          {
            if(prod.product.id === product.product.id) {
              const newCount = prod.count - 1;
              prod.count = newCount;
              return prod;
            }
            return prod;
          }
        );
        const newProducts = products.filter((prod) => prod.count > 0);
        localStorage.setItem('writing-gram-cart', JSON.stringify(newProducts));
        this.cartContent$.next(newProducts);
    }
  }

  deleteFromCart(product: { product: PaperInterface, count: number, totalPrice: number }) {
    let cartContent = JSON.parse(localStorage.getItem('writing-gram-cart') as unknown as string);
    let products = cartContent.length > 0 ? cartContent.filter((prod: { product: PaperInterface, count: number, totalPrice: number }) => prod.product.id !== product.product.id ) : [];
    localStorage.setItem('writing-gram-cart', JSON.stringify(products));
    this.cartContent$.next(products);
  }

  emptyCart() {
    const products: [] = [];
    localStorage.setItem('writing-gram-cart', JSON.stringify(products));
    this.cartContent$.next(products);
  }

  checkAdminRole(user: UserInterface): Observable<boolean> {
    return new Observable((subscriber) => {
      let isAdmin = false;
      try {
        const firebaseFN = this.firebaseFns.httpsCallable('callableFn-fetchCustomClaims');
        firebaseFN(user.firebaseUid).pipe(
          tap((res) => res.customClaims.admin ? isAdmin = true : isAdmin = false),
          retry({ count: 5, delay: 2000 }),
        ).subscribe(() => {
          this.isAdminRole$.next(isAdmin);
          subscriber.next(isAdmin)
        });
      } catch (error) {
        subscriber.next(isAdmin);
      }
    });
  }

  getPrice(paperDetails: PaperCalculatorInterface): Observable<{price: number, pricePerPage: number} | null> {
    return new Observable((subscriber) => {
      let price = null;
      this.ratesService.getRate(`${paperDetails.deadline}-hours`).subscribe((rate) => {
        if(rate) {
          const currentLevel = rate.levels.filter((level) => level.id == paperDetails.levelCode);
          if (currentLevel) {
            const currentPaperType =  currentLevel.filter((level) => level.paperTypes.find((type) => type.id == paperDetails.paperTypeCode));
            if (currentPaperType) {
              const cPaperType = currentPaperType.find((typo) => typo.paperTypes.find(((typ) => typ.id == paperDetails.paperTypeCode)));
              const spacing = cPaperType?.paperTypes.find((type) => type.rate.find((rate) => rate.id == paperDetails.spacing));
              if (spacing) {
                const rate = spacing.rate.find((rate) => rate.id == paperDetails.spacing);
                if (rate) {
                  const mode = rate.type[paperDetails.mode as keyof typeof rate.type];
                  if (mode) {
                    const pricePerPage = mode.pricePerPage;
                    const price = {
                      price:pricePerPage * paperDetails.noOfPages,
                      pricePerPage: pricePerPage,
                    }
                    subscriber.next(price);
                  }
                }
              }
            }
          }
        }
      });
    });
  }
}


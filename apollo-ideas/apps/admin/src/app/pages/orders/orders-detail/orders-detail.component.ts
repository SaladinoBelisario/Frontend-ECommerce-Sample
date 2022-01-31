import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Order, ORDER_STATUS, OrdersService} from '@apollo-ideas/orders';
import {MessageService} from 'primeng/api';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: []
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: Order;
  orderStatuses = [];
  selectedStatus: any;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy() {
    // @ts-ignore
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _mapOrderStatus() {
    // @ts-ignore
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      // @ts-ignore
      const {label} = ORDER_STATUS[key];
      return {
        id: key,
        name: label
      };
    });
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderService
          .getOrder(params['id'])
          .pipe(takeUntil(this.endsubs$))
          .subscribe((order) => {
            this.order = order;
            this.selectedStatus = order.status;
          });
      }
    });
  }

  onStatusChange(event: { value: any; }) {
    this.orderService
      .updateOrder({ status: event.value }, this.order.id)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is updated!'
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Order is not updated!'
          });
        }
      );
  }
}

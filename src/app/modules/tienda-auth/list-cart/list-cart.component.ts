import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../tienda-guest/service/cart.service';

declare function alertSuccess([]):any;
declare function alertDanger([]):any;
declare var paypal:any;
@Component({
  selector: 'app-list-cart',
  templateUrl: './list-cart.component.html',
  styleUrls: ['./list-cart.component.css']
})
export class ListCartComponent implements OnInit{
  listCart:any = [];
  totalSum:number = 0;
  code:any = null;
  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;
  constructor(public cartService:CartService){}

  ngOnInit(): void{
    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.listCart = resp;
      this.totalSum = this.listCart.reduce((sum:number,item:any) => sum + item.total,0);
    })

      paypal.Buttons({
        // optional styling for buttons
        // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
        style: {
          color: "gold",
          shape: "rect",
          layout: "vertical"
        },

        // set up the transaction
        createOrder: (data:any, actions:any) => {
            // pass in any options from the v2 orders create call:
            // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
            if(this.totalSum == 0){
              alertDanger("NO PUEDES PAGAR UN MONTO DE 0");
              return false;
            }
            if(this.listCart.length == 0){
              alertDanger("NO PUEDES PROCESAR EL PAGO SIN CURSOS EN EL CARRITO");
              return false;
            }
            const createOrderPayload = {
              purchase_units: [
                {
                  amount: {
                      description: "COMPRAR POR EL ECOMMERCE",
                      value: this.totalSum
                  }
                }
              ]
            };

            return actions.order.create(createOrderPayload);
        },

        // finalize the transaction
        onApprove: async (data:any, actions:any) => {
            
            let Order = await actions.order.capture();

            let dataT = {
              payment_method: "PAYPAL",
              currency_total: "MXN",
              currency_payment: "MXN",
              total: this.totalSum,
              n_transaccion: Order.purchase_units[0].payments.captures[0].id
            }
            this.cartService.checkout(dataT).subscribe((resp:any) => {
              console.log(resp);
              if(resp.message == 200){
                alertSuccess("LOS CURSOS SE HAN ADQUIRIDO CORRECTAMENTE");
              }
              
            });
            
        },

        // handle unrecoverable errors
        onError: (err:any) => {
            console.error('An error prevented the buyer from checking out with PayPal');
        }
    }).render(this.paypalElement?.nativeElement);
  }
  // Borrar
  getCampaign(type:number){
    let Name = "";
    switch(type){
      case 1:
        Name = "CAMPAÑA NORMAL";
        break;
      case 2:
        Name = "CAMPAÑA FLASH";
        break;
      case 3:
        Name = "CAMPAÑA BANNER";
        break;

      default:
      break;
    }
    return Name;
  }

  removeItem(cart:any){
    this.cartService.deleteCart(cart.id).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("EL ITEM SE HA ELIMINADO CORRECTAMENTE");
      this.cartService.removeItemCart(cart);
    })
  }

  applyCupon(){
    if(!this.code){
      alertDanger("NECESITAS INGRESAR UN CUPÓN");
      return;
    }
    let data = {
      code: this.code
    }
    this.cartService.applyCupon(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
      }else{
        this.cartService.resetCart();
        setTimeout(() => {
          resp.carts.data.forEach((cart:any) => {
            this.cartService.addCart(cart);
          });
        },50)
        alertSuccess("EL CUPÓN SE HA REGISTRADO CORRECTAMENTE");
      }
    })
  }

}

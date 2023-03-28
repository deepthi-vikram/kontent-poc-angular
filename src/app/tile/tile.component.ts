import { ChangeDetectorRef, Component } from '@angular/core';
import {
  IDeliveryClient,
  createDeliveryClient,
  INetworkResponse,
  Responses,
} from '@kentico/kontent-delivery';
import { Observable, from } from 'rxjs';
import { observableHelper } from '../helpers/observable.helper';
import { getRequest } from '../helpers/http.helpers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent {
  title = '';
  carouselData: any = [];
  displayName: string = "";
  isManager: boolean = false;
  showUserName: boolean = false;
  userId: string = "";

  deliveryClient: IDeliveryClient;
  itemsResponse?: INetworkResponse<Responses.IListContentItemsResponse, any>;
  itemResponse?: INetworkResponse<Responses.IViewContentItemResponse, any>;

  constructor(private cdr: ChangeDetectorRef) {
    this.deliveryClient = createDeliveryClient({
      projectId: '27fea92e-2633-0035-9c21-b601899437c5'
    });
   }
  
   bindUserId(e: any) {
    this.userId = e.target.value;
   }

  async getUser(e: any){
    let userData: any = await this.getUserID(this.userId);
    this.isManager = userData.MANAGER? true : false;
    this.displayName = userData.DISPLAY_NAME;
    this.showUserName = true;
    this.getCollection();
  }

  async getUserID(id: any){
    return getRequest("/pulseprofile/api/v1/users/"+id, null);
  }

  private getCollection(): void {
    let roles = ['associate', 'consultant'];
    if(this.isManager){
      roles.push('manager');
    }
    this.zipAndExecute([
      from(this.deliveryClient.items()
      .equalsFilter('system.codename', 'news_tile')
      .anyFilter('elements.roles', roles)
      // .orderParameter('system.last_modified', 'desc')
      .toPromise()).pipe(
        map((response: any) => {
          this.itemsResponse = response;
          console.log('this.itemsResponse = '+ JSON.stringify(this.itemsResponse));
          response.data.items[0].elements.news_items.linkedItems.forEach((element: any) => {
            let roles: string = '';
            element.elements.roles.value.forEach((role: any) => {
              if(role.codename.indexOf('manager') == -1){
                roles = roles+role.codename+',';
              }
            });
            if(this.isManager || roles != ""){
              let carouselItem: any = {};
              carouselItem['title'] = element.elements.title.value;
              carouselItem['image'] = element.elements.image.value[0].url;
              carouselItem['link'] = '/news/'+element.system.codename.toUpperCase();
              this.carouselData.push(carouselItem);
            }
          });
          this.cdr.markForCheck();
        })
      ),
      ]);
  }

  private zipAndExecute(observables: Observable<void>[]): void {
    observableHelper
      .zipObservables(observables)
      .pipe(
        map(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

}

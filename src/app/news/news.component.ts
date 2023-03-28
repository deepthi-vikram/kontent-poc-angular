import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IDeliveryClient,
  createDeliveryClient,
  INetworkResponse,
  Responses,
  IGroupedNetworkResponse,
} from '@kentico/kontent-delivery';
import { AngularHttpService } from '@kentico/kontent-angular-http-service';
import { Observable, from } from 'rxjs';
import { observableHelper } from '../helpers/observable.helper';
import { getRequest } from '../helpers/http.helpers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  newsData: any = {};
  displayName: string;
  isManager: boolean = false;
  id: string = "";

  deliveryClient: IDeliveryClient;

  itemsResponse?: INetworkResponse<Responses.IListContentItemsResponse, any>;
  itemResponse?: INetworkResponse<Responses.IViewContentItemResponse, any>;
  taxonomiesResponse?: INetworkResponse<Responses.IListTaxonomiesResponse, any>;
  taxonomyResponse?: INetworkResponse<Responses.IViewTaxonomyResponse, any>;
  typesResponse?: INetworkResponse<Responses.IListContentTypesResponse, any>;
  typeResponse?: INetworkResponse<Responses.IViewContentTypeResponse, any>;
  languagesResponse?: INetworkResponse<Responses.IListLanguagesResponse, any>;
  elementResponse?: INetworkResponse<Responses.IViewContentTypeElementResponse, any>;
  itemsFeedResponse?: IGroupedNetworkResponse<Responses.IListItemsFeedAllResponse>;

  constructor(private router : Router, private http: HttpClient, private httpClient: HttpClient, private cdr: ChangeDetectorRef) {
    this.deliveryClient = createDeliveryClient({
      projectId: '27fea92e-2633-0035-9c21-b601899437c5',
      httpService: new AngularHttpService(httpClient),
    });
    this.displayName = "";
   }

  async ngOnInit() {    
     this.id = this.router.url.split("/")[this.router.url.split("/").length-1];
      this.getCollection();
  }


  private getCollection(): void {
    this.zipAndExecute([
      from(this.deliveryClient.items()
      .equalsFilter('system.codename', this.id.toLowerCase())
      .toPromise()).pipe(
        map((response) => {
          this.itemsResponse = response;
          console.log('this.itemsResponse = '+ JSON.stringify(this.itemsResponse));
          response.data.items.forEach((element) => { 
          this.newsData['title'] = element.elements.title.value;
          this.newsData['description'] = element.elements.description.value;
          this.newsData['image'] = element.elements.image.value[0].url;
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

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { NewsComponent } from './news/news.component';

@NgModule({
  declarations: [AppComponent, TileComponent, NewsComponent],
  imports: [BrowserModule, HttpClientModule, NgxJsonViewerModule,
    RouterModule.forRoot([
      {path: 'news/:id', component: NewsComponent},
  ]),],
  providers: [],
  bootstrap: [AppComponent, TileComponent, NewsComponent],
})
export class AppModule {}

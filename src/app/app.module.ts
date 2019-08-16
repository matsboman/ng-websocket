import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { UiInfobarBottomComponent } from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import { UiInfobarTopComponent } from './ui/ui-infobar-top/ui-infobar-top.component';
import { UiSidebarLeftComponent } from './ui/ui-sidebar-left/ui-sidebar-left.component';
import { UiSidebarRightComponent } from './ui/ui-sidebar-right/ui-sidebar-right.component';
import { UiComponent } from './ui/ui.component';
import { WebsocketService } from "./services/websocket.service";
import { ChatService } from "./services/chat.service";
import { EventService } from "./services/event.service";
import { ShipService } from "./services/ship.service";


@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    WebsocketService, ChatService, EventService, ShipService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

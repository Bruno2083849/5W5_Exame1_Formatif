import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';
import { UserEntry } from 'src/models/models';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';
  usersList:UserEntry[] = [];
  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza', { accessTokenFactory: () => sessionStorage.getItem("token")! })
      .build();

      this.hubConnection.on('UserCount', (data) => {
      this.nbUsers = data;
      });


      this.hubConnection.on('UpdateNbPizzasAndMoney', (prixPizza:number,nbPi:number, groupName:string,money:number) => {
      
       console.log('Le prix '+prixPizza)
       console.log('Le nombre de '+nbPi)
       console.log('Le nom du group est '+groupName)
       this.pizzaPrice = prixPizza;
       this.nbPizzas = nbPi;
       this.money = money;



      });

      this.hubConnection.on('UpdateMoney', (data) => {
        this.money = data;
        });
   
    // On se connecte au Hub
    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  
  }

  selectChoice(selectedChoice:number) : void {
    this.selectedChoice = selectedChoice;


    this.hubConnection!.invoke('SelectChoice', selectedChoice)
    .then(() => console.log(`Pizza selected: ${selectedChoice}`))
    .catch((err) => console.error('Error creating group:', err));
  }

  unselectChoice() {
   
    this.hubConnection!
      .invoke('UnselectChoice',  this.selectedChoice )
      .then(() => console.log(`Left group: ${ this.selectedChoice }`))
      .catch((err) => console.error('Error leaving group:', err));
      this.selectedChoice = -1;
  }

  addMoney() {
    this.hubConnection!
      .invoke('AddMoney',  this.selectedChoice )
      .then(() => console.log(`Pizza : ${ this.selectedChoice }`))
      .catch((err) => console.error('Error leaving group:', err));
    
  }

  buyPizza() {
    this.hubConnection!
      .invoke('BuyPizza',  this.selectedChoice )
      .then(() => console.log(`Pizza : ${ this.selectedChoice }`))
      .catch((err) => console.error('Error leaving group:', err));
  }
}

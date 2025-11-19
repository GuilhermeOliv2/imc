import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar 
} from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import mqtt from 'mqtt';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    NgFor
  ]
})
export class Tab3Page implements OnInit, OnDestroy {
  mqttClient: any;
  corAtual: string = '#000000';
  coresHistorico: string[] = [];
  isConnected: boolean = false;

  private topicoStatus: string = 'imc/led/status/MOSHENGA6769';

  ngOnInit() {
    this.conectarMQTT();
  }

  conectarMQTT() {
    this.mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    
    this.mqttClient.on('connect', () => {
      console.log('Monitorando LED...');
      this.isConnected = true;
      this.mqttClient.subscribe(this.topicoStatus);
    });

    this.mqttClient.on('message', (topic: string, message: Buffer) => {
      if (topic === this.topicoStatus) {
        const cor = message.toString();
        this.corAtual = cor;
        this.coresHistorico.unshift(cor);
        // Mantém só as últimas 5 cores
        if (this.coresHistorico.length > 5) {
          this.coresHistorico.pop();
        }
      }
    });

    this.mqttClient.on('error', (error: any) => {
      console.error('Erro MQTT:', error);
      this.isConnected = false;
    });
  }

  ngOnDestroy() {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
  }
}
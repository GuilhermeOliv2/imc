import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton 
} from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgIf } from '@angular/common';
import mqtt from 'mqtt'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonButton,
    FormsModule,
    NgIf
  ]
})

export class Tab1Page {
  nome: string = '';
  peso: number | null = null;
  altura: number | null = null;
  genero: string = '';
  resultadoTexto: string = '';
  mostrarResultado: boolean = false;
  usuarioLogado: boolean = false;
  emailUsuario: string = '';

  mqttClient: any;
  isConnected: boolean = false;

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.verificarLogin();
    this.conectarMQTT(); 
  }

  conectarMQTT() {
    this.mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    
    this.mqttClient.on('connect', () => {
      console.log('✅ Conectado ao MQTT!');
      this.isConnected = true;
    });

    this.mqttClient.on('error', (error: any) => {
      console.error('❌ Erro MQTT:', error);
      this.isConnected = false;
    });
  }

  verificarLogin() {
    this.afAuth.authState.subscribe(usuario => {
      this.usuarioLogado = !!usuario;
      this.emailUsuario = usuario?.email || '';
    });
  }

  calcularIMC() {
    if (!this.validarCampos()) {
      return;
    }

    const imc = this.peso! / (this.altura! * this.altura!);
    let classificacao = '';

    if (imc < 18.5) classificacao = 'Abaixo do peso';
    else if (imc < 25) classificacao = 'Peso normal';
    else if (imc < 30) classificacao = 'Sobrepeso';
    else if (imc < 35) classificacao = 'Obesidade Grau I';
    else if (imc < 40) classificacao = 'Obesidade Grau II';
    else classificacao = 'Obesidade Grau III';

    this.resultadoTexto = `Olá, ${this.nome} (${this.genero}).\nSeu IMC é ${imc.toFixed(2)}\nClassificação: ${classificacao}`;
    this.mostrarResultado = true;

    if (this.mqttClient && this.isConnected) {
      this.mqttClient.publish('imc/led', 'mudar_cor');
      console.log('🎨 Comando enviado para LED RGB!');
    }
  }

  validarCampos(): boolean {
    if (!this.nome) {
      alert('Por favor, insira seu nome');
      return false;
    }
    if (!this.peso || this.peso <= 0) {
      alert('Por favor, insira um peso válido');
      return false;
    }
    if (!this.altura || this.altura <= 0) {
      alert('Por favor, insira uma altura válida');
      return false;
    }
    if (!this.genero) {
      alert('Por favor, selecione seu gênero');
      return false;
    }
    return true;
  }

  voltar() {
    this.mostrarResultado = false;
  }
}
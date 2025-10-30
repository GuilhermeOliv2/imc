import { Component } from '@angular/core';
import { 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton,
    FormsModule,
    NgIf
  ]
})
export class Tab2Page {
  email: string = '';
  senha: string = '';
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor(private afAuth: AngularFireAuth) {}

  async fazerLogin() {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(this.email, this.senha);
      console.log('Login bem-sucedido:', result.user?.email);
      this.mensagemSucesso = 'Login realizado com sucesso!'
      this.mensagemErro = '';
      this.mensagemSucesso = '';
      // Aqui vamos redirecionar para o IMC depois
    } catch (error: any) {
      this.mensagemErro = this.traduzirErro(error.code);
      this.mensagemSucesso = '';
    }
  }

  async criarConta() {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(this.email, this.senha);
      console.log('Conta criada:', result.user?.email);
      this.mensagemSucesso = 'Conta criada com sucesso!';
      this.mensagemErro = '';
      console.log('Conta criada:', result.user?.email);
      // Aqui vamos redirecionar para o IMC depois
    } catch (error: any) {
      this.mensagemErro = this.traduzirErro(error.code);
      this.mensagemSucesso = '';
    }
  }

  private traduzirErro(codigo: string): string {
    const erros: { [key: string]: string } = {
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuário desativado',
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Email já está em uso',
      'auth/weak-password': 'Senha muito fraca'
    };
    return erros[codigo] || 'Erro desconhecido';
  }
}
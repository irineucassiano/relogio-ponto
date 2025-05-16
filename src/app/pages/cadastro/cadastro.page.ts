import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false
})
export class CadastroPage {
  nome = '';
  email = '';
  senha = '';

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  cadastrar() {
    if (!this.nome || !this.email || !this.senha) {
      this.mostrarToast('Preencha todos os campos');
      return;
    }

    this.api.registrarUsuario({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    }).subscribe({
      next: () => {
        this.mostrarToast('Conta criada com sucesso!', 'success');
        this.navCtrl.navigateRoot('/login');
      },
      error: () => this.mostrarToast('Erro ao criar conta'),
    });
  }

  async mostrarToast(msg: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
    });
    toast.present();
  }
}

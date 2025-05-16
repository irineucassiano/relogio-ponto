import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async fazerLogin() {
    if (!this.email || !this.senha) {
      this.mostrarToast('Preencha todos os campos');
      return;
    }

    this.api.login({ email: this.email, senha: this.senha }).subscribe({
      next: (res: any) => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.navCtrl.navigateRoot('/ponto');
      },
      error: () => this.mostrarToast('Login inválido'),
    });
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}

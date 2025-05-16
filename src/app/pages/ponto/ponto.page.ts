import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ponto',
  templateUrl: './ponto.page.html',
  styleUrls: ['./ponto.page.scss'],
  standalone: false
})
export class PontoPage {
  usuario: any = null;
  pontos: any[] = [];

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    const data = localStorage.getItem('usuario');
    if (!data) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    this.usuario = JSON.parse(data);
    this.carregarPontos();
  }

  registrar(tipo: 'entrada' | 'saida') {
    this.api.registrarPonto({ usuario_id: this.usuario.id, tipo }).subscribe({
      next: () => {
        this.mostrarToast(`Ponto de ${tipo} registrado`);
        this.carregarPontos();
      },
      error: () => this.mostrarToast('Erro ao registrar ponto'),
    });
  }

  carregarPontos() {
    this.api.listarPontos(this.usuario.id).subscribe({
      next: (res: any) => {
        this.pontos = res;
      },
      error: () => this.mostrarToast('Erro ao carregar pontos'),
    });
  }

  logout() {
    localStorage.removeItem('usuario');
    this.navCtrl.navigateRoot('/login');
  }

  async mostrarToast(msg: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
    });
    toast.present();
  }
}

import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, imagesOutline, shareSocialOutline, trashOutline } from 'ionicons/icons';
import { renderChampionFrame } from '../../core/champion-frame';
import { fileToLogo } from '../../core/image.util';
import { Tournament } from '../../core/models';
import { TeamService } from '../../core/team.service';
import { TournamentService } from '../../core/tournament.service';

@Component({
  selector: 'app-champion-frame',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonContent, IonSpinner],
  providers: [DatePipe],
  templateUrl: './champion-frame.page.html',
  styleUrl: './champion-frame.page.scss',
})
export class ChampionFramePage {
  private readonly service = inject(TournamentService);
  private readonly teams = inject(TeamService);
  private readonly toasts = inject(ToastController);
  private readonly datePipe = inject(DatePipe);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly tournament = signal<Tournament | null>(null);
  /** Rendered frame as a PNG data URL. */
  readonly frame = signal<string | null>(null);
  readonly busy = signal(false);
  private logo: string | null = null;
  readonly hasLogo = signal(false);

  constructor() {
    addIcons({ cameraOutline, imagesOutline, shareSocialOutline, trashOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    const t = await this.service.get(this.id);
    this.tournament.set(t);
    this.logo = t?.championTeamId ? ((await this.teams.get(t.championTeamId))?.logo ?? null) : null;
    this.hasLogo.set(!!this.logo);
    await this.render();
  }

  private async render(): Promise<void> {
    const t = this.tournament();
    if (!t?.championTeamName) return;
    const [y, m, d] = t.playedOn.split('-').map(Number);
    this.frame.set(
      await renderChampionFrame({
        teamName: t.championTeamName,
        photo: t.championPhoto,
        logo: this.logo,
        tournamentName: t.name,
        dateLabel: this.datePipe.transform(new Date(y!, (m ?? 1) - 1, d ?? 1), 'd MMM y') ?? t.playedOn,
        mvpName: t.mvpName,
      }),
    );
  }

  pickPhoto(): void {
    this.fileInput().nativeElement.click();
  }

  async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.busy.set(true);
    try {
      const photo = await fileToLogo(file, 1600);
      await this.service.setChampionPhoto(this.id, photo);
      this.tournament.update((t) => (t ? { ...t, championPhoto: photo } : t));
      await this.render();
      await this.toast('Group photo added');
    } catch {
      await this.toast('Could not read that image');
    } finally {
      this.busy.set(false);
    }
  }

  async removePhoto(): Promise<void> {
    await this.service.setChampionPhoto(this.id, null);
    this.tournament.update((t) => (t ? { ...t, championPhoto: null } : t));
    await this.render();
  }

  /** Shares the whole frame as an image (native share sheet; on the web, Web Share or a download). */
  async share(): Promise<void> {
    const png = this.frame();
    const t = this.tournament();
    if (!png || !t) return;
    const fileName = `${t.name.replace(/[^\w]+/g, '-')}-champion.png`;
    const text = `${t.championTeamName} are the ${t.name} champions! 🏆`;
    this.busy.set(true);
    try {
      if (Capacitor.isNativePlatform()) {
        const saved = await Filesystem.writeFile({
          path: fileName,
          data: png.split(',')[1]!,
          directory: Directory.Cache,
        });
        await Share.share({ title: `${t.name} champion`, text, files: [saved.uri], dialogTitle: 'Share champion frame' });
        return;
      }
      const blob = await (await fetch(png)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${t.name} champion`, text });
        return;
      }
      const a = document.createElement('a');
      a.href = png;
      a.download = fileName;
      a.click();
      await this.toast('Image downloaded');
    } catch (e) {
      // Closing the share sheet without choosing an app is not an error worth reporting.
      if (!String((e as Error)?.message ?? e).toLowerCase().includes('cancel')) {
        await this.toast('Could not share the image');
      }
    } finally {
      this.busy.set(false);
    }
  }

  private async toast(message: string): Promise<void> {
    const t = await this.toasts.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }
}

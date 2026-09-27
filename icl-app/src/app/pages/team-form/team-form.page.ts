import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, closeCircle } from 'ionicons/icons';
import { fileToLogo } from '../../core/image.util';
import { TeamService } from '../../core/team.service';

@Component({
  selector: 'app-team-form',
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonIcon,
  ],
  templateUrl: './team-form.page.html',
  styleUrl: './team-form.page.scss',
})
export class TeamFormPage {
  private readonly teams = inject(TeamService);
  private readonly nav = inject(NavController);
  private readonly toasts = inject(ToastController);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || undefined;
  readonly logo = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    captainName: ['', [Validators.required, Validators.maxLength(60)]],
    captainPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,20}$/)]],
    address: ['', Validators.maxLength(200)],
    comment: ['', Validators.maxLength(500)],
  });

  constructor() {
    addIcons({ cameraOutline, closeCircle });
    if (this.id) this.load(this.id);
  }

  private async load(id: number): Promise<void> {
    const team = await this.teams.get(id);
    if (!team) return;
    this.logo.set(team.logo);
    this.form.patchValue(team);
  }

  pickLogo(): void {
    this.fileInput().nativeElement.click();
  }

  async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      this.logo.set(await fileToLogo(file));
    } catch {
      this.toast('Could not read that image', 'danger');
    }
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      await this.teams.save({ id: this.id, logo: this.logo(), ...this.form.getRawValue() });
      await this.toast(this.id ? 'Team updated' : 'Team added', 'success');
      this.nav.back();
    } catch {
      await this.toast('Could not save team', 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  private async toast(message: string, color: string): Promise<void> {
    const t = await this.toasts.create({ message, color, duration: 1800, position: 'bottom' });
    await t.present();
  }
}

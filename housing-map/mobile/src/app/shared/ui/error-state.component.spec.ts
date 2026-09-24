import { TestBed } from '@angular/core/testing';

import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  it('shows the message as an alert and emits retry', async () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('message', 'The map service is not available.');
    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));

    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLElement>('ion-button')?.click();

    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'The map service is not available.',
    );
    expect(retried).toBe(true);
  });

  it('hides the retry button when not retryable', async () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('message', 'Plot not found.');
    fixture.componentRef.setInput('retryable', false);

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('ion-button')).toBeNull();
  });
});

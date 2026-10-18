// End-to-end "does every screen stay in sync" test. Navigates only by tapping (tabs, back, links, FABs).
// Run against `npx ng serve --port 4300`:  node e2e/sync.e2e.cjs   (BASE=... to point elsewhere)
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const BASE = process.env.BASE || 'http://localhost:4300/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); global.__p = p;
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
  const results = [];
  const check = (name, ok, detail = '') => { results.push([ok ? 'PASS' : 'FAIL', name, detail]); console.log(ok ? 'PASS' : 'FAIL', '-', name, detail ? '| ' + detail : ''); };
  const wait = (ms = 700) => p.waitForTimeout(ms);
  const t = (l, v) => p.locator(`.ion-page:not(.ion-page-hidden) ion-input:has-text("${l}") input`).first().fill(v);
  const tab = async (name) => { await p.click(`ion-tab-button[tab=${name}]`); await wait(900); };
  const back = async () => {
    for (let i = 0; i < 5; i++) {
      const arrow = p.locator('ion-back-button:visible');
      if (await arrow.count()) { await arrow.last().click(); await wait(1000); return; }
      await p.locator('ion-button.text-button:has-text("Back"):visible').last().click(); await wait(600);
    }
  };
  const visibleTexts = (sel) => p.locator(`${sel}:visible`).allInnerTexts();

  await p.goto(BASE); await p.waitForURL(/welcome/); await wait(800);
  await t('Username', 'abc'); await t('PIN (4', '1234'); await t('Confirm PIN', '1234');
  await p.click('ion-button:has-text("Create account")'); await p.waitForURL(/home/); await wait();

  // Visit every tab once so Ionic caches them (this is what makes stale screens possible).
  for (const n of ['tournaments', 'teams', 'settings', 'home']) await tab(n);

  // 1. Add teams from the Teams tab FAB
  await tab('teams');
  for (const n of ['Alpha', 'Bravo', 'Charlie', 'Delta']) {
    await p.locator('app-teams ion-fab-button').click(); await wait(900);
    await t('Team name', n); await t('Captain name', 'Cap ' + n); await t('Captain phone', '0300 123456' + n.length);
    await p.click('ion-button:has-text("Add team")'); await wait(1100);
  }
  let names = await visibleTexts('app-teams ion-item h2');
  check('Teams list shows teams added with the + button', names.length === 4, names.join(', '));

  // 2. Team added from Home's "Start tournament" wizard path: wizard sees all teams
  await tab('home');
  await p.locator('app-home ion-button:has-text("Start new tournament")').click(); await wait(1200);
  await p.click('#confirm-settings'); await wait(600);
  const wizardTeams = await visibleTexts('app-tournament-new ion-item ion-label h2, app-tournament-new ion-item ion-label');
  check('Start-tournament wizard lists all 4 teams', wizardTeams.length >= 4, `${wizardTeams.length} rows`);
  await back();

  // 3. Rename a team: detail + list + wizard update
  await tab('teams');
  await p.locator('app-teams ion-item:has-text("Alpha")').click(); await wait(1000);
  await p.locator('app-team-detail ion-buttons[slot=end] ion-button >> nth=0').click(); await wait(1000);
  await t('Team name', 'Alpha XI'); await p.click('ion-button:has-text("Save changes")'); await wait(1200);
  const detailName = await p.locator('app-team-detail:visible').innerText().catch(() => '');
  check('Team detail shows the new name after editing', detailName.includes('Alpha XI'));
  await back();
  names = await visibleTexts('app-teams ion-item h2');
  check('Teams list shows the renamed team', names.includes('Alpha XI'), names.join(', '));

  // 4. Add a team while a tournament wizard is NOT open, then check the wizard on a fresh open
  await p.locator('app-teams ion-fab-button').click(); await wait(900);
  await t('Team name', 'Echo'); await t('Captain name', 'Cap E'); await t('Captain phone', '0300 7654321');
  await p.click('ion-button:has-text("Add team")'); await wait(1100);
  names = await visibleTexts('app-teams ion-item h2');
  check('Teams list shows 5th team', names.includes('Echo'), names.join(', '));

  // 5. Start a tournament from the Tournaments tab
  await tab('tournaments');
  const before = await visibleTexts('app-tournaments ion-item h2');
  await p.locator('app-tournaments ion-fab-button').click(); await wait(1200);
  const isWizard = await p.locator('#confirm-settings:visible').count();
  if (!isWizard) { console.log('FAB did not open wizard; url', p.url()); }
  await p.click('#confirm-settings'); await wait(600);
  const wiz2 = await visibleTexts('app-tournament-new ion-item ion-label');
  check('Wizard (opened from Tournaments) lists 5 teams incl. Echo', wiz2.some(x => x.includes('Echo')), `${wiz2.length} rows`);
  await p.click('ion-button:has-text("Select all")');
  await p.click('ion-button:has-text("Next: set up pools")'); await wait(600);
  await t('How many pools', '2'); await t('How many courts', '2'); await wait(400);
  await p.click('ion-button:has-text("Draw pools")'); await wait(700);
  await p.locator('#start-0').fill('20:00'); await p.locator('#start-1').fill('20:00');
  await p.click('ion-button:has-text("Start tournament")'); await p.waitForURL(/fixtures$/); await wait(1200);
  await back();
  const after = await visibleTexts('app-tournaments ion-item h2');
  check('Tournaments list shows the new tournament', after.length === before.length + 1, after.join(', '));

  // 6. Team list / Home unaffected but should still be fine; open tournament detail from list
  await p.locator('app-tournaments ion-item').first().click(); await wait(1200);
  const tUrl = p.url();
  // play all pool matches from fixtures (opened via link on detail page)
  await p.locator('app-tournament-detail a.stage, app-tournament-detail .stage').first().click(); await wait(1200);
  const cards = p.locator('app-fixtures .match-card');
  const n = await cards.count();
  for (let k = 0; k < n; k++) {
    const pair = await cards.nth(k).locator('.team .name').allInnerTexts();
    const side = pair[0].localeCompare(pair[1]) <= 0 ? 0 : 1; // alphabetical order always wins → no ties
    await cards.nth(k).locator('ion-button:has-text("Set result")').click(); await wait(500);
    await p.locator('ion-action-sheet button').nth(side).click(); await wait(700);
  }
  await back();
  const r2 = await p.locator('app-tournament-detail #round2:visible').getAttribute('disabled');
  check('Tournament detail unlocks Round 2 after pools are played (on back)', r2 === null || r2 === 'false', 'disabled=' + r2);
  const qLines = await visibleTexts('app-tournament-detail .acc-q');
  check('Pool headers show Q with qualified team names', qLines.length === 2, qLines.join(' / '));
  let qBadges = 0;
  const heads = p.locator('app-tournament-detail .acc-head:visible');
  for (let i = 0; i < await heads.count(); i++) {
    if ((await heads.nth(i).getAttribute('aria-expanded')) !== 'true') { await heads.nth(i).click(); await wait(400); }
  }
  qBadges = await p.locator('app-tournament-detail .acc-item.open .acc-body .badge.q').count();
  check('Pool team lists show a Q badge on each qualifier (2 per pool)', qBadges === 4, 'badges=' + qBadges);


  // 7. Rename a team that is in the tournament → fixtures show the new name
  await back();
  await tab('teams');
  await p.locator('app-teams ion-item:has-text("Bravo")').click(); await wait(1000);
  await p.locator('app-team-detail ion-buttons[slot=end] ion-button >> nth=0').click(); await wait(1000);
  await t('Team name', 'Bravo Kings'); await p.click('ion-button:has-text("Save changes")'); await wait(1200);
  await back();
  await tab('tournaments');
  await p.locator('app-tournaments ion-item').first().click(); await wait(1200);
  let detailAll = '';
  const heads2 = p.locator('app-tournament-detail .acc-head:visible');
  for (let i = 0; i < await heads2.count(); i++) {
    if ((await heads2.nth(i).getAttribute('aria-expanded')) !== 'true') { await heads2.nth(i).click(); await wait(400); }
    detailAll += await p.locator('app-tournament-detail:visible').innerText();
  }
  const detailText2 = detailAll;
  check('Tournament detail shows renamed team (Bravo Kings)', detailText2.includes('Bravo Kings'), detailText2.includes('Bravo') ? 'old name still shown' : 'name not found');

  // 8. Knockout → champion → declare → Home + Tournaments update
  await p.click('app-tournament-detail #round2'); await wait(1000);
  if (await p.locator('#mode-random').count()) { await p.click('#mode-random'); await wait(300); }
  await p.click('#start-ko'); await p.waitForURL(/knockout$/); await wait(1200);
  check('Round 2 has no bracket view', (await p.locator('app-knockout ion-segment, app-knockout .mbox').count()) === 0);
  for (let g = 0; g < 8; g++) {
    const open = p.locator('app-knockout .match-card ion-button:has-text("Set result"):visible');
    if (!(await open.count())) break;
    await open.first().click(); await wait(500);
    await p.locator('ion-action-sheet button').nth(0).click(); await wait(900);
  }
  const champ = (await p.locator('app-knockout .champ h2').innerText().catch(() => '')).trim();
  check('Knockout produced a champion', !!champ, champ);
  await back();
  const stage = (await p.locator('app-tournament-detail #round2:visible').innerText().catch(() => '')).replace(/\n/g, ' ');
  check('Tournament detail shows the knockout winner on back', !!champ && stage.includes(champ), stage);

  // declare champion via knockout banner
  await p.locator('app-tournament-detail #round2').click(); await wait(1200);
  await p.locator('app-knockout .champ ion-button').first().click(); await wait(1200);
  await t('MVP', 'Babar');
  await p.click('app-tournament-form ion-button:has-text("Declare champion")'); await wait(1500);
  const homeChamp = await p.locator('app-home .champion-card .team:visible').innerText().catch(() => '');
  check('Home shows the new champion', !!homeChamp && champ.includes(homeChamp.trim()) || homeChamp.trim() === champ, homeChamp);
  await tab('tournaments');
  const status = await visibleTexts('app-tournaments ion-item');
  check('Tournaments tab shows tournament as Completed', status.some(s => /Completed/i.test(s)), status.join(' / ').replace(/\n/g, ' '));

  // 9. Settings change → wizard defaults
  await tab('settings');
  await p.locator('app-settings #overs input, app-settings ion-input:has-text("Overs") input').first().fill('5');
  await p.locator('app-settings ion-button:has-text("Save")').first().click(); await wait(900);
  await tab('home');
  await p.locator('app-home ion-button:has-text("Start new tournament")').click(); await wait(1200);
  const overs = await p.locator('#review-overs input').inputValue();
  check('Wizard picks up overs changed in Settings', overs === '5', 'overs=' + overs);
  const season = await p.locator('app-tournament-new').innerText();
  check('Wizard offers the next season (Season 2)', /Season 2/.test(season));
  await back();

  // 10. Delete a team → list + wizard
  await tab('teams');
  await p.locator('app-teams ion-item:has-text("Echo")').click(); await wait(1000);
  await p.locator('app-team-detail ion-buttons[slot=end] ion-button >> nth=1').first().click(); await wait(600);
  await p.locator('ion-alert button:has-text("Delete")').click(); await wait(1200);
  names = await visibleTexts('app-teams ion-item h2');
  check('Teams list drops a deleted team', !names.includes('Echo'), names.join(', '));

  console.log('\nSUMMARY', results.filter(r => r[0] === 'PASS').length, 'pass /', results.filter(r => r[0] === 'FAIL').length, 'fail');
  console.log('errors', errs);
  await b.close();
  if (results.some((r) => r[0] === 'FAIL') || errs.length) process.exit(1);
})().catch(async e => { console.error('FAIL (crash)', e.message.split('\n').slice(0,3).join(' ')); try { console.error('at url', global.__p.url()); } catch {} process.exit(1); });

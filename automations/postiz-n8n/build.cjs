const jsCode = `const cfg = $('Config').first().json;
const file = $('Upload Video to Postiz').first().json;

// Per-platform settings Postiz expects. Add more providers here (linkedin, x, bluesky...).
const settings = {
  youtube: { __type: 'youtube', title: cfg.title, type: cfg.youtubeVisibility },
  tiktok: {
    __type: 'tiktok', privacy_level: 'PUBLIC_TO_EVERYONE', duet: false, stitch: false,
    comment: true, autoAddMusic: 'no', brand_content_toggle: false,
    brand_organic_toggle: false, content_posting_method: 'DIRECT_POST',
  },
  instagram: { __type: 'instagram', post_type: 'post', collaborators: [] },
  'instagram-standalone': { __type: 'instagram-standalone', post_type: 'post', collaborators: [] },
};

const wanted = cfg.platforms.split(',').map((s) => s.trim());
const posts = $input.all().map((i) => i.json)
  .filter((i) => !i.disabled && settings[i.identifier] && wanted.includes(i.identifier))
  .map((i) => ({
    integration: { id: i.id },
    // Videos go in "image" too - that's how Postiz takes media.
    value: [{ content: cfg.caption, image: [{ id: file.id, path: file.path }] }],
    settings: settings[i.identifier],
  }));

if (!posts.length) throw new Error('No connected Postiz integration matches: ' + cfg.platforms);

return [{ json: {
  type: 'schedule',
  date: new Date(Date.now() + cfg.delayHours * 3600e3).toISOString(),
  shortLink: false,
  tags: [],
  posts,
} }];`;

const auth = {
  authentication: 'genericCredentialType',
  genericAuthType: 'httpHeaderAuth',
};
const creds = { httpHeaderAuth: { name: 'Postiz API' } };
const api = (p) => `={{ $('Config').first().json.postizUrl }}/api/public/v1${p}`;

const nodes = [
  { name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
  {
    name: 'Config', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [220, 0],
    parameters: { assignments: { assignments: [
      ['postizUrl', 'string', 'https://postiz.yourdomain.com'],
      ['videoUrl', 'string', 'https://example.com/video.mp4'],
      ['title', 'string', 'My video title'],
      ['caption', 'string', 'Caption / description #hashtags'],
      ['platforms', 'string', 'youtube,tiktok,instagram-standalone'],
      ['delayHours', 'number', 24],
      ['youtubeVisibility', 'string', 'public'],
    ].map(([name, type, value], i) => ({ id: String(i), name, type, value })) }, options: {} },
  },
  {
    name: 'Download Video', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [440, 0],
    parameters: { url: '={{ $json.videoUrl }}', options: { response: { response: { responseFormat: 'file' } } } },
  },
  {
    name: 'Upload Video to Postiz', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [660, 0],
    parameters: {
      method: 'POST', url: api('/upload'), ...auth, sendBody: true, contentType: 'multipart-form-data',
      bodyParameters: { parameters: [{ parameterType: 'formBinaryData', name: 'file', inputDataFieldName: 'data' }] },
      options: {},
    },
    credentials: creds,
  },
  {
    name: 'Get Integrations', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [880, 0],
    parameters: { url: api('/integrations'), ...auth, options: {} },
    credentials: creds,
  },
  { name: 'Build Post', type: 'n8n-nodes-base.code', typeVersion: 2, position: [1100, 0], parameters: { jsCode } },
  {
    name: 'Schedule Post', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [1320, 0],
    parameters: {
      method: 'POST', url: api('/posts'), ...auth, sendBody: true, specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json) }}', options: {},
    },
    credentials: creds,
  },
];

const connections = {};
for (let i = 0; i < nodes.length - 1; i++)
  connections[nodes[i].name] = { main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]] };

const wf = { name: 'Postiz - Schedule Video to Socials', nodes, connections, settings: {}, pinData: {} };
require('fs').writeFileSync(__dirname + '/postiz-schedule-video.json', JSON.stringify(wf, null, 2) + '\n');

// Self-check: run Build Post's code with a mocked n8n context.
const assert = require('assert');
const ctx = {
  Config: { postizUrl: 'x', title: 'T', caption: 'C', platforms: 'youtube, tiktok', delayHours: 24, youtubeVisibility: 'public' },
  'Upload Video to Postiz': { id: 'f1', path: '/p.mp4' },
};
const $ = (n) => ({ first: () => ({ json: ctx[n] }) });
const $input = { all: () => [
  { json: { id: 'yt', identifier: 'youtube', disabled: false } },
  { json: { id: 'tt', identifier: 'tiktok', disabled: true } },
  { json: { id: 'ig', identifier: 'instagram-standalone', disabled: false } },
] };
const [{ json: body }] = new Function('$', '$input', jsCode)($, $input);
assert.deepStrictEqual(body.posts.map((p) => p.integration.id), ['yt']);
assert.strictEqual(body.posts[0].settings.title, 'T');
assert.deepStrictEqual(body.posts[0].value[0].image, [{ id: 'f1', path: '/p.mp4' }]);
assert.throws(() => new Function('$', '$input', jsCode)($, { all: () => [] }));
console.log('ok');

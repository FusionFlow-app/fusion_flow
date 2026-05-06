const { spawnSync } = require('child_process');

const env = { ...process.env, MIX_ENV: 'test' };

function run(name, ...args) {
  const r = spawnSync(name, args, { env, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('mix', 'ecto.reset');
run('mix', 'run', 'apps/fusion_flow_core/priv/repo/seeds.exs');

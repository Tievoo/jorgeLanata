module.exports = {
  apps : [{
    name: "lanata",
    script: "bot.ts",
    interpreter: "deno",
    interpreter_args: "run --allow-env --allow-net --allow-read --allow-write",
  }],
  deploy : {
    lanata: {
      user: 'root',
      host: ['165.232.148.166'],
      ref: 'origin/master',
      repo: 'git@github.com:Tievoo/jorgeLanata.git',
      path: '/app',
      'pre-deploy-local': '',
      'post-deploy': 'deno install && pm2 startOrRestart ecosystem.config.cjs',
    }
  }
};

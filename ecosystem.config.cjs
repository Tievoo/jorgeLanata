module.exports = {
  apps : [{
    name: "lanata",
    script: "bot.ts",
    interpreter: "deno",
    interpreter_args: "run --allow-net --allow-read --allow-write",
  }]
};

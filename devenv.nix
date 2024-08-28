{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.bun
  ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    hello
    git --version
    bun --version
  '';

  # https://devenv.sh/languages/
  languages.typescript.enable = true;

  # https://devenv.sh/databases/
  services.postgres.enable = true;
  services.postgres.package = pkgs.postgresql_15;
}

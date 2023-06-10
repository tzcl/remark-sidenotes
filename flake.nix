
{
  description = "A Nix-flake-based Node.js development environment";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = { self, flake-utils, nixpkgs }:
    let
      overlays = [
        (self: super: {
          nodejs = super.nodejs-18_x;
          pnpm = super.nodePackages.pnpm;
        })
      ];
    in flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit overlays system; };

        common = with pkgs; [ nodejs pnpm ];

        run = pkg: "${pkgs.${pkg}}/bin/${pkg}";

        scripts = with pkgs; [
          (writeScriptBin "clean" ''
            rm -rf dist
          '')

          (writeScriptBin "setup" ''
            clean
            ${run "pnpm"} install
          '')

          (writeScriptBin "format" ''
            setup
            ${run "pnpm"} run format
          '')

          (writeScriptBin "check-types" ''
            ${run "pnpm"} run typecheck
          '')
        ];
      in {
        devShells = {
          # The shell for developing this site
          default = pkgs.mkShell { buildInputs = common ++ scripts; };
        };
      });
}
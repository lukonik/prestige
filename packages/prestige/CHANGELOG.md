# Changelog

## 0.0.0 (2026-03-10)


### Features

* add algolia search ([#29](https://github.com/lukonik/prestige/issues/29)) ([4efcd27](https://github.com/lukonik/prestige/commit/4efcd27349d6a9ae31c80d60d6d1ee8f7e110166))
* add article store ([#9](https://github.com/lukonik/prestige/issues/9)) ([ebfa977](https://github.com/lukonik/prestige/commit/ebfa97738479f1b8a9549e5a322d29c6574335ac))
* add config, loader, friendlyError parser ([#4](https://github.com/lukonik/prestige/issues/4)) ([10dfe52](https://github.com/lukonik/prestige/commit/10dfe52f83ea01d200a5552523c01adba4e3e9a8))
* add content store ([#13](https://github.com/lukonik/prestige/issues/13)) ([471bbc1](https://github.com/lukonik/prestige/commit/471bbc11bf1c37b2b9677b88707f5cb51780b900))
* add content-collection store ([#11](https://github.com/lukonik/prestige/issues/11)) ([ed43c45](https://github.com/lukonik/prestige/commit/ed43c45071bc19058aafbe5a3d723713596e1ce2))
* add content-sidebar store ([#12](https://github.com/lukonik/prestige/issues/12)) ([3242784](https://github.com/lukonik/prestige/commit/32427848d5898bbe90b95e8373cf2a60278e288b))
* add contentRouter, collectionRouter and integrated it with plugin system ([#14](https://github.com/lukonik/prestige/issues/14)) ([628c423](https://github.com/lukonik/prestige/commit/628c42329ddf925b702b9358c33469c8eac2231e))
* add demo project ([#3](https://github.com/lukonik/prestige/issues/3)) ([bd36c42](https://github.com/lukonik/prestige/commit/bd36c4215c180bbec99e931d97429ed461602656))
* add docsDir property to config ([#5](https://github.com/lukonik/prestige/issues/5)) ([b710c76](https://github.com/lukonik/prestige/commit/b710c76309d2fc0377db75090dfb6ca73fd090f7))
* add favicon,title options. add createPrestigeRoot function that returns createRootRoute with options ([#34](https://github.com/lukonik/prestige/issues/34)) ([3503891](https://github.com/lukonik/prestige/commit/35038917129a7154e2dd12b618641c85793d950d))
* add index page ([#21](https://github.com/lukonik/prestige/issues/21)) ([0330d24](https://github.com/lukonik/prestige/commit/0330d245d86945acaaed6f47133c3a220657f4a2))
* add markdown watch ([#6](https://github.com/lukonik/prestige/issues/6)) ([d0156b1](https://github.com/lukonik/prestige/commit/d0156b1f8db07fd6b578efd9c519171d84fb1bce))
* add prestige page ([#36](https://github.com/lukonik/prestige/issues/36)) ([53e96a4](https://github.com/lukonik/prestige/commit/53e96a43dccef9360a906ac32086dab1ff6346de))
* add prestige project and pnpm-workspace ([#1](https://github.com/lukonik/prestige/issues/1)) ([383ba66](https://github.com/lukonik/prestige/commit/383ba66264f3e6419803b8c6045502e68f53df1b))
* add shiki code component ([#38](https://github.com/lukonik/prestige/issues/38)) ([fe61042](https://github.com/lukonik/prestige/commit/fe61042844efc3dccd55b8d03168c9254914e545))
* add sidebar in vite ([#10](https://github.com/lukonik/prestige/issues/10)) ([2702b6b](https://github.com/lukonik/prestige/commit/2702b6b2b3ae44478265324a33b311789f921c3c))
* add sidebar link type ([#33](https://github.com/lukonik/prestige/issues/33)) ([b9cf1c7](https://github.com/lukonik/prestige/commit/b9cf1c7f60251242ff4fa3376d70dadfb99e5abb))
* add tab and package manager components ([#40](https://github.com/lukonik/prestige/issues/40)) ([1a32d01](https://github.com/lukonik/prestige/commit/1a32d016822845cea88acd17cfcc2c902dc5114f))
* add theme files for all tailwind colors, default and primary ([#37](https://github.com/lukonik/prestige/issues/37)) ([d23f324](https://github.com/lukonik/prestige/commit/d23f32453c8fe03ba5cfd5f74e0802e275b40de1))
* add validation error handling to prestige items, add typesafety to matter info ([#19](https://github.com/lukonik/prestige/issues/19)) ([a09e71c](https://github.com/lukonik/prestige/commit/a09e71c7ff1490fa0e707e82b8293022e2ba14b3))
* compile markdown with compile instead of function-body ([#24](https://github.com/lukonik/prestige/issues/24)) ([08a31fc](https://github.com/lukonik/prestige/commit/08a31fce9dcc402d68c7035f5d328cd11932db71))
* create theming CSS variables and create dark mode styles ([#32](https://github.com/lukonik/prestige/issues/32)) ([170cf36](https://github.com/lukonik/prestige/commit/170cf36e8acbfc4ce1912eb328cd74bdd1bbec26))
* enable hmr for markdown content ([#18](https://github.com/lukonik/prestige/issues/18)) ([294a83d](https://github.com/lukonik/prestige/commit/294a83dd5e327e41d326ce4c11f59abcb6d3837e))
* generate file-based tanstack routes automatically ([3858f39](https://github.com/lukonik/prestige/commit/3858f39f61d29906356c12be48356fd7a14ae8c3))
* implement compile markdown with sensible defaults, add config to prestige config ([#22](https://github.com/lukonik/prestige/issues/22)) ([0537d13](https://github.com/lukonik/prestige/commit/0537d132c6f1a7282535dcde1fb19bd66cc903c3))
* implement mobile-version for content and collection routes ([#20](https://github.com/lukonik/prestige/issues/20)) ([c55de65](https://github.com/lukonik/prestige/commit/c55de65a11d66e046ac53b47d3006ac3d9058910))
* integrate fe with be. attach vite plugin to content-route and collection-route ([#16](https://github.com/lukonik/prestige/issues/16)) ([d390543](https://github.com/lukonik/prestige/commit/d390543585b6c547e454b6ce15aaae53991e9674))
* markdown hmr ([#7](https://github.com/lukonik/prestige/issues/7)) ([8229fc2](https://github.com/lukonik/prestige/commit/8229fc2cb7f387418d74adbff8adba4c16ad1955))
* process article ([#8](https://github.com/lukonik/prestige/issues/8)) ([745fc70](https://github.com/lukonik/prestige/commit/745fc70a15e4c4a4169a35dd8b5e0f3a2cc864e5))
* update tokens and design, restyle the content and collection pages ([#30](https://github.com/lukonik/prestige/issues/30)) ([6db23c7](https://github.com/lukonik/prestige/commit/6db23c7651ddbe2c47efe8503fd924b9c9f0c341))


### Bug Fixes

* bump version fix ([d5fd209](https://github.com/lukonik/prestige/commit/d5fd2096395e489d379065783d378311f4c2e53b))
* initial release ([#45](https://github.com/lukonik/prestige/issues/45)) ([7df2483](https://github.com/lukonik/prestige/commit/7df24831d300900d08ce829eec4f22b5486df833))
* mdx-relative-imports ([#26](https://github.com/lukonik/prestige/issues/26)) ([d521ffc](https://github.com/lukonik/prestige/commit/d521ffc7e27706f195cd1d90b5b1130957dd77bb))
* pnpm publish script ([4680be1](https://github.com/lukonik/prestige/commit/4680be1deac336ff48345cbd48b211a07235d572))
* remove docsDir, trim import path in resolve ([#39](https://github.com/lukonik/prestige/issues/39)) ([e38affa](https://github.com/lukonik/prestige/commit/e38affa3e724ec933e4d269b2b7e022d3b20e63f))
* ui bugs and move ui options to createPrestigeRootRoute ([#41](https://github.com/lukonik/prestige/issues/41)) ([02d7c94](https://github.com/lukonik/prestige/commit/02d7c947b245499ab88c90183b03fb3270663b3d))

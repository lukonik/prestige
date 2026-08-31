# @prestigia/docs

## 0.9.0

### Minor Changes

- [#160](https://github.com/lukonik/prestigia/pull/160) [`f060f3e`](https://github.com/lukonik/prestigia/commit/f060f3ea86f3f5a6b91008fc99c98416dd79695b) - Add the Prestigia Vite plugin, watched `prestigia.config.ts` loading, and a
  Content Collections-backed virtual config module with Starlight-style sidebar
  resolution. Configure new CLI projects to consume the generated navigation.

- [#158](https://github.com/lukonik/prestigia/pull/158) [`824c27f`](https://github.com/lukonik/prestigia/commit/824c27fc29fcc9e1d6f42fcea6b4f86994b45ad1) - Add an SSG-first recursive sidebar, Content Collections document mapper, and
  reusable `/docs` parent route that lays out statically generated `$slug`
  document pages without server functions or forced SSR.

- [#155](https://github.com/lukonik/prestigia/pull/155) [`7f8fa2c`](https://github.com/lukonik/prestigia/commit/7f8fa2c6a5f77e79c373a038341dc5c8be849956) - Add configurable Markdown rendering with `Article`, plus a `Doc` page and
  `createDocRoute` helper that own slug loading, metadata, and content rendering.

## 0.8.0

### Minor Changes

- [#153](https://github.com/lukonik/prestigia/pull/153) [`f75a12d`](https://github.com/lukonik/prestigia/commit/f75a12d9c01a2c66dc771cde2a711bb12df899e7) - Add the Prestigia project scaffold, implement the CLI create command, and equip the docs and demo apps with Shadcn Base UI and Content Collections.

## 0.7.1

### Patch Changes

- [#146](https://github.com/lukonik/prestigia/pull/146) [`fe69edf`](https://github.com/lukonik/prestigia/commit/fe69edf04981b1aeee1c59f4717a4aad4012ee09) - Keep the CLI and documentation packages on the same version.

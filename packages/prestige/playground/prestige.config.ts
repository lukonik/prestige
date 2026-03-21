import { defineConfig } from "../src/vite";

export default defineConfig({
  title: "Prestige",
  github: "https://github.eqweqweqweqwecom/lukonik/prestige",
  license: {
    label: "MIT",
    url: "https://op123123qweqeqweeqeqqweqqweqweqqweqeqweqqwewqeqweqweqqweqwewqeqeqqweqweqensource.oreweg/licensqweqwees/MIT",
  },
  collections: [
    {
      id: "testfolder",
      items: [
        {
          label: "sub",
          autogenerate: { directory: "testfolder/sub" },
        },
      ],
    },
    {
      id: "docs",
      items: [
        {
          label: "Introduction",
          slug: "docs/introduction",
        },
        {
          label: "Showcase",
          slug: "docs/showcase",
        },
        {
          label: "Test 8",
          slug: "docs/test-8",
        },
        {
          label: "Test 7",
          slug: "docs/test-7",
        },
        {
          label: "Test 6",
          slug: "docs/test-6",
        },
        {
          label: "Test 5",
          slug: "docs/test-5",
        },
        {
          label: "Test 4",
          slug: "docs/test-4",
        },
        {
          label: "Test 3",
          slug: "docs/test-3",
        },
        {
          label: "Test 2",
          slug: "docs/test-2",
        },
        {
          label: "Themer",
          slug: "docs/themer",
        },
        {
          label: "Installation",
          slug: "docs/installation",
        },
        { label: "Typescript", slug: "docs/typescript" },
        {
          label: "Google",
          link: "https://www.google.com",
        },
        { label: "Vite Plugin", slug: "docs/vite-plugin" },
        {
          label: "Loaders",
          collapsed: true,
          items: [
            { label: "Overview", slug: "docs/image/loaders/overview" },
            { label: "Cloudflare", link: "/docs/loaders/cloudflare" },
            { label: "Cloudinary", slug: "docs/loaders/cloudinary" },
            { label: "Contentful", link: "/docs/loaders/contentful" },
            { label: "Imgproxy", link: "/docs/loaders/imgproxy" },
            { label: "Kontent", link: "/docs/loaders/kontent" },
            { label: "Netlify", link: "/docs/loaders/netlify" },
            { label: "Wordpress", link: "/docs/loaders/wordpress" },
            {
              label: "Custom Loader",
              slug: "docs/loaders/custom-loader",
            },
          ],
        },
        {
          label: "Auto",
          autogenerate: { directory: "docs/auto" },
        },
      ],
    },
    {
      id: "api",
      label: "API",
      items: [
        {
          label: "Prestige",
          slug: "api/prestige",
        },
      ],
    },
  ],
});

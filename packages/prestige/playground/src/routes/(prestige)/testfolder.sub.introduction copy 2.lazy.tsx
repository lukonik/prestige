import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/testfolder/sub/introduction copy 2";
import { LazyContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/testfolder/sub/introduction copy 2')(LazyContentRoute(contentData));

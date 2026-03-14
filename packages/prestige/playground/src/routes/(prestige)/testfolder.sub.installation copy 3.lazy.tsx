import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/testfolder/sub/installation copy 3";
import { LazyContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/testfolder/sub/installation copy 3')(LazyContentRoute(contentData));

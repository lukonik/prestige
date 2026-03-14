import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/testfolder/sub/installation copy 5";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/testfolder/sub/installation copy 5')(ContentRoute(contentData));

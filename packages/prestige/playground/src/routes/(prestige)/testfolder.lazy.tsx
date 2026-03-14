import { createLazyFileRoute } from '@tanstack/react-router';
import sidebar from "virtual:prestige/sidebar/testfolder";
import { CollectionRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/testfolder')(CollectionRoute(sidebar, "testfolder"));

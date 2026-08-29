import { createLazyFileRoute } from '@tanstack/react-router';
import sidebar from "virtual:prestige/sidebar/testfolder";
import { CollectionRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/testfolder')(CollectionRoute(sidebar, "testfolder"));

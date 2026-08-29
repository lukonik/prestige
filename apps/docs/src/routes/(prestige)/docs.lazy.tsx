import { createLazyFileRoute } from '@tanstack/react-router';
import sidebar from "virtual:prestige/sidebar/docs";
import { CollectionRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/docs')(CollectionRoute(sidebar, "docs"));

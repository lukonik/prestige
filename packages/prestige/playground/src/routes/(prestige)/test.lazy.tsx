import { createLazyFileRoute } from '@tanstack/react-router';
import sidebar from "virtual:prestige/sidebar/test";
import { CollectionRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/test')(CollectionRoute(sidebar, "test"));

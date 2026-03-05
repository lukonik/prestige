
  
            import { createFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/docs"
            import {CollectionRoute} from "@lonik/prestige/ui"
            
            export const Route = createFileRoute('/(prestige)/docs')(CollectionRoute(sidebar,"docs"))
            
            
  

  
            import { createFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/api"
            import {CollectionRoute} from "@lonik/prestige/ui"
            
            export const Route = createFileRoute('/(prestige)/api')(CollectionRoute(sidebar,"api"))
            
            
  
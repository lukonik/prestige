
  
            import { Outlet,createLazyFileRoute } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/api"
            import {CollectionRoute} from "@lonik/prestige/ui"
            
            export const Route = createLazyFileRoute('/(prestige)/api')(CollectionRoute(sidebar,'api'))
            
            
  
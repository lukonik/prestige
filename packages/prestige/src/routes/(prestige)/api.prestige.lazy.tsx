
import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/api/prestige";
import { ContentRoute } from "@lonik/prestige/ui";


          export const Route = createLazyFileRoute('/(prestige)/api/prestige')(ContentRoute(contentData))
          
        
        
  
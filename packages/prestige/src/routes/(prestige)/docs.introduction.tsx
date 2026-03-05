
import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/introduction";
import { ContentRoute } from "@lonik/prestige/ui";


          export const Route = createFileRoute('/docs/introduction')(ContentRoute(contentData))
          
        
        
  
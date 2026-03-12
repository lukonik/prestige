import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import config from "virtual:prestige/config";
import { motion } from "motion/react";
import { Button } from "../components/button/button";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container mx-auto flex justify-center flex-col items-center mt-40 gap-24">
        <div className="w-4xl text-center flex flex-col gap-6">
          <h1 className="font-flex uppercase text-default-600">
            Static Site Generator
          </h1>
          <h2 className="font-flex text-7xl text-default-800">
            Built with TanStack start, Vite, Tailwind, React
          </h2>
        </div>
        <div className="mt-10 flex lg:justify-start items-center justify-center gap-4">
          <Link to="/docs/introduction">
            <Button label="Introduction">
              <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="https://github.com/lukonik/Prestige" target="_blank">
            <Button label="Star on github" variant="secondary">
              <Github size={18} />
            </Button>
          </a>
        </div>

        <motion.div
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-black rounded-xl w-full h-[800px] items-center justify-center"
        ></motion.div>

        <div className="flex flex-col gap-8">
          <h2 className="font-flex text-7xl text-default-800">
            Prestige takes your markdown content and transforms them into
            TanStack route pages automatically.
          </h2>
          <motion.div
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-default-100 rounded-xl w-full h-[800px] items-center justify-center"
          ></motion.div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="font-flex text-7xl text-default-800">
            On top of that ot adds many feature that will please you while
            developing docs
          </h2>

          <div className="flex">
            <div className="flex flex-col flex-1 mt-20">
              <h2 className="font-flex text-4xl text-default-800">
                Feature numero uno
              </h2>
              <p className="font-flex text-xl text-default-400">
                descriptiono numero uno
              </p>
            </div>
            <motion.div
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className=" flex-2 bg-default-100 rounded-xl w-full h-[600px] items-center justify-center"
            ></motion.div>
          </div>


          <div className="flex">
            <div className="flex flex-col flex-1 mt-20">
              <h2 className="font-flex text-4xl text-gray-800">
                Feature numero do
              </h2>
              <p className="font-flex text-xl text-gray-400">
                descriptiono numero do
              </p>
            </div>
            <motion.div
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className=" flex-2 bg-gray-100 rounded-xl w-full h-[600px] items-center justify-center"
            ></motion.div>
          </div>



        </div>
      </div>
    </>
  );
}

// <h2 className="text-3xl lg:text-6xl font-medium leading-snug">
//         Prestige takes your markdown content and transforms them to TanStack routes pages automatically
//       </h2>

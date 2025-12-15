import Link from "next/link";
import { ArrowRight, Box, Trees } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Elements - Subtle Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="z-10 text-center max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
          Graph & Tree <br/> Algorithms
        </h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          Interactive visualizations for complex computational problems.
          Explore the Knight's Tour and Largest Monotonically Increasing Subsequence.
        </p>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          <Link href="/knights-tour" className="group">
            <div className="h-full bg-card border border-border p-8 rounded-xl hover:border-primary hover:bg-muted/50 transition-all duration-300 flex flex-col items-start gap-4 shadow-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Box size={24} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Knight's Tour</h2>
                <p className="text-muted-foreground text-sm">Visualize Warnsdorff's algorithm solving the classic chess problem on an 8x8 board.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                Launch <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          <Link href="/lmis" className="group">
            <div className="h-full bg-card border border-border p-8 rounded-xl hover:border-secondary hover:bg-muted/50 transition-all duration-300 flex flex-col items-start gap-4 shadow-xl">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <Trees size={24} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">LMIS Tree</h2>
                <p className="text-muted-foreground text-sm">Construct and explore the recursion tree to find the Largest Monotonically Increasing Subsequence.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-secondary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                Launch <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-slate-600 text-sm">
        FP Tegraf &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

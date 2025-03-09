
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { Crown } from "lucide-react";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-12">
        <div className="w-full max-w-md flex flex-col gap-6 order-2 md:order-1">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center md:justify-start">
              BIO<Crown className="h-8 w-8 text-yellow-500 mx-1" />ING
            </h1>
            <p className="text-xl text-muted-foreground">
              Your intelligent AI assistant powered by advanced n8n workflows
            </p>
          </div>
          
          <Card className="border-2 border-primary/10 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Discover Our Features</CardTitle>
              <CardDescription>
                Explore what BIOKING can do for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="rounded-full p-1 bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <span>Chat with our AI assistant to get instant answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full p-1 bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 7-8.5 8.5-5-5L2 17"/>
                      <path d="M16 7h6v6"/>
                    </svg>
                  </div>
                  <span>Track real-time stock information and trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full p-1 bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                    </svg>
                  </div>
                  <span>Read the latest news from around the world</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link to="/chat">Start Chatting</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/stocks">View Stocks</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="w-full max-w-md order-1 md:order-2 flex justify-center">
          <div className="relative rounded-xl overflow-hidden border-4 border-primary/20 shadow-xl">
            <img 
              src="/Epic-chess-battle.gif" 
              alt="Epic Chess Battle" 
              className="w-full h-auto max-w-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 md:py-0 px-4 border-t bg-card/30 backdrop-blur-sm">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2023 BIO<Crown className="h-4 w-4 text-yellow-500 inline mx-0.5" />ING. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Chat
            </Link>
            <Link to="/stocks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Stocks
            </Link>
            <Link to="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              News
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Hi there!</CardTitle>
          <CardDescription>Welcome to n8nChat - Your AI Assistant</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            This application allows you to chat with an AI assistant, check stock information, 
            and browse the latest news - all powered by n8n workflows.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/chat">Start Chatting</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/stocks">View Stocks</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
